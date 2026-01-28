// core/models/creature/creature.model.ts
import { Faction } from '../faction/faction.enum';
import { Resource } from '../player/resources.model';
import { CreatureType } from './creature-type.enum';

export interface Creature {
  type: CreatureType;
  name: string;
  faction: Faction;
  level: number;
  attack: number;
  defense: number;
  minDamage: number;
  maxDamage: number;
  health: number;
  speed: number;
  cost: Resource[];
}
