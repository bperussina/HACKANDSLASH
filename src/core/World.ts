import { World } from 'miniplex';

export type Vec3 = { x: number; y: number; z: number };
export type WeaponState = 'idle' | 'startup' | 'active' | 'recovery';
export type ExecuteState = 'idle' | 'ripping';

export type FodderKind = 'imp' | 'mutt';

export type Entity = {
  id?: number;
  kind?: 'demolisher' | 'dummy' | 'fodder' | 'champion' | 'blast' | 'slash' | 'trophy';
  fodderKind?: FodderKind;
  position: Vec3;
  facing?: number;
  moveSpeed?: number;
  radius?: number;
  height?: number;
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
  attackState?: WeaponState;
  attackTimer?: number;
  meleeRange?: number;
  meleeDamage?: number;
  hurtLock?: number;
  executeState?: ExecuteState;
  silhouetteStage?: number;
  waveIndex?: number;
  alive?: boolean;
  flinchTimer?: number;
  deathFlash?: number;
  range?: number;
  spread?: number;
  arcRadians?: number;
  damage?: number;
  hitIds?: Set<Entity>;
  remaining?: number;
  owner?: Entity;
};

let nextId = 1;

export function nextEntityId(): number {
  const id = nextId;
  nextId += 1;
  return id;
}

export function createWorld(): World<Entity> {
  return new World<Entity>();
}

export function vec3(x = 0, y = 0, z = 0): Vec3 {
  return { x, y, z };
}
