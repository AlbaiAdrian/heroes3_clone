import { Injectable, OnDestroy } from '@angular/core';
import { ViewportService } from './viewport.service';

/**
 * Direction of scrolling
 */
export enum ScrollDirection {
  NONE = 'none',
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NORTH_EAST = 'north-east',
  NORTH_WEST = 'north-west',
  SOUTH_EAST = 'south-east',
  SOUTH_WEST = 'south-west'
}

/**
 * Edge scroll controller service responsible for handling Heroes 3-style edge scrolling.
 * Follows Single Responsibility Principle by handling only edge scroll behavior.
 */
@Injectable({ providedIn: 'root' })
export class EdgeScrollController implements OnDestroy {
  private readonly EDGE_MARGIN = 10; // pixels from edge to trigger scroll
  private readonly SCROLL_SPEED = 8; // pixels per frame
  
  private scrollIntervalId: number | null = null;
  private currentScrollDirection = ScrollDirection.NONE;
  private isEnabled = true;
  
  constructor(private viewport: ViewportService) {}
  
  /**
   * Enable edge scrolling
   */
  enable(): void {
    this.isEnabled = true;
  }
  
  /**
   * Disable edge scrolling
   */
  disable(): void {
    this.isEnabled = false;
    this.stopScrolling();
  }
  
  /**
   * Update mouse position and determine if scrolling should occur
   */
  updateMousePosition(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number): ScrollDirection {
    if (!this.isEnabled) {
      this.stopScrolling();
      return ScrollDirection.NONE;
    }
    
    const direction = this.getScrollDirection(mouseX, mouseY, canvasWidth, canvasHeight);
    
    if (direction !== this.currentScrollDirection) {
      this.currentScrollDirection = direction;
      
      if (direction === ScrollDirection.NONE) {
        this.stopScrolling();
      } else {
        this.startScrolling();
      }
    }
    
    return direction;
  }
  
  /**
   * Get current scroll direction
   */
  getCurrentDirection(): ScrollDirection {
    return this.currentScrollDirection;
  }
  
  /**
   * Determine scroll direction based on mouse position
   */
  private getScrollDirection(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number): ScrollDirection {
    const atTop = mouseY < this.EDGE_MARGIN;
    const atBottom = mouseY > canvasHeight - this.EDGE_MARGIN;
    const atLeft = mouseX < this.EDGE_MARGIN;
    const atRight = mouseX > canvasWidth - this.EDGE_MARGIN;
    
    // Diagonal directions
    if (atTop && atLeft) return ScrollDirection.NORTH_WEST;
    if (atTop && atRight) return ScrollDirection.NORTH_EAST;
    if (atBottom && atLeft) return ScrollDirection.SOUTH_WEST;
    if (atBottom && atRight) return ScrollDirection.SOUTH_EAST;
    
    // Cardinal directions
    if (atTop) return ScrollDirection.NORTH;
    if (atBottom) return ScrollDirection.SOUTH;
    if (atLeft) return ScrollDirection.WEST;
    if (atRight) return ScrollDirection.EAST;
    
    return ScrollDirection.NONE;
  }
  
  /**
   * Start the scrolling animation
   */
  private startScrolling(): void {
    if (this.scrollIntervalId !== null) {
      return; // Already scrolling
    }
    
    this.scrollIntervalId = window.setInterval(() => {
      this.performScroll();
    }, 16); // ~60 FPS
  }
  
  /**
   * Stop the scrolling animation
   */
  private stopScrolling(): void {
    if (this.scrollIntervalId !== null) {
      window.clearInterval(this.scrollIntervalId);
      this.scrollIntervalId = null;
    }
  }
  
  /**
   * Perform one frame of scrolling
   */
  private performScroll(): void {
    const { deltaX, deltaY } = this.getScrollDeltas(this.currentScrollDirection);
    
    if (deltaX !== 0 || deltaY !== 0) {
      this.viewport.moveCamera(deltaX, deltaY);
    }
  }
  
  /**
   * Get scroll deltas for a given direction
   */
  private getScrollDeltas(direction: ScrollDirection): { deltaX: number; deltaY: number } {
    const speed = this.SCROLL_SPEED;
    const diagonalSpeed = Math.round(speed / Math.sqrt(2)); // Normalize diagonal speed
    
    switch (direction) {
      case ScrollDirection.NORTH:
        return { deltaX: 0, deltaY: -speed };
      case ScrollDirection.SOUTH:
        return { deltaX: 0, deltaY: speed };
      case ScrollDirection.EAST:
        return { deltaX: speed, deltaY: 0 };
      case ScrollDirection.WEST:
        return { deltaX: -speed, deltaY: 0 };
      case ScrollDirection.NORTH_EAST:
        return { deltaX: diagonalSpeed, deltaY: -diagonalSpeed };
      case ScrollDirection.NORTH_WEST:
        return { deltaX: -diagonalSpeed, deltaY: -diagonalSpeed };
      case ScrollDirection.SOUTH_EAST:
        return { deltaX: diagonalSpeed, deltaY: diagonalSpeed };
      case ScrollDirection.SOUTH_WEST:
        return { deltaX: -diagonalSpeed, deltaY: diagonalSpeed };
      default:
        return { deltaX: 0, deltaY: 0 };
    }
  }
  
  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.stopScrolling();
  }
}
