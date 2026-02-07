import { BattleUnit } from './battle-unit.model';
import { BattleResult } from './battle-result.enum';

/**
 * Holds the complete state of a battle in progress.
 */
export interface BattleState {
  attackerUnits: BattleUnit[];
  defenderUnits: BattleUnit[];
  /** All units sorted by speed for turn order */
  turnOrder: BattleUnit[];
  currentTurnIndex: number;
  round: number;
  result: BattleResult | null;
  log: string[];
}
