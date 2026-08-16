import RAPIER from '@dimforge/rapier3d-compat';
import { WOUND } from '../core/Constants.ts';

export class PhysicsSystem {
  world: RAPIER.World | null = null;

  async init(): Promise<void> {
    await RAPIER.init();
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    const half = WOUND.SIZE / 2;
    const ground = RAPIER.ColliderDesc.cuboid(half, 0.5, half).setTranslation(0, -0.5, 0);
    this.world.createCollider(ground);

    const t = WOUND.WALL_THICKNESS / 2;
    const h = WOUND.WALL_HEIGHT / 2;
    const walls: Array<[number, number, number, number, number]> = [
      [half + t, h, half, half + t, 0],
      [half + t, h, half, -(half + t), 0],
      [half, h, t, 0, half + t],
      [half, h, t, 0, -(half + t)],
    ];
    for (const [hx, hy, hz, x, z] of walls) {
      this.world.createCollider(RAPIER.ColliderDesc.cuboid(hx, hy, hz).setTranslation(x, hy, z));
    }
  }

  step(dt: number): void {
    if (!this.world) return;
    this.world.timestep = dt;
    this.world.step();
  }

  dispose(): void {
    this.world?.free();
    this.world = null;
  }
}
