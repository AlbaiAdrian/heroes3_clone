// core/models/town/town.model.ts
import { Faction } from '../faction/faction.enum';
import { Building } from '../building/building.model';
import { Creature } from '../creature/creature.model';
import { Tile } from '../terrain/tile.model';

export interface Town {
  id: string;
  name: string;
  faction: Faction;
  tile: Tile;
  buildings: Building[];
  availableCreatures: TownCreature[];
}

export interface TownCreature {
  creature: Creature;
  available: number;
}
