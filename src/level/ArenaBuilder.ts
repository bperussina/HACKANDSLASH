import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { COLORS, WOUND } from '../core/Constants.ts';

function placedBox(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  ry = 0,
  rz = 0,
  rx = 0,
): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  if (rx) geo.rotateX(rx);
  if (ry) geo.rotateY(ry);
  if (rz) geo.rotateZ(rz);
  geo.translate(x, y, z);
  return geo;
}

export class ArenaBuilder {
  readonly group = new THREE.Group();

  build(scene: THREE.Scene): void {
    scene.background = new THREE.Color(COLORS.SKY);
    scene.fog = new THREE.Fog(COLORS.FOG, 22, 68);

    const floorMat = new THREE.MeshStandardMaterial({
      color: COLORS.FLOOR,
      roughness: 0.96,
      metalness: 0.04,
    });
    const wallMat = new THREE.MeshStandardMaterial({
      color: COLORS.WALL,
      roughness: 0.92,
      metalness: 0.06,
    });
    const ironMat = new THREE.MeshStandardMaterial({
      color: COLORS.IRON,
      roughness: 0.72,
      metalness: 0.48,
    });
    const rustMat = new THREE.MeshStandardMaterial({
      color: COLORS.RUST,
      roughness: 0.9,
      metalness: 0.22,
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

    const ironBits = [
      placedBox(0.22, 2.4, 0.22, -1.45, 1.05, 5.15),
      placedBox(0.22, 2.1, 0.22, -1.45, 0.85, 6.35, 0, 0.35),
      placedBox(0.22, 1.6, 0.22, -1.2, 0.55, 7.35, 0, 0.85),
      placedBox(0.22, 1.35, 0.22, 1.55, 0.4, 5.45, 0, -1.15),
      placedBox(2.4, 0.22, 0.28, -0.15, 2.35, 5.05, 0.2, 0.15),
      placedBox(1.8, 0.18, 1.1, 0.1, -0.02, 6.15),
      placedBox(1.4, 0.16, 0.9, 2.1, 0.02, 3.4, 0.4),
      placedBox(0.28, 0.9, 1.6, 1.9, 0.28, 3.55, 0.55, 0.4),
      placedBox(2.2, 0.14, 1.2, -6.5, -0.04, -3.2, 0.3),
      placedBox(1.6, 0.14, 1.8, 9.5, -0.04, 8.4, -0.5),
      placedBox(1.9, 0.14, 1.1, 5.2, -0.04, -12.4, 0.8),
      placedBox(1.4, 0.14, 1.4, -11.2, -0.04, 10.6, -0.2),
      placedBox(0.18, 1.8, 0.18, -18.5, 0.7, -8.2, 0, 0.2),
      placedBox(0.18, 1.4, 0.18, 17.8, 0.45, 4.5, 0, -0.9),
      placedBox(0.18, 2.1, 0.18, 16.4, 0.85, -16.2),
    ];
    const rustBits = [
      placedBox(1.1, 0.12, 0.7, 0.4, 0.04, 4.6, 0.25),
      placedBox(0.7, 0.5, 0.18, -0.8, 0.22, 4.9, 0.6, 0.2),
      placedBox(1.3, 0.1, 0.5, WOUND.DUMMY_X + 0.8, 0.03, WOUND.DUMMY_Z + 1.2, -0.3),
      placedBox(0.9, 0.1, 0.9, -8.4, -0.02, 2.1, 0.7),
      placedBox(0.16, 0.9, 0.7, 3.4, 0.2, 2.2, 1.1, 0.5),
    ];

    const ironGeo = mergeGeometries(ironBits, false);
    const rustGeo = mergeGeometries(rustBits, false);
    if (ironGeo) this.group.add(new THREE.Mesh(ironGeo, ironMat));
    if (rustGeo) this.group.add(new THREE.Mesh(rustGeo, rustMat));
    for (const geo of ironBits) geo.dispose();
    for (const geo of rustBits) geo.dispose();

    const ash = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 12),
      new THREE.MeshStandardMaterial({ color: COLORS.ASH, roughness: 1, metalness: 0 }),
    );
    ash.rotation.x = -Math.PI / 2;
    ash.position.set(WOUND.DUMMY_X, 0.03, WOUND.DUMMY_Z);
    this.group.add(ash);

    scene.add(this.group);

    scene.add(new THREE.AmbientLight(COLORS.AMBIENT, 0.28));
    const key = new THREE.DirectionalLight(COLORS.DIRECTIONAL, 0.95);
    key.position.set(7, 16, 5);
    key.castShadow = false;
    scene.add(key);
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
