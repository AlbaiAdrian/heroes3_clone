import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { Player } from '../../models/player/player.model';
import { MapObjectMine } from '../../models/map-objects/map-object-mine.model';

/**
 * Handler for mine capture actions.
 * Implements Strategy Pattern for extensible action handling.
 */
@Injectable({ providedIn: 'root' })
export class MineActionHandler implements ActionHandler {

  canHandle(action: any): boolean {
    return action && typeof action === 'object' && 'resourceType' in action && 'productionAmount' in action;
  }

  handle(action: any, player: Player): void {
    const mine = action as MapObjectMine;
    
    // Check if mine is already owned
    if (!player.ownedMines.some(m => m.id === mine.id)) {
      player.ownedMines.push(mine);
    }
  }
}
