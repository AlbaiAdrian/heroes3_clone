// core/services/creature/json-creature-repository.service.ts

import { Injectable } from '@angular/core';
import { ICreatureRepository } from './creature-repository.interface';
import { CreatureData } from '../../models/creature/creature-data.interface';
import { Faction } from '../../models/faction/faction.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';

/**
 * JSON-based implementation of the creature repository.
 * Loads creature data from JSON files.
 * Follows the Repository Pattern and Single Responsibility Principle.
 */
@Injectable({
  providedIn: 'root'
})
export class JsonCreatureRepository implements ICreatureRepository {
  private creatures: Map<string, CreatureData> = new Map();
  private loaded = false;

  /**
   * Load all creature data from JSON file.
   * This method is idempotent - calling it multiple times will only load once.
   */
  async loadAll(): Promise<CreatureData[]> {
    if (this.loaded) {
      return Array.from(this.creatures.values());
    }

    try {
      // Load from JSON file in assets
      const response = await fetch('assets/data/creatures.json');
      if (!response.ok) {
        throw new Error(`Failed to load creatures: ${response.statusText}`);
      }
      
      const data: CreatureData[] = await response.json();
      
      // Validate and store creatures
      this.validateCreatureData(data);
      
      data.forEach(creature => {
        this.creatures.set(creature.id, creature);
      });
      
      this.loaded = true;
      return data;
    } catch (error) {
      console.error('Error loading creature data:', error);
      throw error;
    }
  }

  /**
   * Get creature data by ID.
   */
  getById(id: string): CreatureData | undefined {
    this.ensureLoaded();
    return this.creatures.get(id);
  }

  /**
   * Get all creatures for a specific faction.
   */
  getByFaction(faction: Faction): CreatureData[] {
    this.ensureLoaded();
    return Array.from(this.creatures.values())
      .filter(creature => creature.faction === faction);
  }

  /**
   * Get all creatures of a specific level.
   */
  getByLevel(level: CreatureLevel): CreatureData[] {
    this.ensureLoaded();
    return Array.from(this.creatures.values())
      .filter(creature => creature.level === level);
  }

  /**
   * Get upgrade options for a creature.
   */
  getUpgradeOptions(creatureId: string): CreatureData[] {
    this.ensureLoaded();
    const creature = this.creatures.get(creatureId);
    
    if (!creature || !creature.upgradesTo) {
      return [];
    }

    return creature.upgradesTo
      .map(id => this.creatures.get(id))
      .filter((c): c is CreatureData => c !== undefined);
  }

  /**
   * Validate creature data integrity.
   * Checks that upgrade relationships are valid.
   */
  private validateCreatureData(data: CreatureData[]): void {
    const ids = new Set(data.map(c => c.id));
    const errors: string[] = [];

    data.forEach(creature => {
      // Validate upgradesTo references
      if (creature.upgradesTo) {
        creature.upgradesTo.forEach(upgradeId => {
          if (!ids.has(upgradeId)) {
            errors.push(`Creature '${creature.id}' has invalid upgrade reference: '${upgradeId}'`);
          }
        });
      }

      // Validate upgradesFrom reference
      if (creature.upgradesFrom && !ids.has(creature.upgradesFrom)) {
        errors.push(`Creature '${creature.id}' has invalid upgradesFrom reference: '${creature.upgradesFrom}'`);
      }

      // Validate bidirectional relationships
      if (creature.upgradesFrom) {
        const parent = data.find(c => c.id === creature.upgradesFrom);
        if (parent && (!parent.upgradesTo || !parent.upgradesTo.includes(creature.id))) {
          errors.push(`Creature '${creature.id}' has upgradesFrom '${creature.upgradesFrom}', but parent doesn't reference it in upgradesTo`);
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(`Creature data validation failed:\n${errors.join('\n')}`);
    }
  }

  /**
   * Ensure data is loaded before operations.
   */
  private ensureLoaded(): void {
    if (!this.loaded) {
      throw new Error('Creature data not loaded. Call loadAll() first.');
    }
  }
}
