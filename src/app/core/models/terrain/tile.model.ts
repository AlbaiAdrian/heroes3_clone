import { TerrainType } from "./terrain.enum";

// core/models/tile.model.ts
export interface Tile {
    x: number;
    y: number;
    terrain: TerrainType;
    walkable: boolean;
  }