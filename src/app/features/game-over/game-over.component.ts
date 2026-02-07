import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';

@Component({
  standalone: true,
  selector: 'app-game-over',
  imports: [CommonModule],
  template: `
    <section class="game-over">
      <h1>Game Over</h1>
      <p>All your heroes have fallen. The kingdom is lost.</p>
      <button (click)="returnToMenu()">Return to Main Menu</button>
    </section>
  `,
  styles: [
    `
      .game-over {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #0d1b2a;
        color: #eee;
        text-align: center;
      }
      h1 {
        color: #ef5350;
        font-size: 3rem;
        margin-bottom: 1rem;
      }
      p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #aaa;
      }
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        background: #b71c1c;
        color: #fff;
        cursor: pointer;
        font-size: 1rem;
      }
      button:hover { background: #c62828; }
    `,
  ],
})
export class GameOverComponent {
  constructor(private gameEngine: GameEngineService) {}

  returnToMenu(): void {
    this.gameEngine.returnToMenu();
  }
}
