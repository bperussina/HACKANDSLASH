import type { Entity } from '../core/World.ts';
import { vec3 } from '../core/World.ts';
import { DEMOLISHER, SHOTGUN, SLASH } from '../core/Constants.ts';

export function spawnDemolisher(): Entity {
  return {
    kind: 'demolisher',
    position: vec3(0, 0, 6),
    facing: Math.PI,
    moveSpeed: DEMOLISHER.SPEED,
    health: DEMOLISHER.HEALTH,
    maxHealth: DEMOLISHER.HEALTH,
    shotgunDamage: DEMOLISHER.SHOTGUN_DAMAGE,
    coneRange: SHOTGUN.RANGE,
    coneSpread: SHOTGUN.SPREAD,
    slashDamage: DEMOLISHER.SLASH_DAMAGE,
    slashRange: SLASH.RANGE,
    slashArc: SLASH.ARC,
    shotgunState: 'idle',
    slashState: 'idle',
    shotgunTimer: 0,
    slashTimer: 0,
    hurtLock: 0,
    executeState: 'idle',
    silhouetteStage: 0,
    alive: true,
  };
}
