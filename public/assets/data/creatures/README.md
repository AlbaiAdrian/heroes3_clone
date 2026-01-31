# Creature Data Files

This directory contains JSON files for each faction's creatures in the Heroes 3 clone.

## Structure

Each faction has its own JSON file named after the faction:
- `castle.json` - Castle faction creatures
- `rampart.json` - Rampart faction creatures
- `tower.json` - Tower faction creatures
- `inferno.json` - Inferno faction creatures
- `necropolis.json` - Necropolis faction creatures
- `dungeon.json` - Dungeon faction creatures
- `stronghold.json` - Stronghold faction creatures
- `fortress.json` - Fortress faction creatures
- `conflux.json` - Conflux faction creatures

## Creature Object Format

Each creature object follows the `CreatureData` interface:

```typescript
interface CreatureData {
  id: string;                    // Unique creature identifier
  name: string;                  // Display name
  faction: string;               // Faction this creature belongs to
  level: number;                 // Creature level (1-7), corresponds to dwelling level
  attributes: CreatureAttribute[]; // Stats (ATTACK, DEFENSE, MIN_DAMAGE, MAX_DAMAGE, HEALTH, SPEED)
  cost: Resource[];              // Resources required to recruit
}
```

### Example Creature

```json
{
  "id": "pikeman",
  "name": "Pikeman",
  "faction": "castle",
  "level": 1,
  "attributes": [
    { "attributeType": "ATTACK", "value": 4 },
    { "attributeType": "DEFENSE", "value": 5 },
    { "attributeType": "MIN_DAMAGE", "value": 1 },
    { "attributeType": "MAX_DAMAGE", "value": 3 },
    { "attributeType": "HEALTH", "value": 10 },
    { "attributeType": "SPEED", "value": 4 }
  ],
  "cost": [{ "type": "gold", "value": 60 }]
}
```

## Creature Levels and Building Correspondence

Each faction has 7 levels of creatures, with basic and upgraded versions:
- **Level 1**: Basic dwelling (growth 12-15/week)
- **Level 2**: Basic dwelling (growth 8-9/week)
- **Level 3**: Basic dwelling (growth 6-8/week)
- **Level 4**: Basic dwelling (growth 4-5/week)
- **Level 5**: Basic dwelling (growth 3/week)
- **Level 6**: Basic dwelling (growth 2/week)
- **Level 7**: Basic dwelling (growth 1/week)

Upgraded dwellings produce the upgraded version of the creature at the same level.

**Important:** The creature `level` field directly corresponds to the `creatureLevel` field in dwelling buildings. This ensures that:
1. Level 1 creatures are produced by Level 1 dwellings
2. Level 2 creatures are produced by Level 2 dwellings
3. And so on...

## Usage

To load creature data in your Angular components or services:

```typescript
import { CreatureDataService } from './core/services/creature/creature-data.service';
import { Faction } from './core/models/faction/faction.enum';

constructor(private creatureService: CreatureDataService) {}

loadCreatures() {
  this.creatureService.getCreaturesByFaction(Faction.Castle).subscribe(
    creatures => {
      console.log('Castle creatures:', creatures);
    }
  );
}
```

## Validation

All JSON files have been validated to ensure:
1. Valid JSON syntax
2. Correct structure matching the CreatureData interface
3. Proper resource types (gold, wood, ore, mercury, sulfur, crystal, gems)
4. Valid creature levels (1-7) matching dwelling levels
5. Complete attribute sets for all creatures
6. Each faction has both basic and upgraded versions for all 7 levels
