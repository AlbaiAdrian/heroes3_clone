
// core/services/rendering/canvas-renderer.service.ts
import { Injectable } from '@angular/core';
import { Tile } from '../../models/terrain/tile.model';
import { HeroSpriteService } from './hero-sprite.service';
import { TERRAIN_CONFIG } from '../../models/terrain/terrain-config';
import { TerrainSpriteService } from './terrain-sprite.service';
import { Hero } from '../../models/hero/hero.model';
import { MapObject } from '../../models/map-objects/map-object.model';
import { ObjectsSpriteService } from './objects-sprite.service';
import { MAP_OBJECT_DEFINITIONS } from '../../models/map-objects/map-object-config';
import { getFootprintSize } from './map-object.utils';

@Injectable({ providedIn: 'root' })
export class CanvasRendererService {

  private ctx!: CanvasRenderingContext2D;
  private tileSize = 48;

  constructor(private heroSprite: HeroSpriteService, private terrainSprite: TerrainSpriteService, private ojectsSprite: ObjectsSpriteService) {}

  initialize(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
  }

  draw(map: Tile[][], objects: MapObject[], hero: Hero, ): void {
    this.ctx.clearRect(0, 0, 960, 720);
    this.drawMap(map);
    this.renderObjects(objects);
    this.drawPathPreview(hero);
    this.drawHero(hero);
  }

  private drawMap(map: Tile[][]): void {
    for (const row of map) {
      for (const tile of row) {
        this.drawTile(tile);
      }
    }
  }

  private drawTile(tile: Tile): void {
    const terrain = TERRAIN_CONFIG[tile.terrain];
    const sprite = this.terrainSprite.get(terrain.type);

    this.ctx.drawImage(
      sprite,
      tile.x * this.tileSize,
      tile.y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
    console.log('Drew tile at', tile.x, tile.y, this.tileSize);
  }

  private drawPathPreview(hero: Hero): void {
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

    for (const tile of hero.path) {
      if (tile === hero.tile) continue;

      this.ctx.fillRect(
        tile.x * this.tileSize,
        tile.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private drawHero(hero: Hero): void {
    const sprite = this.heroSprite.get(hero.facing);

    const x = hero.tile.x * this.tileSize;
    const y = hero.tile.y * this.tileSize;

    this.ctx.drawImage(
      sprite,
      x - this.tileSize * 0.25,
      y - this.tileSize * 0.5,
      this.tileSize * 1.5,
      this.tileSize * 1.5
    );
  }

//   renderObjects(objects: MapObject[]): void {
//   for (const obj of objects) {
//     const sprite = 

//     this.ctx.drawImage(
//       sprite,
//       obj.x * this.tileSize,
//       obj.y * this.tileSize,
//       this.tileSize,
//       this.tileSize
//     );
//   }
// }
  renderObjects(objects: MapObject[]): void {
    for (const obj of objects) {
      const def = MAP_OBJECT_DEFINITIONS[obj.type];
      const sprite = this.ojectsSprite.get(obj.type);
      const size = getFootprintSize(obj.footprint);

      const drawWidth = size.width * this.tileSize;
      const drawHeight = size.height * this.tileSize;

      this.ctx.drawImage(
        sprite,
        obj.x * this.tileSize,
        obj.y * this.tileSize,
        drawWidth,
        drawHeight
      );
    }
  }
}
