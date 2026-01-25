// core/services/turn-engine.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TurnState } from '../models/turn-state.model';
import { HeroMovementStateService } from './hero-movement/hero-movement-state.service';
import { Hero } from '../models/hero/hero.model';
import { GameClockService } from './game-clock.service';
import { MineInteractionService } from './mine-interaction.service';
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
    private mineInteraction: MineInteractionService
  ) {}

  get snapshot(): TurnState {
    return this.state$.value;
  }

  endTurn(heroes: Hero[], player: Player): void {
    this.state$.next(
      {
        currentTurn: this.snapshot.currentTurn + 1,
      });
    heroes.forEach(hero => {
      this.gameClock.nextDay();
      this.movementState.reset(hero);
    });
    
    // Generate resources from owned mines
    this.mineInteraction.generateResourcesFromMines(player);
  }
}