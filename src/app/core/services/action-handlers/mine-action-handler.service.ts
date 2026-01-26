import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { InteractionObject } from '../../models/interactions/interaction-object.interface';
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

  canHandle(interactionObject: InteractionObject): boolean {
    return interactionObject.type === MapObjectType.MINE;
  }

  handle(interactionObject: InteractionObject): void {
    const mine = interactionObject as MapObjectMine;
    const player = this.activePlayerService.getActivePlayer();
    
    if (!player) return;
    
    // Check if mine is already owned by comparing object references
    if (!player.ownedMines.some(m => m === mine)) {
      player.ownedMines.push(mine);
    }
  }
}
