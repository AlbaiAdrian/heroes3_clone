// features/battle/battle.component.ts
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';
import { BattleStateService } from '../../core/services/battle/battle-state.service';
import { BattleService } from '../../core/services/battle/battle.service';
import { BattleState } from '../../core/models/battle/battle-state.model';
import { BattleUnit } from '../../core/models/battle/battle-unit.model';
import { BattleResult } from '../../core/models/battle/battle-result.enum';
import { CreatureAttributeType } from '../../core/models/creature/creature-attribute-type.enum';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-battle',
  imports: [CommonModule],
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit, OnDestroy {
  state: BattleState | null = null;
  currentUnit: BattleUnit | null = null;
  targets: BattleUnit[] = [];
  resultText = '';
  selectedUnit: BattleUnit | null = null;
  private readonly attackCache = new Map<string, number>();
  private readonly defenseCache = new Map<string, number>();

  private sub?: Subscription;

  constructor(
    private gameEngine: GameEngineService,
    private battleStateService: BattleStateService,
    private battleService: BattleService,
  ) {}

  ngOnInit(): void {
    this.sub = this.battleStateService.state$.subscribe(state => {
      this.state = state;
      if (state) {
        this.currentUnit = this.battleService.getCurrentUnit(state);
        this.targets = this.currentUnit
          ? this.battleService.getValidTargets(state, this.currentUnit)
          : [];
        this.resultText = this.getResultText(state.result);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  attackTarget(target: BattleUnit): void {
    this.battleStateService.attack(target);
  }

  retreat(): void {
    this.battleStateService.retreat();
  }

  endBattle(): void {
    this.gameEngine.resolveBattle();
  }

  openSprite(unit: BattleUnit): void {
    this.selectedUnit = unit;
  }

  closeSprite(): void {
    this.selectedUnit = null;
  }

  getCreatureSpritePath(unit: BattleUnit): string {
    return `creature/${unit.creatureType.faction}/${unit.creatureType.code}.png`;
  }

  getAttackValue(unit: BattleUnit): number {
    const key = this.getUnitKey(unit);
    if (this.attackCache.has(key)) {
      return this.attackCache.get(key) ?? 0;
    }

    let melee: number | null = null;
    let ranged: number | null = null;
    for (const attr of unit.creatureType.attributes) {
      if (attr.attributeType === CreatureAttributeType.AttackTypeRanged) {
        ranged = attr.value;
      }
      if (attr.attributeType === CreatureAttributeType.AttackTypeMelee) {
        melee = attr.value;
      }
      if (ranged !== null && melee !== null) {
        break;
      }
    }
    const attackValue = ranged ?? melee ?? 0;
    this.attackCache.set(key, attackValue);
    return attackValue;
  }

  getDefenseValue(unit: BattleUnit): number {
    const key = this.getUnitKey(unit);
    if (this.defenseCache.has(key)) {
      return this.defenseCache.get(key) ?? 0;
    }

    const defenseValue = this.getAttributeValue(unit, CreatureAttributeType.Defense);
    this.defenseCache.set(key, defenseValue);
    return defenseValue;
  }

  private getResultText(result: BattleResult | null): string {
    switch (result) {
      case BattleResult.AttackerWins: return 'Victory! The attacker wins!';
      case BattleResult.DefenderWins: return 'Defeat! The defender wins!';
      case BattleResult.Retreat: return 'The attacker has retreated!';
      default: return '';
    }
  }

  private getAttributeValue(unit: BattleUnit, type: CreatureAttributeType): number {
    return unit.creatureType.attributes.find(attr => attr.attributeType === type)?.value ?? 0;
  }

  private getUnitKey(unit: BattleUnit): string {
    return `${unit.creatureType.faction}:${unit.creatureType.code}`;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.selectedUnit) {
      this.closeSprite();
    }
  }
}
