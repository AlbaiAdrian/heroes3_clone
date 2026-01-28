// core/models/creature/creature.model.spec.ts
import { Creature } from './creature.model';
import { Faction } from '../faction/faction.enum';

describe('Creature Model', () => {
  it('should create a valid creature', () => {
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
      cost: {
        gold: 60
      }
    };

    expect(creature.name).toBe('Pikeman');
    expect(creature.faction).toBe(Faction.Castle);
    expect(creature.level).toBe(1);
  });
});
