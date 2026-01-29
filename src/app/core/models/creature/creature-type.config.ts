// core/models/creature/creature-type.config.ts
import { CreatureType } from './creature-type.model';
import { Faction } from '../faction/faction.enum';

/**
 * Configuration of all creature types in the game.
 * This defines the upgrade paths for creatures.
 */
export const CREATURE_TYPES: Record<string, CreatureType> = {
  // Castle faction - Level 1
  pikeman: {
    id: 'pikeman',
    name: 'Pikeman',
    faction: Faction.Castle,
    level: 1,
    upgradesTo: ['halberdier'],
  },
  halberdier: {
    id: 'halberdier',
    name: 'Halberdier',
    faction: Faction.Castle,
    level: 1,
    upgradesTo: [],
    upgradesFrom: 'pikeman',
  },

  // Castle faction - Level 2
  archer: {
    id: 'archer',
    name: 'Archer',
    faction: Faction.Castle,
    level: 2,
    upgradesTo: ['marksman'],
  },
  marksman: {
    id: 'marksman',
    name: 'Marksman',
    faction: Faction.Castle,
    level: 2,
    upgradesTo: [],
    upgradesFrom: 'archer',
  },

  // Castle faction - Level 3
  griffin: {
    id: 'griffin',
    name: 'Griffin',
    faction: Faction.Castle,
    level: 3,
    upgradesTo: ['royal_griffin'],
  },
  royal_griffin: {
    id: 'royal_griffin',
    name: 'Royal Griffin',
    faction: Faction.Castle,
    level: 3,
    upgradesTo: [],
    upgradesFrom: 'griffin',
  },

  // Castle faction - Level 4
  swordsman: {
    id: 'swordsman',
    name: 'Swordsman',
    faction: Faction.Castle,
    level: 4,
    upgradesTo: ['crusader'],
  },
  crusader: {
    id: 'crusader',
    name: 'Crusader',
    faction: Faction.Castle,
    level: 4,
    upgradesTo: [],
    upgradesFrom: 'swordsman',
  },

  // Castle faction - Level 5
  monk: {
    id: 'monk',
    name: 'Monk',
    faction: Faction.Castle,
    level: 5,
    upgradesTo: ['zealot'],
  },
  zealot: {
    id: 'zealot',
    name: 'Zealot',
    faction: Faction.Castle,
    level: 5,
    upgradesTo: [],
    upgradesFrom: 'monk',
  },

  // Castle faction - Level 6
  cavalier: {
    id: 'cavalier',
    name: 'Cavalier',
    faction: Faction.Castle,
    level: 6,
    upgradesTo: ['champion'],
  },
  champion: {
    id: 'champion',
    name: 'Champion',
    faction: Faction.Castle,
    level: 6,
    upgradesTo: [],
    upgradesFrom: 'cavalier',
  },

  // Castle faction - Level 7
  angel: {
    id: 'angel',
    name: 'Angel',
    faction: Faction.Castle,
    level: 7,
    upgradesTo: ['archangel'],
  },
  archangel: {
    id: 'archangel',
    name: 'Archangel',
    faction: Faction.Castle,
    level: 7,
    upgradesTo: [],
    upgradesFrom: 'angel',
  },

  // Rampart faction - Level 1
  centaur: {
    id: 'centaur',
    name: 'Centaur',
    faction: Faction.Rampart,
    level: 1,
    upgradesTo: ['centaur_captain'],
  },
  centaur_captain: {
    id: 'centaur_captain',
    name: 'Centaur Captain',
    faction: Faction.Rampart,
    level: 1,
    upgradesTo: [],
    upgradesFrom: 'centaur',
  },

  // Rampart faction - Level 2
  dwarf: {
    id: 'dwarf',
    name: 'Dwarf',
    faction: Faction.Rampart,
    level: 2,
    upgradesTo: ['battle_dwarf'],
  },
  battle_dwarf: {
    id: 'battle_dwarf',
    name: 'Battle Dwarf',
    faction: Faction.Rampart,
    level: 2,
    upgradesTo: [],
    upgradesFrom: 'dwarf',
  },

  // Rampart faction - Level 3
  wood_elf: {
    id: 'wood_elf',
    name: 'Wood Elf',
    faction: Faction.Rampart,
    level: 3,
    upgradesTo: ['grand_elf'],
  },
  grand_elf: {
    id: 'grand_elf',
    name: 'Grand Elf',
    faction: Faction.Rampart,
    level: 3,
    upgradesTo: [],
    upgradesFrom: 'wood_elf',
  },

  // Rampart faction - Level 4
  pegasus: {
    id: 'pegasus',
    name: 'Pegasus',
    faction: Faction.Rampart,
    level: 4,
    upgradesTo: ['silver_pegasus'],
  },
  silver_pegasus: {
    id: 'silver_pegasus',
    name: 'Silver Pegasus',
    faction: Faction.Rampart,
    level: 4,
    upgradesTo: [],
    upgradesFrom: 'pegasus',
  },

  // Rampart faction - Level 5
  dendroid_guard: {
    id: 'dendroid_guard',
    name: 'Dendroid Guard',
    faction: Faction.Rampart,
    level: 5,
    upgradesTo: ['dendroid_soldier'],
  },
  dendroid_soldier: {
    id: 'dendroid_soldier',
    name: 'Dendroid Soldier',
    faction: Faction.Rampart,
    level: 5,
    upgradesTo: [],
    upgradesFrom: 'dendroid_guard',
  },

  // Rampart faction - Level 6
  unicorn: {
    id: 'unicorn',
    name: 'Unicorn',
    faction: Faction.Rampart,
    level: 6,
    upgradesTo: ['war_unicorn'],
  },
  war_unicorn: {
    id: 'war_unicorn',
    name: 'War Unicorn',
    faction: Faction.Rampart,
    level: 6,
    upgradesTo: [],
    upgradesFrom: 'unicorn',
  },

  // Rampart faction - Level 7
  green_dragon: {
    id: 'green_dragon',
    name: 'Green Dragon',
    faction: Faction.Rampart,
    level: 7,
    upgradesTo: ['gold_dragon'],
  },
  gold_dragon: {
    id: 'gold_dragon',
    name: 'Gold Dragon',
    faction: Faction.Rampart,
    level: 7,
    upgradesTo: [],
    upgradesFrom: 'green_dragon',
  },

  // Add more creature types as needed for other factions
};

/**
 * Validates the creature types configuration to ensure data integrity.
 * Checks that all upgrade paths reference valid creature type IDs.
 * @throws Error if validation fails
 */
export function validateCreatureTypes(): void {
  const errors: string[] = [];

  for (const [id, creatureType] of Object.entries(CREATURE_TYPES)) {
    // Check that the id matches the key
    if (creatureType.id !== id) {
      errors.push(`Creature type key '${id}' does not match id '${creatureType.id}'`);
    }

    // Check that upgradesTo references exist
    for (const upgradeId of creatureType.upgradesTo) {
      if (!CREATURE_TYPES[upgradeId]) {
        errors.push(`Creature '${id}' upgradesTo '${upgradeId}' which does not exist`);
      }
    }

    // Check that upgradesFrom reference exists
    if (creatureType.upgradesFrom && !CREATURE_TYPES[creatureType.upgradesFrom]) {
      errors.push(`Creature '${id}' upgradesFrom '${creatureType.upgradesFrom}' which does not exist`);
    }

    // Check bidirectional consistency
    if (creatureType.upgradesFrom) {
      const parent = CREATURE_TYPES[creatureType.upgradesFrom];
      if (parent && !parent.upgradesTo.includes(id)) {
        errors.push(`Creature '${id}' has upgradesFrom '${creatureType.upgradesFrom}', but parent does not have '${id}' in upgradesTo`);
      }
    }

    for (const upgradeId of creatureType.upgradesTo) {
      const upgrade = CREATURE_TYPES[upgradeId];
      if (upgrade && upgrade.upgradesFrom !== id) {
        errors.push(`Creature '${id}' has '${upgradeId}' in upgradesTo, but '${upgradeId}' does not have upgradesFrom '${id}'`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Creature types validation failed:\n${errors.join('\n')}`);
  }
}

// Validate on module load (in development)
// Note: This runs during build time, not runtime
try {
  validateCreatureTypes();
} catch (error) {
  console.error('Creature types validation error:', error);
}
