import { describe, it, expect, beforeEach } from 'vitest';
import { ResourceGenerationService } from './resource-generation.service';
import { MapObjectMine } from '../models/map-objects/map-object-mine.model';
import { MineType } from '../models/map-objects/mine-type.enum';
import { Player } from '../models/player/player.model';
import { Hero } from '../models/hero/hero.model';
import { ResourceType } from '../models/player/resource-type.enum';
import { HeroOrientation } from '../models/hero/hero-orientation.enum';
import { MapObject } from '../models/map-objects/map-object.model';

describe('ResourceGenerationService', () => {
  let service: ResourceGenerationService;
  let player: Player;
  let goldMine: MapObjectMine;
  let woodMine: MapObjectMine;
  let objects: MapObject[];

  beforeEach(() => {
    service = new ResourceGenerationService();

    goldMine = new MapObjectMine(
      'gold-mine-1',
      5,
      10,
      [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }],
      [{ dx: 1, dy: 0 }],
      MineType.GOLD
    );

    woodMine = new MapObjectMine(
      'wood-mine-1',
      8,
      12,
      [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }],
      [{ dx: 1, dy: 0 }],
      MineType.WOOD
    );

    objects = [goldMine, woodMine];

    const hero: Hero = {
      name: 'Test Hero',
      level: 1,
      movementPoints: 10,
      maxMovementPoints: 10,
      facing: HeroOrientation.South,
      tile: { x: 5, y: 5, walkable: true, terrain: 0 } as any,
      path: []
    };

    player = {
      heroes: [hero],
      selectedHero: hero,
      resources: {
        gold: { value: 1000, type: ResourceType.Gold },
        wood: { value: 10, type: ResourceType.Wood },
        stone: { value: 10, type: ResourceType.Stone }
      },
      ownedMines: []
    };
  });

  it('should not generate resources when no mines are owned', () => {
    const initialGold = player.resources.gold.value;
    
    service.generateFromMines(player, objects);
    
    expect(player.resources.gold.value).toBe(initialGold);
  });

  it('should generate resources from a single owned mine', () => {
    player.ownedMines = ['gold-mine-1'];
    const initialGold = player.resources.gold.value;
    
    service.generateFromMines(player, objects);
    
    expect(player.resources.gold.value).toBe(initialGold + 1000);
  });

  it('should generate resources from multiple owned mines', () => {
    player.ownedMines = ['gold-mine-1', 'wood-mine-1'];
    const initialGold = player.resources.gold.value;
    const initialWood = player.resources.wood.value;
    
    service.generateFromMines(player, objects);
    
    expect(player.resources.gold.value).toBe(initialGold + 1000);
    expect(player.resources.wood.value).toBe(initialWood + 2);
  });

  it('should handle invalid mine IDs gracefully', () => {
    player.ownedMines = ['non-existent-mine'];
    const initialGold = player.resources.gold.value;
    
    service.generateFromMines(player, objects);
    
    expect(player.resources.gold.value).toBe(initialGold);
  });
});
