
import { Tile } from "../terrain/tile.model";
import { HeroOrientation } from "./hero-orientation.enum";
import { Faction } from "../faction/faction.enum";
import { Creature } from "../creature/creature.model";

  // core/models/hero.model.ts
  export interface Hero {
    name?: string;
    level?: number;
    faction?: Faction;

    movementPoints: number
    maxMovementPoints: number
    facing: HeroOrientation;

    tile: Tile
    path: Tile[];

    army: Creature[];
  }