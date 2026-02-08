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
    map: Tile[][],
    heroTileBeforeBattle: Tile | null
  ): boolean {
    switch (result) {
      case BattleResult.AttackerWins:
        this.handleVictory(battleState, hero, creatureObject, objects, map);
        return false;

      case BattleResult.DefenderWins:
        return this.handleDefeat(hero, player);

      case BattleResult.Retreat:
        this.handleRetreat(hero, heroTileBeforeBattle);
        return false;

      default:
        return false;
    }
  }

  /**
   * Victory: remove dead creature stacks from hero's army and update
   * surviving stacks with their remaining quantities, then remove
   * the defeated creature from the map.
   */
  private handleVictory(
    battleState: BattleState,
    hero: Hero,
    creatureObject: MapObjectCreature,
    objects: MapObject[],
    map: Tile[][]
  ): void {
    // Rebuild hero army: keep only surviving units, remove dead stacks
    const survivingArmy: Creature[] = [];
    for (const unit of battleState.attackerUnits) {
      if (!unit.isDead && unit.quantity > 0) {
        survivingArmy.push({ type: unit.creatureType, quantity: unit.quantity });
      }
    }
    hero.army = survivingArmy;

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
   * Retreat: move hero back to the tile before the creature and clear
   * remaining path. The creature remains on the map blocking passage.
   */
  private handleRetreat(hero: Hero, previousTile: Tile | null): void {
    // Move hero back to the tile before the creature
    if (previousTile) {
      hero.tile = previousTile;
    }
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
