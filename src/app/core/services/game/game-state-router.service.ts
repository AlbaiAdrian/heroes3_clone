import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from './game-state.service';
import { GameState } from '../../models/game-state.enum';

@Injectable({ providedIn: 'root' })
export class GameStateRouterService {

  constructor(
    private readonly gameState: GameStateService,
    private readonly router: Router
  ) {}

  init(): void {
    console.log('GameStateRouterService initialized, subscribing to game state changes.');
    console.log(this.gameState);
    this.gameState.currentState$.subscribe(state => {
      console.log(`Routing to state: ${state}`);

      switch (state) {
        case GameState.MainMenu:
          this.router.navigateByUrl('');
          break;
        case GameState.Adventure:
          this.router.navigateByUrl('adventure');
          break;
        case GameState.Battle:
          this.router.navigateByUrl('battle');
          break;
        case GameState.GameOver:
          this.router.navigateByUrl('game-over');
          break;
      }
    });
  }
}
