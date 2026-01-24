import { AfterViewInit, ViewChild, ElementRef, Component, OnDestroy } from "@angular/core";
import { combineLatest, map, Observable, Subscription, BehaviorSubject } from "rxjs";
import { Tile } from "../../core/models/terrain/tile.model";
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
import { ViewportService } from "../../core/services/viewport/viewport.service";
import { EdgeScrollController } from "../../core/services/viewport/edge-scroll-controller.service";
import { CursorManagerService } from "../../core/services/viewport/cursor-manager.service";

@Component({
  selector: 'app-adventure-map',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './adventure-map.component.html',
  styleUrls: ['./adventure-map.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdventureMapComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  map!: Tile[][];
  objects!: MapObject[];
  player!: Player;

  // Reactive bindings
  turn$: Observable<number>;
  readonly movement$: Observable<number>;
  readonly movementPercent$: Observable<number>;
  readonly gameTime$: Observable<GameTime>;
  readonly isMoving$: Observable<boolean>;
  readonly hasPath$: Observable<boolean>;

  // Map dimensions (increased from 24x16 to 48x32)
  private readonly MAP_WIDTH = 48;
  private readonly MAP_HEIGHT = 32;
  
  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];
  
  // BehaviorSubject to track if hero has a path
  private hasPathSubject = new BehaviorSubject<boolean>(false);
  
  // Event listeners for cleanup
  private boundOnClick!: (e: MouseEvent) => void;
  private boundOnDoubleClick!: (e: MouseEvent) => Promise<void>;
  private boundOnMouseMove!: (e: MouseEvent) => void;
  private boundOnMouseLeave!: () => void;

  constructor(
      private mapGenerator: MapGeneratorService,
      private objectGenerator: MapObjectGeneratorService,
      private objectWalkability: ObjectWalkabilityService,
      private heroMovement: HeroMovementService,
      private renderer: CanvasRendererService,
      private movementState: HeroMovementStateService,
      private turnEngine: TurnEngineService,
      private gameClock: GameClockService,
      private viewport: ViewportService,
      private edgeScroll: EdgeScrollController,
      private cursorManager: CursorManagerService
    ) 
    
  {
    // this sequence must be reworked
    this.map = this.mapGenerator.generate(this.MAP_WIDTH, this.MAP_HEIGHT);
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

    this.isMoving$ = this.heroMovement.isMoving$;

    this.hasPath$ = this.hasPathSubject.asObservable();

    this.movementState.initialize(this.player.selectedHero);
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    this.renderer.initialize(ctx);
    
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;

    // Initialize viewport with canvas and map dimensions
    this.viewport.initialize(canvasWidth, canvasHeight, this.MAP_WIDTH, this.MAP_HEIGHT);
    
    // Center camera on hero initially
    this.viewport.centerOnTile(this.player.selectedHero.tile.x, this.player.selectedHero.tile.y);

    // Bind event listeners for proper cleanup
    this.boundOnClick = (e: MouseEvent) => this.onClick(e);
    this.boundOnDoubleClick = (e: MouseEvent) => this.onDoubleClick(e);
    this.boundOnMouseMove = (e: MouseEvent) => this.onMouseMove(e);
    this.boundOnMouseLeave = () => this.onMouseLeave();

    this.canvas.nativeElement.addEventListener('click', this.boundOnClick);
    this.canvas.nativeElement.addEventListener('dblclick', this.boundOnDoubleClick);
    this.canvas.nativeElement.addEventListener('mousemove', this.boundOnMouseMove);
    this.canvas.nativeElement.addEventListener('mouseleave', this.boundOnMouseLeave);

    // Subscribe to camera changes to trigger redraw
    // Use combineLatest to avoid duplicate redraws when both X and Y change simultaneously
    this.subscriptions.push(
      combineLatest([this.viewport.cameraX, this.viewport.cameraY]).subscribe(() => this.redraw())
    );
  }

  private onClick(event: MouseEvent): void {
    const tile = this.getTileFromMouse(event);
    if (!tile) return;

    this.heroMovement.setDestination(this.player.selectedHero, tile, this.map);
    
    // Update hasPath observable
    this.hasPathSubject.next(this.player.selectedHero.path.length > 0);

    this.redraw();
  }

  private async onDoubleClick(event: MouseEvent): Promise<void> {
    await this.heroMovement.executePlannedMovement(this.player.selectedHero, async () => {
      this.redraw();
      // yield control so browser can paint
      await new Promise(requestAnimationFrame);
    });
    
    // Update hasPath observable after movement completes
    this.hasPathSubject.next(this.player.selectedHero.path.length > 0);
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const scrollDirection = this.edgeScroll.updateMousePosition(
      mouseX, 
      mouseY, 
      this.canvas.nativeElement.width, 
      this.canvas.nativeElement.height
    );
    
    this.cursorManager.applyCursor(this.canvas.nativeElement, scrollDirection);
  }

  private onMouseLeave(): void {
    this.edgeScroll.updateMousePosition(-100, -100, 0, 0); // Stop scrolling
    this.cursorManager.resetCursor(this.canvas.nativeElement);
  }

  private redraw(): void {
    this.renderer.draw(this.map, this.objects, this.player.selectedHero);
  }

  private getTileFromMouse(event: MouseEvent): Tile | null {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;
    
    // Convert screen coordinates to world coordinates
    const worldPos = this.viewport.screenToWorld(screenX, screenY);
    const tileSize = 48; // Same as ViewportService.TILE_SIZE and CanvasRendererService.tileSize
    const x = Math.floor(worldPos.x / tileSize);
    const y = Math.floor(worldPos.y / tileSize);
    
    return this.map[y]?.[x] ?? null;
  }

  endTurn(): void {
    this.turnEngine.endTurn(this.player.heroes);
  }

  async continueMovement(): Promise<void> {
    await this.heroMovement.executePlannedMovement(this.player.selectedHero, async () => {
      this.redraw();
      // yield control so browser can paint
      await new Promise(requestAnimationFrame);
    });
    
    // Update hasPath observable after movement completes
    this.hasPathSubject.next(this.player.selectedHero.path.length > 0);
  }

  ngOnDestroy(): void {
    this.edgeScroll.disable();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Complete BehaviorSubject to prevent memory leaks
    this.hasPathSubject.complete();
    
    // Remove event listeners
    if (this.canvas?.nativeElement) {
      this.canvas.nativeElement.removeEventListener('click', this.boundOnClick);
      this.canvas.nativeElement.removeEventListener('dblclick', this.boundOnDoubleClick);
      this.canvas.nativeElement.removeEventListener('mousemove', this.boundOnMouseMove);
      this.canvas.nativeElement.removeEventListener('mouseleave', this.boundOnMouseLeave);
    }
  }

}
