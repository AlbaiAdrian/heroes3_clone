import { TerrainType } from "./terrain.enum";
import { TileInteraction } from "./tile-interaction.model";

// core/models/tile.model.ts
export interface Tile {
    x: number;
    y: number;
    terrain: TerrainType;
    walkable: boolean;
    /**
     * Optional interaction that returns an action when triggered.
     * Can return a mine, bonus, spell, etc.
     */
    interaction?: TileInteraction;
  }