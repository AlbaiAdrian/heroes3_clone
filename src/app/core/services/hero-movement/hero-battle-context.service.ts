import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';

/**
 * Lightweight service that tracks context needed when a battle is triggered
 * during hero movement. Avoids circular dependency between HeroStepExecutorService
 * and CreatureActionHandler.
 */
@Injectable({ providedIn: 'root' })
export class HeroBattleContextService {
  /** The tile the hero was on before stepping onto a tile with an interaction */
  private _previousTile: Tile | null = null;

  get previousTile(): Tile | null {
    return this._previousTile;
  }

  setPreviousTile(tile: Tile | null): void {
    this._previousTile = tile;
  }
}
