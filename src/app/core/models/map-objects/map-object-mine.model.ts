import { MapObject } from './map-object.model';
import { MapObjectType } from './map-object-type.enum';
import { MineType } from './mine-type.enum';
import { ResourceType } from '../player/resource-type.enum';
import { ObjectEntryTile } from './map-object-entry.model';
import { ObjectFootprintTile } from './map-object-footprint.model';

/**
 * Represents a mine object on the map.
 * Extends MapObject with mine-specific properties.
 */
export class MapObjectMine implements MapObject {
  readonly id: string;
  readonly type: MapObjectType.MINE;
  readonly x: number;
  readonly y: number;
  readonly footprint: readonly ObjectFootprintTile[];
  readonly entries: readonly ObjectEntryTile[];
  
  readonly mineType: MineType;
  readonly resourceType: ResourceType;
  readonly productionAmount: number;

  constructor(
    id: string,
    x: number,
    y: number,
    footprint: readonly ObjectFootprintTile[],
    entries: readonly ObjectEntryTile[],
    mineType: MineType
  ) {
    this.id = id;
    this.type = MapObjectType.MINE;
    this.x = x;
    this.y = y;
    this.footprint = footprint;
    this.entries = entries;
    this.mineType = mineType;
    
    // Set resource type and production amount based on mine type
    const mineConfig = this.getMineConfig(mineType);
    this.resourceType = mineConfig.resourceType;
    this.productionAmount = mineConfig.productionAmount;
  }

  private getMineConfig(mineType: MineType): { resourceType: ResourceType; productionAmount: number } {
    switch (mineType) {
      case MineType.GOLD:
        return { resourceType: ResourceType.Gold, productionAmount: 1000 };
      case MineType.WOOD:
        return { resourceType: ResourceType.Wood, productionAmount: 2 };
      case MineType.STONE:
        return { resourceType: ResourceType.Stone, productionAmount: 2 };
    }
  }

  /**
   * Generate resources for this mine.
   * @returns The amount of resources produced
   */
  produceResources(): number {
    return this.productionAmount;
  }
}
