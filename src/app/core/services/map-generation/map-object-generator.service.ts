import { Injectable } from '@angular/core';
import { MAP_OBJECT_DEFINITIONS } from '../../models/map-objects/map-object-config';
import { MapObjectType } from '../../models/map-objects/map-object-type.enum';
import { MapObject } from '../../models/map-objects/map-object.model';
import { MapObjectMine, MINE_PRODUCTION_CONFIG } from '../../models/map-objects/map-object-mine.model';
import { MapObjectCreature } from '../../models/map-objects/map-object-creature.model';
import { TerrainType } from '../../models/terrain/terrain.enum';
import { Tile } from '../../models/terrain/tile.model';
import { ResourceType } from '../../models/player/resource-type.enum';
import { TileInteraction } from '../../models/terrain/tile-interaction.model';
import { CreatureTypeStoreService } from '../creature/creature-type-store.service';
import { CreatureType } from '../../models/creature/creature-type.model';


/**
 * Shared interaction factory that uses a WeakMap to associate tiles with their map objects.
 * This avoids creating a new closure for each mine, improving memory efficiency.
 */
class InteractionFactory {
  private tileToObjectMap = new WeakMap<Tile, MapObject>();
  
  createInteraction(tile: Tile, mapObject: MapObject): TileInteraction {
    this.tileToObjectMap.set(tile, mapObject);
    return {
      getInteractionObject: () => this.tileToObjectMap.get(tile) || mapObject
    };
  }
}

@Injectable({ providedIn: 'root' })
export class MapObjectGeneratorService {
  private readonly MINE_RESOURCE_TYPES = [ResourceType.Gold, ResourceType.Wood, ResourceType.Stone];
  private readonly MAX_ARMY_SLOTS = 8;
  private readonly interactionFactory = new InteractionFactory();
  private occupiedTiles = new Set<string>();

  constructor(private creatureTypeStore: CreatureTypeStoreService) {}

  generate(grid: Tile[][]): MapObject[] {
    const objects: MapObject[] = [];
    // Reset occupied tiles for each generation
    this.occupiedTiles.clear();

    objects.push(this.placeObject(grid, MapObjectType.TOWN));
    
    // Place 2 mines of each resource type
    for (const resourceType of this.MINE_RESOURCE_TYPES) {
      objects.push(this.placeMine(grid, resourceType));
      objects.push(this.placeMine(grid, resourceType));
    }
    
    objects.push(...this.placeMultiple(grid, MapObjectType.TREE, 20));
    
    // Place creatures on the map
    const creatureTypes = this.creatureTypeStore.getCreatureTypes();
    if (creatureTypes.length > 0) {
      // Find specific creature types by exact name match
      const goblin = creatureTypes.find(c => c.name.toLowerCase() === 'goblin');
      const wolf = creatureTypes.find(c => c.name.toLowerCase() === 'wolf_rider');
      const dragon = creatureTypes.find(c => c.name.toLowerCase() === 'dragon');
      
      if (goblin) objects.push(this.placeCreature(grid, [{ type: goblin, quantity: 100 }, { type: goblin, quantity: 30 }, { type: goblin, quantity: 20 }, { type: goblin, quantity: 50 }]));
      if (wolf) objects.push(this.placeCreature(grid, [{ type: wolf, quantity: 3 }]));
      if (dragon) objects.push(this.placeCreature(grid, [{ type: dragon, quantity: 1 }]));
    }

    return objects;
  }

  private placeMultiple(
    grid: Tile[][],
    type: MapObjectType,
    count: number
  ): MapObject[] {
    return Array.from({ length: count }, () =>
      this.placeObject(grid, type)
    );
  }

  private placeMine(
    grid: Tile[][],
    resourceType: ResourceType
  ): MapObjectMine {
    const def = MAP_OBJECT_DEFINITIONS[MapObjectType.MINE];
    const width = grid[0].length;
    const height = grid.length;

    while (true) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!this.canPlace(grid, x, y, def.footprint)) continue;

      const productionAmount = MINE_PRODUCTION_CONFIG[resourceType];
      
      const mine: MapObjectMine = {
        type: MapObjectType.MINE,
        x,
        y,
        footprint: def.footprint,
        entries: def.entries,
        resourceType: resourceType,
        productionAmount: productionAmount,
      };
      
      // Mark tiles as occupied
      this.markOccupied(x, y, def.footprint);
      
      // Set up interaction on entry tiles that returns the mine
      this.setupMineInteractions(grid, mine);
      
      return mine;
    }
  }

  private placeObject(
    grid: Tile[][],
    type: MapObjectType
  ): MapObject {
    const def = MAP_OBJECT_DEFINITIONS[type];
    const width = grid[0].length;
    const height = grid.length;

    while (true) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!this.canPlace(grid, x, y, def.footprint)) continue;

      // Create regular map object
      const object: MapObject = {
        type,
        x,
        y,
        footprint: def.footprint,
        entries: def.entries,
      };

      // Mark tiles as occupied
      this.markOccupied(x, y, def.footprint);

      return object;
    }
  }

  private setupMineInteractions(grid: Tile[][], mine: MapObjectMine): void {
    // Add interaction to each entry tile using the shared interaction factory
    mine.entries.forEach(entry => {
      const tileX = mine.x + entry.dx;
      const tileY = mine.y + entry.dy;
      
      // Validate bounds before accessing tile
      if (tileY >= 0 && tileY < grid.length && tileX >= 0 && tileX < grid[0].length) {
        const tile = grid[tileY][tileX];
        if (tile) {
          tile.interaction = this.interactionFactory.createInteraction(tile, mine);
        }
      }
    });
  }

  private placeCreature(
    grid: Tile[][],
    creatures: { type: CreatureType; quantity: number }[]
  ): MapObjectCreature {
    const def = MAP_OBJECT_DEFINITIONS[MapObjectType.CREATURE];
    const width = grid[0].length;
    const height = grid.length;

    while (true) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!this.canPlace(grid, x, y, def.footprint)) continue;

      const creature: MapObjectCreature = {
        type: MapObjectType.CREATURE,
        x,
        y,
        footprint: def.footprint,
        entries: def.entries,
        creatures: creatures.slice(0, this.MAX_ARMY_SLOTS),
      };

      // Mark tiles as occupied
      this.markOccupied(x, y, def.footprint);

      // Set up interaction on entry tiles
      this.setupCreatureInteractions(grid, creature);

      return creature;
    }
  }

  private setupCreatureInteractions(grid: Tile[][], creature: MapObjectCreature): void {
    // Add interaction to each entry tile using the shared interaction factory
    creature.entries.forEach(entry => {
      const tileX = creature.x + entry.dx;
      const tileY = creature.y + entry.dy;

      // Validate bounds before accessing tile
      if (tileY >= 0 && tileY < grid.length && tileX >= 0 && tileX < grid[0].length) {
        const tile = grid[tileY][tileX];
        if (tile) {
          tile.interaction = this.interactionFactory.createInteraction(tile, creature);
        }
      }
    });
  }

  private canPlace(
    grid: Tile[][],
    x: number,
    y: number,
    footprint: readonly { dx: number; dy: number }[]
  ): boolean {
    return footprint.every(p => {
      const tile = grid[y + p.dy]?.[x + p.dx];
      if (!tile || tile.terrain !== TerrainType.GRASS) {
        return false;
      }
      // Check if tile is already occupied by another object
      const key = `${x + p.dx},${y + p.dy}`;
      return !this.occupiedTiles.has(key);
    });
  }

  private markOccupied(
    x: number,
    y: number,
    footprint: readonly { dx: number; dy: number }[]
  ): void {
    footprint.forEach(p => {
      const key = `${x + p.dx},${y + p.dy}`;
      this.occupiedTiles.add(key);
    });
  }
}
