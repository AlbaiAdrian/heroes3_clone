import { Injectable } from "@angular/core";
import { TerrainType } from "../../models/terrain/terrain.enum";
import { Tile } from "../../models/terrain/tile.model";

// core/services/map-generator.service.ts
@Injectable({ providedIn: 'root' })
export class MapGeneratorService {

  generate(width: number, height: number): Tile[][] {
    const grid = this.createBaseGrass(width, height);

    this.generateWater(grid, width, height);
    this.generateSand(grid, width, height);
    this.generateSnow(grid, width, height);
    this.generateDirt(grid, width, height);

    return grid;
  }

  // --------------------------------------------------
  // Base
  // --------------------------------------------------
  private createBaseGrass(width: number, height: number): Tile[][] {
    return Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => ({
        x,
        y,
        terrain: TerrainType.GRASS,
        walkable: true
      }))
    );
  }

  // --------------------------------------------------
  // WATER
  // --------------------------------------------------
  private generateWater(grid: Tile[][], width: number, height: number): void {
    const lakes = 3;

    for (let i = 0; i < lakes; i++) {
      this.floodFill(
        grid,
        this.randomX(width),
        this.randomY(height),
        TerrainType.WATER,
        Math.floor(width * height * 0.05),
        false
      );
    }
  }

  // --------------------------------------------------
  // SAND (only next to water)
  // --------------------------------------------------
  private generateSand(grid: Tile[][], width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (
          grid[y][x].terrain === TerrainType.GRASS &&
          this.hasNeighbor(grid, x, y, TerrainType.WATER)
        ) {
          grid[y][x].terrain = TerrainType.SAND;
          grid[y][x].walkable = true;
        }
      }
    }
  }

  // --------------------------------------------------
  // SNOW
  // --------------------------------------------------
  private generateSnow(grid: Tile[][], width: number, height: number): void {
    this.floodFill(
      grid,
      this.randomX(width),
      this.randomY(height),
      TerrainType.SNOW,
      Math.floor(width * height * 0.08),
      true
    );
  }

  // --------------------------------------------------
  // DIRT
  // --------------------------------------------------
  private generateDirt(grid: Tile[][], width: number, height: number): void {
    const patches = 4;

    for (let i = 0; i < patches; i++) {
      this.floodFill(
        grid,
        this.randomX(width),
        this.randomY(height),
        TerrainType.DIRT,
        Math.floor(width * height * 0.06),
        true
      );
    }
  }

  // --------------------------------------------------
  // FLOOD FILL (SAFE)
  // --------------------------------------------------
  private floodFill(grid: Tile[][], startX: number, startY: number, terrain: TerrainType, maxSize: number, walkable: boolean): void {
    const queue = [{ x: startX, y: startY }];
    let filled = 0;

    while (queue.length && filled < maxSize) {
      const { x, y } = queue.shift()!;
      const tile = grid[y]?.[x];

      if (!tile || tile.terrain !== TerrainType.GRASS) {
        continue;
      }

      tile.terrain = terrain;
      tile.walkable = walkable;

      filled++;

      this.getNeighbors(x, y, grid[0].length, grid.length)
        .forEach(n => queue.push(n));
    }
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------
  private hasNeighbor(grid: Tile[][], x: number, y: number, terrain: TerrainType): boolean {
    return this.getNeighbors(x, y, grid[0].length, grid.length)
      .some(n => grid[n.y][n.x].terrain === terrain);
  }

  private getNeighbors(x: number, y: number, width: number, height: number): { x: number; y: number }[] {
    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter(p =>
      p.x >= 0 &&
      p.y >= 0 &&
      p.x < width &&
      p.y < height
    );
  }

  private randomX(width: number): number {
    return Math.floor(Math.random() * width);
  }

  private randomY(height: number): number {
    return Math.floor(Math.random() * height);
  }
}