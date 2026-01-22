import { Injectable } from '@angular/core';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';

@Injectable({ providedIn: 'root' })
export class ObjectsSpriteService {

  private sprites = new Map<MapObjectType, HTMLImageElement>();

  loadSprites(): void {
    console.log('Loading hero sprites...');
    this.load(MapObjectType.MINE,  'object/mine.png');
    this.load(MapObjectType.ROCK,  'object/rock.png');
    this.load(MapObjectType.TOWN, 'object/town.png');
    this.load(MapObjectType.TREE, 'object/forest.png');
    console.log('Object sprites loaded.');
  } 

  get(direction: MapObjectType): HTMLImageElement {
    return this.sprites.get(direction)!;
  }

  private load(dir: MapObjectType, src: string) {
    const img = new Image();
    img.src = src;
    this.sprites.set(dir, img);
  }
}
