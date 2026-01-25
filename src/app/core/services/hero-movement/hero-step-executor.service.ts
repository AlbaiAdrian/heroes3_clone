// core/services/hero-step-executor.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { Hero } from '../../models/hero/hero.model';
import { MapObject } from '../../models/map-objects/map-object.model';
import { Player } from '../../models/player/player.model';
import { MineInteractionService } from '../mine-interaction.service';

@Injectable({ providedIn: 'root' })
export class HeroStepExecutorService {

  private readonly STEP_DELAY_MS = 200;

  constructor(private mineInteraction: MineInteractionService) {}

  async execute(hero: Hero, tile: Tile, objects: MapObject[], player: Player): Promise<void> {
    const facing = this.getFacingDirection(hero, tile);
    hero.tile = tile;
    hero.facing = facing;

    const index = hero.path.indexOf(tile);
    if (index !== -1) {
      hero.path.splice(index, 1);
    }

    // Check for mine interaction
    this.mineInteraction.checkAndCaptureMine(hero, objects, player);

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
