import { describe, it, expect, beforeEach } from 'vitest';
import { MapObjectMine } from './map-object-mine.model';
import { MineType } from './mine-type.enum';
import { ResourceType } from '../player/resource-type.enum';
import { MapObjectType } from './map-object-type.enum';

describe('MapObjectMine', () => {
  it('should create a gold mine with correct properties', () => {
    const mine = new MapObjectMine(
      'test-id',
      5,
      10,
      [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }],
      [{ dx: 1, dy: 0 }],
      MineType.GOLD
    );

    expect(mine.id).toBe('test-id');
    expect(mine.type).toBe(MapObjectType.MINE);
    expect(mine.x).toBe(5);
    expect(mine.y).toBe(10);
    expect(mine.mineType).toBe(MineType.GOLD);
    expect(mine.resourceType).toBe(ResourceType.Gold);
    expect(mine.productionAmount).toBe(1000);
  });

  it('should create a wood mine with correct properties', () => {
    const mine = new MapObjectMine(
      'test-id',
      5,
      10,
      [],
      [],
      MineType.WOOD
    );

    expect(mine.mineType).toBe(MineType.WOOD);
    expect(mine.resourceType).toBe(ResourceType.Wood);
    expect(mine.productionAmount).toBe(2);
  });

  it('should create a stone mine with correct properties', () => {
    const mine = new MapObjectMine(
      'test-id',
      5,
      10,
      [],
      [],
      MineType.STONE
    );

    expect(mine.mineType).toBe(MineType.STONE);
    expect(mine.resourceType).toBe(ResourceType.Stone);
    expect(mine.productionAmount).toBe(2);
  });

  it('should produce resources', () => {
    const mine = new MapObjectMine(
      'test-id',
      5,
      10,
      [],
      [],
      MineType.GOLD
    );

    expect(mine.produceResources()).toBe(1000);
  });
});
