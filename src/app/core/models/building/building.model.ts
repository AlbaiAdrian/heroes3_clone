// core/models/building/building.model.ts
import { Resource } from '../player/resources.model';
import { CreatureType } from '../creature/creature-type.enum';

export interface Building {
  name: string;
  cost: Resource[];
  /** Array of prerequisite building names that must be constructed before this building */
  prerequisiteBuildings: string[];
  creatureType?: CreatureType;
  growth?: number;
}
