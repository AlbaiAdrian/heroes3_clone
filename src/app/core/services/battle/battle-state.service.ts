import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { BattleState } from '../../models/battle/battle-state.model';
import { BattleUnit } from '../../models/battle/battle-unit.model';
import { BattleResult } from '../../models/battle/battle-result.enum';
import { BattleService } from './battle.service';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';

/**
 * Holds the current battle state as an observable for the UI.
 * Delegates battle logic to BattleService.
 */
@Injectable({ providedIn: 'root' })
export class BattleStateService {
  private battleState$ = new BehaviorSubject<BattleState | null>(null);

  readonly state$ = this.battleState$.asObservable();

  /** The map creature object that triggered the current battle */
  private _creatureObject: MapObjectCreature | null = null;

  constructor(private battleService: BattleService) {}

  get snapshot(): BattleState | null {
    return this.battleState$.value;
  }

  get creatureObject(): MapObjectCreature | null {
    return this._creatureObject;
  }

  /**
   * Start a new battle between an attacker army and a defender army.
   */
  startBattle(attackerArmy: Creature[], defenderArmy: Creature[], creatureObject: MapObjectCreature | null): void {
    this._creatureObject = creatureObject;
    const state = this.battleService.initBattle(attackerArmy, defenderArmy);
    this.battleState$.next(state);
  }

  /**
   * Execute an attack from the current unit to the given target.
   */
  attack(target: BattleUnit): void {
    const state = this.snapshot;
    if (!state) return;

    const current = this.battleService.getCurrentUnit(state);
    if (!current) return;

    this.battleService.executeAttack(state, current, target);
    // Emit updated state
    this.battleState$.next({ ...state });
  }

  /**
   * Set the retreat result on the current battle.
   */
  retreat(): void {
    const state = this.snapshot;
    if (!state) return;

    state.result = BattleResult.Retreat;
    state.log.push('Attacker retreats from battle!');
    this.battleState$.next({ ...state });
  }

  /**
   * End the current battle and clear state.
   */
  endBattle(): void {
    this._creatureObject = null;
    this.battleState$.next(null);
  }
}
