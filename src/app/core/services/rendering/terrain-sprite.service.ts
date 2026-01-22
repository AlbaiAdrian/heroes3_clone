import { Injectable } from '@angular/core';
import { TerrainType } from '../../models/terrain/terrain.enum';

@Injectable({ providedIn: 'root' })
export class TerrainSpriteService {

  private sprites = new Map<TerrainType, HTMLImageElement>();

  loadSprites(): void {
    this.load(TerrainType.GRASS,  'terrain/grass.png');
    this.load(TerrainType.DIRT,  'terrain/dirt.png');
    this.load(TerrainType.SAND,  'terrain/sand.png');
    this.load(TerrainType.SNOW,  'terrain/snow.png');
    this.load(TerrainType.WATER,  'terrain/water.png');
    console.log('Terrain sprites loaded.');
  }

  get(terrainType: TerrainType): HTMLImageElement {
    return this.sprites.get(terrainType)!;
  }

  private load(terrainType: TerrainType, src: string) {
    const img = new Image();
    img.src = src;
    this.sprites.set(terrainType, img);
  }
}
