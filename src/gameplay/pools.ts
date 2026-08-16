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
