// core/models/building/building.model.ts
import { CreatureLevel } from '../creature/creature-level.enum';
import { Faction } from '../faction/faction.enum';
import { Resource } from '../player/resources.model';

export interface Building {
  name: string;
  faction: Faction
  cost: Resource[];
  /** Array of prerequisite building names that must be constructed before this building */
  prerequisiteBuildings: string[];
  
  /** 
   * Reference to the creature level that this building produces (for dwelling buildings) 
   * Since the building may not always produce creatures, this field is optional
   * We do not provide the faction here, as it is implied by the town type
  */
  creatureLevel?: CreatureLevel;
  growth?: number;
}
