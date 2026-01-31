import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Creature } from '../../models/creature/creature.model';
import { CreatureData } from '../../models/creature/creature-data.interface';

/**
 * Loads creature definitions from JSON and exposes them as `Creature` objects.
 */
@Injectable({ providedIn: 'root' })
export class CreatureDataService {
  private readonly creaturesUrl = 'assets/data/creatures.json';

  constructor(private readonly http: HttpClient) {}

  getCreatures(): Observable<Creature[]> {
    return this.http.get<CreatureData[]>(this.creaturesUrl).pipe(
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
}
