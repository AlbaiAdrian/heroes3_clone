# Building Data Files

This directory contains JSON files for each faction's buildings in the Heroes 3 clone.

## Structure

Each faction has its own JSON file named after the faction:
- `castle.json` - Castle faction buildings
- `rampart.json` - Rampart faction buildings
- `tower.json` - Tower faction buildings
- `inferno.json` - Inferno faction buildings
- `necropolis.json` - Necropolis faction buildings
- `dungeon.json` - Dungeon faction buildings
- `stronghold.json` - Stronghold faction buildings
- `fortress.json` - Fortress faction buildings
- `conflux.json` - Conflux faction buildings

## Building Object Format

Each building object follows the `Building` interface defined in `src/app/core/models/building/building.model.ts`:

```typescript
interface Building {
  name: string;                    // Building name
  cost: Resource[];                // Array of resources required to build
  prerequisiteBuildings: string[]; // Names of buildings that must be built first
  creatureLevel?: number;          // Optional: Creature level (1-7) for dwelling buildings
  growth?: number;                 // Optional: Weekly creature growth for dwelling buildings
}
```

### Example Building

```json
{
  "name": "Guardhouse",
  "cost": [
    { "type": "gold", "value": 300 },
    { "type": "wood", "value": 5 }
  ],
  "prerequisiteBuildings": [],
  "creatureLevel": 1,
  "growth": 14
}
```

## Common Buildings

All factions share these common buildings:
- **Village Hall** - Starting building, no cost
- **Town Hall** - Requires Village Hall and Tavern
- **City Hall** - Requires Town Hall, Blacksmith, and Marketplace
- **Capitol** - Requires City Hall and Castle
- **Fort** - Basic fortification
- **Citadel** - Requires Fort
- **Castle** - Requires Citadel
- **Tavern** - Hero recruitment
- **Blacksmith** - War machine production
- **Marketplace** - Resource trading
- **Mage Guild Level 1-5** - Spell learning

## Dwelling Buildings

Each faction has 7 levels of creature dwellings, with basic and upgraded versions:
- Level 1: Growth 12-15 per week
- Level 2: Growth 8-9 per week
- Level 3: Growth 6-8 per week
- Level 4: Growth 4-5 per week
- Level 5: Growth 3 per week
- Level 6: Growth 2 per week
- Level 7: Growth 1 per week

**Note:** Some factions have unique prerequisite requirements for their level 7 dwellings:
- Tower's Cloud Temple requires both Castle and Mage Guild Level 2 (reflecting the magical nature of Titans)

## Usage

To load building data in your Angular components or services:

```typescript
import { BuildingService } from './core/services/building.service';
import { Faction } from './core/models/faction/faction.enum';

constructor(private buildingService: BuildingService) {}

loadBuildings() {
  this.buildingService.getBuildingsByFaction(Faction.Castle).subscribe(
    buildings => {
      console.log('Castle buildings:', buildings);
    }
  );
}
```

## Validation

All JSON files have been validated to ensure:
1. Valid JSON syntax
2. Correct structure matching the Building interface
3. Proper resource types (gold, wood, stone)
4. Valid creature levels (1-7) for dwelling buildings
5. Appropriate growth rates for dwelling buildings
