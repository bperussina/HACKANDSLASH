import { AIM_DEADZONE, WOUND } from '../core/Constants.ts';
import type { CameraMode } from '../core/GameState.ts';
import type { Entity } from '../core/World.ts';
import { wrapAngle } from '../gameplay/shotgun.ts';
import type { InputSample } from './InputSystem.ts';

export function applyFacing(
  hero: Entity,
  mode: CameraMode,
  lookDelta: number,
  aimX: number,
  aimZ: number,
): void {
  if (mode === 'ots') {
    if (lookDelta === 0) return;
    hero.facing = wrapAngle((hero.facing ?? 0) + lookDelta);
    return;
  }
  const aimLen = Math.hypot(aimX, aimZ);
  if (aimLen >= AIM_DEADZONE) {
    hero.facing = Math.atan2(aimX, aimZ);
  }
}

export class MovementSystem {
  step(hero: Entity, input: InputSample, dt: number): void {
    if (!hero.alive) return;
    const speed = hero.moveSpeed ?? 0;
    hero.position.x += input.moveX * speed * dt;
    hero.position.z += input.moveZ * speed * dt;

    const limit = WOUND.SIZE / 2 - 1.4;
    hero.position.x = Math.max(-limit, Math.min(limit, hero.position.x));
    hero.position.z = Math.max(-limit, Math.min(limit, hero.position.z));
  }
}
