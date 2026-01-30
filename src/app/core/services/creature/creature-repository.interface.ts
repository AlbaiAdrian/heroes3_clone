// core/services/creature/creature-repository.interface.ts

import { CreatureData } from '../../models/creature/creature-data.interface';
import { Faction } from '../../models/faction/faction.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';

/**
 * Repository interface for creature data access.
 * Follows the Repository Pattern for data abstraction.
 * This allows for different implementations (JSON, API, database, etc.)
 */
export interface ICreatureRepository {
  /**
   * Load all creature data from the data source.
   * @returns Promise resolving to array of creature data
   */
  loadAll(): Promise<CreatureData[]>;

  /**
   * Get creature data by ID.
   * @param id - The unique identifier of the creature
   * @returns The creature data or undefined if not found
   */
  getById(id: string): CreatureData | undefined;

  /**
   * Get all creatures for a specific faction.
   * @param faction - The faction to filter by
   * @returns Array of creature data for the faction
   */
  getByFaction(faction: Faction): CreatureData[];

  /**
   * Get all creatures of a specific level.
   * @param level - The creature level to filter by
   * @returns Array of creature data for the level
   */
  getByLevel(level: CreatureLevel): CreatureData[];

  /**
   * Get upgrade options for a creature.
   * @param creatureId - The ID of the creature
   * @returns Array of creature data that this creature can upgrade to
   */
  getUpgradeOptions(creatureId: string): CreatureData[];
}
