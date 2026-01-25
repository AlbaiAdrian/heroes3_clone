import { MapObject } from './map-object.model';
import { MineType } from './mine-type.enum';
import { ResourceType } from '../player/resource-type.enum';

/**
 * Configuration for mine production rates
 */
export const MINE_PRODUCTION_CONFIG: Record<MineType, { resourceType: ResourceType; productionAmount: number }> = {
  [MineType.GOLD]: { resourceType: ResourceType.Gold, productionAmount: 1000 },
  [MineType.WOOD]: { resourceType: ResourceType.Wood, productionAmount: 2 },
  [MineType.STONE]: { resourceType: ResourceType.Stone, productionAmount: 2 },
};

/**
 * Interface for mine objects on the map.
 * Extends MapObject with mine-specific properties.
 */
export interface MapObjectMine extends MapObject {
  readonly mineType: MineType;
  readonly resourceType: ResourceType;
  readonly productionAmount: number;
}
