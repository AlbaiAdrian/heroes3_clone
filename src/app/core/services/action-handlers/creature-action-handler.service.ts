import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { GameEngineService } from '../game/game-engine.service';
import { PlayerService } from '../player.service';
import { BattleStateService } from '../battle/battle-state.service';

/**
 * Handler for creature battle interactions.
 * Implements Strategy Pattern for extensible interaction handling.
 */
@Injectable({ providedIn: 'root' })
export class CreatureActionHandler implements ActionHandler {

  constructor(
    private gameEngineService: GameEngineService,
    private playerService: PlayerService,
    private battleStateService: BattleStateService,
  ) {}

  canHandle(interactionObject: MapObject): boolean {
    return interactionObject.type === MapObjectType.CREATURE;
  }

  handle(interactionObject: MapObject): void {
    const creature = interactionObject as MapObjectCreature;
    const player = this.playerService.getActivePlayer();
    if (!player) return;

    const hero = player.selectedHero;
    const creatureList = creature.creatures.map(c => `${c.quantity} ${c.type.name}`).join(', ');
    console.log(`Initiating battle with: ${creatureList}`);

    // Initialize battle state with hero's army vs map creatures
    this.battleStateService.initBattle(
      hero.army,
      creature.creatures,
    );

    this.gameEngineService.enterBattle(creature);
  }
}
