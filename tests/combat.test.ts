import { describe, expect, it } from 'vitest';
import { pickSameFrameAction, shotgunHits } from '../src/gameplay/shotgun.ts';
import { slashHits } from '../src/gameplay/slash.ts';
import { CombatSystem } from '../src/systems/CombatSystem.ts';
import { spawnDemolisher } from '../src/gameplay/demolisher.ts';
import { spawnDummy } from '../src/gameplay/dummy.ts';
import { EMPTY_INPUT, type InputSample } from '../src/systems/InputSystem.ts';
import { SHOTGUN, SLASH } from '../src/core/Constants.ts';
import { eventBus, Events } from '../src/core/EventBus.ts';

function press(partial: Partial<InputSample>): InputSample {
  return { ...EMPTY_INPUT, ...partial };
}

describe('shotgun cone', () => {
  it('hits a target inside the cone', () => {
    expect(shotgunHits({ x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 6 })).toBe(true);
  });

  it('misses a target outside the cone', () => {
    expect(shotgunHits({ x: 0, y: 0, z: 0 }, 0, { x: 10, y: 0, z: 1 })).toBe(false);
  });
});

describe('slash arc', () => {
  it('hits a target inside the arc', () => {
    expect(slashHits({ x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: 2 })).toBe(true);
  });

  it('misses a target outside the arc', () => {
    expect(slashHits({ x: 0, y: 0, z: 0 }, 0, { x: 0, y: 0, z: -2 })).toBe(false);
  });
});

describe('same-frame rule', () => {
  it('prefers slash when a target is in blade range', () => {
    expect(pickSameFrameAction(true, true, true)).toBe('slash');
  });

  it('prefers shoot when nothing is in blade range', () => {
    expect(pickSameFrameAction(true, true, false)).toBe('shoot');
  });
});

describe('weapon recovery', () => {
  it('ignores extra shoot presses during recovery', () => {
    const hero = spawnDemolisher();
    const dummy = spawnDummy();
    dummy.position = { x: 0, y: 0, z: 0 };
    hero.position = { x: 0, y: 0, z: 6 };
    hero.facing = Math.PI;
    const combat = new CombatSystem();
    let shots = 0;
    eventBus.on(Events.playerShoot, () => {
      shots += 1;
    });
    combat.step(hero, dummy, press({ shootPressed: true }), SHOTGUN.STARTUP);
    combat.step(hero, dummy, press({ shootPressed: true }), SHOTGUN.ACTIVE);
    combat.step(hero, dummy, press({ shootPressed: true }), SHOTGUN.RECOVERY / 2);
    expect(shots).toBe(1);
    expect(hero.shotgunState).toBe('recovery');
    eventBus.clear();
  });

  it('ignores extra slash presses during recovery', () => {
    const hero = spawnDemolisher();
    const dummy = spawnDummy();
    hero.position = { x: 0, y: 0, z: -6 };
    dummy.position = { x: 0, y: 0, z: -8 };
    hero.facing = Math.PI;
    const combat = new CombatSystem();
    let slashes = 0;
    eventBus.on(Events.playerSlash, () => {
      slashes += 1;
    });
    combat.step(hero, dummy, press({ slashPressed: true }), SLASH.STARTUP);
    combat.step(hero, dummy, press({ slashPressed: true }), SLASH.ACTIVE);
    combat.step(hero, dummy, press({ slashPressed: true }), SLASH.RECOVERY / 2);
    expect(slashes).toBe(1);
    eventBus.clear();
  });
});
