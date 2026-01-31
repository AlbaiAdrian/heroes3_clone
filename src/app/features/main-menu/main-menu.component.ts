// features/main-menu/main-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';
import { MapGeneratorService } from '../../core/services/map-generation/map-generator.service';
import { MapObjectGeneratorService } from '../../core/services/map-generation/map-object-generator.service';
import { ObjectWalkabilityService } from '../../core/services/map-generation/object-walkability.service';
import { PlayerService } from '../../core/services/player.service';
import { GameSessionService } from '../../core/services/game/game-session.service';
import { Hero } from '../../core/models/hero/hero.model';
import { HeroOrientation } from '../../core/models/hero/hero-orientation.enum';
import { PlayerColor } from '../../core/models/player/player-color.enum';
import { ResourceType } from '../../core/models/player/resource-type.enum';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-main-menu',
  imports: [CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  // Map dimensions (increased from 24x16 to 48x32)
  private readonly MAP_WIDTH = 48;
  private readonly MAP_HEIGHT = 32;

  canStartGame$!: Observable<boolean>;

  constructor(
    private gameEngine: GameEngineService,
    private mapGenerator: MapGeneratorService,
    private objectGenerator: MapObjectGeneratorService,
    private objectWalkability: ObjectWalkabilityService,
    private playerService: PlayerService,
    private gameSession: GameSessionService
  ) {
    this.canStartGame$ = this.gameEngine.canStartGame();
  }

  newGame(): void {
    const map = this.mapGenerator.generate(this.MAP_WIDTH, this.MAP_HEIGHT);
    const objects = this.objectGenerator.generate(map);
    this.objectWalkability.applyObjects(map, objects);

    // Initialize player with starting hero and resources
    const firstHero: Hero = {
      tile: map[5][5],
      name: 'First Hero',
      level: 1,
      movementPoints: 10,
      maxMovementPoints: 10,
      path: [],
      facing: HeroOrientation.West
    };

    const player = {
      color: PlayerColor.Red,
      heroes: [firstHero],
      selectedHero: firstHero,
      resources: {
        gold: { value: 10000, type: ResourceType.Gold },
        wood: { value: 20, type: ResourceType.Wood },
        stone: { value: 20, type: ResourceType.Stone }
      },
      ownedMines: [],
      towns: []
    };

    // Set this player as the active player for the turn-based game
    this.playerService.setActivePlayer(player);
    this.playerService.setPlayers([player]);

    // Store session data for the adventure map
    this.gameSession.setMap(map);
    this.gameSession.setObjects(objects);
    this.gameSession.setPlayer(player);

    // FSM transition → Adventure
    this.gameEngine.startNewGame();
  }
}