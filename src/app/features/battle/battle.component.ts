// features/battle/battle.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';

@Component({
  standalone: true,
  selector: 'app-battle',
  imports: [CommonModule],
  template: `
    <section class="battle">
      <h2>Battle</h2>
      <p>Battle system placeholder</p>

      <button (click)="endBattle()">End Battle</button>
    </section>
  `,
  styles: [
    `
      .battle {
        padding: 2rem;
        text-align: center;
      }
    `,
  ],
})
export class BattleComponent {
  constructor(private gameEngine: GameEngineService) {}

  endBattle(): void {
    this.gameEngine.returnToMap();
  }
}