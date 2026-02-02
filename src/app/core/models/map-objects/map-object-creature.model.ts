import { MapObject } from './map-object.model';
import { CreatureType } from '../creature/creature-type.model';

/**
 * Interface for creature objects on the map that can be battled.
 * Extends MapObject with creature-specific properties.
 */
export interface MapObjectCreature extends MapObject {
  readonly creatures: readonly { type: CreatureType; quantity: number }[];
}
