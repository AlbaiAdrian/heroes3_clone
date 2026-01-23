import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Viewport service responsible for managing the camera position and viewport dimensions.
 * Follows Single Responsibility Principle by handling only viewport-related concerns.
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly TILE_SIZE = 48;
  
  // Canvas dimensions (viewport size in pixels)
  private canvasWidth = 960;
  private canvasHeight = 720;
  
  // Camera position in pixels (top-left corner of viewport)
  private cameraX$ = new BehaviorSubject<number>(0);
  private cameraY$ = new BehaviorSubject<number>(0);
  
  // Map dimensions in tiles
  private mapWidth = 0;
  private mapHeight = 0;
  
  /**
   * Observable for camera X position
   */
  get cameraX(): Observable<number> {
    return this.cameraX$.asObservable();
  }
  
  /**
   * Observable for camera Y position
   */
  get cameraY(): Observable<number> {
    return this.cameraY$.asObservable();
  }
  
  /**
   * Get current camera position
   */
  getCameraPosition(): { x: number; y: number } {
    return {
      x: this.cameraX$.value,
      y: this.cameraY$.value
    };
  }
  
  /**
   * Get viewport dimensions in tiles
   */
  getViewportDimensions(): { width: number; height: number } {
    return {
      width: Math.ceil(this.canvasWidth / this.TILE_SIZE),
      height: Math.ceil(this.canvasHeight / this.TILE_SIZE)
    };
  }
  
  /**
   * Initialize viewport with canvas and map dimensions
   */
  initialize(canvasWidth: number, canvasHeight: number, mapWidth: number, mapHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    
    // Center camera on map initially
    this.centerCamera();
  }
  
  /**
   * Center camera on the map
   */
  private centerCamera(): void {
    const maxCameraX = Math.max(0, this.mapWidth * this.TILE_SIZE - this.canvasWidth);
    const maxCameraY = Math.max(0, this.mapHeight * this.TILE_SIZE - this.canvasHeight);
    
    this.cameraX$.next(Math.floor(maxCameraX / 2));
    this.cameraY$.next(Math.floor(maxCameraY / 2));
  }
  
  /**
   * Move camera by delta values, respecting map boundaries
   */
  moveCamera(deltaX: number, deltaY: number): void {
    const newX = this.clampCameraX(this.cameraX$.value + deltaX);
    const newY = this.clampCameraY(this.cameraY$.value + deltaY);
    
    this.cameraX$.next(newX);
    this.cameraY$.next(newY);
  }
  
  /**
   * Set camera position to specific coordinates
   */
  setCameraPosition(x: number, y: number): void {
    this.cameraX$.next(this.clampCameraX(x));
    this.cameraY$.next(this.clampCameraY(y));
  }
  
  /**
   * Center camera on a specific tile
   */
  centerOnTile(tileX: number, tileY: number): void {
    const centerX = (tileX * this.TILE_SIZE) - (this.canvasWidth / 2) + (this.TILE_SIZE / 2);
    const centerY = (tileY * this.TILE_SIZE) - (this.canvasHeight / 2) + (this.TILE_SIZE / 2);
    
    this.setCameraPosition(centerX, centerY);
  }
  
  /**
   * Clamp camera X position to valid range
   */
  private clampCameraX(x: number): number {
    const maxX = Math.max(0, this.mapWidth * this.TILE_SIZE - this.canvasWidth);
    return Math.max(0, Math.min(x, maxX));
  }
  
  /**
   * Clamp camera Y position to valid range
   */
  private clampCameraY(y: number): number {
    const maxY = Math.max(0, this.mapHeight * this.TILE_SIZE - this.canvasHeight);
    return Math.max(0, Math.min(y, maxY));
  }
  
  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX + this.cameraX$.value,
      y: screenY + this.cameraY$.value
    };
  }
  
  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX - this.cameraX$.value,
      y: worldY - this.cameraY$.value
    };
  }
}
