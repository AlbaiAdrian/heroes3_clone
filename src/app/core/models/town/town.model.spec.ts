// core/models/town/town.model.spec.ts
import { Town } from './town.model';
import { Faction } from '../faction/faction.enum';
import { Building } from '../building/building.model';
import { Creature } from '../creature/creature.model';
import { TerrainType } from '../terrain/terrain.enum';

describe('Town Model', () => {
  it('should create a valid town with faction and buildings', () => {
    const creature: Creature = {
      id: 'pikeman',
      name: 'Pikeman',
      faction: Faction.Castle,
      level: 1,
      attack: 4,
      defense: 5,
      minDamage: 1,
      maxDamage: 3,
      health: 10,
      speed: 4,
      growth: 14,
      cost: { gold: 60 }
    };

    const building: Building = {
      id: 'guardhouse',
      name: 'Guardhouse',
      level: 1,
      cost: { gold: 1000, wood: 5 },
      prerequisiteBuildings: [],
      creatureType: creature
    };

    const town: Town = {
      id: 'castle1',
      name: 'Castle Town',
      faction: Faction.Castle,
      tile: { x: 10, y: 10, terrain: TerrainType.GRASS, walkable: true },
      buildings: [building],
      availableCreatures: [
        {
          creature: creature,
          available: 14
        }
      ]
    };

    expect(town.name).toBe('Castle Town');
    expect(town.faction).toBe(Faction.Castle);
    expect(town.buildings.length).toBe(1);
    expect(town.availableCreatures.length).toBe(1);
    expect(town.availableCreatures[0].available).toBe(14);
  });
});
