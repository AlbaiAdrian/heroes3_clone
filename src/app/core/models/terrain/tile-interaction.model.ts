/**
 * Base interface for tile interactions.
 * Returns an action object when triggered, without knowing about hero or player.
 */
export interface TileInteraction {
  /**
   * Get the action object for this interaction.
   * The action can be a mine, a bonus, a spell, etc.
   * @returns The action object associated with this tile
   */
  getAction(): any;
}
