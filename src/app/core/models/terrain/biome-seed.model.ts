import { TerrainType } from "./terrain.enum";

export interface BiomeSeed {
  x: number;
  y: number;
  terrain: TerrainType;
}