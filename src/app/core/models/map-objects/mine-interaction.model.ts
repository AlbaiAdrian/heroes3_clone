import { TileInteraction } from '../terrain/tile-interaction.model';
import { Hero } from '../hero/hero.model';
import { Player } from '../player/player.model';
import { MapObjectMine } from './map-object-mine.model';

/**
 * Interaction for mine capture.
 * When a hero steps on a mine entry tile, this interaction captures the mine.
 */
export class MineInteraction implements TileInteraction {
  constructor(private mine: MapObjectMine) {}

  execute(hero: Hero, player: Player): void {
    // Check if mine is already owned
    if (player.ownedMines.includes(this.mine.id)) {
      return;
    }

    // Capture the mine by adding its ID to player's owned mines
    player.ownedMines.push(this.mine.id);
  }
}
