// core/services/game-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../models/game-state.enum';


@Injectable({ providedIn: 'root' })
export class GameStateService {
    private state$ = new BehaviorSubject<GameState>(GameState.MainMenu);

    currentState$ = this.state$.asObservable();

    get snapshot(): GameState {
        return this.state$.value;
    }

    transitionTo(state: GameState): void {
        console.log(`Transitioning game state to: ${state}`);
        this.state$.next(state);
    }
}