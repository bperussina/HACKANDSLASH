import * as THREE from 'three';
import type { Entity } from '../core/World.ts';

export class AnimationSystem {
  private clock = 0;

  step(hero: Entity, dummy: Entity, heroGroup: THREE.Object3D, dummyGroup: THREE.Object3D, dt: number): void {
    this.clock += dt;
    const moving = hero.shotgunState !== 'startup';
    const bob = Math.sin(this.clock * 8) * 0.03;
    heroGroup.position.y = moving ? bob : 0;

    if (hero.shotgunState === 'startup' || hero.shotgunState === 'active') {
      heroGroup.rotation.x = -0.08;
    } else if (hero.slashState === 'startup' || hero.slashState === 'active') {
      heroGroup.rotation.z = 0.18;
    } else {
      heroGroup.rotation.x = 0;
      heroGroup.rotation.z = 0;
    }

    dummyGroup.rotation.y = Math.sin(this.clock * 0.7) * 0.08;
    dummyGroup.position.y = (dummy.flinchTimer ?? 0) > 0 ? 0.08 : 0;
  }
}
