import { Injectable } from '@angular/core';
import { CreatureType } from '../../models/creature/creature-type.model';

/**
 * In-memory creature store available app-wide.
 */
@Injectable({ providedIn: 'root' })
export class CreatureTypeStoreService {
  private creatureTypes: CreatureType[] = [];

  setCreatureTypes(creatureTypes: CreatureType[]): void {
    this.creatureTypes = creatureTypes;
  }

  getCreatureTypes(): CreatureType[] {
    return this.creatureTypes;
  }
}
