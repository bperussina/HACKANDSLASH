import { SLASH } from '../core/Constants.ts';
import type { Vec3 } from '../core/World.ts';
import { pointInArc } from './shotgun.ts';

export function slashHits(origin: Vec3, facing: number, target: Vec3): boolean {
  return pointInArc(origin, facing, SLASH.RANGE, SLASH.ARC, target);
}
