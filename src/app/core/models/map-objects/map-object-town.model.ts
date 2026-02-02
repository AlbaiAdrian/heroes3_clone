import { MapObject } from './map-object.model';
import { Faction } from '../faction/faction.enum';
import { Building } from '../building/building.model';
import { CreatureType } from '../creature/creature-type.model';

/**
 * Interface for available creatures in a town.
 */
export interface TownCreature {
  readonly creature: CreatureType;
  readonly available: number;
}

/**
 * Interface for town objects on the map.
 * Extends MapObject with town-specific properties.
 */
export interface MapObjectTown extends MapObject {
  readonly name: string;
  readonly faction: Faction;
  readonly buildings: Building[];
  readonly availableCreatures: TownCreature[];
}
