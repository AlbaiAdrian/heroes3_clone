
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

  draw(map: Tile[][], objects: MapObject[], hero: Hero, viewportX: number = 0, viewportY: number = 0, viewportWidth: number = 20, viewportHeight: number = 15): void {
    this.ctx.clearRect(0, 0, 960, 720);
    this.drawMap(map, viewportX, viewportY, viewportWidth, viewportHeight);
    this.renderObjects(objects, viewportX, viewportY, viewportWidth, viewportHeight);
    this.drawPathPreview(hero, viewportX, viewportY);
    this.drawHero(hero, viewportX, viewportY);
  }

  private drawMap(map: Tile[][], viewportX: number, viewportY: number, viewportWidth: number, viewportHeight: number): void {
    // Only draw visible tiles
    const endY = Math.min(viewportY + viewportHeight, map.length);
    const endX = Math.min(viewportX + viewportWidth, map[0].length);
    
    for (let y = viewportY; y < endY; y++) {
      for (let x = viewportX; x < endX; x++) {
        this.drawTile(map[y][x], viewportX, viewportY);
      }
    }
  }

  private drawTile(tile: Tile, viewportX: number, viewportY: number): void {
    const terrain = TERRAIN_CONFIG[tile.terrain];
    const sprite = this.terrainSprite.get(terrain.type);

    // Draw at screen position relative to viewport
    const screenX = (tile.x - viewportX) * this.tileSize;
    const screenY = (tile.y - viewportY) * this.tileSize;

    this.ctx.drawImage(
      sprite,
      screenX,
      screenY,
      this.tileSize,
      this.tileSize
    );
    console.log('Drew tile at', tile.x, tile.y, this.tileSize);
  }

  private drawPathPreview(hero: Hero, viewportX: number, viewportY: number): void {
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

    for (const tile of hero.path) {
      if (tile === hero.tile) continue;

      // Only draw if tile is in viewport
      const screenX = (tile.x - viewportX) * this.tileSize;
      const screenY = (tile.y - viewportY) * this.tileSize;

      this.ctx.fillRect(
        screenX,
        screenY,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private drawHero(hero: Hero, viewportX: number, viewportY: number): void {
    const sprite = this.heroSprite.get(hero.facing);

    // Draw at screen position relative to viewport
    const screenX = (hero.tile.x - viewportX) * this.tileSize;
    const screenY = (hero.tile.y - viewportY) * this.tileSize;

    this.ctx.drawImage(
      sprite,
      screenX - this.tileSize * 0.25,
      screenY - this.tileSize * 0.5,
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
  renderObjects(objects: MapObject[], viewportX: number, viewportY: number, viewportWidth: number, viewportHeight: number): void {
    for (const obj of objects) {
      // Check if object is visible in viewport
      const size = getFootprintSize(obj.footprint);
      const objEndX = obj.x + size.width;
      const objEndY = obj.y + size.height;
      
      // Skip if completely outside viewport
      if (obj.x >= viewportX + viewportWidth || objEndX <= viewportX ||
          obj.y >= viewportY + viewportHeight || objEndY <= viewportY) {
        continue;
      }

      const def = MAP_OBJECT_DEFINITIONS[obj.type];
      const sprite = this.ojectsSprite.get(obj.type);

      const drawWidth = size.width * this.tileSize;
      const drawHeight = size.height * this.tileSize;

      // Draw at screen position relative to viewport
      const screenX = (obj.x - viewportX) * this.tileSize;
      const screenY = (obj.y - viewportY) * this.tileSize;

      this.ctx.drawImage(
        sprite,
        screenX,
        screenY,
        drawWidth,
        drawHeight
      );
    }
  }
}
