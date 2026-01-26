import { MapObject } from '../map-objects/map-object.model';

/**
 * Base interface for all interaction objects.
 * All objects that can be interacted with (mines, shrines, etc.) should extend this.
 */
export interface InteractionObject extends MapObject {
  // Base properties from MapObject (type, x, y, footprint, entries)
  // Specific interaction objects will add their own properties
}
