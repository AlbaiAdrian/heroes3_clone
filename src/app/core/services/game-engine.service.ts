// core/services/game-engine.service.ts
import { Injectable } from '@angular/core';
import { GameStateService } from './game-state.service';
import { GameState } from '../models/game-state.enum';
import { TerrainSpriteService } from './rendering/terrain-sprite.service';
import { HeroSpriteService } from './rendering/hero-sprite.service';
import { ObjectsSpriteService } from './rendering/objects-sprite.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  
  constructor(private gameState: GameStateService, terrainSprite: TerrainSpriteService, objectsSprite: ObjectsSpriteService, heroSprite: HeroSpriteService) {
    heroSprite.loadSprites();
    objectsSprite.loadSprites();
    terrainSprite.loadSprites();
  }

  startNewGame(): void {
    console.log('Starting a new game...');
    this.gameState.transitionTo(GameState.Adventure);

  }

  loadGame(): void {
    this.gameState.transitionTo(GameState.Load);
  }

  enterBattle(): void {
    this.gameState.transitionTo(GameState.Battle);
  }

  returnToMap(): void {
    this.gameState.transitionTo(GameState.Adventure);
  }
}