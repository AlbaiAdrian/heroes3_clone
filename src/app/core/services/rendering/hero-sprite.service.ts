import { Injectable } from '@angular/core';
import { HeroOrientation } from '../../models/hero/hero-orientation.enum';

@Injectable({ providedIn: 'root' })
export class HeroSpriteService {

  private sprites = new Map<HeroOrientation, HTMLImageElement>();

  loadSprites(): void {
    console.log('Loading hero sprites...');
    this.load(HeroOrientation.West,  'hero/hero-mounted-west.png');
    this.load(HeroOrientation.East,  'hero/hero-mounted-east.png');
    this.load(HeroOrientation.North, 'hero/hero-mounted-north.png');
    this.load(HeroOrientation.South, 'hero/hero-mounted-south.png');
    this.load(HeroOrientation.SouthWest, 'hero/hero-south-west.png');
    this.load(HeroOrientation.SouthEast, 'hero/hero-mounted-south-east.png');
    this.load(HeroOrientation.NorthEast, 'hero/hero-mounted-north-east.png');
    this.load(HeroOrientation.NorthWest, 'hero/hero-mounted-north-west.png');
    console.log('Hero sprites loaded.');
  } 

  get(direction: HeroOrientation): HTMLImageElement {
    return this.sprites.get(direction)!;
  }

  private load(dir: HeroOrientation, src: string) {
    const img = new Image();
    img.src = src;
    this.sprites.set(dir, img);
  }
}
