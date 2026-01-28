import { MapObject } from './map-object.model';
import { Town } from '../town/town.model';

/**
 * Interface for town objects on the map.
 * Extends MapObject with town-specific properties.
 */
export interface MapObjectTown extends MapObject {
  readonly town: Town;
}
