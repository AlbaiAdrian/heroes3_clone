import { Injectable } from '@angular/core';
import { MapObject } from '../../models/map-objects/map-object.model';
import { Player } from '../../models/player/player.model';
import { Tile } from '../../models/terrain/tile.model';

/**
 * Holds the current game session data in memory.
 */
@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private map!: Tile[][];
  private objects!: MapObject[];
  private player!: Player;

  setMap(map: Tile[][]): void {
    this.map = map;
  }

  getMap(): Tile[][]  {
    return this.map;
  }

  setObjects(objects: MapObject[]): void {
    this.objects = objects;
  }

  getObjects(): MapObject[]{
    return this.objects;
  }

  setPlayer(player: Player): void {
    this.player = player;
  }

  getPlayer(): Player{
    return this.player;
  }
}
