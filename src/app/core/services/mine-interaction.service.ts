import { Injectable } from '@angular/core';
import { MapObject } from '../models/map-objects/map-object.model';
import { MapObjectType } from '../models/map-objects/map-object-type.enum';
import { Player } from '../models/player/player.model';
import { Hero } from '../models/hero/hero.model';
import { ResourceType } from '../models/player/resource-type.enum';
import { MineType } from '../models/map-objects/mine-type.enum';
import { OwnedMine } from '../models/player/owned-mine.model';

@Injectable({ providedIn: 'root' })
export class MineInteractionService {
  
  private readonly MINE_PRODUCTION: Record<MineType, { resourceType: ResourceType; amount: number }> = {
    [MineType.GOLD]: { resourceType: ResourceType.Gold, amount: 1000 },
    [MineType.WOOD]: { resourceType: ResourceType.Wood, amount: 2 },
    [MineType.STONE]: { resourceType: ResourceType.Stone, amount: 2 },
  };

  checkAndCaptureMine(hero: Hero, objects: MapObject[], player: Player): void {
    // Check if hero is on a mine entry tile
    const mine = this.getMineAtPosition(hero.tile.x, hero.tile.y, objects);
    
    if (!mine) return;
    
    // Check if mine is already owned
    if (player.ownedMines.some((m: OwnedMine) => m.id === mine.id)) {
      console.log('Mine already owned');
      return;
    }
    
    // Capture the mine
    console.log('Capturing mine of type:', mine.mineType);
    this.captureMine(mine, player);
  }

  private getMineAtPosition(x: number, y: number, objects: MapObject[]): MapObject | undefined {
    return objects.find(obj => {
      if (obj.type !== MapObjectType.MINE) return false;
      
      // Check if hero is on any entry tile of the mine
      return obj.entries.some(entry => {
        const entryX = obj.x + entry.dx;
        const entryY = obj.y + entry.dy;
        return entryX === x && entryY === y;
      });
    });
  }

  private captureMine(mine: MapObject, player: Player): void {
    if (!mine.mineType) return;
    
    const production = this.MINE_PRODUCTION[mine.mineType];
    
    const ownedMine: OwnedMine = {
      id: mine.id,
      resourceType: production.resourceType,
      productionAmount: production.amount,
    };
    
    player.ownedMines.push(ownedMine);
    console.log(`Mine captured! Type: ${mine.mineType}, Resource: ${production.resourceType}, Amount: ${production.amount}`);
    console.log(`Total owned mines: ${player.ownedMines.length}`);
  }

  generateResourcesFromMines(player: Player): void {
    console.log(`Generating resources from ${player.ownedMines.length} owned mines`);
    player.ownedMines.forEach((mine: OwnedMine) => {
      const resource = player.resources[mine.resourceType];
      const oldValue = resource.value;
      resource.value += mine.productionAmount;
      console.log(`Mine produced ${mine.productionAmount} ${mine.resourceType}: ${oldValue} -> ${resource.value}`);
    });
  }
}
