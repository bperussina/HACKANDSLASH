import * as THREE from 'three';
import { COLORS, SLASH } from '../core/Constants.ts';
import { eventBus, Events } from '../core/EventBus.ts';
import type { Entity } from '../core/World.ts';

function mat(color: number, extras: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0] = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.78,
    metalness: 0.35,
    ...extras,
  });
}

function box(
  w: number,
  h: number,
  d: number,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  return mesh;
}

function trapezoid(
  topW: number,
  botW: number,
  h: number,
  d: number,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(1, h, d);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const t = (pos.getY(i) + h / 2) / h;
    pos.setX(i, pos.getX(i) * (botW + (topW - botW) * t));
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  return mesh;
}

export class PresentationSystem {
  readonly group = new THREE.Group();
  readonly heroMesh = new THREE.Group();
  readonly dummyMesh = new THREE.Group();
  private visorMat!: THREE.MeshStandardMaterial;
  private muzzleFlash: THREE.Mesh;
  private sparks: THREE.Mesh[] = [];
  private slashArc: THREE.Mesh;
  private dummyMats: THREE.MeshStandardMaterial[] = [];
  private muzzleTime = 0;
  private bladeTime = 0;
  private visorClock = 0;

  constructor() {
    this.heroMesh.add(this.buildDemolisher());
    this.dummyMesh.add(this.buildDummy());

    this.muzzleFlash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.52),
      new THREE.MeshBasicMaterial({
        color: COLORS.EMBER,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.muzzleFlash.position.set(0.68, 1.18, 1.82);
    this.heroMesh.add(this.muzzleFlash);

    for (let i = 0; i < 5; i += 1) {
      const spark = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        new THREE.MeshBasicMaterial({ color: COLORS.EMBER }),
      );
      spark.visible = false;
      this.sparks.push(spark);
      this.heroMesh.add(spark);
    }

    this.slashArc = new THREE.Mesh(
      new THREE.RingGeometry(
        SLASH.RANGE * 0.42,
        SLASH.RANGE * 0.92,
        10,
        1,
        Math.PI / 2 - SLASH.ARC / 2,
        SLASH.ARC,
      ),
      new THREE.MeshBasicMaterial({
        color: COLORS.EMBER,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.slashArc.rotation.x = Math.PI / 2;
    this.slashArc.position.set(0, 1.05, 0);
    this.heroMesh.add(this.slashArc);

    this.group.add(this.heroMesh, this.dummyMesh);

    eventBus.on(Events.playerShoot, () => {
      this.muzzleTime = 0.07;
    });
    eventBus.on(Events.playerSlash, () => {
      this.bladeTime = 0.11;
    });
  }

  sync(hero: Entity, dummy: Entity, dt: number): void {
    this.heroMesh.position.set(hero.position.x, 0, hero.position.z);
    this.heroMesh.rotation.y = hero.facing ?? 0;
    this.dummyMesh.position.set(dummy.position.x, 0, dummy.position.z);

    const flinch = dummy.flinchTimer ?? 0;
    const punch = flinch > 0 ? 1 + Math.sin(flinch * 36) * 0.07 : 1;
    this.dummyMesh.scale.setScalar(punch);
    for (const dummyMat of this.dummyMats) {
      dummyMat.emissiveIntensity = flinch > 0 ? 0.55 : 0.04;
    }

    this.muzzleTime = Math.max(0, this.muzzleTime - dt);
    const muzzleMat = this.muzzleFlash.material as THREE.MeshBasicMaterial;
    muzzleMat.opacity = this.muzzleTime > 0 ? 0.95 : 0;
    this.sparks.forEach((spark, i) => {
      const on = this.muzzleTime > 0;
      spark.visible = on;
      if (on) {
        const t = this.muzzleTime * 18 + i;
        spark.position.set(0.58 + Math.sin(t) * 0.16, 1.16 + (i % 3) * 0.07, 1.72 + i * 0.11);
      }
    });

    this.bladeTime = Math.max(0, this.bladeTime - dt);
    const bladeMat = this.slashArc.material as THREE.MeshBasicMaterial;
    bladeMat.opacity = this.bladeTime > 0 ? 0.85 : 0;

    this.visorClock += dt;
    this.visorMat.emissiveIntensity = 1.28 + Math.sin(this.visorClock * 3.1) * 0.18;
  }

  dispose(): void {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const material of materials) material.dispose();
      }
    });
  }

  private buildDemolisher(): THREE.Group {
    const root = new THREE.Group();
    const plate = mat(COLORS.IRON, { metalness: 0.58, roughness: 0.55 });
    const iron = mat(COLORS.IRON, { metalness: 0.5, roughness: 0.68 });
    const rust = mat(COLORS.RUST, { metalness: 0.25, roughness: 0.88 });
    const bone = mat(COLORS.BONE, { metalness: 0.05, roughness: 0.9 });
    const leather = mat(COLORS.ASH, { metalness: 0.08, roughness: 0.96 });
    const visorMat = new THREE.MeshStandardMaterial({
      color: COLORS.VISOR,
      emissive: COLORS.VISOR,
      emissiveIntensity: 1.45,
      roughness: 0.35,
      metalness: 0.1,
    });
    this.visorMat = visorMat;

    root.add(trapezoid(1.88, 1.12, 1.18, 0.76, plate, 0, 1.24, 0.02));
    root.add(box(1.18, 0.32, 0.66, iron, 0, 0.58, 0.04));
    root.add(box(0.44, 0.72, 0.44, leather, -0.3, 0.38, 0.02));
    root.add(box(0.44, 0.72, 0.44, leather, 0.3, 0.38, 0.02));
    root.add(box(0.56, 0.24, 0.68, iron, -0.32, 0.12, 0.08));
    root.add(box(0.56, 0.24, 0.68, iron, 0.32, 0.12, 0.08));

    const leftArm = box(0.44, 1.02, 0.44, iron, -1.08, 1.18, 0.06);
    const rightArm = box(0.34, 0.92, 0.34, iron, 0.98, 1.12, 0.14);
    root.add(leftArm, rightArm);

    const leftPauldron = box(0.74, 0.36, 0.78, plate, -0.92, 1.72, 0.04);
    leftPauldron.rotation.z = 0.32;
    const rightPauldron = box(0.36, 0.18, 0.46, plate, 0.86, 1.62, 0.12);
    rightPauldron.rotation.z = -0.08;
    root.add(leftPauldron, rightPauldron);

    root.add(box(0.3, 0.16, 0.3, leather, 0, 1.78, 0.04));
    const helm = box(0.56, 0.44, 0.54, plate, 0, 1.96, 0.06);
    const visor = box(0.42, 0.08, 0.07, visorMat, 0, 1.94, 0.34);
    const visorTop = box(0.38, 0.05, 0.28, visorMat, 0, 2.2, 0.04);
    root.add(helm, visor, visorTop);

    const gun = box(0.56, 0.48, 1.68, iron, 0.68, 1.16, 0.78);
    const gunDoor = box(0.64, 0.54, 0.16, rust, 0.68, 1.16, 1.55);
    const barrel = box(0.18, 0.18, 0.42, iron, 0.68, 1.18, 1.78);
    const stock = box(0.18, 0.28, 0.36, rust, 0.68, 0.92, 0.08);
    root.add(gun, gunDoor, barrel, stock);

    const blade = box(0.12, 0.86, 1.58, bone, -1.08, 1.02, 0.58);
    const spine = box(0.06, 0.18, 1.42, rust, -1.08, 1.4, 0.5);
    const hilt = box(0.18, 0.18, 0.42, rust, -1.08, 1.02, -0.28);
    root.add(blade, spine, hilt);

    root.add(box(0.1, 0.22, 0.1, bone, -0.52, 1.58, 0.38));
    root.add(box(0.1, 0.22, 0.1, bone, 0.52, 1.58, 0.38));
    root.add(box(0.12, 0.16, 0.12, rust, 0, 1.58, 0.4));
    root.add(box(0.16, 0.16, 0.16, rust, -0.72, 1.82, -0.12));
    root.add(box(0.1, 0.1, 0.1, rust, 0.42, 1.72, 0.36));

    return root;
  }

  private buildDummy(): THREE.Group {
    const root = new THREE.Group();
    const rust = mat(COLORS.RUST, {
      metalness: 0.2,
      roughness: 0.92,
      emissive: COLORS.BLOOD,
      emissiveIntensity: 0.04,
    });
    const bone = mat(COLORS.BONE, { metalness: 0.05, roughness: 0.88 });
    const iron = mat(COLORS.IRON, { metalness: 0.45, roughness: 0.7 });
    this.dummyMats.push(rust, bone);

    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.85, 0.2), iron);
    post.position.y = 1.42;
    const bar = box(1.15, 0.1, 0.1, iron, 0, 2.82, 0);
    const body = box(0.58, 0.82, 0.4, rust, 0.04, 1.12, 0.14);
    body.rotation.x = 0.22;
    body.rotation.z = 0.08;
    const head = box(0.3, 0.26, 0.28, bone, 0.08, 1.62, 0.22);
    const arm = box(0.16, 0.7, 0.16, rust, -0.42, 1.05, 0.08);
    arm.rotation.z = 0.45;
    const chainL = box(0.05, 1.05, 0.05, bone, -0.24, 2.22, 0.1);
    const chainR = box(0.05, 1.05, 0.05, bone, 0.26, 2.22, 0.1);
    root.add(post, bar, body, head, arm, chainL, chainR);
    return root;
  }
}
