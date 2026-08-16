import { FODDER, WAVE, WOUND } from '../core/Constants.ts';
import type { Entity, FodderKind } from '../core/World.ts';
import { nextEntityId } from '../core/World.ts';
import { fodderPool, resetFodder } from './pools.ts';

export type { FodderKind };

export function acquireFodder(kind: FodderKind, x: number, z: number, waveIndex = 1): Entity {
  const entity = fodderPool.acquire();
  resetFodder(entity);
  const mutt = kind === 'mutt';
  entity.id = nextEntityId();
  entity.kind = 'fodder';
  entity.fodderKind = kind;
  entity.position.x = x;
  entity.position.y = 0;
  entity.position.z = z;
  entity.facing = 0;
  entity.moveSpeed = mutt ? FODDER.MUTT_SPEED : FODDER.SPEED;
  entity.radius = mutt ? FODDER.MUTT_RADIUS : FODDER.RADIUS;
  entity.height = FODDER.HEIGHT;
  entity.health = mutt ? FODDER.MUTT_HEALTH : FODDER.HEALTH;
  entity.maxHealth = entity.health;
  entity.attackState = 'idle';
  entity.attackTimer = 0;
  entity.meleeRange = FODDER.MELEE_RANGE;
  entity.meleeDamage = mutt ? FODDER.MUTT_DAMAGE : FODDER.DAMAGE;
  entity.waveIndex = waveIndex;
  entity.alive = true;
  entity.flinchTimer = 0;
  entity.deathFlash = 0;
  return entity;
}

export function releaseFodder(entity: Entity): void {
  resetFodder(entity);
  fodderPool.release(entity);
}

export function spawnWoundPack(hero: Entity): Entity[] {
  const spots: Array<{ kind: FodderKind; x: number; z: number }> = [
    { kind: 'imp', x: 11, z: 7 },
    { kind: 'imp', x: -11, z: 5 },
    { kind: 'mutt', x: 10, z: -3 },
    { kind: 'imp', x: -10, z: -5 },
    { kind: 'mutt', x: 6, z: -16 },
    { kind: 'imp', x: -6, z: -15 },
  ];
  const pack: Entity[] = [];
  for (const spot of spots) {
    const dist = Math.hypot(spot.x - hero.position.x, spot.z - hero.position.z);
    if (dist < WAVE.SPAWN_SAFE_RADIUS) continue;
    pack.push(acquireFodder(spot.kind, spot.x, spot.z, 1));
  }
  return pack;
}

export function stepFodder(fodder: Entity, hero: Entity, dt: number): void {
  if (!fodder.alive || !hero.alive) return;

  const dx = hero.position.x - fodder.position.x;
  const dz = hero.position.z - fodder.position.z;
  const dist = Math.hypot(dx, dz) || 0.0001;
  fodder.facing = Math.atan2(dx, dz);

  const melee = fodder.meleeRange ?? FODDER.MELEE_RANGE;
  const winding = fodder.attackState !== undefined && fodder.attackState !== 'idle';
  if (winding) return;

  if (dist <= melee) {
    fodder.attackState = 'startup';
    fodder.attackTimer = FODDER.STARTUP;
    return;
  }

  const speed = fodder.moveSpeed ?? FODDER.SPEED;
  const stop = melee * 0.82;
  const step = Math.min(speed * dt, Math.max(0, dist - stop));
  fodder.position.x += (dx / dist) * step;
  fodder.position.z += (dz / dist) * step;

  const limit = WOUND.SIZE / 2 - 1.4;
  fodder.position.x = Math.max(-limit, Math.min(limit, fodder.position.x));
  fodder.position.z = Math.max(-limit, Math.min(limit, fodder.position.z));
}

export function separateFodder(pack: Entity[]): void {
  const live = pack.filter((entity) => entity.alive);
  for (let i = 0; i < live.length; i += 1) {
    for (let j = i + 1; j < live.length; j += 1) {
      const a = live[i]!;
      const b = live[j]!;
      const dx = b.position.x - a.position.x;
      const dz = b.position.z - a.position.z;
      const dist = Math.hypot(dx, dz);
      const min = (a.radius ?? FODDER.RADIUS) + (b.radius ?? FODDER.RADIUS);
      if (dist < 0.001 || dist >= min) continue;
      const push = (min - dist) * 0.5;
      const nx = dx / dist;
      const nz = dz / dist;
      a.position.x -= nx * push;
      a.position.z -= nz * push;
      b.position.x += nx * push;
      b.position.z += nz * push;
    }
  }
}
