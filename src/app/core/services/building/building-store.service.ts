import { Injectable } from '@angular/core';
import { Building } from '../../models/building/building.model';

/**
 * In-memory building store available app-wide.
 */
@Injectable({ providedIn: 'root' })
export class BuildingStoreService {
  private buildings: Building[] = [];

  setBuildings(buildings: Building[]): void {
    this.buildings = buildings;
  }

  getBuildings(): Building[] {
    return this.buildings;
  }
}
