import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { CreatureType } from '../../models/creature/creature-type.model';
import { Faction } from '../../models/faction/faction.enum';

@Injectable({ providedIn: 'root' })
export class CreatureSpriteService {
  private readonly creatureDataPath = 'assets/data/creature';
  private readonly creatureSpritePath = 'creature';
  private sprites = new Map<Faction, Map<string, HTMLImageElement>>();

  constructor(private readonly http: HttpClient) {}

  loadSprites(): void {
    const factions = Object.values(Faction);
    factions.forEach((faction) => {
      this.folderExists(faction).subscribe((exists) => {
        if (!exists) {
          console.warn(`Creature sprite folder missing for faction: ${faction}`);
          return;
        }

        this.http.get<CreatureType[]>(`${this.creatureDataPath}/${faction}.json`).subscribe({
          next: (creatures) => this.loadFactionSprites(faction, creatures),
          error: (err) => console.error(`Failed to load creatures for ${faction}:`, err),
        });
      });
    });
  }

  get(faction: Faction, code: string): HTMLImageElement | undefined {
    return this.sprites.get(faction)?.get(code);
  }

  private folderExists(faction: Faction): Observable<boolean> {
    return this.http
      .get(`${this.creatureSpritePath}/${faction}/`, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => of(error.status !== 404))
      );
  }

  private loadFactionSprites(faction: Faction, creatures: CreatureType[]): void {
    const factionSprites = this.getFactionSprites(faction);
    creatures.forEach((creature) => {
      const img = new Image();
      img.src = `${this.creatureSpritePath}/${faction}/${creature.code}.png`;
      img.onerror = () => {
        console.warn(`Missing creature sprite: ${faction}/${creature.code}`);
      };
      factionSprites.set(creature.code, img);
    });
  }

  private getFactionSprites(faction: Faction): Map<string, HTMLImageElement> {
    let factionSprites = this.sprites.get(faction);
    if (!factionSprites) {
      factionSprites = new Map<string, HTMLImageElement>();
      this.sprites.set(faction, factionSprites);
    }
    return factionSprites;
  }
}
