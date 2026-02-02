import { MapObject } from './map-object.model';

/**
 * Interface for creature objects on the map that can be battled.
 * Extends MapObject with creature-specific properties.
 */
export interface MapObjectCreature extends MapObject {
  readonly creatureName: string;
  readonly quantity: number;
}
