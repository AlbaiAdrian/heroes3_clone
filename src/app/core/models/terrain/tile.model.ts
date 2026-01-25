import { TerrainType } from "./terrain.enum";
import { TileInteraction } from "./tile-interaction.model";

// core/models/tile.model.ts
export interface Tile {
    x: number;
    y: number;
    terrain: TerrainType;
    walkable: boolean;
    interaction?: TileInteraction;
  }