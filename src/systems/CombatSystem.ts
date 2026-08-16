import type { Entity, WeaponState } from '../core/World.ts';
import { SHOTGUN, SLASH, WOUND } from '../core/Constants.ts';
import { eventBus, Events } from '../core/EventBus.ts';
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

export class CombatSystem {
  step(hero: Entity, dummy: Entity, input: InputSample, dt: number): void {
    if (!hero.alive) return;

    dummy.flinchTimer = Math.max(0, (dummy.flinchTimer ?? 0) - dt);

    const inBlade = slashHits(hero.position, hero.facing ?? 0, dummy.position);
    const action = pickSameFrameAction(input.shootPressed, input.slashPressed, inBlade);

    if (action === 'shoot' && hero.shotgunState === 'idle') {
      hero.shotgunState = 'startup';
      hero.shotgunTimer = SHOTGUN.STARTUP;
    } else if (action === 'slash' && hero.slashState === 'idle') {
      hero.slashState = 'startup';
      hero.slashTimer = SLASH.STARTUP;
    } else if (input.shootPressed && action === 'shoot' && hero.shotgunState !== 'idle') {
      // recovery ignore
    } else if (input.slashPressed && action === 'slash' && hero.slashState !== 'idle') {
      // recovery ignore
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
      if (shotgunHits(hero.position, hero.facing ?? 0, dummy.position)) {
        dummy.flinchTimer = 0.22;
        eventBus.emit(Events.dummyHit, { amount: hero.shotgunDamage, weapon: 'shotgun' });
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
      if (slashHits(hero.position, hero.facing ?? 0, dummy.position)) {
        dummy.flinchTimer = 0.22;
        eventBus.emit(Events.dummyHit, { amount: hero.slashDamage, weapon: 'slash' });
      }
    }
  }

  inArena(x: number, z: number): boolean {
    const limit = WOUND.SIZE / 2 - 1.2;
    return Math.abs(x) <= limit && Math.abs(z) <= limit;
  }
}
