import { Injectable } from '@angular/core';
import { MAP_OBJECT_DEFINITIONS } from '../../models/map-objects/map-object-config';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { MapObject } from '../../models/map-objects/map-object.model';
import { TerrainType } from '../../models/terrain/terrain.enum';
import { Tile } from '../../models/terrain/tile.model';
import { MineType } from '../../models/map-objects/mine-type.enum';


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

      const object: MapObject = {
        id: crypto.randomUUID(),
        type,
        x,
        y,
        footprint: def.footprint,
        entries: def.entries,
      };

      // Assign a random mine type if this is a mine
      if (type === MapObjectType.MINE) {
        const mineTypes = [MineType.GOLD, MineType.WOOD, MineType.STONE];
        const randomIndex = Math.floor(Math.random() * mineTypes.length);
        (object as any).mineType = mineTypes[randomIndex];
        console.log(`Mine created at position (${x}, ${y}) - Type: ${mineTypes[randomIndex]}`);
      }

      return object;
    }
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
