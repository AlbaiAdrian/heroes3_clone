import { MapObject } from '../map-objects/map-object.model';

/**
 * Base interface for tile interactions.
 * Returns an interaction object when triggered, without knowing about hero or player.
 */
export interface TileInteraction {
  /**
   * Get the interaction object for this tile.
   * The object can be a mine, a bonus, a spell, etc.
   * @returns The interaction object associated with this tile
   */
  getInteractionObject(): MapObject;
}
