import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { CreatureData } from '../../models/creature/creature-data.interface';
import { Faction } from '../../models/faction/faction.enum';

/**
 * Service for loading faction creature data from JSON files.
 * Example usage:
 * 
 * constructor(private creatureService: CreatureDataService) {}
 * 
 * loadCastleCreatures() {
 *   this.creatureService.getCreaturesByFaction(Faction.Castle).subscribe(
 *     creatures => {
 *       console.log('Castle creatures:', creatures);
 *     }
 *   );
 * }
 */
@Injectable({ providedIn: 'root' })
export class CreatureDataService {
  private readonly creaturesPath = 'assets/data/creatures';

  constructor(private readonly http: HttpClient) {}

  /**
   * Load creatures for a specific faction
   * @param faction The faction to load creatures for
   * @returns Observable of Creature array
   */
  getCreaturesByFaction(faction: Faction): Observable<Creature[]> {
    const factionFileName = this.getFactionFileName(faction);
    return this.http.get<CreatureData[]>(`${this.creaturesPath}/${factionFileName}.json`).pipe(
      map((data) =>
        data.map((creature) => ({
          level: creature.level,
          faction: creature.faction,
          name: creature.name,
          attributes: creature.attributes,
          cost: creature.cost,
        }))
      )
    );
  }

  /**
   * Load all creatures (maintains backward compatibility)
   * @returns Observable of Creature array containing creatures from all factions
   */
  getCreatures(): Observable<Creature[]> {
    return this.getAllCreatures().pipe(
      map((creaturesMap) => {
        const allCreatures: Creature[] = [];
        creaturesMap.forEach((creatures) => {
          allCreatures.push(...creatures);
        });
        return allCreatures;
      })
    );
  }

  /**
   * Load creatures for all factions in parallel
   * @returns Observable of Map with faction as key and creatures as value
   */
  getAllCreatures(): Observable<Map<Faction, Creature[]>> {
    const allFactions = Object.values(Faction);
    const requests: Record<string, Observable<Creature[]>> = {};
    
    allFactions.forEach(faction => {
      requests[faction] = this.getCreaturesByFaction(faction);
    });
    
    return forkJoin(requests).pipe(
      map(results => {
        const creaturesMap = new Map<Faction, Creature[]>();
        allFactions.forEach(faction => {
          creaturesMap.set(faction, results[faction]);
        });
        return creaturesMap;
      })
    );
  }

  /**
   * Get the filename for a faction.
   * Note: This assumes the Faction enum values directly match the JSON filenames.
   * Faction enum: { Castle = 'castle', Rampart = 'rampart', ... }
   * JSON files: castle.json, rampart.json, ...
   * 
   * @param faction The faction
   * @returns The faction enum value, which matches the JSON filename (without extension)
   */
  private getFactionFileName(faction: Faction): string {
    return faction;
  }
}
