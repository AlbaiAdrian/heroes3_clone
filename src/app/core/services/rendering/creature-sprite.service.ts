import { DestroyRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, of, switchMap } from 'rxjs';
import { CreatureType } from '../../models/creature/creature-type.model';
import { Faction } from '../../models/faction/faction.enum';

@Injectable({ providedIn: 'root' })
export class CreatureSpriteService {
  private readonly creatureDataPath = 'assets/data/creature';
  private readonly creatureSpritePath = 'creature';
  private sprites = new Map<Faction, Map<string, HTMLImageElement>>();
  private pendingLoads = 0;
  private pendingFactions = 0;
  private loadingInProgress = false;
  private spritesLoaded$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient,
    private readonly destroyRef: DestroyRef
  ) {}

  loadSprites(): void {
    const factions = Object.values(Faction);
    if (this.loadingInProgress) {
      return;
    }

    this.pendingFactions = factions.length;
    this.pendingLoads = 0;
    this.loadingInProgress = true;
    this.spritesLoaded$.next(false);

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
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.completeFactionLoad())
        )
        .subscribe({
          next: (creatures) => this.loadFactionSprites(faction, creatures),
          error: (err) => {
            console.error(`Failed to load creatures for ${faction}:`, err);
          },
        });
    });
  }

  get(faction: Faction, code: string): HTMLImageElement | undefined {
    return this.sprites.get(faction)?.get(code);
  }

  spritesLoaded(): Observable<boolean> {
    return this.spritesLoaded$.asObservable();
  }

  private folderExists(faction: Faction): Observable<boolean> {
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
      if (factionSprites.has(creature.code)) {
        return;
      }

      const img = new Image();
      img.onload = () => {
        factionSprites.set(creature.code, img);
        this.completeSpriteLoad();
      };
      img.onerror = () => {
        console.warn(`Missing creature sprite: ${faction}/${creature.code}`);
        this.completeSpriteLoad();
      };
      this.pendingLoads += 1;
      img.src = `${this.creatureSpritePath}/${faction}/${creature.code}.png`;
    });
  }

  private completeFactionLoad(): void {
    this.pendingFactions = Math.max(0, this.pendingFactions - 1);
    this.checkIfLoaded();
  }

  private completeSpriteLoad(): void {
    this.pendingLoads = Math.max(0, this.pendingLoads - 1);
    this.checkIfLoaded();
  }

  private checkIfLoaded(): void {
    if (this.pendingFactions === 0 && this.pendingLoads === 0) {
      this.loadingInProgress = false;
      console.log('All creature sprites loaded.', this.sprites);
      this.spritesLoaded$.next(true);
    }
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
