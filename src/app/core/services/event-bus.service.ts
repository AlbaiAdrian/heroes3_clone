// core/services/event-bus.service.ts
import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

export interface EventBusEvent<T = unknown> {
  type: string;
  payload?: T;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private events$ = new Subject<EventBusEvent>();

  emit<T>(type: string, payload?: T): void {
    this.events$.next({ type, payload });
  }

  on<T = unknown>(type: string): Observable<T> {
    return this.events$.pipe(
      filter(event => event.type === type),
      map(event => event.payload as T)
    );
  }
}