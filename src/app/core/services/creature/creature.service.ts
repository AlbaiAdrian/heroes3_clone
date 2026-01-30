// core/services/creature/creature.service.ts

import { Injectable, Inject } from '@angular/core';
import { ICreatureRepository, CREATURE_REPOSITORY } from './creature-repository.interface';
import { CreatureFactory } from './creature-factory.service';
import { Creature } from '../../models/creature/creature.model';
import { CreatureData } from '../../models/creature/creature-data.interface';
import { Faction } from '../../models/faction/faction.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';

/**
 * Main service for managing creatures.
 * Follows the Facade Pattern to provide a simple interface to the creature subsystem.
 * Uses Dependency Injection for loose coupling.
 */
@Injectable({
  providedIn: 'root'
})
export class CreatureService {

  constructor(
    private creatureFactory: CreatureFactory,
    @Inject(CREATURE_REPOSITORY) private repository: ICreatureRepository
  ) {}

  /**
   * Initialize the service by loading all creature data.
   * Should be called during application initialization.
   */
  async initialize(): Promise<void> {
    await this.repository.loadAll();
  }

  /**
   * Get a creature instance by ID.
   * @param id - The unique identifier of the creature
   * @returns Creature instance or undefined if not found
   */
  getCreature(id: string): Creature | undefined {
    const data = this.repository.getById(id);
    return data ? this.creatureFactory.createFromData(data) : undefined;
  }

  /**
   * Get all creatures for a faction.
   * @param faction - The faction to filter by
   * @returns Array of Creature instances
   */
  getCreaturesByFaction(faction: Faction): Creature[] {
    const data = this.repository.getByFaction(faction);
    return this.creatureFactory.createManyFromData(data);
  }

  /**
   * Get all creatures of a specific level.
   * @param level - The creature level to filter by
   * @returns Array of Creature instances
   */
  getCreaturesByLevel(level: CreatureLevel): Creature[] {
    const data = this.repository.getByLevel(level);
    return this.creatureFactory.createManyFromData(data);
  }

  /**
   * Get available upgrades for a creature.
   * @param creatureId - The ID of the creature
   * @returns Array of Creature instances that this creature can upgrade to
   */
  getUpgradeOptions(creatureId: string): Creature[] {
    const data = this.repository.getUpgradeOptions(creatureId);
    return this.creatureFactory.createManyFromData(data);
  }

  /**
   * Get the raw creature data by ID.
   * Useful for accessing upgrade relationships and metadata.
   * @param id - The unique identifier of the creature
   * @returns CreatureData or undefined if not found
   */
  getCreatureData(id: string): CreatureData | undefined {
    return this.repository.getById(id);
  }

  /**
   * Check if a creature can upgrade to another creature.
   * @param fromId - The source creature ID
   * @param toId - The target creature ID
   * @returns True if upgrade is possible
   */
  canUpgradeTo(fromId: string, toId: string): boolean {
    const data = this.repository.getById(fromId);
    return data?.upgradesTo?.includes(toId) ?? false;
  }
}
