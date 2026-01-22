// core/models/player/player.model.ts
import { Hero } from '../hero/hero.model';
import { Resources } from './resources.model';

export interface Player {
  heroes: Hero[];
  selectedHeroIndex: number;
  resources: Resources;
}
