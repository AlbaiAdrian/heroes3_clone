// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { GameStateRouterService } from './app/core/services/game/game-state-router.service';
import { App } from './app/app';
import { inject, provideAppInitializer } from '@angular/core';


bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes),

    provideAppInitializer(() => {
      inject(GameStateRouterService).init();
    }),
  ],
}).catch(err => console.error(err));