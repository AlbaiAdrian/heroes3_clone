// core/models/creature/creature.model.ts
import { Resource } from '../player/resources.model';
import { CreatureAttributes } from './creature-attribute.model';

export interface Creature {
  /** Reference to the creature type ID from CREATURE_TYPES config */
  typeId: string;
  attributes: CreatureAttributes;
  cost: Resource[];
}
