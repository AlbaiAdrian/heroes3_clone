import { Injectable } from '@angular/core';
import { Player } from '../models/player/player.model';
import { MapObject } from '../models/map-objects/map-object.model';
import { MapObjectMine } from '../models/map-objects/map-object-mine.model';
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
   * @param allObjects All map objects (to find the mine objects)
   */
  generateFromMines(player: Player, allObjects: MapObject[]): void {
    player.ownedMines.forEach(mineId => {
      const mine = this.findMineById(mineId, allObjects);
      if (mine) {
        this.addResources(player.resources, mine);
      }
    });
  }

  private findMineById(id: string, objects: MapObject[]): MapObjectMine | undefined {
    const obj = objects.find(o => o.id === id);
    return obj instanceof MapObjectMine ? obj : undefined;
  }

  private addResources(resources: Resources, mine: MapObjectMine): void {
    const resourceKey = mine.resourceType as keyof Resources;
    const resource = resources[resourceKey];
    // Add resources from the mine's production
    resource.value += mine.produceResources();
  }
}
