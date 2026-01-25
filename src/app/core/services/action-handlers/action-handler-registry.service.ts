import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { Player } from '../../models/player/player.model';
import { MineActionHandler } from './mine-action-handler.service';

/**
 * Registry for action handlers using Strategy Pattern.
 * New action types can be added by creating new handlers and registering them here.
 */
@Injectable({ providedIn: 'root' })
export class ActionHandlerRegistry {
  private handlers: ActionHandler[] = [];

  constructor(
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
   * Handle an action by finding the appropriate handler.
   * @param action The action to handle
   * @param player The active player
   */
  handleAction(action: any, player: Player): void {
    const handler = this.handlers.find(h => h.canHandle(action));
    if (handler) {
      handler.handle(action, player);
    }
  }
}
