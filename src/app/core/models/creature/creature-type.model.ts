// core/models/creature/creature-type.model.ts
import { Faction } from '../faction/faction.enum';
import { Resource } from '../player/resources.model';
import { CreatureAttribute } from './creature-attribute.model';
import { CreatureLevel } from './creature-level.enum';

export interface CreatureType {
  level: CreatureLevel;
  faction: Faction;
  name: string;
  /** Configurable creature statistics (attack, defense, damage, health, speed, etc.) */
  attributes: CreatureAttribute[];
  cost: Resource[];
}
