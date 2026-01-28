// core/models/building/building.model.ts
import { Creature } from '../creature/creature.model';

export interface Building {
  id: string;
  name: string;
  level: number;
  cost: BuildingCost;
  prerequisiteBuildings: string[];
  creatureType?: Creature;
}

export interface BuildingCost {
  gold: number;
  wood?: number;
  stone?: number;
  ore?: number;
  mercury?: number;
  sulfur?: number;
  crystal?: number;
  gems?: number;
}
