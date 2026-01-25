import { Injectable } from '@angular/core';
import { MAP_OBJECT_DEFINITIONS } from '../../models/map-objects/map-object-config';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectMine, MINE_PRODUCTION_CONFIG } from '../../models/map-objects/map-object-mine.model';
import { TerrainType } from '../../models/terrain/terrain.enum';
import { Tile } from '../../models/terrain/tile.model';
import { MineType } from '../../models/map-objects/mine-type.enum';
import { TileInteraction } from '../../models/terrain/tile-interaction.model';


@Injectable({ providedIn: 'root' })
export class MapObjectGeneratorService {

  generate(grid: Tile[][]): MapObject[] {
    const objects: MapObject[] = [];

    objects.push(this.placeObject(grid, MapObjectType.TOWN));
    objects.push(...this.placeMultiple(grid, MapObjectType.MINE, 3));
    objects.push(...this.placeMultiple(grid, MapObjectType.TREE, 20));

    return objects;
  }

  private placeMultiple(
    grid: Tile[][],
    type: MapObjectType,
    count: number
  ): MapObject[] {
    return Array.from({ length: count }, () =>
      this.placeObject(grid, type)
    );
  }

  private placeObject(
    grid: Tile[][],
    type: MapObjectType
  ): MapObject {
    const def = MAP_OBJECT_DEFINITIONS[type];
    const width = grid[0].length;
    const height = grid.length;

    while (true) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!this.canPlace(grid, x, y, def.footprint)) continue;

      // Create mine object as plain object implementing MapObjectMine interface
      if (type === MapObjectType.MINE) {
        const mineTypes = [MineType.GOLD, MineType.WOOD, MineType.STONE];
        const randomIndex = Math.floor(Math.random() * mineTypes.length);
        const mineType = mineTypes[randomIndex];
        const config = MINE_PRODUCTION_CONFIG[mineType];
        
        const mine: MapObjectMine = {
          id: crypto.randomUUID(),
          type: MapObjectType.MINE,
          x,
          y,
          footprint: def.footprint,
          entries: def.entries,
          mineType: mineType,
          resourceType: config.resourceType,
          productionAmount: config.productionAmount,
        };
        
        // Set up interaction on entry tiles that returns the mine
        this.setupMineInteractions(grid, mine);
        
        return mine;
      }

      // Create regular map object
      const object: MapObject = {
        id: crypto.randomUUID(),
        type,
        x,
        y,
        footprint: def.footprint,
        entries: def.entries,
      };

      return object;
    }
  }

  private setupMineInteractions(grid: Tile[][], mine: MapObjectMine): void {
    // Create interaction that returns the mine object
    const interaction: TileInteraction = {
      getAction: () => mine
    };
    
    // Add interaction to each entry tile
    mine.entries.forEach(entry => {
      const tileX = mine.x + entry.dx;
      const tileY = mine.y + entry.dy;
      
      // Validate bounds before accessing tile
      if (tileY >= 0 && tileY < grid.length && tileX >= 0 && tileX < grid[0].length) {
        const tile = grid[tileY][tileX];
        if (tile) {
          tile.interaction = interaction;
        }
      }
    });
  }

  private canPlace(
    grid: Tile[][],
    x: number,
    y: number,
    footprint: readonly { dx: number; dy: number }[]
  ): boolean {
    return footprint.every(p => {
      const tile = grid[y + p.dy]?.[x + p.dx];
      return tile && tile.terrain === TerrainType.GRASS;
    });
  }
}
