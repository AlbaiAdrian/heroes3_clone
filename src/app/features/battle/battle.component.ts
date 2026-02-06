// features/battle/battle.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';
import { BattleService } from '../../core/services/battle/battle.service';
import { BattleStateService } from '../../core/services/battle/battle-state.service';
import { BattleResult, BattleState } from '../../core/models/battle/battle-state.model';
import { GameSessionService } from '../../core/services/game/game-session.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-battle',
  imports: [CommonModule],
  template: `
    <section class="battle">
      <h2>⚔️ Battle</h2>

      <div class="armies">
        <div class="army attacker-army">
          <h3>Your Army</h3>
          <ul>
            @for (creature of state.attackerArmy; track creature.type.name) {
              <li>{{ creature.quantity }} × {{ creature.type.name }}</li>
            }
            @empty {
              <li class="empty">No troops</li>
            }
          </ul>
        </div>

        <div class="vs">VS</div>

        <div class="army defender-army">
          <h3>Enemy Army</h3>
          <ul>
            @for (creature of state.defenderArmy; track creature.type.name) {
              <li>{{ creature.quantity }} × {{ creature.type.name }}</li>
            }
            @empty {
              <li class="empty">No troops</li>
            }
          </ul>
        </div>
      </div>

      @if (state.result === 'PENDING') {
        <div class="actions">
          <button (click)="fight()">⚔️ Fight</button>
          <button (click)="flee()">🏃 Flee</button>
        </div>
      }

      @if (state.result !== 'PENDING') {
        <div class="result" [class.victory]="state.result === 'ATTACKER_WINS'"
             [class.defeat]="state.result === 'DEFENDER_WINS'">
          {{ state.result === 'ATTACKER_WINS' ? '🏆 Victory!' : '💀 Defeat!' }}
        </div>
        <button (click)="endBattle()">Return to Map</button>
      }

      <div class="battle-log">
        <h3>Battle Log</h3>
        <div class="log-entries">
          @for (entry of state.log; track $index) {
            <p>{{ entry.message }}</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .battle {
        padding: 2rem;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
      }
      .armies {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        margin: 1.5rem 0;
        gap: 1rem;
      }
      .army {
        flex: 1;
        padding: 1rem;
        border: 2px solid #555;
        border-radius: 8px;
        background: #1a1a2e;
        color: #eee;
      }
      .attacker-army { border-color: #4a9eff; }
      .defender-army { border-color: #ff4a4a; }
      .army ul {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0 0;
      }
      .army li { padding: 0.25rem 0; }
      .army li.empty { color: #888; font-style: italic; }
      .vs {
        font-size: 1.5rem;
        font-weight: bold;
        color: #ccc;
        align-self: center;
      }
      .actions {
        margin: 1rem 0;
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
      button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 4px;
        background: #4a9eff;
        color: white;
      }
      button:hover { background: #357abd; }
      .result {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 1rem 0;
      }
      .victory { color: #4aff4a; }
      .defeat { color: #ff4a4a; }
      .battle-log {
        margin-top: 1.5rem;
        text-align: left;
        max-height: 300px;
        overflow-y: auto;
        background: #111;
        padding: 1rem;
        border-radius: 8px;
        color: #ccc;
      }
      .battle-log h3 { margin: 0 0 0.5rem; color: #eee; }
      .log-entries p {
        margin: 0.15rem 0;
        font-size: 0.85rem;
        font-family: monospace;
      }
    `,
  ],
})
export class BattleComponent implements OnInit, OnDestroy {
  state: BattleState = {
    attackerArmy: [],
    defenderArmy: [],
    log: [],
    result: BattleResult.Pending,
  };

  private subscription!: Subscription;

  constructor(
    private gameEngine: GameEngineService,
    private battleService: BattleService,
    private battleStateService: BattleStateService,
    private gameSession: GameSessionService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.battleStateService.battleState$.subscribe(s => {
      this.state = s;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  fight(): void {
    const result = this.battleService.resolveBattle();

    if (result === BattleResult.AttackerWins) {
      this.applyVictory();
    } else {
      this.applyDefeat();
    }
  }

  flee(): void {
    this.battleStateService.addLogEntry({ message: '🏃 You fled the battle!' });
    this.endBattle();
  }

  endBattle(): void {
    this.battleStateService.clear();
    this.gameEngine.returnToMap();
  }

  private applyVictory(): void {
    const player = this.gameSession.getPlayer();
    if (!player) return;

    // Update hero's army with surviving troops
    const survivors = this.battleStateService.snapshot.attackerArmy;
    player.selectedHero.army = survivors.filter(c => c.quantity > 0);

    // Remove the defeated creature from the map
    const battleCreature = this.gameEngine.getBattleCreature();
    if (battleCreature) {
      const objects = this.gameSession.getObjects();
      const idx = objects.indexOf(battleCreature);
      if (idx !== -1) {
        objects.splice(idx, 1);
      }
    }
  }

  private applyDefeat(): void {
    // On defeat the hero's army is wiped out
    const player = this.gameSession.getPlayer();
    if (!player) return;
    player.selectedHero.army = [];
  }
}