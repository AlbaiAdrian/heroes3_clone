import { Injectable } from '@angular/core';
import { ScrollDirection } from './edge-scroll-controller.service';

/**
 * Cursor manager service responsible for managing cursor appearance based on scroll state.
 * Follows Single Responsibility Principle by handling only cursor display logic.
 */
@Injectable({ providedIn: 'root' })
export class CursorManagerService {
  private currentCursor = 'default';
  
  /**
   * Get CSS cursor value for a scroll direction
   */
  getCursorForDirection(direction: ScrollDirection): string {
    switch (direction) {
      case ScrollDirection.NORTH:
        return 'n-resize';
      case ScrollDirection.SOUTH:
        return 's-resize';
      case ScrollDirection.EAST:
        return 'e-resize';
      case ScrollDirection.WEST:
        return 'w-resize';
      case ScrollDirection.NORTH_EAST:
        return 'ne-resize';
      case ScrollDirection.NORTH_WEST:
        return 'nw-resize';
      case ScrollDirection.SOUTH_EAST:
        return 'se-resize';
      case ScrollDirection.SOUTH_WEST:
        return 'sw-resize';
      default:
        return 'default';
    }
  }
  
  /**
   * Apply cursor to an HTML element
   */
  applyCursor(element: HTMLElement, direction: ScrollDirection): void {
    const cursor = this.getCursorForDirection(direction);
    if (cursor !== this.currentCursor) {
      element.style.cursor = cursor;
      this.currentCursor = cursor;
    }
  }
  
  /**
   * Reset cursor to default
   */
  resetCursor(element: HTMLElement): void {
    this.applyCursor(element, ScrollDirection.NONE);
  }
}
