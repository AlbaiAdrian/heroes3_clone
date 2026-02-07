import { Injectable } from '@angular/core';
import { Creature } from '../../models/creature/creature.model';
import { CreatureAttributeType } from '../../models/creature/creature-attribute-type.enum';
import { BattleUnit } from '../../models/battle/battle-unit.model';
import { BattleAction } from '../../models/battle/battle-action.model';
import { BattleResult } from '../../models/battle/battle-result.enum';
import { BattleState } from '../../models/battle/battle-state.model';

/**
 * Core battle logic service.
 * Handles damage calculation, turn order, attack execution, and win conditions.
 */
@Injectable({ providedIn: 'root' })
export class BattleService {

  /**
   * Initialize a new battle state from attacker and defender creature armies.
   */
  initBattle(attackerArmy: Creature[], defenderArmy: Creature[]): BattleState {
    const attackerUnits = attackerArmy.map(c => this.createBattleUnit(c, true));
    const defenderUnits = defenderArmy.map(c => this.createBattleUnit(c, false));
    const turnOrder = this.calculateTurnOrder([...attackerUnits, ...defenderUnits]);

    return {
      attackerUnits,
      defenderUnits,
      turnOrder,
      currentTurnIndex: 0,
      round: 1,
      result: null,
      log: ['Battle started!'],
    };
  }

  /**
   * Create a BattleUnit from a Creature.
   */
  createBattleUnit(creature: Creature, isAttacker: boolean): BattleUnit {
    const maxHp = this.getAttribute(creature, CreatureAttributeType.Health);
    return {
      creatureType: creature.type,
      quantity: creature.quantity,
      currentHp: maxHp,
      maxHp,
      isAttacker,
      isDead: creature.quantity <= 0,
    };
  }

  /**
   * Get the current active unit in the turn order.
   */
  getCurrentUnit(state: BattleState): BattleUnit | null {
    if (state.result) return null;
    const aliveUnits = state.turnOrder.filter(u => !u.isDead);
    if (aliveUnits.length === 0) return null;
    return aliveUnits[state.currentTurnIndex % aliveUnits.length] ?? null;
  }

  /**
   * Get valid targets for the current unit (enemies that are alive).
   */
  getValidTargets(state: BattleState, unit: BattleUnit): BattleUnit[] {
    const enemies = unit.isAttacker ? state.defenderUnits : state.attackerUnits;
    return enemies.filter(e => !e.isDead);
  }

  /**
   * Execute an attack from one unit to another. Returns the action taken.
   */
  executeAttack(state: BattleState, attacker: BattleUnit, target: BattleUnit): BattleAction {
    const damage = this.calculateDamage(attacker, target);
    const killCount = this.applyDamage(target, damage);

    const action: BattleAction = { attacker, target, damage, killCount };

    state.log.push(
      `${attacker.quantity} ${attacker.creatureType.name} attacks ${target.creatureType.name} for ${damage} damage` +
      (killCount > 0 ? ` (${killCount} killed)` : '')
    );

    this.advanceTurn(state);
    state.result = this.checkResult(state);

    return action;
  }

  /**
   * Calculate damage dealt by attacker to target using Heroes III-style formula.
   * Damage = quantity * random(minDmg, maxDmg) * attackModifier
   * attackModifier = 1 + 0.05 * (attack - defense), clamped to [0.01, 4.0]
   */
  calculateDamage(attacker: BattleUnit, target: BattleUnit): number {
    const attack = this.getUnitAttribute(attacker, CreatureAttributeType.AttackTypeMelee);
    const defense = this.getUnitAttribute(target, CreatureAttributeType.Defense);
    const minDmg = this.getUnitAttribute(attacker, CreatureAttributeType.MinDamage);
    const maxDmg = this.getUnitAttribute(attacker, CreatureAttributeType.MaxDamage);

    const baseDamage = minDmg + Math.floor(Math.random() * (maxDmg - minDmg + 1));
    const attackModifier = Math.max(0.01, Math.min(4.0, 1 + 0.05 * (attack - defense)));
    return Math.max(1, Math.floor(attacker.quantity * baseDamage * attackModifier));
  }

  /**
   * Apply damage to a target unit. Returns number of creatures killed.
   */
  applyDamage(target: BattleUnit, damage: number): number {
    if (target.isDead) return 0;

    let remaining = damage;
    let killed = 0;

    // First absorb damage with the top creature's remaining HP
    if (remaining >= target.currentHp) {
      remaining -= target.currentHp;
      killed++;
      target.currentHp = target.maxHp;
    } else {
      target.currentHp -= remaining;
      remaining = 0;
    }

    // Kill full creatures with remaining damage
    if (remaining > 0 && target.maxHp > 0) {
      const fullKills = Math.floor(remaining / target.maxHp);
      killed += fullKills;
      remaining -= fullKills * target.maxHp;

      if (remaining > 0) {
        target.currentHp = target.maxHp - remaining;
      }
    }

    // Cap kills at quantity
    killed = Math.min(killed, target.quantity);
    target.quantity -= killed;

    if (target.quantity <= 0) {
      target.quantity = 0;
      target.isDead = true;
      target.currentHp = 0;
    }

    return killed;
  }

  /**
   * Sort units by speed (descending). Faster units act first.
   */
  calculateTurnOrder(units: BattleUnit[]): BattleUnit[] {
    return [...units].sort((a, b) => {
      const speedA = this.getUnitAttribute(a, CreatureAttributeType.Speed);
      const speedB = this.getUnitAttribute(b, CreatureAttributeType.Speed);
      return speedB - speedA;
    });
  }

  /**
   * Advance to the next turn. If all units have acted, start a new round.
   */
  advanceTurn(state: BattleState): void {
    const aliveUnits = state.turnOrder.filter(u => !u.isDead);
    if (aliveUnits.length === 0) return;

    state.currentTurnIndex++;
    if (state.currentTurnIndex >= aliveUnits.length) {
      state.currentTurnIndex = 0;
      state.round++;
      state.turnOrder = this.calculateTurnOrder(
        [...state.attackerUnits, ...state.defenderUnits].filter(u => !u.isDead)
      );
    }
  }

  /**
   * Check if the battle is over.
   */
  checkResult(state: BattleState): BattleResult | null {
    const attackerAlive = state.attackerUnits.some(u => !u.isDead);
    const defenderAlive = state.defenderUnits.some(u => !u.isDead);

    if (!attackerAlive && !defenderAlive) return BattleResult.DefenderWins;
    if (!defenderAlive) return BattleResult.AttackerWins;
    if (!attackerAlive) return BattleResult.DefenderWins;
    return null;
  }

  /**
   * Get a specific attribute value from a BattleUnit's creature type.
   */
  getUnitAttribute(unit: BattleUnit, attrType: CreatureAttributeType): number {
    return unit.creatureType.attributes.find(a => a.attributeType === attrType)?.value ?? 0;
  }

  /**
   * Get a specific attribute value from a Creature.
   */
  private getAttribute(creature: Creature, attrType: CreatureAttributeType): number {
    return creature.type.attributes.find(a => a.attributeType === attrType)?.value ?? 1;
  }
}
