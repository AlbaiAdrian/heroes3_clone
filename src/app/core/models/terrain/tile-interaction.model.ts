import { Player } from '../player/player.model';
import { Hero } from '../hero/hero.model';

/**
 * Base interface for tile interactions.
 * All interactive map objects should implement this interface.
 */
export interface TileInteraction {
  /**
   * Execute the interaction when a hero steps on this tile.
   * @param hero The hero interacting with the tile
   * @param player The player who owns the hero
   */
  execute(hero: Hero, player: Player): void;
}
