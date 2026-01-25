import { Injectable } from '@angular/core';
import { Player } from '../models/player/player.model';
import { Resources } from '../models/player/resources.model';

/**
 * Service for generating resources from owned mines.
 * Uses SOLID principles with single responsibility.
 */
@Injectable({ providedIn: 'root' })
export class ResourceGenerationService {

  /**
   * Generate resources from all owned mines.
   * @param player The player who owns the mines
   */
  generateFromMines(player: Player): void {
    player.ownedMines.forEach(mine => {
      this.addResources(player.resources, mine.resourceType, mine.productionAmount);
    });
  }

  private addResources(resources: Resources, resourceType: string, amount: number): void {
    const resourceKey = resourceType as keyof Resources;
    const resource = resources[resourceKey];
    resource.value += amount;
  }
}
