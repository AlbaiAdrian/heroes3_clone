import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { CreatureType } from '../../models/creature/creature-type.model';
import { Faction } from '../../models/faction/faction.enum';


@Injectable({ providedIn: 'root' })
export class CreatureTypeDataService {
  private readonly creaturesPath = 'assets/data/creature';

  constructor(private readonly http: HttpClient) {}

  /**
   * Load creatures for a specific faction
   * @param faction The faction to load creatures for
   * @returns Observable of CreatureType array
   */
  getCreatureTypesByFaction(faction: Faction): Observable<CreatureType[]> {
    return this.http.get<CreatureType[]>(`${this.creaturesPath}/${faction}.json`).pipe(
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
   * Load creatures for all factions in parallel
   * @returns Observable of a flat CreatureType array
   */
  getCreatureTypes(): Observable<CreatureType[]> {
    const allFactions = Object.values(Faction);
    const requests = allFactions.map((faction) => this.getCreatureTypesByFaction(faction));

    return forkJoin(requests).pipe(
      map((results) => results.flat())
    );
  }
}
