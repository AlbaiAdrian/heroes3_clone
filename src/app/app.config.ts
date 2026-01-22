// import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { appRoutes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideRouter(appRoutes)
//   ]
// };

import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { GameStateRouterService } from './core/services/game-state-router.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
  ]
};