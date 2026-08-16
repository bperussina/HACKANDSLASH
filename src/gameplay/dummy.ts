import type { Entity } from '../core/World.ts';
import { vec3 } from '../core/World.ts';
import { WOUND } from '../core/Constants.ts';

export function spawnDummy(): Entity {
  return {
    kind: 'dummy',
    position: vec3(WOUND.DUMMY_X, 0, WOUND.DUMMY_Z),
    facing: 0,
    health: 9999,
    maxHealth: 9999,
    alive: true,
    flinchTimer: 0,
  };
}
