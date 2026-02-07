// app.routes.ts
import { Routes } from '@angular/router';
import { MainMenuComponent } from './features/main-menu/main-menu.component';
import { AdventureMapComponent } from './features/adventure-map/adventure-map.component';
import { BattleComponent } from './features/battle/battle.component';
import { GameOverComponent } from './features/game-over/game-over.component';


export const appRoutes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'adventure', component: AdventureMapComponent },
  { path: 'battle', component: BattleComponent },
  { path: 'game-over', component: GameOverComponent },
];