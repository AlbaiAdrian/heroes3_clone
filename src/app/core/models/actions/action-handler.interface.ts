import { Player } from '../player/player.model';

/**
 * Strategy interface for handling different action types.
 * Each action handler implements this interface.
 */
export interface ActionHandler {
  /**
   * Check if this handler can handle the given action.
   * @param action The action object to check
   * @returns True if this handler can process the action
   */
  canHandle(action: any): boolean;

  /**
   * Handle the action.
   * @param action The action object to process
   * @param player The active player
   */
  handle(action: any, player: Player): void;
}
