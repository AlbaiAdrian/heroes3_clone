import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { GameEngineService } from '../game/game-engine.service';

/**
 * Handler for creature battle interactions.
 * Implements Strategy Pattern for extensible interaction handling.
 */
@Injectable({ providedIn: 'root' })
export class CreatureActionHandler implements ActionHandler {

  constructor(private gameEngineService: GameEngineService) {}

  canHandle(interactionObject: MapObject): boolean {
    return interactionObject.type === MapObjectType.CREATURE;
  }

  handle(interactionObject: MapObject): void {
    const creature = interactionObject as MapObjectCreature;
    const creatureList = creature.creatures.map(c => `${c.quantity} ${c.type.name}`).join(', ');
    console.log(`Initiating battle with: ${creatureList}`);
    this.gameEngineService.enterBattle();
  }
}
