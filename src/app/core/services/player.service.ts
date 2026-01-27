import { Injectable } from '@angular/core';
import { Player } from '../models/player/player.model';

/**
 * Service to manage players in the turn-based game.
 * Tracks the active player and provides access to all players.
 */
@Injectable({ providedIn: 'root' })
export class PlayerService {
  private currentPlayer?: Player;
  private allPlayers: Player[] = [];

  setActivePlayer(player: Player): void {
    this.currentPlayer = player;
  }

  getActivePlayer(): Player | undefined {
    if (!this.currentPlayer) {
      console.warn(
        'PlayerService: getActivePlayer called but no active player is currently set.'
      );
    }
    return this.currentPlayer;
  }

  setPlayers(players: Player[]): void {
    this.allPlayers = players;
  }

  getAllPlayers(): Player[] {
    return this.allPlayers;
  }
}
