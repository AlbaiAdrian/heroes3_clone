import { Injectable } from '@angular/core';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { PlayerColor } from '../../models/player/player-color.enum';
import { ResourceType } from '../../models/player/resource-type.enum';

@Injectable({ providedIn: 'root' })
export class ObjectsSpriteService {

  private sprites = new Map<MapObjectType, HTMLImageElement>();
  private mineSprites = new Map<ResourceType, HTMLImageElement>();
  private flagSprites = new Map<PlayerColor, HTMLImageElement>();

  loadSprites(): void {
    console.log('Loading object sprites...');
    this.load(MapObjectType.MINE,  'object/mine.png');
    this.load(MapObjectType.ROCK,  'object/rock.png');
    this.load(MapObjectType.TOWN, 'object/town.png');
    this.load(MapObjectType.TREE, 'object/forest.png');
    
    // Load mine type sprites (distinct for each resource)
    this.loadMineSprite(ResourceType.Gold, 'object/gold-mine.png');
    this.loadMineSprite(ResourceType.Wood, 'object/wood-mill.png');
    this.loadMineSprite(ResourceType.Stone, 'object/stone-quarry.png');
    
    // Load flag overlays for player colors
    this.loadFlagSprite(PlayerColor.Red, 'object/flag-red.png');
    this.loadFlagSprite(PlayerColor.Blue, 'object/flag-blue.png');
    this.loadFlagSprite(PlayerColor.Green, 'object/flag-green.png');
    this.loadFlagSprite(PlayerColor.Yellow, 'object/flag-yellow.png');
    this.loadFlagSprite(PlayerColor.Purple, 'object/flag-purple.png');
    this.loadFlagSprite(PlayerColor.Orange, 'object/flag-orange.png');
    this.loadFlagSprite(PlayerColor.Teal, 'object/flag-teal.png');
    this.loadFlagSprite(PlayerColor.Pink, 'object/flag-pink.png');
    
    console.log('Object sprites loaded.');
  } 

  get(direction: MapObjectType): HTMLImageElement {
    const sprite = this.sprites.get(direction);
    if (!sprite) {
      throw new Error(`Sprite not found for object type: ${direction}`);
    }
    return sprite;
  }

  getMineSprite(resourceType: ResourceType): HTMLImageElement {
    const sprite = this.mineSprites.get(resourceType);
    if (!sprite) {
      throw new Error(`Mine sprite not found for resource type: ${resourceType}`);
    }
    return sprite;
  }

  getFlagSprite(color: PlayerColor): HTMLImageElement | undefined {
    return this.flagSprites.get(color);
  }

  private load(dir: MapObjectType, src: string) {
    const img = new Image();
    img.src = src;
    this.sprites.set(dir, img);
  }

  private loadMineSprite(resourceType: ResourceType, src: string) {
    const img = new Image();
    img.src = src;
    this.mineSprites.set(resourceType, img);
  }

  private loadFlagSprite(color: PlayerColor, src: string) {
    const img = new Image();
    img.src = src;
    this.flagSprites.set(color, img);
  }
}
