import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';

@Component({
  standalone: true,
  selector: 'app-game-over',
  imports: [CommonModule],
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class GameOverComponent {
  constructor(private gameEngine: GameEngineService) {}

  returnToMenu(): void {
    this.gameEngine.returnToMenu();
  }
}
