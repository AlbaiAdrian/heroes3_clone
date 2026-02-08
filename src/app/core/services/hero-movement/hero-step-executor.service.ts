// core/services/hero-step-executor.service.ts
import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { Hero } from '../../models/hero/hero.model';
import { ActionHandlerRegistry } from '../action-handlers/action-handler-registry.service';

@Injectable({ providedIn: 'root' })
export class HeroStepExecutorService {

  private readonly STEP_DELAY_MS = 200;

  /** The tile the hero was on before the last executed step */
  private _previousTile: Tile | null = null;

  constructor(
    private actionHandlerRegistry: ActionHandlerRegistry
  ) {}

  get previousTile(): Tile | null {
    return this._previousTile;
  }

  async execute(hero: Hero, tile: Tile): Promise<void> {
    const facing = this.getFacingDirection(hero, tile);
    this._previousTile = hero.tile;
    hero.tile = tile;
    hero.facing = facing;

    const index = hero.path.indexOf(tile);
    if (index !== -1) {
      hero.path.splice(index, 1);
    }

    // Handle tile interaction if present
    if (tile.interaction) {
      const interactionObject = tile.interaction.getInteractionObject();
      this.actionHandlerRegistry.handleInteraction(interactionObject);
    }

    // allow browser to paint before next step
    await this.delay(this.STEP_DELAY_MS);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getFacingDirection(hero: Hero, tile: Tile ): HeroOrientation {
    const fromX = hero.tile.x;
    const fromY = hero.tile.y;
    const toX = tile.x;
    const toY = tile.y;

    const dx = toX - fromX;
    const dy = toY - fromY;

    if (dx === 0 && dy < 0) return HeroOrientation.North;
    if (dx > 0 && dy < 0) return HeroOrientation.NorthEast;
    if (dx > 0 && dy === 0) return HeroOrientation.East;
    if (dx > 0 && dy > 0) return HeroOrientation.SouthEast;
    if (dx === 0 && dy > 0) return HeroOrientation.South;
    if (dx < 0 && dy > 0) return HeroOrientation.SouthWest;
    if (dx < 0 && dy === 0) return HeroOrientation.West;
    if (dx < 0 && dy < 0) return HeroOrientation.NorthWest;

    // fallback (no movement)
    return HeroOrientation.South;
  }
}
