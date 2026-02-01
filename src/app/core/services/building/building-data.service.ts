import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Building } from '../../models/building/building.model';
import { Faction } from '../../models/faction/faction.enum';

@Injectable({
  providedIn: 'root'
})
export class BuildingDataService {
  private readonly buildingsPath = 'assets/data/building';

  constructor(private http: HttpClient) {}

  /**
   * Load buildings for a specific faction
   * @param faction The faction to load buildings for
   * @returns Observable of Building array
   */
  getBuildingsByFaction(faction: Faction): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.buildingsPath}/${faction}.json`);
  }

  /**
   * Load buildings for all factions in parallel
   * @returns Observable of a flat Building array
   */
  getBuildings(): Observable<Building[]> {
    const allFactions = Object.values(Faction);
    const requests = allFactions.map((faction) => this.getBuildingsByFaction(faction));

    return forkJoin(requests).pipe(
      map((results) => results.flat())
    );
  }
}
