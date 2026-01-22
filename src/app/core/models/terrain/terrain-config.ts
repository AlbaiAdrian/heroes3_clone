import { TerrainType } from './terrain.enum';

export interface TerrainConfig {
  readonly type: TerrainType;
  // readonly walkable: boolean;
  readonly movementCost: number;
}

export const TERRAIN_CONFIG: Record<TerrainType, TerrainConfig> = {
  [TerrainType.GRASS]: {
    type: TerrainType.GRASS,
    // walkable: true,
    movementCost: 1,
  },
  [TerrainType.DIRT]: {
    type: TerrainType.DIRT,
    // walkable: true,
    movementCost: 1,
  },
  [TerrainType.SAND]: {
    type: TerrainType.SAND,
    // walkable: true,
    movementCost: 2,
  },
  [TerrainType.SNOW]: {
    type: TerrainType.SNOW,
    // walkable: true,
    movementCost: 2,
  },
  [TerrainType.WATER]: {
    type: TerrainType.WATER,
    // walkable: false,
    movementCost: Infinity,
  },
};
