// core/services/creature/creature-factory.service.ts

import { Injectable } from '@angular/core';
import { Creature } from '../../models/creature/creature.model';
import { CreatureData } from '../../models/creature/creature-data.interface';
import { CreatureAttribute } from '../../models/creature/creature-attribute.model';
import { Resource } from '../../models/player/resources.model';

/**
 * Factory service for creating Creature instances from CreatureData.
 * Follows the Factory Pattern and Single Responsibility Principle.
 * Handles the conversion from data objects to domain models.
 */
@Injectable({
  providedIn: 'root'
})
export class CreatureFactory {
  
  /**
   * Create a Creature instance from CreatureData.
   * @param data - The creature data from JSON
   * @returns A fully formed Creature instance
   */
  createFromData(data: CreatureData): Creature {
    return {
      level: data.level,
      faction: data.faction,
      name: data.name,
      attributes: this.mapAttributes(data.attributes),
      cost: this.mapCost(data.cost)
    };
  }

  /**
   * Create multiple Creature instances from an array of CreatureData.
   * @param dataArray - Array of creature data
   * @returns Array of Creature instances
   */
  createManyFromData(dataArray: CreatureData[]): Creature[] {
    return dataArray.map(data => this.createFromData(data));
  }

  /**
   * Map attribute data to CreatureAttribute array.
   */
  private mapAttributes(attributeData: Array<{attributeType: any, value: number}>): CreatureAttribute[] {
    return attributeData.map(attr => ({
      attributeType: attr.attributeType,
      value: attr.value
    }));
  }

  /**
   * Map cost data to Resource array.
   */
  private mapCost(costData: Array<{type: any, value: number}>): Resource[] {
    return costData.map(cost => ({
      type: cost.type,
      value: cost.value
    }));
  }
}
