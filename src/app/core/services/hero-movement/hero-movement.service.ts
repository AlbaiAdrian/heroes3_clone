// core/services/hero-movement.service.ts
import { Injectable } from '@angular/core';
import { HeroPathfindingService } from './hero-pathfinding.service';
import { HeroStepExecutorService } from './hero-step-executor.service';
import { HeroMovementStateService } from './hero-movement-state.service';
import { Tile } from '../../models/terrain/tile.model';
import { Hero } from '../../models/hero/hero.model';
import { Player } from '../../models/player/player.model';

@Injectable({ providedIn: 'root' })
export class HeroMovementService {

  private isMoving = false;

  constructor(
    private pathfinding: HeroPathfindingService,
    private stepExecutor: HeroStepExecutorService,
    private movementState: HeroMovementStateService
  ) {}

  setDestination(hero: Hero, tile: Tile, map: Tile[][]): void {
    hero.path = this.pathfinding.findPath(hero.tile, tile, map);
  }

  async executePlannedMovement(hero: Hero, player: Player, afterStep: () => Promise<void>): Promise<void> {
    if (this.isMoving) return;

    this.isMoving = true;

    const originalPath = [...hero.path];

    for (let i = 0; i < originalPath.length; i++) {
      if (hero.movementPoints <= 0) break;

      const nextTile = originalPath[i];

      await this.stepExecutor.execute(hero, nextTile, player);
      this.movementState.consume(hero);
        
      // service does NOT know what this does
      await afterStep();
    }
 
    this.isMoving = false;
  }
}