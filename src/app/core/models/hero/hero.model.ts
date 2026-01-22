
import { Tile } from "../terrain/tile.model";
import { HeroOrientation } from "./hero-orientation.enum";

  // core/models/hero.model.ts
  export interface Hero {
    name?: string;
    level?: number;

    movementPoints: number
    maxMovementPoints: number
    facing: HeroOrientation;

    tile: Tile
    path: Tile[];
  }