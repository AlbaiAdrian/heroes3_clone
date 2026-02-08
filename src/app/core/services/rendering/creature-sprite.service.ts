import { DestroyRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { CreatureType } from '../../models/creature/creature-type.model';
import { Faction } from '../../models/faction/faction.enum';

@Injectable({ providedIn: 'root' })
export class CreatureSpriteService {
  private readonly creatureDataPath = 'assets/data/creature';
  private readonly creatureSpritePath = 'creature';
  private sprites = new Map<Faction, Map<string, HTMLImageElement>>();

  constructor(
    private readonly http: HttpClient,
    private readonly destroyRef: DestroyRef
  ) {}

  loadSprites(): void {
    const factions = Object.values(Faction);
    factions.forEach((faction) => {
      this.folderExists(faction)
        .pipe(
          filter((exists) => {
            if (!exists) {
              console.warn(`Creature sprite folder missing for faction: ${faction}`);
            }
            return exists;
          }),
          switchMap(() => this.http.get<CreatureType[]>(`${this.creatureDataPath}/${faction}.json`)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: (creatures) => this.loadFactionSprites(faction, creatures),
          error: (err) => console.error(`Failed to load creatures for ${faction}:`, err),
        });
    });
  }

  get(faction: Faction, code: string): HTMLImageElement | undefined {
    return this.sprites.get(faction)?.get(code);
  }

  folderExists(faction: Faction): Observable<boolean> {
    return this.http
      .get(`${this.creatureSpritePath}/${faction}/`, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  private loadFactionSprites(faction: Faction, creatures: CreatureType[]): void {
    const factionSprites = this.getFactionSprites(faction);
    creatures.forEach((creature) => {
      const img = new Image();
      img.onload = () => {
        factionSprites.set(creature.code, img);
      };
      img.onerror = () => {
        console.warn(`Missing creature sprite: ${faction}/${creature.code}`);
      };
      img.src = `${this.creatureSpritePath}/${faction}/${creature.code}.png`;
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
