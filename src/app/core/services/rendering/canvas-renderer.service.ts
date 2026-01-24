
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
import { ViewportService } from '../viewport/viewport.service';

@Injectable({ providedIn: 'root' })
export class CanvasRendererService {

  private ctx!: CanvasRenderingContext2D;
  private tileSize = 48;
  private canvasWidth = 960;
  private canvasHeight = 720;

  constructor(
    private heroSprite: HeroSpriteService, 
    private terrainSprite: TerrainSpriteService, 
    private objectsSprite: ObjectsSpriteService,
    private viewport: ViewportService
  ) {}

  initialize(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.canvasWidth = ctx.canvas.width;
    this.canvasHeight = ctx.canvas.height;
  }

  draw(map: Tile[][], objects: MapObject[], hero: Hero): void {
    const camera = this.viewport.getCameraPosition();
    
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Apply camera transformation
    this.ctx.save();
    this.ctx.translate(-camera.x, -camera.y);
    
    this.drawMap(map, camera);
    this.renderObjects(objects, camera);
    this.drawPathPreview(hero, camera);
    this.drawHero(hero, camera);
    
    this.ctx.restore();
  }

  private drawMap(map: Tile[][], camera: { x: number; y: number }): void {
    // Calculate visible tile range for performance optimization
    const startX = Math.max(0, Math.floor(camera.x / this.tileSize));
    const startY = Math.max(0, Math.floor(camera.y / this.tileSize));
    const endX = Math.min(map[0].length, Math.ceil((camera.x + this.canvasWidth) / this.tileSize) + 1);
    const endY = Math.min(map.length, Math.ceil((camera.y + this.canvasHeight) / this.tileSize) + 1);
    
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.drawTile(map[y][x]);
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
  }

  private drawPathPreview(hero: Hero, camera: { x: number; y: number }): void {
    // Calculate visible tile range for viewport culling
    const startX = Math.floor(camera.x / this.tileSize);
    const startY = Math.floor(camera.y / this.tileSize);
    const endX = Math.ceil((camera.x + this.canvasWidth) / this.tileSize);
    const endY = Math.ceil((camera.y + this.canvasHeight) / this.tileSize);
    
    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

    for (const tile of hero.path) {
      if (tile === hero.tile) continue;

      // Only draw path tiles that are visible in the viewport
      if (tile.x < startX || tile.x > endX || tile.y < startY || tile.y > endY) {
        continue;
      }

      this.ctx.fillRect(
        tile.x * this.tileSize,
        tile.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }
  }

  private drawHero(hero: Hero, camera: { x: number; y: number }): void {
    const x = hero.tile.x * this.tileSize;
    const y = hero.tile.y * this.tileSize;
    
    // Hero sprite extends beyond the tile (1.5x size, offset by 0.25 left and 0.5 up)
    const heroLeft = x - this.tileSize * 0.25;
    const heroTop = y - this.tileSize * 0.5;
    const heroWidth = this.tileSize * 1.5;
    const heroHeight = this.tileSize * 1.5;
    
    // Calculate viewport bounds
    const viewportLeft = camera.x;
    const viewportTop = camera.y;
    const viewportRight = camera.x + this.canvasWidth;
    const viewportBottom = camera.y + this.canvasHeight;
    
    // Only draw hero if visible in viewport
    if (heroLeft + heroWidth < viewportLeft || heroLeft > viewportRight ||
        heroTop + heroHeight < viewportTop || heroTop > viewportBottom) {
      return;
    }
    
    const sprite = this.heroSprite.get(hero.facing);

    this.ctx.drawImage(
      sprite,
      heroLeft,
      heroTop,
      heroWidth,
      heroHeight
    );
  }

  renderObjects(objects: MapObject[], camera: { x: number; y: number }): void {
    // Filter objects that are visible in the viewport
    const startX = Math.floor(camera.x / this.tileSize);
    const startY = Math.floor(camera.y / this.tileSize);
    const endX = Math.ceil((camera.x + this.canvasWidth) / this.tileSize);
    const endY = Math.ceil((camera.y + this.canvasHeight) / this.tileSize);
    
    for (const obj of objects) {
      const size = getFootprintSize(obj.footprint);
      
      // Simple visibility check
      if (obj.x + size.width < startX || obj.x > endX ||
          obj.y + size.height < startY || obj.y > endY) {
        continue;
      }
      
      const sprite = this.objectsSprite.get(obj.type);
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
