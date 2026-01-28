// core/models/creature/creature.model.ts
import { Faction } from '../faction/faction.enum';

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
  growth: number;
  cost: CreatureCost;
}

export interface CreatureCost {
  gold: number;
  wood?: number;
  stone?: number;
  ore?: number;
  mercury?: number;
  sulfur?: number;
  crystal?: number;
  gems?: number;
}
