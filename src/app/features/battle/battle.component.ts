// features/battle/battle.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
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
    const ranged = unit.creatureType.attributes.find(
      attr => attr.attributeType === CreatureAttributeType.AttackTypeRanged
    );
    if (ranged) {
      return ranged.value;
    }

    return (
      unit.creatureType.attributes.find(
        attr => attr.attributeType === CreatureAttributeType.AttackTypeMelee
      )?.value ?? 0
    );
  }

  getDefenseValue(unit: BattleUnit): number {
    return this.getAttributeValue(unit, CreatureAttributeType.Defense);
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
}
