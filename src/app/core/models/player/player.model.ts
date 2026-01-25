// core/models/player/player.model.ts
import { Hero } from '../hero/hero.model';
import { Resources } from './resources.model';
import { MapObjectMine } from '../map-objects/map-object-mine.model';

export interface Player {
  heroes: Hero[];
  selectedHero: Hero;
  resources: Resources;
  ownedMines: MapObjectMine[];
}
