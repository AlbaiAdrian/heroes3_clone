import { Injectable } from '@angular/core';
import { Player } from '../models/player/player.model';

/**
 * Service to manage the current active player in the turn-based game.
 * Since this is a turn-based game, only one player is active at a time.
 */
@Injectable({ providedIn: 'root' })
export class ActivePlayerService {
  private currentPlayer?: Player;

  setActivePlayer(player: Player): void {
    this.currentPlayer = player;
  }

  getActivePlayer(): Player | undefined {
    return this.currentPlayer;
  }
}
