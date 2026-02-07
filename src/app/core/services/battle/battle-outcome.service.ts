import { Injectable } from '@angular/core';
import { BattleResult } from '../../models/battle/battle-result.enum';
import { BattleState } from '../../models/battle/battle-state.model';
import { Hero } from '../../models/hero/hero.model';
import { Player } from '../../models/player/player.model';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { Creature } from '../../models/creature/creature.model';
import { Tile } from '../../models/terrain/tile.model';

/**
 * Handles post-battle consequences:
 * - Victory: update hero army losses, remove creature from map, allow movement
 * - Defeat: remove hero from player, check game over
 * - Retreat: block hero from advancing over the creature tile
 */
@Injectable({ providedIn: 'root' })
export class BattleOutcomeService {

  /**
   * Apply battle outcome to the game state.
   * Returns true if the player has lost (game over).
   */
  applyOutcome(
    result: BattleResult,
    battleState: BattleState,
    hero: Hero,
    player: Player,
    creatureObject: MapObjectCreature,
    objects: MapObject[],
    map: Tile[][]
  ): boolean {
    switch (result) {
      case BattleResult.AttackerWins:
        this.handleVictory(battleState, hero, creatureObject, objects, map);
        return false;

      case BattleResult.DefenderWins:
        return this.handleDefeat(hero, player);

      case BattleResult.Retreat:
        this.handleRetreat(hero, creatureObject);
        return false;

      default:
        return false;
    }
  }

  /**
   * Victory: update hero's army to reflect losses, remove creature from map.
   */
  private handleVictory(
    battleState: BattleState,
    hero: Hero,
    creatureObject: MapObjectCreature,
    objects: MapObject[],
    map: Tile[][]
  ): void {
    // Update hero army based on surviving attacker units
    hero.army = battleState.attackerUnits
      .filter(u => !u.isDead)
      .map(u => ({
        type: u.creatureType,
        quantity: u.quantity,
      } as Creature));

    // Remove the creature from the map objects array
    const index = objects.indexOf(creatureObject);
    if (index !== -1) {
      objects.splice(index, 1);
    }

    // Clear interaction and restore walkability on creature tiles
    this.clearCreatureTiles(creatureObject, map);
  }

  /**
   * Defeat: remove hero from player's hero list.
   * Returns true if the player has no heroes left (game over).
   */
  private handleDefeat(hero: Hero, player: Player): boolean {
    const heroIndex = player.heroes.indexOf(hero);
    if (heroIndex !== -1) {
      player.heroes.splice(heroIndex, 1);
    }

    // If the selected hero was removed, select another or leave undefined
    if (player.selectedHero === hero) {
      player.selectedHero = player.heroes[0];
    }

    // Game over if no heroes remain
    return player.heroes.length === 0;
  }

  /**
   * Retreat: clear hero's remaining path to stop further movement.
   * The creature remains on the map so the hero cannot advance past it.
   */
  private handleRetreat(hero: Hero, creatureObject: MapObjectCreature): void {
    // Clear any remaining path so the hero stops moving
    hero.path = [];
  }

  /**
   * Remove the creature interaction from tiles and mark the tile as walkable.
   */
  private clearCreatureTiles(creature: MapObjectCreature, map: Tile[][]): void {
    for (const entry of creature.entries) {
      const tileX = creature.x + entry.dx;
      const tileY = creature.y + entry.dy;

      const tile = map[tileY]?.[tileX];
      if (tile) {
        tile.interaction = undefined;
        tile.walkable = true;
      }
    }

    for (const foot of creature.footprint) {
      const tileX = creature.x + foot.dx;
      const tileY = creature.y + foot.dy;

      const tile = map[tileY]?.[tileX];
      if (tile) {
        tile.walkable = true;
      }
    }
  }
}
