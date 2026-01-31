import { Injectable } from '@angular/core';
import { Creature } from '../../models/creature/creature.model';

/**
 * In-memory creature store available app-wide.
 */
@Injectable({ providedIn: 'root' })
export class CreatureStoreService {
  private creatures: Creature[] = [];

  setCreatures(creatures: Creature[]): void {
    this.creatures = creatures;
  }

  getCreatures(): Creature[] {
    return this.creatures;
  }
}
