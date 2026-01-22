// app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameStateRouterService } from './core/services/game-state-router.service';

export function initGameStateRouter(
    routerService: GameStateRouterService
  ) {
    return () => routerService.init();
  }
  


@Component({
standalone: true,
selector: 'app-root',
imports: [RouterOutlet],
template: `<router-outlet />`,
})
export class App {
}