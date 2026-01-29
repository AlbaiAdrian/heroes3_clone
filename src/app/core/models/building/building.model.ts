// core/models/building/building.model.ts
import { Resource } from '../player/resources.model';

export interface Building {
  name: string;
  cost: Resource[];
  /** Array of prerequisite building names that must be constructed before this building */
  prerequisiteBuildings: string[];
  /** Reference to the creature type ID that this building produces (for dwelling buildings) */
  creatureTypeId?: string;
  growth?: number;
}
