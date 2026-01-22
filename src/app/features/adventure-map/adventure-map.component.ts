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
    this.map = this.mapGenerator.generate(24, 16);
    this.objects = this.objectGenerator.generate(this.map);
    this.objectWalkability.applyObjects(this.map, this.objects)

    // Initialize player with starting hero and resources
    const firstHero: Hero = {tile: this.map[5][5], name: 'First Hero', level: 1, movementPoints: 10, maxMovementPoints: 10, path: [], facing:HeroOrientation.West};
    
    this.player = {
      heroes: [firstHero],
      selectedHeroIndex: 0,
      resources: {
        gold: 10000,
        wood: 20,
        stone: 20
      }
    };

    this.turn$ = this.turnEngine.turnState$.pipe(
        map(state => state.currentTurn)
      );

    this.movement$ = this.movementState.movement$;

    this.movementPercent$ = this.movement$.pipe(map(movement => Math.round((movement / this.player.heroes[this.player.selectedHeroIndex].maxMovementPoints) * 100)));

    this.gameTime$ = this.gameClock.time$;

    this.movementState.initialize(this.player.heroes[this.player.selectedHeroIndex]);
  }

  ngAfterViewInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d')!;
    this.renderer.initialize(ctx);

    this.eventBus.on('heroMoved').subscribe(() => this.redraw());

    this.canvas.nativeElement.addEventListener('click', e => this.onClick(e));
    this.canvas.nativeElement.addEventListener('dblclick', e => this.onDoubleClick(e));

    this.redraw();
  }

  private onClick(event: MouseEvent): void {
    const tile = this.getTileFromMouse(event);
    if (!tile) return;

    this.heroMovement.setDestination(this.player.heroes[this.player.selectedHeroIndex], tile, this.map);

    this.redraw();
  }

  private async onDoubleClick(event: MouseEvent): Promise<void> {
    await this.heroMovement.executePlannedMovement(this.player.heroes[this.player.selectedHeroIndex], async () => {
      this.redraw();
      // yield control so browser can paint
      await new Promise(requestAnimationFrame);
    });
  }

  private redraw(): void {
    this.renderer.draw(this.map, this.objects, this.player.heroes[this.player.selectedHeroIndex]);
  }

  private getTileFromMouse(event: MouseEvent): Tile | null {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) /48);
    const y = Math.floor((event.clientY - rect.top) / 48);
    return this.map[y]?.[x] ?? null;
  }

  endTurn(): void {
    this.turnEngine.endTurn(this.player.heroes);
  }

}