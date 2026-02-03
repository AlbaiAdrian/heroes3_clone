import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { TERRAIN_CONFIG } from '../../models/terrain/terrain-config';

@Injectable({ providedIn: 'root' })
export class HeroPathfindingService {

  findPath(start: Tile, target: Tile, grid: Tile[][]): Tile[] {
    const queue: Tile[] = [start];
    const cameFrom = new Map<Tile, Tile | null>();

    cameFrom.set(start, null);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === target) {
        return this.reconstructPath(cameFrom, current);
      }

      for (const neighbor of this.getNeighbors(current, grid)) {
        // const terrain = TERRAIN_CONFIG[neighbor.terrain];
        // if (!cameFrom.has(neighbor) && terrain.walkable) {
        
        // Tiles with interactions can only be walked on if they are the target tile
        const canWalkOnTile = neighbor.walkable && 
          (!neighbor.interaction || neighbor === target);
        
        if (!cameFrom.has(neighbor) && canWalkOnTile) {
          queue.push(neighbor);
          cameFrom.set(neighbor, current);
        }
      }
    }

    return [];
  }

  private reconstructPath(
    cameFrom: Map<Tile, Tile | null>,
    current: Tile
  ): Tile[] {
    const path: Tile[] = [];
    while (current) {
      path.unshift(current);
      current = cameFrom.get(current)!;
    }

    // Remove starting tile so the path contains only FUTURE steps
    path.shift();

    return path;
  }

  private getNeighbors(tile: Tile, grid: Tile[][]): Tile[] {
    const x = tile.x;
    const y = tile.y;

    const candidates: Array<{ dx: number; dy: number; requires?: [number, number][] }> = [
      { dx: 0, dy: -1 }, // N
      { dx: 1, dy: 0 },  // E
      { dx: 0, dy: 1 },  // S
      { dx: -1, dy: 0 }, // W

      { dx: 1, dy: -1, requires: [[1, 0], [0, -1]] },  // NE
      { dx: 1, dy: 1, requires: [[1, 0], [0, 1]] },    // SE
      { dx: -1, dy: 1, requires: [[-1, 0], [0, 1]] },  // SW
      { dx: -1, dy: -1, requires: [[-1, 0], [0, -1]] } // NW
    ];

    return candidates
      .filter(({ requires }) =>
        !requires ||
        requires.every(([rx, ry]) => grid[y + ry]?.[x + rx])
      )
      .map(({ dx, dy }) => grid[y + dy]?.[x + dx])
      .filter((tile): tile is Tile => tile !== undefined);
  }
}
