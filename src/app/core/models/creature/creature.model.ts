// core/models/creature/creature.model.ts
import { Faction } from '../faction/faction.enum';
import { Resource } from '../player/resources.model';

export interface Creature {
  id: string;
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
