// app.routes.ts
import { Routes } from '@angular/router';
import { MainMenuComponent } from './features/main-menu/main-menu.component';
import { AdventureMapComponent } from './features/adventure-map/adventure-map.component';
import { BattleComponent } from './features/battle/battle.component';


export const appRoutes: Routes = [
  { path: '', component: MainMenuComponent },
  { path: 'adventure', component: AdventureMapComponent },
  { path: 'battle', component: BattleComponent },
];