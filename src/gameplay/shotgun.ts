import { SHOTGUN } from '../core/Constants.ts';
import type { Vec3 } from '../core/World.ts';

export function wrapAngle(angle: number): number {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

export function yawToDir(yaw: number): { x: number; z: number } {
  return { x: Math.sin(yaw), z: Math.cos(yaw) };
}

export function pointInCone(
  origin: Vec3,
  facing: number,
  range: number,
  spread: number,
  target: Vec3,
): boolean {
  const dx = target.x - origin.x;
  const dz = target.z - origin.z;
  const dist = Math.hypot(dx, dz);
  if (dist > range || dist < 0.05) return false;
  const angle = Math.atan2(dx, dz);
  return Math.abs(wrapAngle(angle - facing)) <= spread / 2;
}

export function pointInArc(
  origin: Vec3,
  facing: number,
  range: number,
  arc: number,
  target: Vec3,
): boolean {
  return pointInCone(origin, facing, range, arc, target);
}

export function pickSameFrameAction(
  shootPressed: boolean,
  slashPressed: boolean,
  inBladeRange: boolean,
): 'shoot' | 'slash' | null {
  if (shootPressed && slashPressed) return inBladeRange ? 'slash' : 'shoot';
  if (slashPressed) return 'slash';
  if (shootPressed) return 'shoot';
  return null;
}

export function shotgunHits(origin: Vec3, facing: number, target: Vec3): boolean {
  return pointInCone(origin, facing, SHOTGUN.RANGE, SHOTGUN.SPREAD, target);
}
