import { describe, it, expect, beforeEach } from 'vitest';
import { BattleService } from './battle.service';
import { Creature } from '../../models/creature/creature.model';
import { CreatureType } from '../../models/creature/creature-type.model';
import { CreatureAttributeType } from '../../models/creature/creature-attribute-type.enum';
import { CreatureLevel } from '../../models/creature/creature-level.enum';
import { Faction } from '../../models/faction/faction.enum';
import { BattleUnit } from '../../models/battle/battle-unit.model';
import { BattleResult } from '../../models/battle/battle-result.enum';

function makeCreatureType(name: string, overrides: Partial<Record<CreatureAttributeType, number>> = {}): CreatureType {
  const defaults: Record<CreatureAttributeType, number> = {
    [CreatureAttributeType.AttackTypeMelee]: 5,
    [CreatureAttributeType.Defense]: 3,
    [CreatureAttributeType.MinDamage]: 2,
    [CreatureAttributeType.MaxDamage]: 4,
    [CreatureAttributeType.Speed]: 4,
    [CreatureAttributeType.Health]: 10,
    [CreatureAttributeType.Damage]: 3,
    [CreatureAttributeType.AttackTypeRanged]: 0,
  };
  const merged = { ...defaults, ...overrides };
  return {
    name,
    level: CreatureLevel.Level1,
    faction: Faction.Castle,
    attributes: Object.entries(merged).map(([key, value]) => ({
      attributeType: key as CreatureAttributeType,
      value,
    })),
    cost: [],
  };
}

function makeCreature(name: string, quantity: number, overrides?: Partial<Record<CreatureAttributeType, number>>): Creature {
  return { type: makeCreatureType(name, overrides), quantity };
}

describe('BattleService', () => {
  let service: BattleService;

  beforeEach(() => {
    service = new BattleService();
  });

  describe('initBattle', () => {
    it('should create battle state with attacker and defender units', () => {
      const attackerArmy: Creature[] = [makeCreature('Pikeman', 20)];
      const defenderArmy: Creature[] = [makeCreature('Skeleton', 15)];

      const state = service.initBattle(attackerArmy, defenderArmy);

      expect(state.attackerUnits).toHaveLength(1);
      expect(state.defenderUnits).toHaveLength(1);
      expect(state.attackerUnits[0].creatureType.name).toBe('Pikeman');
      expect(state.defenderUnits[0].creatureType.name).toBe('Skeleton');
      expect(state.attackerUnits[0].isAttacker).toBe(true);
      expect(state.defenderUnits[0].isAttacker).toBe(false);
      expect(state.round).toBe(1);
      expect(state.result).toBeNull();
      expect(state.log).toContain('Battle started!');
    });

    it('should handle multiple units per side', () => {
      const attackerArmy: Creature[] = [
        makeCreature('Pikeman', 20),
        makeCreature('Archer', 10),
      ];
      const defenderArmy: Creature[] = [makeCreature('Skeleton', 15)];

      const state = service.initBattle(attackerArmy, defenderArmy);

      expect(state.attackerUnits).toHaveLength(2);
      expect(state.turnOrder.length).toBe(3);
    });
  });

  describe('createBattleUnit', () => {
    it('should set HP from creature Health attribute', () => {
      const creature = makeCreature('Pikeman', 10, { [CreatureAttributeType.Health]: 25 });
      const unit = service.createBattleUnit(creature, true);

      expect(unit.maxHp).toBe(25);
      expect(unit.currentHp).toBe(25);
      expect(unit.quantity).toBe(10);
      expect(unit.isAttacker).toBe(true);
      expect(unit.isDead).toBe(false);
    });
  });

  describe('calculateTurnOrder', () => {
    it('should sort units by speed descending', () => {
      const slow = service.createBattleUnit(
        makeCreature('Slow', 5, { [CreatureAttributeType.Speed]: 2 }), true
      );
      const fast = service.createBattleUnit(
        makeCreature('Fast', 5, { [CreatureAttributeType.Speed]: 10 }), false
      );
      const mid = service.createBattleUnit(
        makeCreature('Mid', 5, { [CreatureAttributeType.Speed]: 5 }), true
      );

      const order = service.calculateTurnOrder([slow, fast, mid]);

      expect(order[0].creatureType.name).toBe('Fast');
      expect(order[1].creatureType.name).toBe('Mid');
      expect(order[2].creatureType.name).toBe('Slow');
    });
  });

  describe('applyDamage', () => {
    it('should reduce HP without killing when damage is less than currentHp', () => {
      const unit: BattleUnit = service.createBattleUnit(
        makeCreature('Test', 5, { [CreatureAttributeType.Health]: 10 }), true
      );

      const killed = service.applyDamage(unit, 3);

      expect(killed).toBe(0);
      expect(unit.currentHp).toBe(7);
      expect(unit.quantity).toBe(5);
      expect(unit.isDead).toBe(false);
    });

    it('should kill one creature when damage equals currentHp', () => {
      const unit: BattleUnit = service.createBattleUnit(
        makeCreature('Test', 5, { [CreatureAttributeType.Health]: 10 }), true
      );

      const killed = service.applyDamage(unit, 10);

      expect(killed).toBe(1);
      expect(unit.quantity).toBe(4);
      expect(unit.currentHp).toBe(10); // Next creature at full HP
    });

    it('should kill multiple creatures with high damage', () => {
      const unit: BattleUnit = service.createBattleUnit(
        makeCreature('Test', 5, { [CreatureAttributeType.Health]: 10 }), true
      );

      const killed = service.applyDamage(unit, 25);

      expect(killed).toBe(2);
      expect(unit.quantity).toBe(3);
      expect(unit.currentHp).toBe(5); // 25 - 10 - 10 = 5 remaining damage, 10 - 5 = 5 HP left
    });

    it('should mark unit as dead when all creatures killed', () => {
      const unit: BattleUnit = service.createBattleUnit(
        makeCreature('Test', 2, { [CreatureAttributeType.Health]: 10 }), true
      );

      const killed = service.applyDamage(unit, 100);

      expect(killed).toBe(2);
      expect(unit.quantity).toBe(0);
      expect(unit.isDead).toBe(true);
      expect(unit.currentHp).toBe(0);
    });

    it('should not deal damage to already dead units', () => {
      const unit: BattleUnit = service.createBattleUnit(
        makeCreature('Test', 0, { [CreatureAttributeType.Health]: 10 }), true
      );
      unit.isDead = true;

      const killed = service.applyDamage(unit, 50);

      expect(killed).toBe(0);
    });
  });

  describe('checkResult', () => {
    it('should return null when both sides have alive units', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender', 5)]
      );

      expect(service.checkResult(state)).toBeNull();
    });

    it('should return AttackerWins when all defenders are dead', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender', 5)]
      );
      state.defenderUnits.forEach(u => { u.isDead = true; u.quantity = 0; });

      expect(service.checkResult(state)).toBe(BattleResult.AttackerWins);
    });

    it('should return DefenderWins when all attackers are dead', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender', 5)]
      );
      state.attackerUnits.forEach(u => { u.isDead = true; u.quantity = 0; });

      expect(service.checkResult(state)).toBe(BattleResult.DefenderWins);
    });
  });

  describe('getCurrentUnit', () => {
    it('should return the first alive unit in turn order', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5, { [CreatureAttributeType.Speed]: 10 })],
        [makeCreature('Defender', 5, { [CreatureAttributeType.Speed]: 2 })]
      );

      const current = service.getCurrentUnit(state);
      expect(current).not.toBeNull();
      expect(current!.creatureType.name).toBe('Attacker');
    });

    it('should return null when battle has a result', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender', 5)]
      );
      state.result = BattleResult.AttackerWins;

      expect(service.getCurrentUnit(state)).toBeNull();
    });
  });

  describe('getValidTargets', () => {
    it('should return alive enemy units', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender1', 5), makeCreature('Defender2', 3)]
      );

      const targets = service.getValidTargets(state, state.attackerUnits[0]);
      expect(targets).toHaveLength(2);
    });

    it('should exclude dead enemy units', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 5)],
        [makeCreature('Defender1', 5), makeCreature('Defender2', 3)]
      );
      state.defenderUnits[0].isDead = true;

      const targets = service.getValidTargets(state, state.attackerUnits[0]);
      expect(targets).toHaveLength(1);
      expect(targets[0].creatureType.name).toBe('Defender2');
    });
  });

  describe('executeAttack', () => {
    it('should deal damage and log the attack', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 10, {
          [CreatureAttributeType.AttackTypeMelee]: 10,
          [CreatureAttributeType.MinDamage]: 5,
          [CreatureAttributeType.MaxDamage]: 5,
        })],
        [makeCreature('Defender', 5, {
          [CreatureAttributeType.Defense]: 10,
          [CreatureAttributeType.Health]: 50,
        })]
      );

      const initialLogLength = state.log.length;
      const action = service.executeAttack(state, state.attackerUnits[0], state.defenderUnits[0]);

      expect(action.damage).toBeGreaterThan(0);
      expect(state.log.length).toBeGreaterThan(initialLogLength);
    });

    it('should end battle when all defenders die', () => {
      const state = service.initBattle(
        [makeCreature('Attacker', 100, {
          [CreatureAttributeType.AttackTypeMelee]: 50,
          [CreatureAttributeType.MinDamage]: 100,
          [CreatureAttributeType.MaxDamage]: 100,
        })],
        [makeCreature('Defender', 1, {
          [CreatureAttributeType.Defense]: 0,
          [CreatureAttributeType.Health]: 1,
        })]
      );

      service.executeAttack(state, state.attackerUnits[0], state.defenderUnits[0]);

      expect(state.defenderUnits[0].isDead).toBe(true);
      expect(state.result).toBe(BattleResult.AttackerWins);
    });
  });

  describe('calculateDamage', () => {
    it('should return at least 1 damage', () => {
      const attacker = service.createBattleUnit(
        makeCreature('Weak', 1, {
          [CreatureAttributeType.AttackTypeMelee]: 0,
          [CreatureAttributeType.MinDamage]: 1,
          [CreatureAttributeType.MaxDamage]: 1,
        }), true
      );
      const defender = service.createBattleUnit(
        makeCreature('Tough', 1, {
          [CreatureAttributeType.Defense]: 100,
        }), false
      );

      const damage = service.calculateDamage(attacker, defender);
      expect(damage).toBeGreaterThanOrEqual(1);
    });

    it('should increase damage with more quantity', () => {
      const smallStack = service.createBattleUnit(
        makeCreature('Few', 1, {
          [CreatureAttributeType.AttackTypeMelee]: 5,
          [CreatureAttributeType.MinDamage]: 5,
          [CreatureAttributeType.MaxDamage]: 5,
          [CreatureAttributeType.Defense]: 5,
        }), true
      );
      const largeStack = service.createBattleUnit(
        makeCreature('Many', 10, {
          [CreatureAttributeType.AttackTypeMelee]: 5,
          [CreatureAttributeType.MinDamage]: 5,
          [CreatureAttributeType.MaxDamage]: 5,
          [CreatureAttributeType.Defense]: 5,
        }), true
      );
      const target = service.createBattleUnit(
        makeCreature('Target', 1, { [CreatureAttributeType.Defense]: 5 }), false
      );

      const dmgSmall = service.calculateDamage(smallStack, target);
      const dmgLarge = service.calculateDamage(largeStack, target);

      expect(dmgLarge).toBeGreaterThan(dmgSmall);
    });
  });
});
