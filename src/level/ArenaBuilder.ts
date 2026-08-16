import * as THREE from 'three';
import { COLORS, WOUND } from '../core/Constants.ts';

export class ArenaBuilder {
  readonly group = new THREE.Group();

  build(scene: THREE.Scene): void {
    scene.background = new THREE.Color(COLORS.FOG);
    scene.fog = new THREE.Fog(COLORS.FOG, 18, 62);

    const floorMat = new THREE.MeshStandardMaterial({
      color: COLORS.FLOOR,
      roughness: 0.95,
      metalness: 0.05,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: COLORS.WALL,
      roughness: 0.9,
      metalness: 0.08,
    });

    const half = WOUND.SIZE / 2;
    const floor = new THREE.Mesh(new THREE.BoxGeometry(WOUND.SIZE, 0.4, WOUND.SIZE), floorMat);
    floor.position.y = -0.2;
    this.group.add(floor);

    const t = WOUND.WALL_THICKNESS;
    const h = WOUND.WALL_HEIGHT;
    const wallSpecs = [
      { x: 0, z: half + t / 2, w: WOUND.SIZE + t * 2, d: t },
      { x: 0, z: -(half + t / 2), w: WOUND.SIZE + t * 2, d: t },
      { x: half + t / 2, z: 0, w: t, d: WOUND.SIZE },
      { x: -(half + t / 2), z: 0, w: t, d: WOUND.SIZE },
    ];
    for (const spec of wallSpecs) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(spec.w, h, spec.d), wallMat);
      wall.position.set(spec.x, h / 2, spec.z);
      this.group.add(wall);
    }

    const ash = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a0c08, roughness: 1 }),
    );
    ash.rotation.x = -Math.PI / 2;
    ash.position.set(WOUND.DUMMY_X, 0.03, WOUND.DUMMY_Z);
    this.group.add(ash);

    scene.add(this.group);
    scene.add(new THREE.AmbientLight(COLORS.AMBIENT, 0.55));
    const sun = new THREE.DirectionalLight(COLORS.DIRECTIONAL, 1.15);
    sun.position.set(8, 18, 6);
    scene.add(sun);
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
}
