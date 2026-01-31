// core/services/game-engine.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameStateService } from './game-state.service';
import { GameState } from '../../models/game-state.enum';
import { TerrainSpriteService } from '../rendering/terrain-sprite.service';
import { HeroSpriteService } from '../rendering/hero-sprite.service';
import { ObjectsSpriteService } from '../rendering/objects-sprite.service';
import { CreatureDataService } from '../creature/creature-data.service';
import { CreatureStoreService } from '../creature/creature-store.service';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private canStartGame$ = new BehaviorSubject<boolean>(false);
  
  constructor(
    private gameState: GameStateService,
    terrainSprite: TerrainSpriteService,
    objectsSprite: ObjectsSpriteService,
    heroSprite: HeroSpriteService,
    creatureData: CreatureDataService,
    creatureStore: CreatureStoreService
  ) {
    heroSprite.loadSprites();
    objectsSprite.loadSprites();
    terrainSprite.loadSprites();

    creatureData.getCreatures().subscribe({
      next: (creatures) => {
        console.log('Creatures loaded:', creatures);
        creatureStore.setCreatures(creatures);
        this.canStartGame$.next(true);
      },
      error: (err) => {
        console.error('Failed to load creatures:', err);
        // Allow game to proceed even if creatures fail
        this.canStartGame$.next(true);
      }
    });
  }

  canStartGame(): Observable<boolean> {
    return this.canStartGame$.asObservable();
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