import { MapObject } from './map-object.model';
import { Creature } from '../creature/creature.model';

/**
 * Interface for creature objects on the map that can be battled.
 * Extends MapObject with creature-specific properties.
 */
export interface MapObjectCreature extends MapObject {
  readonly creatures: readonly Creature[];
}
