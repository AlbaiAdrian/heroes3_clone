import { MapObjectType } from './map-object-type.enum';

export interface MapObjectDefinition {
  readonly spriteKey: string;
  readonly footprint: { dx: number; dy: number }[];
  readonly entries: { dx: number; dy: number }[];
}

export const MAP_OBJECT_DEFINITIONS: Record<MapObjectType, MapObjectDefinition> = {
  [MapObjectType.TREE]: {
    spriteKey: 'tree',
    footprint: [
      { dx: 0, dy: 0 },
      { dx: 1, dy: 0 },

      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
    ],
    entries: [],
  },

  [MapObjectType.ROCK]: {
    spriteKey: 'rock',
    footprint: [{ dx: 0, dy: 0 }],
    entries: [],
  },

  [MapObjectType.MINE]: {
    spriteKey: 'mine',

    // 3 tiles wide, 1 tile tall
    footprint: [
      { dx: 0, dy: 0 }, // left
      { dx: 1, dy: 0 }, // middle
      { dx: 2, dy: 0 }, // right

      { dx: 0, dy: 1 }, // left
      { dx: 1, dy: 1 }, // middle
      { dx: 2, dy: 1 }, // right
    ],

    // interaction tile = middle tile
    entries: [
      { dx: 1, dy: 1 },
    ],
  },
    [MapObjectType.TOWN]: {
    spriteKey: 'town',

    // 3×2 footprint
    footprint: [
      // top row (all blocking)
      { dx: 0, dy: 0},
      { dx: 1, dy: 0},
      { dx: 2, dy: 0},

      // bottom row
      { dx: 0, dy: 1},
      { dx: 1, dy: 1}, 
      { dx: 2, dy: 1},

      { dx: 0, dy: 2},
      { dx: 1, dy: 2}, // GATE / ENTRY
      { dx: 2, dy: 2},
    ],

    // interaction tile is INSIDE the footprint
    entries: [
      { dx: 1, dy: 2 },
    ]
  },

  [MapObjectType.CREATURE]: {
    spriteKey: 'creature',
    footprint: [
      { dx: 0, dy: 0 },
    ],
    entries: [
      { dx: 0, dy: 0 },
    ],
  },
};
