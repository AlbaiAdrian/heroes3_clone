import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameTime } from '../../models/game-time.model';

const DAYS_PER_WEEK = 7;
const WEEKS_PER_MONTH = 4;

@Injectable({ providedIn: 'root' })
export class GameClockService {

  private readonly timeSubject = new BehaviorSubject<GameTime>({
    day: 1,
    week: 1,
    month: 1,
  });

  readonly time$ = this.timeSubject.asObservable();

  /** Called once per End Turn */
  nextDay(): void {
    const { day, week, month } = this.timeSubject.value;

    if (day < DAYS_PER_WEEK) {
      this.timeSubject.next({ day: day + 1, week, month });
      return;
    }

    // Day rollover
    if (week < WEEKS_PER_MONTH) {
      this.timeSubject.next({ day: 1, week: week + 1, month });
      return;
    }

    // Week + Day rollover → new month
    this.timeSubject.next({ day: 1, week: 1, month: month + 1 });
  }

  /** Useful for new game */
  reset(): void {
    this.timeSubject.next({ day: 1, week: 1, month: 1 });
  }
}
