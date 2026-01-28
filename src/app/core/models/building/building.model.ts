// core/models/building/building.model.ts
import { Resource } from '../player/resources.model';

export interface Building {
  id: string;
  name: string;
  level: number;
  cost: Resource[];
  prerequisiteBuildings: string[];
  growth?: number;
}
