import { MapObject } from './map-object.model';
import { ResourceType } from '../player/resource-type.enum';

/**
 * Configuration for mine production rates
 */
export const MINE_PRODUCTION_CONFIG: Record<ResourceType, number> = {
  [ResourceType.Gold]: 1000,
  [ResourceType.Wood]: 2,
  [ResourceType.Stone]: 2,
};

/**
 * Interface for mine objects on the map.
 * Extends MapObject with mine-specific properties.
 */
export interface MapObjectMine extends MapObject {
  readonly resourceType: ResourceType;
  readonly productionAmount: number;
  ownerId?: string; // ID of the player who owns this mine, undefined if not captured
}
