import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { BattleState } from '../../models/battle/battle-state.model';
import { BattleUnit } from '../../models/battle/battle-unit.model';
import { BattleService } from './battle.service';

/**
 * Holds the current battle state as an observable for the UI.
 * Delegates battle logic to BattleService.
 */
@Injectable({ providedIn: 'root' })
export class BattleStateService {
  private battleState$ = new BehaviorSubject<BattleState | null>(null);

  readonly state$ = this.battleState$.asObservable();

  constructor(private battleService: BattleService) {}

  get snapshot(): BattleState | null {
    return this.battleState$.value;
  }

  /**
   * Start a new battle between an attacker army and a defender army.
   */
  startBattle(attackerArmy: Creature[], defenderArmy: Creature[]): void {
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
   * End the current battle and clear state.
   */
  endBattle(): void {
    this.battleState$.next(null);
  }
}
