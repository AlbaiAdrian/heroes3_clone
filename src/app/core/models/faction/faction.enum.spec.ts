// core/models/faction/faction.enum.spec.ts
import { Faction } from './faction.enum';

describe('Faction', () => {
  it('should have all expected factions', () => {
    expect(Faction.Castle).toBe('castle');
    expect(Faction.Rampart).toBe('rampart');
    expect(Faction.Tower).toBe('tower');
    expect(Faction.Inferno).toBe('inferno');
    expect(Faction.Necropolis).toBe('necropolis');
    expect(Faction.Dungeon).toBe('dungeon');
    expect(Faction.Stronghold).toBe('stronghold');
    expect(Faction.Fortress).toBe('fortress');
    expect(Faction.Conflux).toBe('conflux');
  });
});
