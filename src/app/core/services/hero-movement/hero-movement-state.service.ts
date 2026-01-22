// core/services/hero-movement-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Hero } from '../../models/hero/hero.model';


@Injectable({ providedIn: 'root' })
export class HeroMovementStateService {

  private movementSubject = new BehaviorSubject<number>(0);
  readonly movement$ = this.movementSubject.asObservable();

  initialize(hero: Hero): void {
    this.movementSubject.next(hero.movementPoints);
  }

  consume(hero: Hero, amount = 1): void {
    hero.movementPoints -= amount;
    this.movementSubject.next(hero.movementPoints);
  }

  reset(hero: Hero): void {
    hero.movementPoints = hero.maxMovementPoints;
    this.movementSubject.next(hero.movementPoints);
  }
}