import { Injectable } from '@angular/core';
import { CreatureType } from '../../models/creature/creature-type.model';

/**
 * In-memory creature store available app-wide.
 */
@Injectable({ providedIn: 'root' })
export class CreatureTypeStoreService {
  private creatures: CreatureType[] = [];

  setCreatures(creatures: CreatureType[]): void {
    this.creatures = creatures;
  }

  getCreatures(): CreatureType[] {
    return this.creatures;
  }
}
