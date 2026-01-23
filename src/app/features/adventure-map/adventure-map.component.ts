import { AfterViewInit, ViewChild, ElementRef, Component } from "@angular/core";
import { map, Observable } from "rxjs";
import { Tile } from "../../core/models/terrain/tile.model";
import { EventBusService } from "../../core/services/event-bus.service";
import { HeroMovementStateService } from "../../core/services/hero-movement/hero-movement-state.service";
import { MapGeneratorService } from "../../core/services/map-generation/map-generator.service";
import { CanvasRendererService } from "../../core/services/rendering/canvas-renderer.service";
import { TurnEngineService } from "../../core/services/turn-engine.service";
import { HeroMovementService } from "../../core/services/hero-movement/hero-movement.service";
import { AsyncPipe } from "@angular/common";
import { HeroOrientation } from "../../core/models/hero/hero-orientation.enum";
import { Hero } from "../../core/models/hero/hero.model";
import { GameClockService } from "../../core/services/game-clock.service";
import { GameTime } from "../../core/models/game-time.model";
import { MapObjectGeneratorService } from "../../core/services/map-generation/map-object-generator.service";
import { MapObject } from "../../core/models/map-objects/map-object.model";
import { ObjectWalkabilityService } from "../../core/services/map-generation/object-walkability.service";
import { Player } from "../../core/models/player/player.model";
import { ResourceType } from "../../core/models/player/resource-type.enum";

// @Component({
//   standalone: true,
//   selector: 'app-adventure-map',
//   imports: [CommonModule],
//   template: `
//     <canvas #canvas width="960" height="720"></canvas>

//     <section class="ui">
//       <p>Turn: {{ turn$ | async }}</p>
//       <p>Movement: {{ movement$ | async }}</p>
//       <button (click)="endTurn()">End Turn</button>
//     </section>
//   `,
// })
@Component({
  selector: 'app-adventure-map',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './adventure-map.component.html',
  styleUrls: ['./adventure-map.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventureMapComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  map!: Tile[][];
  objects!: MapObject[];
  player!: Player;

  // Viewport tracking for scrolling
  private viewportX = 0;
  private viewportY = 0;
  private readonly viewportWidth = 20;  // tiles visible horizontally
  private readonly viewportHeight = 15; // tiles visible vertically
  
  // Mouse drag state
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;

  // Reactive bindings
  turn$: Observable<number>;
  readonly movement$: Observable<number>;
  readonly movementPercent$: Observable<number>;
  readonly gameTime$: Observable<GameTime>;

  constructor(
      private mapGenerator: MapGeneratorService,
      private objectGenerator: MapObjectGeneratorService,
      private objectWalkability: ObjectWalkabilityService,
      private heroMovement: HeroMovementService,
      private renderer: CanvasRendererService,
      private movementState: HeroMovementStateService,
      private turnEngine: TurnEngineService,
      private gameClock: GameClockService,
      private eventBus: EventBusService) 
    
  {
    // this sequence must be reworked
    // Generate a larger map (40x30 tiles instead of 24x16)
    this.map = this.mapGenerator.generate(40, 30);
    this.objects = this.objectGenerator.generate(this.map);
    this.objectWalkability.applyObjects(this.map, this.objects)

    // Initialize player with starting hero and resources
    const firstHero: Hero = {tile: this.map[5][5], name: 'First Hero', level: 1, movementPoints: 10, maxMovementPoints: 10, path: [], facing:HeroOrientation.West};
    
    this.player = {
      heroes: [firstHero],
      selectedHero: firstHero,
      resources: {
        gold: { value: 10000, type: ResourceType.Gold },
        wood: { value: 20, type: ResourceType.Wood },
        stone: { value: 20, type: ResourceType.Stone }
      }
    };

    this.turn$ = this.turnEngine.turnState$.pipe(
        map(state => state.currentTurn)
      );

    this.movement$ = this.movementState.movement$;

    this.movementPercent$ = this.movement$.pipe(map(movement => Math.round((movement / this.player.selectedHero.maxMovementPoints) * 100)));

    this.gameTime$ = this.gameClock.time$;

    this.movementState.initialize(this.player.selectedHero);
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    this.renderer.initialize(ctx);

    this.eventBus.on('heroMoved').subscribe(() => this.redraw());

    this.canvas.nativeElement.addEventListener('click', e => this.onClick(e));
    this.canvas.nativeElement.addEventListener('dblclick', e => this.onDoubleClick(e));
    
    // Add mouse drag handlers for scrolling
    this.canvas.nativeElement.addEventListener('mousedown', e => this.onMouseDown(e));
    this.canvas.nativeElement.addEventListener('mousemove', e => this.onMouseMove(e));
    this.canvas.nativeElement.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.nativeElement.addEventListener('mouseleave', () => this.onMouseUp());

    this.redraw();
  }

  private onClick(event: MouseEvent): void {
    if (this.isDragging) return; // Ignore click if we were dragging
    
    const tile = this.getTileFromMouse(event);
    if (!tile) return;

    this.heroMovement.setDestination(this.player.selectedHero, tile, this.map);

    this.redraw();
  }

  private async onDoubleClick(event: MouseEvent): Promise<void> {
    await this.heroMovement.executePlannedMovement(this.player.selectedHero, async () => {
      this.redraw();
      // yield control so browser can paint
      await new Promise(requestAnimationFrame);
    });
  }

  private redraw(): void {
    this.renderer.draw(this.map, this.objects, this.player.selectedHero, this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight);
  }

  private getTileFromMouse(event: MouseEvent): Tile | null {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const canvasX = Math.floor((event.clientX - rect.left) / 48);
    const canvasY = Math.floor((event.clientY - rect.top) / 48);
    
    // Adjust for viewport offset
    const x = canvasX + this.viewportX;
    const y = canvasY + this.viewportY;
    
    return this.map[y]?.[x] ?? null;
  }

  private onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    
    // Drag threshold to distinguish from click
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      // Convert pixel delta to tile delta
      const tileDeltaX = Math.floor(-deltaX / 48);
      const tileDeltaY = Math.floor(-deltaY / 48);
      
      if (tileDeltaX !== 0 || tileDeltaY !== 0) {
        this.scrollViewport(tileDeltaX, tileDeltaY);
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
      }
    }
  }

  private onMouseUp(): void {
    this.isDragging = false;
  }

  private scrollViewport(deltaX: number, deltaY: number): void {
    const mapWidth = this.map[0].length;
    const mapHeight = this.map.length;
    
    this.viewportX = Math.max(0, Math.min(mapWidth - this.viewportWidth, this.viewportX + deltaX));
    this.viewportY = Math.max(0, Math.min(mapHeight - this.viewportHeight, this.viewportY + deltaY));
    
    this.redraw();
  }

  endTurn(): void {
    this.turnEngine.endTurn(this.player.heroes);
  }

}