import type { Entity, WeaponState } from '../core/World.ts';
import { DEMOLISHER, FODDER, SHOTGUN, SLASH, WOUND } from '../core/Constants.ts';
import { eventBus, Events } from '../core/EventBus.ts';
import { gameState } from '../core/GameState.ts';
import type { InputSample } from './InputSystem.ts';
import { pickSameFrameAction, shotgunHits } from '../gameplay/shotgun.ts';
import { slashHits } from '../gameplay/slash.ts';

function advanceWeapon(
  state: WeaponState,
  timer: number,
  dt: number,
  startup: number,
  active: number,
  recovery: number,
): { state: WeaponState; timer: number; justActive: boolean } {
  if (state === 'idle') return { state, timer: 0, justActive: false };
  let nextTimer = timer - dt;
  let nextState: WeaponState = state;
  let justActive = false;
  if (nextTimer <= 0) {
    if (state === 'startup') {
      nextState = 'active';
      nextTimer = active;
      justActive = true;
    } else if (state === 'active') {
      nextState = 'recovery';
      nextTimer = recovery;
    } else {
      nextState = 'idle';
      nextTimer = 0;
    }
  }
  return { state: nextState, timer: nextTimer, justActive };
}

function livingFodder(enemies: Entity[]): Entity[] {
  return enemies.filter((enemy) => enemy.kind === 'fodder' && enemy.alive);
}

export class CombatSystem {
  step(hero: Entity, dummy: Entity, input: InputSample, dt: number, enemies: Entity[] = []): void {
    if (!hero.alive) return;

    hero.hurtLock = Math.max(0, (hero.hurtLock ?? 0) - dt);
    dummy.flinchTimer = Math.max(0, (dummy.flinchTimer ?? 0) - dt);

    for (const enemy of enemies) {
      enemy.flinchTimer = Math.max(0, (enemy.flinchTimer ?? 0) - dt);
      if (!enemy.alive) {
        enemy.deathFlash = Math.max(0, (enemy.deathFlash ?? 0) - dt);
        continue;
      }
      const swing = advanceWeapon(
        enemy.attackState ?? 'idle',
        enemy.attackTimer ?? 0,
        dt,
        FODDER.STARTUP,
        FODDER.ACTIVE,
        FODDER.RECOVERY,
      );
      enemy.attackState = swing.state;
      enemy.attackTimer = swing.timer;
      if (swing.justActive) this.tryHitHero(hero, enemy);
    }

    const facing = hero.facing ?? 0;
    const inBlade =
      slashHits(hero.position, facing, dummy.position) ||
      livingFodder(enemies).some((enemy) => slashHits(hero.position, facing, enemy.position));
    const action = pickSameFrameAction(input.shootPressed, input.slashPressed, inBlade);

    if (action === 'shoot' && hero.shotgunState === 'idle') {
      hero.shotgunState = 'startup';
      hero.shotgunTimer = SHOTGUN.STARTUP;
    } else if (action === 'slash' && hero.slashState === 'idle') {
      hero.slashState = 'startup';
      hero.slashTimer = SLASH.STARTUP;
    }

    const gun = advanceWeapon(
      hero.shotgunState ?? 'idle',
      hero.shotgunTimer ?? 0,
      dt,
      SHOTGUN.STARTUP,
      SHOTGUN.ACTIVE,
      SHOTGUN.RECOVERY,
    );
    hero.shotgunState = gun.state;
    hero.shotgunTimer = gun.timer;
    if (gun.justActive) {
      eventBus.emit(Events.playerShoot, { facing: hero.facing, damage: hero.shotgunDamage });
      if (shotgunHits(hero.position, facing, dummy.position)) {
        dummy.flinchTimer = 0.22;
        eventBus.emit(Events.dummyHit, { amount: hero.shotgunDamage, weapon: 'shotgun' });
      }
      for (const enemy of livingFodder(enemies)) {
        if (shotgunHits(hero.position, facing, enemy.position)) {
          this.hurtEnemy(enemy, hero.shotgunDamage ?? DEMOLISHER.SHOTGUN_DAMAGE);
        }
      }
    }

    const blade = advanceWeapon(
      hero.slashState ?? 'idle',
      hero.slashTimer ?? 0,
      dt,
      SLASH.STARTUP,
      SLASH.ACTIVE,
      SLASH.RECOVERY,
    );
    hero.slashState = blade.state;
    hero.slashTimer = blade.timer;
    if (blade.justActive) {
      eventBus.emit(Events.playerSlash, { facing: hero.facing, damage: hero.slashDamage });
      if (slashHits(hero.position, facing, dummy.position)) {
        dummy.flinchTimer = 0.22;
        eventBus.emit(Events.dummyHit, { amount: hero.slashDamage, weapon: 'slash' });
      }
      for (const enemy of livingFodder(enemies)) {
        if (slashHits(hero.position, facing, enemy.position)) {
          this.hurtEnemy(enemy, hero.slashDamage ?? DEMOLISHER.SLASH_DAMAGE);
        }
      }
    }
  }

  inArena(x: number, z: number): boolean {
    const limit = WOUND.SIZE / 2 - 1.2;
    return Math.abs(x) <= limit && Math.abs(z) <= limit;
  }

  private tryHitHero(hero: Entity, enemy: Entity): void {
    if (!hero.alive) return;
    const dx = hero.position.x - enemy.position.x;
    const dz = hero.position.z - enemy.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > (enemy.meleeRange ?? FODDER.MELEE_RANGE)) return;
    if ((hero.hurtLock ?? 0) > 0) return;

    const amount = enemy.meleeDamage ?? FODDER.DAMAGE;
    hero.health = Math.max(0, (hero.health ?? 0) - amount);
    hero.hurtLock = DEMOLISHER.HURT_LOCK;
    eventBus.emit(Events.playerHit, { amount, sourceId: enemy.id });
    gameState.patch({ heroHealth: hero.health ?? 0 });
    if ((hero.health ?? 0) <= 0) {
      hero.alive = false;
      gameState.patch({ heroAlive: false });
      eventBus.emit(Events.playerDied, {
        wave: gameState.current.waveIndex,
        kills: gameState.current.kills,
      });
    }
  }

  private hurtEnemy(enemy: Entity, amount: number): void {
    if (!enemy.alive) return;
    enemy.health = (enemy.health ?? 0) - amount;
    enemy.flinchTimer = 0.18;
    eventBus.emit(Events.enemyHit, { id: enemy.id, amount });
    if ((enemy.health ?? 0) > 0) return;
    enemy.health = 0;
    enemy.alive = false;
    enemy.attackState = 'idle';
    enemy.attackTimer = 0;
    enemy.deathFlash = FODDER.DEATH_FLASH;
    gameState.patch({ kills: gameState.current.kills + 1 });
    eventBus.emit(Events.enemyDied, {
      id: enemy.id,
      waveIndex: enemy.waveIndex ?? 1,
      executed: false,
    });
  }
}
