// core/services/game-engine.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameStateService } from './game-state.service';
import { GameState } from '../../models/game-state.enum';
import { TerrainSpriteService } from '../rendering/terrain-sprite.service';
import { HeroSpriteService } from '../rendering/hero-sprite.service';
import { ObjectsSpriteService } from '../rendering/objects-sprite.service';
import { CreatureTypeDataService } from '../creature/creature-type-data.service';
import { CreatureTypeStoreService } from '../creature/creature-type-store.service';
import { BuildingDataService } from '../building/building-data.service';
import { BuildingStoreService } from '../building/building-store.service';
import { Creature } from '../../models/creature/creature.model';
import { BattleStateService } from '../battle/battle-state.service';
import { BattleOutcomeService } from '../battle/battle-outcome.service';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { PlayerService } from '../player.service';
import { GameSessionService } from './game-session.service';
import { Tile } from '../../models/terrain/tile.model';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private canStartGame$ = new BehaviorSubject<boolean>(false);
  private creaturesLoaded = false;
  private buildingsLoaded = false;
  
  constructor(
    private gameState: GameStateService,
    private battleState: BattleStateService,
    private battleOutcome: BattleOutcomeService,
    private playerService: PlayerService,
    private gameSession: GameSessionService,
    terrainSprite: TerrainSpriteService,
    objectsSprite: ObjectsSpriteService,
    heroSprite: HeroSpriteService,
    creatureTypeData: CreatureTypeDataService,
    creatureStore: CreatureTypeStoreService,
    buildingData: BuildingDataService,
    buildingStore: BuildingStoreService
  ) {
    heroSprite.loadSprites();
    objectsSprite.loadSprites();
    terrainSprite.loadSprites();

    creatureTypeData.getCreatureTypes().subscribe({
      next: (creatureTypes) => {
        console.log('Creatures loaded:', creatureTypes);
        creatureStore.setCreatureTypes(creatureTypes);
        this.creaturesLoaded = true;
        this.updateCanStartGame();
      },
      error: (err) => {
        console.error('Failed to load creatures:', err);
        // Allow game to proceed even if creatures fail
        this.creaturesLoaded = true;
        this.updateCanStartGame();
      }
    });

    buildingData.getBuildings().subscribe({
      next: (buildings) => {
        console.log('Buildings loaded:', buildings);
        buildingStore.setBuildings(buildings);
        this.buildingsLoaded = true;
        this.updateCanStartGame();
      },
      error: (err) => {
        console.error('Failed to load buildings:', err);
        // Allow game to proceed even if buildings fail
        this.buildingsLoaded = true;
        this.updateCanStartGame();
      }
    });
  }

  private updateCanStartGame(): void {
    if (this.creaturesLoaded && this.buildingsLoaded) {
      this.canStartGame$.next(true);
    }
  }

  canStartGame(): Observable<boolean> {
    return this.canStartGame$.asObservable();
  }

  startNewGame(): void {
    console.log('Starting a new game...');
    this.gameState.transitionTo(GameState.Adventure);

  }

  loadGame(): void {
    this.gameState.transitionTo(GameState.Load);
  }

  enterBattle(attackerArmy: Creature[], defenderArmy: Creature[], creatureObject: MapObjectCreature, heroTileBeforeBattle: Tile | null): void {
    this.battleState.startBattle(attackerArmy, defenderArmy, creatureObject, heroTileBeforeBattle);
    this.gameState.transitionTo(GameState.Battle);
  }

  /**
   * Apply battle outcome and return to map, or trigger game over.
   */
  resolveBattle(): void {
    const state = this.battleState.snapshot;
    const creatureObject = this.battleState.creatureObject;
    const heroTileBeforeBattle = this.battleState.heroTileBeforeBattle;
    const player = this.playerService.getActivePlayer();

    if (!state?.result || !player) {
      this.battleState.endBattle();
      this.gameState.transitionTo(GameState.Adventure);
      return;
    }

    const hero = player.selectedHero;
    const objects = this.gameSession.getObjects();
    const map = this.gameSession.getMap();

    const isGameOver = this.battleOutcome.applyOutcome(
      state.result,
      state,
      hero,
      player,
      creatureObject!,
      objects,
      map,
      heroTileBeforeBattle
    );

    this.battleState.endBattle();

    if (isGameOver) {
      this.gameState.transitionTo(GameState.GameOver);
    } else {
      this.gameState.transitionTo(GameState.Adventure);
    }
  }

  returnToMap(): void {
    this.gameState.transitionTo(GameState.Adventure);
  }

  returnToMenu(): void {
    this.gameState.transitionTo(GameState.MainMenu);
  }
}