import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CreatureActionHandler } from './creature-action-handler.service';
import { GameEngineService } from '../game/game-engine.service';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';

describe('CreatureActionHandler', () => {
  let handler: CreatureActionHandler;
  let gameEngineService: GameEngineService;
  let enterBattleSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    enterBattleSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        CreatureActionHandler,
        {
          provide: GameEngineService,
          useValue: { enterBattle: enterBattleSpy }
        }
      ]
    });

    handler = TestBed.inject(CreatureActionHandler);
    gameEngineService = TestBed.inject(GameEngineService);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  it('should handle creature type', () => {
    const creature: MapObjectCreature = {
      type: MapObjectType.CREATURE,
      x: 5,
      y: 5,
      footprint: [{ dx: 0, dy: 0 }],
      entries: [{ dx: 0, dy: 0 }],
      creatureName: 'Goblin',
      quantity: 5
    };

    expect(handler.canHandle(creature)).toBe(true);
  });

  it('should not handle non-creature types', () => {
    const tree = {
      type: MapObjectType.TREE,
      x: 5,
      y: 5,
      footprint: [{ dx: 0, dy: 0 }],
      entries: []
    };

    expect(handler.canHandle(tree)).toBe(false);
  });

  it('should trigger battle when handling creature', () => {
    const creature: MapObjectCreature = {
      type: MapObjectType.CREATURE,
      x: 5,
      y: 5,
      footprint: [{ dx: 0, dy: 0 }],
      entries: [{ dx: 0, dy: 0 }],
      creatureName: 'Dragon',
      quantity: 1
    };

    handler.handle(creature);

    expect(enterBattleSpy).toHaveBeenCalled();
  });
});
