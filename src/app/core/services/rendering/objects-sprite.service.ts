import { Injectable } from '@angular/core';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { PlayerColor } from '../../models/player/player-color.enum';

@Injectable({ providedIn: 'root' })
export class ObjectsSpriteService {

  private sprites = new Map<MapObjectType, HTMLImageElement>();
  private mineSprites = new Map<string, HTMLImageElement>();

  loadSprites(): void {
    console.log('Loading object sprites...');
    this.load(MapObjectType.MINE,  'object/mine.png');
    this.load(MapObjectType.ROCK,  'object/rock.png');
    this.load(MapObjectType.TOWN, 'object/town.png');
    this.load(MapObjectType.TREE, 'object/forest.png');
    
    // Load colored mine sprites
    this.loadMineSprite('neutral', 'object/mine.png');
    this.loadMineSprite(PlayerColor.Red, 'object/mine-red.png');
    this.loadMineSprite(PlayerColor.Blue, 'object/mine-blue.png');
    this.loadMineSprite(PlayerColor.Green, 'object/mine-green.png');
    this.loadMineSprite(PlayerColor.Yellow, 'object/mine-yellow.png');
    this.loadMineSprite(PlayerColor.Purple, 'object/mine-purple.png');
    this.loadMineSprite(PlayerColor.Orange, 'object/mine-orange.png');
    this.loadMineSprite(PlayerColor.Teal, 'object/mine-teal.png');
    this.loadMineSprite(PlayerColor.Pink, 'object/mine-pink.png');
    
    console.log('Object sprites loaded.');
  } 

  get(direction: MapObjectType): HTMLImageElement {
    const sprite = this.sprites.get(direction);
    if (!sprite) {
      throw new Error(`Sprite not found for object type: ${direction}`);
    }
    return sprite;
  }

  getMineSprite(color: PlayerColor | 'neutral'): HTMLImageElement {
    const sprite = this.mineSprites.get(color);
    if (!sprite) {
      console.warn(`Mine sprite not found for color: ${color}, falling back to neutral`);
      return this.mineSprites.get('neutral')!;
    }
    return sprite;
  }

  private load(dir: MapObjectType, src: string) {
    const img = new Image();
    img.src = src;
    this.sprites.set(dir, img);
  }

  private loadMineSprite(color: string, src: string) {
    const img = new Image();
    img.src = src;
    this.mineSprites.set(color, img);
  }
}
