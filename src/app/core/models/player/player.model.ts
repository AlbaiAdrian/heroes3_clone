// core/models/player/player.model.ts
import { Hero } from '../hero/hero.model';
import { Resources } from './resources.model';
import { OwnedMine } from './owned-mine.model';

export interface Player {
  heroes: Hero[];
  selectedHero: Hero;
  resources: Resources;
  ownedMines: OwnedMine[];
}
