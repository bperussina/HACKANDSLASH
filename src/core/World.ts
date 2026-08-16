import { World } from 'miniplex';

export type Vec3 = { x: number; y: number; z: number };
export type WeaponState = 'idle' | 'startup' | 'active' | 'recovery';
export type ExecuteState = 'idle' | 'ripping';

export type Entity = {
  kind?: 'demolisher' | 'dummy' | 'fodder' | 'champion' | 'blast' | 'slash' | 'trophy';
  position: Vec3;
  facing?: number;
  moveSpeed?: number;
  health?: number;
  maxHealth?: number;
  shotgunDamage?: number;
  coneRange?: number;
  coneSpread?: number;
  slashDamage?: number;
  slashRange?: number;
  slashArc?: number;
  shotgunState?: WeaponState;
  slashState?: WeaponState;
  shotgunTimer?: number;
  slashTimer?: number;
  hurtLock?: number;
  executeState?: ExecuteState;
  silhouetteStage?: number;
  alive?: boolean;
  flinchTimer?: number;
  range?: number;
  spread?: number;
  arcRadians?: number;
  damage?: number;
  hitIds?: Set<Entity>;
  remaining?: number;
  owner?: Entity;
};

export function createWorld(): World<Entity> {
  return new World<Entity>();
}

export function vec3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}
