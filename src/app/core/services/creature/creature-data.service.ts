import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { Faction } from '../../models/faction/faction.enum';


@Injectable({ providedIn: 'root' })
export class CreatureDataService {
  private readonly creaturesPath = 'assets/data/creature';

  constructor(private readonly http: HttpClient) {}

  /**
   * Load creatures for a specific faction
   * @param faction The faction to load creatures for
   * @returns Observable of Creature array
   */
  getCreaturesByFaction(faction: Faction): Observable<Creature[]> {
    return this.http.get<Creature[]>(`${this.creaturesPath}/${faction}.json`).pipe(
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
   * @returns Observable of a flat Creature array
   */
  getCreatures(): Observable<Creature[]> {
    const allFactions = Object.values(Faction);
    const requests = allFactions.map((faction) => this.getCreaturesByFaction(faction));

    return forkJoin(requests).pipe(
      map((results) => results.flat())
    );
  }
}
