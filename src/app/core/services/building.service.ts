import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Building } from '../models/building/building.model';
import { Faction } from '../models/faction/faction.enum';

/**
 * Service for loading faction building data from JSON files.
 * Example usage:
 * 
 * constructor(private buildingService: BuildingService) {}
 * 
 * loadCastleBuildings() {
 *   this.buildingService.getBuildingsByFaction(Faction.Castle).subscribe(
 *     buildings => {
 *       console.log('Castle buildings:', buildings);
 *     }
 *   );
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private readonly buildingsPath = 'assets/data/buildings';

  constructor(private http: HttpClient) {}

  /**
   * Load buildings for a specific faction
   * @param faction The faction to load buildings for
   * @returns Observable of Building array
   */
  getBuildingsByFaction(faction: Faction): Observable<Building[]> {
    const factionFileName = this.getFactionFileName(faction);
    return this.http.get<Building[]>(`${this.buildingsPath}/${factionFileName}.json`);
  }

  /**
   * Load buildings for all factions in parallel
   * @returns Observable of Map with faction as key and buildings as value
   */
  getAllBuildings(): Observable<Map<Faction, Building[]>> {
    const allFactions = Object.values(Faction);
    const requests: Record<string, Observable<Building[]>> = {};
    
    allFactions.forEach(faction => {
      requests[faction] = this.getBuildingsByFaction(faction);
    });
    
    return forkJoin(requests).pipe(
      map(results => {
        const buildingsMap = new Map<Faction, Building[]>();
        allFactions.forEach(faction => {
          buildingsMap.set(faction, results[faction]);
        });
        return buildingsMap;
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
