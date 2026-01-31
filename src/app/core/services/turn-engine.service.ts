// core/services/turn-engine.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TurnState } from '../models/turn-state.model';
import { HeroMovementStateService } from './hero-movement/hero-movement-state.service';
import { GameClockService } from './game/game-clock.service';
import { ResourceGenerationService } from './resource-generation.service';
import { Player } from '../models/player/player.model';

@Injectable({ providedIn: 'root' })
export class TurnEngineService {
  private state$ = new BehaviorSubject<TurnState>({
    currentTurn: 1
  });

  readonly turnState$ = this.state$.asObservable();

  constructor(
    private movementState: HeroMovementStateService, 
    private readonly gameClock: GameClockService,
    private resourceGeneration: ResourceGenerationService
  ) {}

  get snapshot(): TurnState {
    return this.state$.value;
  }

  endTurn(player: Player): void {
    this.state$.next(
      {
        currentTurn: this.snapshot.currentTurn + 1,
      });
    
    // Advance the game clock once per turn
    this.gameClock.nextDay();

    // Iterate through player's heroes
    player.heroes.forEach(hero => {
      this.movementState.reset(hero);
    });
    
    // Generate resources from owned mines
    this.resourceGeneration.generateFromMines(player);
  }
}