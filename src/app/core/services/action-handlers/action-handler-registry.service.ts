import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { MapObject } from '../../models/map-objects/map-object.model';
import { ActivePlayerService } from '../active-player.service';
import { MineActionHandler } from './mine-action-handler.service';

/**
 * Registry for action handlers using Strategy Pattern.
 * New action types can be added by creating new handlers and registering them here.
 */
@Injectable({ providedIn: 'root' })
export class ActionHandlerRegistry {
  private handlers: ActionHandler[] = [];

  constructor(
    private activePlayerService: ActivePlayerService,
    private mineActionHandler: MineActionHandler
    // Add more handlers here as needed
  ) {
    // Register all handlers
    this.registerHandler(this.mineActionHandler);
    // Future: this.registerHandler(new SpellActionHandler());
    // Future: this.registerHandler(new BonusActionHandler());
  }

  private registerHandler(handler: ActionHandler): void {
    this.handlers.push(handler);
  }

  /**
   * Handle an interaction object by finding the appropriate handler.
   * @param interactionObject The interaction object to handle
   */
  handleInteraction(interactionObject: MapObject): void {
    const player = this.activePlayerService.getActivePlayer();
    if (!player) return;

    const handler = this.handlers.find(h => h.canHandle(interactionObject));
    if (handler) {
      handler.handle(interactionObject);
    }
  }
}
