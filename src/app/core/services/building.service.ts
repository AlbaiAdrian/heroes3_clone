import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
   * Load buildings for all factions
   * @returns Observable of Map with faction as key and buildings as value
   */
  getAllBuildings(): Observable<Map<Faction, Building[]>> {
    const allFactions = Object.values(Faction);
    const buildingsMap = new Map<Faction, Building[]>();
    
    // This is a simplified example. In production, you might want to use forkJoin
    // to load all factions in parallel
    return new Observable(observer => {
      let loaded = 0;
      allFactions.forEach(faction => {
        this.getBuildingsByFaction(faction).subscribe({
          next: buildings => {
            buildingsMap.set(faction, buildings);
            loaded++;
            if (loaded === allFactions.length) {
              observer.next(buildingsMap);
              observer.complete();
            }
          },
          error: err => observer.error(err)
        });
      });
    });
  }

  /**
   * Get the filename for a faction
   * @param faction The faction
   * @returns The filename (without extension)
   */
  private getFactionFileName(faction: Faction): string {
    return faction; // The enum values match the file names
  }
}
