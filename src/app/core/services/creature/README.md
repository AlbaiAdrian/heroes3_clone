# Creature Management System

This system provides a flexible, JSON-based approach to managing creature data in the game. It follows SOLID principles and uses design patterns for clean, maintainable code.

## Architecture

### Design Patterns Used

1. **Repository Pattern** - `ICreatureRepository` interface abstracts data access
2. **Factory Pattern** - `CreatureFactory` handles creation of domain objects
3. **Facade Pattern** - `CreatureService` provides a simple interface to the subsystem
4. **Dependency Injection** - All services use Angular DI for loose coupling

### SOLID Principles

1. **Single Responsibility** - Each class has one reason to change:
   - `JsonCreatureRepository` - Load and query creature data
   - `CreatureFactory` - Convert data objects to domain models
   - `CreatureService` - Coordinate creature operations

2. **Open/Closed** - System is open for extension:
   - Can add new repository implementations (API, database)
   - Can extend creature attributes without modifying core classes

3. **Liskov Substitution** - `ICreatureRepository` can be replaced with any implementation

4. **Interface Segregation** - Interfaces are focused and minimal

5. **Dependency Inversion** - High-level modules depend on abstractions (`ICreatureRepository`)

## File Structure

```
src/app/core/
├── models/creature/
│   ├── creature.model.ts              # Domain model
│   ├── creature-data.interface.ts     # JSON data structure
│   ├── creature-attribute.model.ts    # Attribute model
│   ├── creature-level.enum.ts         # Level enumeration
│   └── creature-attribute-type.enum.ts # Attribute types
└── services/creature/
    ├── creature-repository.interface.ts       # Repository abstraction
    ├── json-creature-repository.service.ts    # JSON implementation
    ├── creature-factory.service.ts            # Factory for domain objects
    └── creature.service.ts                    # Main facade service

public/assets/data/
└── creatures.json                     # Creature data (editable!)
```

## Usage

### 1. Initialize the Service

In your application initialization (e.g., `app.config.ts` or `main.ts`):

```typescript
import { CreatureService } from './core/services/creature/creature.service';

// In your initialization code
const creatureService = inject(CreatureService);
await creatureService.initialize();
```

### 2. Get Creatures

```typescript
// Get a specific creature
const pikeman = creatureService.getCreature('pikeman');

// Get all creatures for a faction
const castleCreatures = creatureService.getCreaturesByFaction(Faction.Castle);

// Get creatures by level
const level1Creatures = creatureService.getCreaturesByLevel(CreatureLevel.Level1);

// Get upgrade options
const upgrades = creatureService.getUpgradeOptions('pikeman'); // Returns [halberdier]

// Check if upgrade is possible
const canUpgrade = creatureService.canUpgradeTo('pikeman', 'halberdier'); // true
```

### 3. Modifying Creature Data

Simply edit `public/assets/data/creatures.json`:

```json
{
  "id": "new_creature",
  "name": "New Creature",
  "faction": "castle",
  "level": 4,
  "attributes": [
    { "attributeType": "ATTACK", "value": 10 },
    { "attributeType": "DEFENSE", "value": 8 }
  ],
  "cost": [
    { "type": "gold", "value": 500 }
  ],
  "upgradesTo": ["upgraded_creature"]
}
```

No code changes required! The system will automatically:
- Load the new creature
- Validate upgrade relationships
- Make it available through the service

### 4. Adding New Attribute Types

1. Add to `creature-attribute-type.enum.ts`:
```typescript
export enum CreatureAttributeType {
  // Existing...
  MagicResistance = 'MAGIC_RESISTANCE',  // New attribute
}
```

2. Add to creature JSON:
```json
{
  "attributes": [
    { "attributeType": "MAGIC_RESISTANCE", "value": 50 }
  ]
}
```

## Validation

The system automatically validates:
- All creature IDs are unique
- Upgrade references point to existing creatures
- Bidirectional relationships are consistent (upgradesTo ↔ upgradesFrom)

Validation errors are thrown on initialization, ensuring data integrity.

## Benefits

1. **No Code Changes for Data** - Edit JSON files to modify creatures
2. **Type Safety** - TypeScript interfaces ensure data structure
3. **Validation** - Automatic integrity checks
4. **Extensibility** - Easy to add new repositories (API, database)
5. **Testability** - Mock `ICreatureRepository` for testing
6. **Clean Code** - SOLID principles, design patterns, clear separation of concerns

## Example: Adding a New Faction

1. Add faction to `faction.enum.ts`
2. Add creatures to `creatures.json` with the new faction
3. No other code changes needed!

## Example: Switching to API Backend

Create `ApiCreatureRepository` implementing `ICreatureRepository`:

```typescript
@Injectable()
export class ApiCreatureRepository implements ICreatureRepository {
  async loadAll(): Promise<CreatureData[]> {
    const response = await fetch('/api/creatures');
    return response.json();
  }
  // ... implement other methods
}
```

Update dependency injection in `CreatureService` - that's it!
