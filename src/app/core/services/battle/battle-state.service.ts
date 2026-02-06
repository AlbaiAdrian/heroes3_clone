import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { BattleLogEntry, BattleResult, BattleState } from '../../models/battle/battle-state.model';

@Injectable({ providedIn: 'root' })
export class BattleStateService {
  private state$ = new BehaviorSubject<BattleState>({
    attackerArmy: [],
    defenderArmy: [],
    log: [],
    result: BattleResult.Pending,
  });

  readonly battleState$ = this.state$.asObservable();

  get snapshot(): BattleState {
    return this.state$.value;
  }

  initBattle(attackerArmy: Creature[], defenderArmy: Creature[]): void {
    this.state$.next({
      attackerArmy: attackerArmy.map(c => ({ ...c })),
      defenderArmy: defenderArmy.map(c => ({ ...c })),
      log: [],
      result: BattleResult.Pending,
    });
  }

  updateState(state: Partial<BattleState>): void {
    this.state$.next({ ...this.snapshot, ...state });
  }

  addLogEntry(entry: BattleLogEntry): void {
    this.state$.next({
      ...this.snapshot,
      log: [...this.snapshot.log, entry],
    });
  }

  clear(): void {
    this.state$.next({
      attackerArmy: [],
      defenderArmy: [],
      log: [],
      result: BattleResult.Pending,
    });
  }
}
