import { CreatureType } from '../creature/creature-type.model';

/**
 * Represents a single creature stack in battle.
 * Tracks current HP for the top creature and remaining quantity.
 */
export interface BattleUnit {
  readonly creatureType: CreatureType;
  quantity: number;
  currentHp: number;
  maxHp: number;
  /** true = attacker side, false = defender side */
  isAttacker: boolean;
  isDead: boolean;
}
