import { WOUND } from '../core/Constants.ts';
import type { Entity } from '../core/World.ts';
import type { InputSample } from './InputSystem.ts';

export class MovementSystem {
  step(hero: Entity, input: InputSample, dt: number): void {
    if (!hero.alive) return;
    const speed = hero.moveSpeed ?? 0;
    hero.position.x += input.moveX * speed * dt;
    hero.position.z += input.moveZ * speed * dt;

    const limit = WOUND.SIZE / 2 - 1.4;
    hero.position.x = Math.max(-limit, Math.min(limit, hero.position.x));
    hero.position.z = Math.max(-limit, Math.min(limit, hero.position.z));

    const aimLen = Math.hypot(input.aimX, input.aimZ);
    const moveLen = Math.hypot(input.moveX, input.moveZ);
    if (aimLen > 0.05) {
      hero.facing = Math.atan2(input.aimX, input.aimZ);
    } else if (moveLen > 0.05) {
      hero.facing = Math.atan2(input.moveX, input.moveZ);
    }
  }
}
