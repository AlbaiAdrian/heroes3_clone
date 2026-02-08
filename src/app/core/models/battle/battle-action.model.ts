import { BattleUnit } from './battle-unit.model';

/**
 * Represents an attack action in battle.
 */
export interface BattleAction {
  attacker: BattleUnit;
  target: BattleUnit;
  damage: number;
  killCount: number;
}
