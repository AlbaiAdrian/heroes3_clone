import { Creature } from '../creature/creature.model';

export interface BattleLogEntry {
  readonly message: string;
}

export enum BattleResult {
  AttackerWins = 'ATTACKER_WINS',
  DefenderWins = 'DEFENDER_WINS',
  Pending = 'PENDING',
}

export interface BattleState {
  attackerArmy: Creature[];
  defenderArmy: Creature[];
  log: BattleLogEntry[];
  result: BattleResult;
}
