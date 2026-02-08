import { Injectable } from '@angular/core';
import { ActionHandler } from '../../models/actions/action-handler.interface';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { GameEngineService } from '../game/game-engine.service';
import { PlayerService } from '../player.service';
import { HeroBattleContextService } from '../hero-movement/hero-battle-context.service';

/**
 * Handler for creature battle interactions.
 * Implements Strategy Pattern for extensible interaction handling.
 */
@Injectable({ providedIn: 'root' })
export class CreatureActionHandler implements ActionHandler {
  private readonly MAX_ARMY_SLOTS = 8;

  constructor(
    private gameEngineService: GameEngineService,
    private playerService: PlayerService,
    private heroBattleContext: HeroBattleContextService
  ) {}

  canHandle(interactionObject: MapObject): boolean {
    return interactionObject.type === MapObjectType.CREATURE;
  }

  handle(interactionObject: MapObject): void {
    const creature = interactionObject as MapObjectCreature;
    const creatureList = creature.creatures.map(c => `${c.quantity} ${c.type.name}`).join(', ');
    console.log(`Initiating battle with: ${creatureList}`);

    const player = this.playerService.getActivePlayer();
    const attackerArmy = (player?.selectedHero?.army ?? []).slice(0, this.MAX_ARMY_SLOTS);
    const previousTile = this.heroBattleContext.previousTile;

    const defenderArmy = creature.creatures.slice(0, this.MAX_ARMY_SLOTS);
    this.gameEngineService.enterBattle(attackerArmy, defenderArmy, creature, previousTile);
  }
}
