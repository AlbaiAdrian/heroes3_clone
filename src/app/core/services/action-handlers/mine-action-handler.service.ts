import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectMine } from '../../models/map-objects/map-object-mine.model';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { ActivePlayerService } from '../active-player.service';

/**
 * Handler for mine capture interactions.
 * Implements Strategy Pattern for extensible interaction handling.
 */
@Injectable({ providedIn: 'root' })
export class MineActionHandler implements ActionHandler {

  constructor(private activePlayerService: ActivePlayerService) {}

  canHandle(interactionObject: MapObject): boolean {
    return interactionObject.type === MapObjectType.MINE;
  }

  handle(interactionObject: MapObject): void {
    const mine = interactionObject as MapObjectMine;
    const player = this.activePlayerService.getActivePlayer();
    
    if (!player) return;
    
    // Check if mine is already owned by this player
    if (mine.ownerId === player.id) return;
    
    // Set the mine owner
    mine.ownerId = player.id;
    
    // Add to player's owned mines if not already there
    if (!player.ownedMines.some(m => m === mine)) {
      player.ownedMines.push(mine);
    }
  }
}
