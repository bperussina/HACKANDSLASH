import type { Entity } from '../core/World.ts';

export type Pool<T> = {
  acquire: () => T;
  release: (item: T) => void;
  drain: () => T[];
};

export function createPool<T>(factory: () => T): Pool<T> {
  const free: T[] = [];
  return {
    acquire() {
      return free.pop() ?? factory();
    },
    release(item) {
      free.push(item);
    },
    drain() {
      const all = free.splice(0, free.length);
      return all;
    },
  };
}

export const blastPool = createPool<Entity>(() => ({
  kind: 'blast',
  position: { x: 0, y: 0, z: 0 },
  facing: 0,
  remaining: 0,
  damage: 0,
  hitIds: new Set(),
}));

export const slashPool = createPool<Entity>(() => ({
  kind: 'slash',
  position: { x: 0, y: 0, z: 0 },
  facing: 0,
  remaining: 0,
  damage: 0,
  hitIds: new Set(),
}));

export const fodderPool = createPool<Entity>(() => ({
  kind: 'fodder',
  fodderKind: 'imp',
  position: { x: 0, y: 0, z: 0 },
  facing: 0,
  alive: false,
  health: 0,
  maxHealth: 0,
}));

export function resetFodder(entity: Entity): void {
  entity.kind = 'fodder';
  entity.fodderKind = 'imp';
  entity.position.x = 0;
  entity.position.y = 0;
  entity.position.z = 0;
  entity.facing = 0;
  entity.moveSpeed = 0;
  entity.radius = 0;
  entity.height = 0;
  entity.health = 0;
  entity.maxHealth = 0;
  entity.attackState = 'idle';
  entity.attackTimer = 0;
  entity.meleeRange = 0;
  entity.meleeDamage = 0;
  entity.waveIndex = 1;
  entity.alive = false;
  entity.flinchTimer = 0;
  entity.deathFlash = 0;
}
