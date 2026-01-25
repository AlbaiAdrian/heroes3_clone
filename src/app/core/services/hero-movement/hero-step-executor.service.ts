// core/services/hero-step-executor.service.ts
import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { Hero } from '../../models/hero/hero.model';
import { ActivePlayerService } from '../active-player.service';
import { MapObjectMine } from '../../models/map-objects/map-object-mine.model';

@Injectable({ providedIn: 'root' })
export class HeroStepExecutorService {

  private readonly STEP_DELAY_MS = 200;

  constructor(private activePlayerService: ActivePlayerService) {}

  async execute(hero: Hero, tile: Tile): Promise<void> {
    const facing = this.getFacingDirection(hero, tile);
    hero.tile = tile;
    hero.facing = facing;

    const index = hero.path.indexOf(tile);
    if (index !== -1) {
      hero.path.splice(index, 1);
    }

    // Handle tile interaction if present
    if (tile.interaction) {
      const action = tile.interaction.getAction();
      this.handleAction(action);
    }

    // allow browser to paint before next step
    await this.delay(this.STEP_DELAY_MS);
  }

  private handleAction(action: any): void {
    const player = this.activePlayerService.getActivePlayer();
    if (!player) return;

    // Handle mine capture
    if (this.isMine(action)) {
      const mine = action as MapObjectMine;
      // Check if mine is already owned
      if (!player.ownedMines.some(m => m.id === mine.id)) {
        player.ownedMines.push(mine);
      }
    }
    // Future: handle other action types (bonuses, spells, etc.)
  }

  private isMine(action: any): action is MapObjectMine {
    return action && typeof action === 'object' && 'mineType' in action;
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
