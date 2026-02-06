import { Injectable } from '@angular/core';
import { Creature } from '../../models/creature/creature.model';
import { CreatureAttributeType } from '../../models/creature/creature-attribute-type.enum';
import { BattleResult } from '../../models/battle/battle-state.model';
import { BattleStateService } from './battle-state.service';

/**
 * Resolves combat between two armies using Heroes 3-style mechanics.
 *
 * Each round:
 *  1. Merge all stacks into a single initiative queue sorted by speed (descending).
 *  2. Each stack attacks an enemy stack: damage = quantity × random(minDmg..maxDmg),
 *     modified by attack vs. defense difference.
 *  3. Casualties are applied immediately; dead stacks are removed.
 *  4. Repeat until one side is eliminated.
 */
@Injectable({ providedIn: 'root' })
export class BattleService {
  constructor(private battleState: BattleStateService) {}

  /** Run the entire battle to completion and return the result. */
  resolveBattle(): BattleResult {
    const state = this.battleState.snapshot;
    const attackers = state.attackerArmy;
    const defenders = state.defenderArmy;

    this.battleState.addLogEntry({ message: '⚔️ Battle begins!' });

    let round = 0;
    const maxRounds = 100;

    while (this.hasLivingStacks(attackers) && this.hasLivingStacks(defenders) && round < maxRounds) {
      round++;
      this.battleState.addLogEntry({ message: `--- Round ${round} ---` });
      this.executeRound(attackers, defenders);
    }

    const result = this.hasLivingStacks(attackers) ? BattleResult.AttackerWins : BattleResult.DefenderWins;
    this.battleState.updateState({ result, attackerArmy: attackers, defenderArmy: defenders });

    const resultMessage = result === BattleResult.AttackerWins ? '🏆 Attacker wins!' : '💀 Defender wins!';
    this.battleState.addLogEntry({ message: resultMessage });

    return result;
  }

  private executeRound(attackers: Creature[], defenders: Creature[]): void {
    // Build initiative queue: all living stacks sorted by speed descending
    const queue = this.buildInitiativeQueue(attackers, defenders);

    for (const entry of queue) {
      // Skip dead stacks
      if (entry.creature.quantity <= 0) continue;

      const enemyArmy = entry.side === 'attacker' ? defenders : attackers;
      if (!this.hasLivingStacks(enemyArmy)) break;

      const target = this.selectTarget(enemyArmy);
      if (!target) break;

      this.attackStack(entry.creature, target);
    }

    // Clean up dead stacks
    this.removeDead(attackers);
    this.removeDead(defenders);
  }

  private buildInitiativeQueue(
    attackers: Creature[],
    defenders: Creature[]
  ): { creature: Creature; side: 'attacker' | 'defender' }[] {
    const entries = [
      ...attackers.filter(c => c.quantity > 0).map(c => ({ creature: c, side: 'attacker' as const })),
      ...defenders.filter(c => c.quantity > 0).map(c => ({ creature: c, side: 'defender' as const })),
    ];

    entries.sort((a, b) => this.getSpeed(b.creature) - this.getSpeed(a.creature));
    return entries;
  }

  private attackStack(attacker: Creature, defender: Creature): void {
    const attack = this.getAttack(attacker);
    const defense = this.getDefense(defender);
    const minDmg = this.getAttribute(attacker, CreatureAttributeType.MinDamage);
    const maxDmg = this.getAttribute(attacker, CreatureAttributeType.MaxDamage);
    const defenderHealth = this.getAttribute(defender, CreatureAttributeType.Health);

    const baseDamage = attacker.quantity * this.randomInt(minDmg, maxDmg);

    // Damage modifier: +5% per point of attack above defense, -2.5% per point below (clamped)
    const diff = attack - defense;
    const modifier = diff > 0 ? 1 + diff * 0.05 : 1 / (1 + Math.abs(diff) * 0.025);
    const totalDamage = Math.max(1, Math.round(baseDamage * modifier));

    const totalHp = defender.quantity * defenderHealth;
    const remainingHp = totalHp - totalDamage;

    const survived = Math.max(0, Math.ceil(remainingHp / defenderHealth));
    const killed = defender.quantity - survived;
    defender.quantity = survived;

    this.battleState.addLogEntry({
      message: `${attacker.quantity} ${attacker.type.name} deal ${totalDamage} dmg to ${defender.type.name}, killing ${killed}`,
    });
  }

  private selectTarget(army: Creature[]): Creature | null {
    const alive = army.filter(c => c.quantity > 0);
    return alive.length > 0 ? alive[0] : null;
  }

  private hasLivingStacks(army: Creature[]): boolean {
    return army.some(c => c.quantity > 0);
  }

  private removeDead(army: Creature[]): void {
    for (let i = army.length - 1; i >= 0; i--) {
      if (army[i].quantity <= 0) {
        army.splice(i, 1);
      }
    }
  }

  private getAttack(creature: Creature): number {
    return (
      this.tryGetAttribute(creature, CreatureAttributeType.AttackTypeMelee) ??
      this.tryGetAttribute(creature, CreatureAttributeType.AttackTypeRanged) ??
      0
    );
  }

  private getDefense(creature: Creature): number {
    return this.getAttribute(creature, CreatureAttributeType.Defense);
  }

  private getSpeed(creature: Creature): number {
    return this.getAttribute(creature, CreatureAttributeType.Speed);
  }

  getAttribute(creature: Creature, attrType: CreatureAttributeType): number {
    return this.tryGetAttribute(creature, attrType) ?? 0;
  }

  private tryGetAttribute(creature: Creature, attrType: CreatureAttributeType): number | undefined {
    return creature.type.attributes.find(a => a.attributeType === attrType)?.value;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
