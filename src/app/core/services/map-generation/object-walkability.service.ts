import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { MapObject } from '../../models/map-objects/map-object.model';


@Injectable({ providedIn: 'root' })
export class ObjectWalkabilityService {

  applyObjects(grid: Tile[][], objects: MapObject[]): void {
    for (const object of objects) {
      this.applyObject(grid, object);
    }
  }

  private applyObject(grid: Tile[][], object: MapObject): void {
    // Block entire footprint (LOCAL → MAP coordinates)
    for (const cell of object.footprint) {
      const mapX = object.x + cell.dx;
      const mapY = object.y + cell.dy;

      const tile = grid[mapY]?.[mapX];
      if (!tile) continue;

      tile.walkable = false;
    }

    if (object.entries.length <= 0 ){
        return;
    }
        
    // Allow interaction tile (LOCAL → MAP coordinates)
    const interactionMapX = object.x + object.entries[0].dx;
    const interactionMapY = object.y + object.entries[0].dy;

    const interactionTile = grid[interactionMapY]?.[interactionMapX];
    if (interactionTile) {
      interactionTile.walkable = true;
    }
  }
}
