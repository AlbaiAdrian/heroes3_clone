// core/models/building/building.model.spec.ts
import { Building } from './building.model';
import { Creature } from '../creature/creature.model';
import { Faction } from '../faction/faction.enum';

describe('Building Model', () => {
  it('should create a valid building', () => {
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
      cost: {
        gold: 1000,
        wood: 5
      },
      prerequisiteBuildings: [],
      creatureType: creature
    };

    expect(building.name).toBe('Guardhouse');
    expect(building.creatureType?.name).toBe('Pikeman');
  });
});
