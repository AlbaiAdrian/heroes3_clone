// core/models/player/player.model.ts
import { Hero } from '../hero/hero.model';
import { Resources } from './resources.model';
import { MapObjectMine } from '../map-objects/map-object-mine.model';
import { MapObjectTown } from '../map-objects/map-object-town.model';
import { PlayerColor } from './player-color.enum';

export interface Player {
  color: PlayerColor;
  heroes: Hero[];
  selectedHero: Hero;
  resources: Resources;
  ownedMines: MapObjectMine[];
  towns: MapObjectTown[];
}
