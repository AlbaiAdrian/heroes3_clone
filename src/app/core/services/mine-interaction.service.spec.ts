import { describe, it, expect, beforeEach } from 'vitest';
import { MineInteractionService } from './mine-interaction.service';
import { MapObject } from '../models/map-objects/map-object.model';
import { MapObjectType } from '../models/map-objects/map-object-type.enum';
import { MineType } from '../models/map-objects/mine-type.enum';
import { Player } from '../models/player/player.model';
import { Hero } from '../models/hero/hero.model';
import { ResourceType } from '../models/player/resource-type.enum';
import { HeroOrientation } from '../models/hero/hero-orientation.enum';

describe('MineInteractionService', () => {
  let service: MineInteractionService;
  let player: Player;
  let hero: Hero;
  let mine: MapObject;
  let objects: MapObject[];

  beforeEach(() => {
    service = new MineInteractionService();
    
    // Create a hero at position (5, 5)
    hero = {
      name: 'Test Hero',
      level: 1,
      movementPoints: 10,
      maxMovementPoints: 10,
      facing: HeroOrientation.South,
      tile: { x: 5, y: 5, walkable: true, terrain: 0 } as any,
      path: []
    };
    
    // Create a player with the hero
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
    
    // Create a gold mine at position (4, 5) with entry at (5, 5)
    mine = {
      id: 'test-mine-1',
      type: MapObjectType.MINE,
      x: 4,
      y: 5,
      footprint: [
        { dx: 0, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 2, dy: 0 }
      ],
      entries: [{ dx: 1, dy: 0 }],
      mineType: MineType.GOLD
    };
    
    objects = [mine];
  });

  it('should capture a mine when hero steps on entry tile', () => {
    // Hero is at (5, 5) which is the entry point of the mine at (4, 5)
    expect(player.ownedMines.length).toBe(0);
    
    service.checkAndCaptureMine(hero, objects, player);
    
    expect(player.ownedMines.length).toBe(1);
    expect(player.ownedMines[0].id).toBe('test-mine-1');
    expect(player.ownedMines[0].resourceType).toBe(ResourceType.Gold);
    expect(player.ownedMines[0].productionAmount).toBe(1000);
  });

  it('should not capture the same mine twice', () => {
    service.checkAndCaptureMine(hero, objects, player);
    expect(player.ownedMines.length).toBe(1);
    
    // Try to capture again
    service.checkAndCaptureMine(hero, objects, player);
    expect(player.ownedMines.length).toBe(1);
  });

  it('should not capture mine when hero is not on entry tile', () => {
    hero.tile = { x: 10, y: 10, walkable: true, terrain: 0 } as any;
    
    service.checkAndCaptureMine(hero, objects, player);
    
    expect(player.ownedMines.length).toBe(0);
  });

  it('should generate resources from owned mines', () => {
    // Capture the mine first
    service.checkAndCaptureMine(hero, objects, player);
    
    const initialGold = player.resources.gold.value;
    
    // Generate resources
    service.generateResourcesFromMines(player);
    
    expect(player.resources.gold.value).toBe(initialGold + 1000);
  });

  it('should generate resources from multiple mines', () => {
    // Add a wood mine
    const woodMine: MapObject = {
      id: 'test-mine-2',
      type: MapObjectType.MINE,
      x: 6,
      y: 5,
      footprint: [
        { dx: 0, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 2, dy: 0 }
      ],
      entries: [{ dx: 1, dy: 0 }],
      mineType: MineType.WOOD
    };
    
    objects.push(woodMine);
    
    // Capture gold mine
    hero.tile = { x: 5, y: 5, walkable: true, terrain: 0 } as any;
    service.checkAndCaptureMine(hero, objects, player);
    
    // Move and capture wood mine
    hero.tile = { x: 7, y: 5, walkable: true, terrain: 0 } as any;
    service.checkAndCaptureMine(hero, objects, player);
    
    expect(player.ownedMines.length).toBe(2);
    
    const initialGold = player.resources.gold.value;
    const initialWood = player.resources.wood.value;
    
    service.generateResourcesFromMines(player);
    
    expect(player.resources.gold.value).toBe(initialGold + 1000);
    expect(player.resources.wood.value).toBe(initialWood + 2);
  });
});
