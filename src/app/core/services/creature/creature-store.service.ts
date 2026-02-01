import { Injectable } from '@angular/core';
import { CreatureType } from '../../models/creature/creature.model';

/**
 * In-memory creature store available app-wide.
 */
@Injectable({ providedIn: 'root' })
export class CreatureStoreService {
  private creatures: CreatureType[] = [];

  setCreatures(creatures: CreatureType[]): void {
    this.creatures = creatures;
  }

  getCreatures(): CreatureType[] {
    return this.creatures;
  }
}
