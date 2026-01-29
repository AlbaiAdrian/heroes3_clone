// core/models/creature/creature-type.model.ts
import { Faction } from '../faction/faction.enum';

/**
 * Represents a creature type with upgrade path information.
 * Supports multiple levels of upgrades (not limited to 2).
 */
export interface CreatureType {
  readonly id: string;
  readonly name: string;
  readonly faction: Faction;
  readonly level: number;
  /** 
   * Array of creature type IDs that this creature can be upgraded to.
   * Empty array means this is the final upgrade level.
   */
  readonly upgradesTo: string[];
  /**
   * Creature type ID that this creature is upgraded from.
   * Undefined means this is the base creature.
   */
  readonly upgradesFrom?: string;
}
