// core/models/creature/creature-data.interface.ts

import { CreatureAttributeType } from './creature-attribute-type.enum';
import { CreatureLevel } from './creature-level.enum';
import { Faction } from '../faction/faction.enum';
import { ResourceType } from '../player/resource-type.enum';

/**
 * Interface representing the structure of creature data as stored in JSON.
 * This matches the JSON file format for easy serialization/deserialization.
 */
export interface CreatureData {
  readonly id: string;
  readonly name: string;
  readonly faction: Faction;
  readonly level: CreatureLevel;
  readonly attributes: CreatureAttributeData[];
  readonly cost: ResourceCostData[];
  readonly upgradesTo?: string[];
  readonly upgradesFrom?: string;
}

/**
 * Interface for attribute data in JSON format.
 */
export interface CreatureAttributeData {
  readonly attributeType: CreatureAttributeType;
  readonly value: number;
}

/**
 * Interface for resource cost data in JSON format.
 */
export interface ResourceCostData {
  readonly type: ResourceType;
  readonly value: number;
}
