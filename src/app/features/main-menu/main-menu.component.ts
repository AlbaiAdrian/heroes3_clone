// features/main-menu/main-menu.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game-engine.service';

@Component({
  standalone: true,
  selector: 'app-main-menu',
  imports: [CommonModule],
  template: `
    <section class="menu">
      <h1>Heroes II</h1>
      <button (click)="newGame()">New Game</button>
    </section>
  `,
})
export class MainMenuComponent {
  constructor(private gameEngine: GameEngineService) {}

  newGame(): void {
    // FSM transition → Adventure
    this.gameEngine.startNewGame();
  }
}