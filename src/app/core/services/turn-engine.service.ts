// core/services/turn-engine.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TurnState } from '../models/turn-state.model';
import { HeroMovementStateService } from './hero-movement/hero-movement-state.service';
import { Hero } from '../models/hero/hero.model';
import { GameClockService } from './game-clock.service';
import { ResourceGenerationService } from './resource-generation.service';
import { Player } from '../models/player/player.model';
import { MapObject } from '../models/map-objects/map-object.model';

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

  endTurn(heroes: Hero[], player: Player, objects: MapObject[]): void {
    this.state$.next(
      {
        currentTurn: this.snapshot.currentTurn + 1,
      });
    heroes.forEach(hero => {
      this.gameClock.nextDay();
      this.movementState.reset(hero);
    });
    
    // Generate resources from owned mines
    this.resourceGeneration.generateFromMines(player, objects);
  }
}