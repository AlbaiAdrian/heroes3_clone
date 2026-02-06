import { TestBed } from '@angular/core/testing';
import { BattleService } from './battle.service';
import { BattleStateService } from './battle-state.service';
import { BattleResult } from '../../models/battle/battle-state.model';
import { Creature } from '../../models/creature/creature.model';
import { CreatureType } from '../../models/creature/creature-type.model';
import { CreatureAttributeType } from '../../models/creature/creature-attribute-type.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';
import { Faction } from '../../models/faction/faction.enum';

function makeCreatureType(name: string, attack: number, defense: number, minDmg: number, maxDmg: number, health: number, speed: number): CreatureType {
  return {
    name,
    level: CreatureLevel.Level1,
    faction: Faction.Stronghold,
    attributes: [
      { attributeType: CreatureAttributeType.AttackTypeMelee, value: attack },
      { attributeType: CreatureAttributeType.Defense, value: defense },
      { attributeType: CreatureAttributeType.MinDamage, value: minDmg },
      { attributeType: CreatureAttributeType.MaxDamage, value: maxDmg },
      { attributeType: CreatureAttributeType.Health, value: health },
      { attributeType: CreatureAttributeType.Speed, value: speed },
    ],
    cost: [],
  };
}

function makeCreature(name: string, quantity: number, attack: number, defense: number, minDmg: number, maxDmg: number, health: number, speed: number): Creature {
  return {
    type: makeCreatureType(name, attack, defense, minDmg, maxDmg, health, speed),
    quantity,
  };
}

describe('BattleService', () => {
  let service: BattleService;
  let stateService: BattleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BattleService, BattleStateService],
    });
    service = TestBed.inject(BattleService);
    stateService = TestBed.inject(BattleStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('attacker with overwhelming force wins', () => {
    const attackers: Creature[] = [makeCreature('Strong', 100, 20, 20, 50, 50, 100, 10)];
    const defenders: Creature[] = [makeCreature('Weak', 1, 1, 1, 1, 1, 5, 1)];

    stateService.initBattle(attackers, defenders);
    const result = service.resolveBattle();

    expect(result).toBe(BattleResult.AttackerWins);
  });

  it('defender with overwhelming force wins', () => {
    const attackers: Creature[] = [makeCreature('Weak', 1, 1, 1, 1, 1, 5, 1)];
    const defenders: Creature[] = [makeCreature('Strong', 100, 20, 20, 50, 50, 100, 10)];

    stateService.initBattle(attackers, defenders);
    const result = service.resolveBattle();

    expect(result).toBe(BattleResult.DefenderWins);
  });

  it('battle log contains entries', () => {
    const attackers: Creature[] = [makeCreature('A', 5, 5, 5, 2, 3, 10, 5)];
    const defenders: Creature[] = [makeCreature('B', 3, 3, 3, 1, 2, 8, 3)];

    stateService.initBattle(attackers, defenders);
    service.resolveBattle();

    const state = stateService.snapshot;
    expect(state.log.length).toBeGreaterThan(0);
    expect(state.log[0].message).toContain('Battle begins');
  });

  it('removes dead stacks after battle', () => {
    const attackers: Creature[] = [makeCreature('A', 50, 10, 10, 20, 20, 50, 5)];
    const defenders: Creature[] = [makeCreature('B', 1, 1, 1, 1, 1, 5, 1)];

    stateService.initBattle(attackers, defenders);
    const result = service.resolveBattle();

    expect(result).toBe(BattleResult.AttackerWins);
    const state = stateService.snapshot;
    expect(state.defenderArmy.length).toBe(0);
    expect(state.attackerArmy.length).toBeGreaterThan(0);
  });

  it('handles creatures with missing attributes without errors', () => {
    const bare: Creature = {
      type: {
        name: 'Bare',
        level: CreatureLevel.Level1,
        faction: Faction.Stronghold,
        attributes: [],
        cost: [],
      },
      quantity: 1,
    };

    const strong: Creature[] = [makeCreature('Strong', 10, 10, 10, 50, 50, 100, 10)];

    stateService.initBattle([bare], strong);
    // Should not throw despite missing attributes
    const result = service.resolveBattle();
    expect(result).toBe(BattleResult.DefenderWins);
  });

  it('faster stacks attack first', () => {
    // Fast attacker should kill slow defender before it acts
    const attackers: Creature[] = [makeCreature('Fast', 1, 20, 0, 999, 999, 100, 99)];
    const defenders: Creature[] = [makeCreature('Slow', 1, 0, 0, 999, 999, 100, 1)];

    stateService.initBattle(attackers, defenders);
    const result = service.resolveBattle();

    expect(result).toBe(BattleResult.AttackerWins);
  });
});

describe('BattleStateService', () => {
  let stateService: BattleStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BattleStateService],
    });
    stateService = TestBed.inject(BattleStateService);
  });

  it('should be created', () => {
    expect(stateService).toBeTruthy();
  });

  it('initBattle copies armies', () => {
    const original: Creature[] = [makeCreature('A', 5, 5, 5, 2, 3, 10, 5)];
    stateService.initBattle(original, []);

    const state = stateService.snapshot;
    expect(state.attackerArmy.length).toBe(1);
    // Should be a copy, not the same reference
    expect(state.attackerArmy[0]).not.toBe(original[0]);
    expect(state.attackerArmy[0].type).toBe(original[0].type);
  });

  it('clear resets state', () => {
    stateService.initBattle(
      [makeCreature('A', 5, 5, 5, 2, 3, 10, 5)],
      [makeCreature('B', 3, 3, 3, 1, 2, 8, 3)],
    );

    stateService.clear();
    const state = stateService.snapshot;
    expect(state.attackerArmy.length).toBe(0);
    expect(state.defenderArmy.length).toBe(0);
    expect(state.log.length).toBe(0);
    expect(state.result).toBe(BattleResult.Pending);
  });

  it('addLogEntry appends to log', () => {
    stateService.addLogEntry({ message: 'Test entry' });
    expect(stateService.snapshot.log.length).toBe(1);
    expect(stateService.snapshot.log[0].message).toBe('Test entry');
  });
});
