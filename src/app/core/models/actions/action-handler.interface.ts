import { InteractionObject } from '../interactions/interaction-object.interface';

/**
 * Strategy interface for handling different interaction object types.
 * Each interaction handler implements this interface.
 */
export interface ActionHandler {
  /**
   * Check if this handler can handle the given interaction object.
   * @param interactionObject The interaction object to check
   * @returns True if this handler can process the interaction object
   */
  canHandle(interactionObject: InteractionObject): boolean;

  /**
   * Handle the interaction object.
   * @param interactionObject The interaction object to process
   */
  handle(interactionObject: InteractionObject): void;
}
