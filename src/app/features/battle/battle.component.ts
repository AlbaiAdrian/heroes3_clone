// features/battle/battle.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../../core/services/game/game-engine.service';
import { BattleStateService } from '../../core/services/battle/battle-state.service';
import { BattleService } from '../../core/services/battle/battle.service';
import { BattleState } from '../../core/models/battle/battle-state.model';
import { BattleUnit } from '../../core/models/battle/battle-unit.model';
import { BattleResult } from '../../core/models/battle/battle-result.enum';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-battle',
  imports: [CommonModule],
  template: `
    <section class="battle" *ngIf="state">
      <h2>Battle — Round {{ state.round }}</h2>

      <div class="battlefield">
        <div class="army attacker-army">
          <h3>Attacker</h3>
          <div
            *ngFor="let unit of state.attackerUnits"
            class="unit-card"
            [class.dead]="unit.isDead"
            [class.active]="unit === currentUnit"
          >
            <strong>{{ unit.creatureType.name }}</strong>
            <span>Qty: {{ unit.quantity }}</span>
            <span>HP: {{ unit.currentHp }}/{{ unit.maxHp }}</span>
          </div>
        </div>

        <div class="battle-info">
          <div *ngIf="!state.result" class="turn-info">
            <p>
              Current turn:
              <strong>{{ currentUnit?.creatureType?.name }}</strong>
              ({{ currentUnit?.isAttacker ? 'Attacker' : 'Defender' }})
            </p>
            <p class="select-target" *ngIf="targets.length > 0">Select a target to attack:</p>
            <div class="targets">
              <button
                *ngFor="let target of targets"
                class="target-btn"
                (click)="attackTarget(target)"
              >
                Attack {{ target.creatureType.name }} ({{ target.quantity }})
              </button>
            </div>
          </div>

          <div *ngIf="state.result" class="result">
            <h3 class="result-title">{{ resultText }}</h3>
            <button class="end-btn" (click)="endBattle()">Return to Map</button>
          </div>

          <div class="battle-log">
            <h4>Battle Log</h4>
            <div class="log-entries">
              <p *ngFor="let entry of state.log">{{ entry }}</p>
            </div>
          </div>
        </div>

        <div class="army defender-army">
          <h3>Defender</h3>
          <div
            *ngFor="let unit of state.defenderUnits"
            class="unit-card"
            [class.dead]="unit.isDead"
            [class.active]="unit === currentUnit"
          >
            <strong>{{ unit.creatureType.name }}</strong>
            <span>Qty: {{ unit.quantity }}</span>
            <span>HP: {{ unit.currentHp }}/{{ unit.maxHp }}</span>
          </div>
        </div>
      </div>

      <button *ngIf="!state.result" class="retreat-btn" (click)="retreat()">Retreat</button>
    </section>
  `,
  styles: [
    `
      .battle {
        padding: 1rem;
        text-align: center;
        background: #1a1a2e;
        color: #eee;
        min-height: 100vh;
      }
      .battlefield {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin: 1rem auto;
        max-width: 900px;
      }
      .army {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .army h3 {
        margin-bottom: 0.5rem;
      }
      .attacker-army h3 { color: #4fc3f7; }
      .defender-army h3 { color: #ef5350; }
      .unit-card {
        padding: 0.5rem;
        border: 1px solid #555;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        background: #16213e;
      }
      .unit-card.dead {
        opacity: 0.4;
        text-decoration: line-through;
      }
      .unit-card.active {
        border-color: #ffd700;
        box-shadow: 0 0 6px #ffd700;
      }
      .battle-info {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .turn-info {
        padding: 0.5rem;
      }
      .select-target {
        margin-top: 0.5rem;
        font-style: italic;
      }
      .targets {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .target-btn {
        padding: 0.5rem;
        border: none;
        border-radius: 4px;
        background: #e65100;
        color: #fff;
        cursor: pointer;
        font-size: 0.9rem;
      }
      .target-btn:hover { background: #ff6d00; }
      .result {
        padding: 1rem;
        border: 2px solid #ffd700;
        border-radius: 8px;
        background: #0d1b2a;
      }
      .result-title { color: #ffd700; margin-bottom: 0.5rem; }
      .end-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #2e7d32;
        color: #fff;
        cursor: pointer;
        font-size: 1rem;
      }
      .end-btn:hover { background: #388e3c; }
      .retreat-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: #b71c1c;
        color: #fff;
        cursor: pointer;
        font-size: 1rem;
      }
      .retreat-btn:hover { background: #c62828; }
      .battle-log {
        text-align: left;
        max-height: 200px;
        overflow-y: auto;
        background: #0d1b2a;
        border-radius: 4px;
        padding: 0.5rem;
      }
      .battle-log h4 { margin-bottom: 0.5rem; }
      .log-entries p {
        margin: 0.15rem 0;
        font-size: 0.85rem;
        color: #aaa;
      }
    `,
  ],
})
export class BattleComponent implements OnInit, OnDestroy {
  state: BattleState | null = null;
  currentUnit: BattleUnit | null = null;
  targets: BattleUnit[] = [];
  resultText = '';

  private sub?: Subscription;

  constructor(
    private gameEngine: GameEngineService,
    private battleStateService: BattleStateService,
    private battleService: BattleService
  ) {}

  ngOnInit(): void {
    this.sub = this.battleStateService.state$.subscribe(state => {
      this.state = state;
      if (state) {
        this.currentUnit = this.battleService.getCurrentUnit(state);
        this.targets = this.currentUnit
          ? this.battleService.getValidTargets(state, this.currentUnit)
          : [];
        this.resultText = this.getResultText(state.result);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  attackTarget(target: BattleUnit): void {
    this.battleStateService.attack(target);
  }

  retreat(): void {
    if (this.state) {
      this.state.result = BattleResult.Retreat;
      this.state.log.push('Attacker retreats from battle!');
      this.resultText = this.getResultText(this.state.result);
    }
  }

  endBattle(): void {
    this.battleStateService.endBattle();
    this.gameEngine.returnToMap();
  }

  private getResultText(result: BattleResult | null): string {
    switch (result) {
      case BattleResult.AttackerWins: return 'Victory! The attacker wins!';
      case BattleResult.DefenderWins: return 'Defeat! The defender wins!';
      case BattleResult.Retreat: return 'The attacker has retreated!';
      default: return '';
    }
  }
}