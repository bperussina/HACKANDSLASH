import * as THREE from 'three';
import { COLORS, DEMOLISHER } from '../core/Constants.ts';
import { eventBus, Events } from '../core/EventBus.ts';
import type { Entity } from '../core/World.ts';

function ironMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: COLORS.IRON,
    roughness: 0.62,
    metalness: 0.55,
    emissive: COLORS.IRON_RIM,
    emissiveIntensity: 0.18,
  });
}

export class PresentationSystem {
  readonly group = new THREE.Group();
  private heroMesh = new THREE.Group();
  private dummyMesh = new THREE.Group();
  private muzzle = new THREE.PointLight(COLORS.MUZZLE, 0, 8);
  private bladeFlash = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 10, 0, Math.PI * 0.7),
    new THREE.MeshBasicMaterial({
      color: COLORS.BLADE,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
  );
  private dummyMats: THREE.MeshStandardMaterial[] = [];
  private muzzleTime = 0;
  private bladeTime = 0;

  constructor() {
    this.heroMesh.add(this.buildDemolisher());
    this.dummyMesh.add(this.buildDummy());
    this.muzzle.position.set(0.55, 1.2, 0.9);
    this.heroMesh.add(this.muzzle);
    this.bladeFlash.rotation.x = -Math.PI / 2;
    this.bladeFlash.position.set(0, 1.05, 1.1);
    this.heroMesh.add(this.bladeFlash);
    this.group.add(this.heroMesh, this.dummyMesh);

    eventBus.on(Events.playerShoot, () => {
      this.muzzleTime = 0.08;
    });
    eventBus.on(Events.playerSlash, () => {
      this.bladeTime = 0.12;
    });
  }

  sync(hero: Entity, dummy: Entity, dt: number): void {
    this.heroMesh.position.set(hero.position.x, 0, hero.position.z);
    this.heroMesh.rotation.y = hero.facing ?? 0;
    this.dummyMesh.position.set(dummy.position.x, 0, dummy.position.z);

    const flinch = dummy.flinchTimer ?? 0;
    const punch = flinch > 0 ? 1 + Math.sin(flinch * 40) * 0.08 : 1;
    this.dummyMesh.scale.set(punch, punch, punch);
    for (const mat of this.dummyMats) {
      mat.emissiveIntensity = flinch > 0 ? 0.8 : 0.05;
    }

    this.muzzleTime = Math.max(0, this.muzzleTime - dt);
    this.muzzle.intensity = this.muzzleTime > 0 ? 18 : 0;
    this.bladeTime = Math.max(0, this.bladeTime - dt);
    const bladeMat = this.bladeFlash.material as THREE.MeshBasicMaterial;
    bladeMat.opacity = this.bladeTime > 0 ? 0.7 : 0;
  }

  dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of materials) mat.dispose();
      }
    });
  }

  private buildDemolisher(): THREE.Group {
    const root = new THREE.Group();
    const bodyMat = ironMaterial();
    const bladeMat = new THREE.MeshStandardMaterial({
      color: COLORS.BLADE,
      metalness: 0.8,
      roughness: 0.28,
    });
    const gunMat = new THREE.MeshStandardMaterial({
      color: 0x1a1410,
      metalness: 0.7,
      roughness: 0.4,
    });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.85, 4, 8), bodyMat);
    torso.position.y = DEMOLISHER.HEIGHT * 0.52;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), bodyMat);
    head.position.y = 1.72;
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 5), bodyMat);
    horn.position.set(0.12, 1.96, 0.05);
    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 1.15), gunMat);
    gun.position.set(0.52, 1.18, 0.55);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 1.05), bladeMat);
    blade.position.set(-0.58, 1.1, 0.45);
    root.add(torso, head, horn, gun, blade);
    return root;
  }

  private buildDummy(): THREE.Group {
    const root = new THREE.Group();
    const rust = new THREE.MeshStandardMaterial({
      color: COLORS.DUMMY,
      roughness: 0.9,
      metalness: 0.2,
      emissive: 0x3a1810,
      emissiveIntensity: 0.05,
    });
    this.dummyMats.push(rust);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.2, 6), rust);
    post.position.y = 1.6;
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.7, 4, 6), rust);
    body.position.set(0, 1.35, 0.15);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 5), rust);
    chain.position.set(0.2, 2.3, 0.1);
    root.add(post, body, chain);
    return root;
  }
}
