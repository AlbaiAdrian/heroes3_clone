import { describe, it, expect, beforeEach } from 'vitest';
import { MineInteraction } from './mine-interaction.model';
import { MapObjectMine } from './map-object-mine.model';
import { MineType } from './mine-type.enum';
import { Player } from '../player/player.model';
import { Hero } from '../hero/hero.model';
import { ResourceType } from '../player/resource-type.enum';
import { HeroOrientation } from '../hero/hero-orientation.enum';

describe('MineInteraction', () => {
  let mine: MapObjectMine;
  let player: Player;
  let hero: Hero;

  beforeEach(() => {
    mine = new MapObjectMine(
      'mine-1',
      5,
      10,
      [{ dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: 2, dy: 0 }],
      [{ dx: 1, dy: 0 }],
      MineType.GOLD
    );

    hero = {
      name: 'Test Hero',
      level: 1,
      movementPoints: 10,
      maxMovementPoints: 10,
      facing: HeroOrientation.South,
      tile: { x: 6, y: 10, walkable: true, terrain: 0 } as any,
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

  it('should capture mine when executed', () => {
    const interaction = new MineInteraction(mine);
    
    expect(player.ownedMines).toHaveLength(0);
    
    interaction.execute(hero, player);
    
    expect(player.ownedMines).toHaveLength(1);
    expect(player.ownedMines[0]).toBe('mine-1');
  });

  it('should not capture the same mine twice', () => {
    const interaction = new MineInteraction(mine);
    
    interaction.execute(hero, player);
    expect(player.ownedMines).toHaveLength(1);
    
    interaction.execute(hero, player);
    expect(player.ownedMines).toHaveLength(1);
  });
});
