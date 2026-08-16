import * as THREE from 'three';
import { CAMERA_ISO, CAMERA_OTS } from '../core/Constants.ts';
import { eventBus, Events } from '../core/EventBus.ts';
import { gameState, type CameraMode } from '../core/GameState.ts';
import type { Entity } from '../core/World.ts';

export class CameraSystem {
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  queued: CameraMode | null = null;
  private target = new THREE.Vector3();
  private look = new THREE.Vector3();
  private euler = new THREE.Euler();

  constructor() {
    this.camera.position.set(0, 8, 12);
  }

  resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
  }

  requestToggle(ripping: boolean): void {
    const next: CameraMode = gameState.current.cameraMode === 'ots' ? 'iso' : 'ots';
    if (ripping) {
      this.queued = next;
      return;
    }
    this.apply(next);
  }

  flushQueue(ripping: boolean): void {
    if (!ripping && this.queued) {
      this.apply(this.queued);
      this.queued = null;
    }
  }

  apply(mode: CameraMode): void {
    gameState.patch({ cameraMode: mode });
    eventBus.emit(Events.cameraToggled, { mode });
  }

  yaw(): number {
    if (gameState.current.cameraMode === 'iso') {
      return Math.atan2(-CAMERA_ISO.OFFSET_X, -CAMERA_ISO.OFFSET_Z);
    }
    const euler = this.euler.setFromQuaternion(this.camera.quaternion, 'YXZ');
    return euler.y;
  }

  follow(hero: Entity, dt: number): void {
    const pos = hero.position;
    const facing = hero.facing ?? 0;
    const target = this.target;
    const look = this.look;

    if (gameState.current.cameraMode === 'ots') {
      const back = CAMERA_OTS.DISTANCE;
      target.set(
        pos.x - Math.sin(facing) * back,
        pos.y + CAMERA_OTS.HEIGHT,
        pos.z - Math.cos(facing) * back,
      );
      look.set(
        pos.x + Math.sin(facing) * CAMERA_OTS.LOOK_AHEAD,
        pos.y + CAMERA_OTS.LOOK_HEIGHT,
        pos.z + Math.cos(facing) * CAMERA_OTS.LOOK_AHEAD,
      );
      this.camera.fov = 55;
    } else {
      target.set(
        pos.x + CAMERA_ISO.OFFSET_X,
        pos.y + CAMERA_ISO.OFFSET_Y,
        pos.z + CAMERA_ISO.OFFSET_Z,
      );
      look.set(pos.x, pos.y + 0.4, pos.z);
      this.camera.fov = 45;
    }

    const lerp = (gameState.current.cameraMode === 'ots' ? CAMERA_OTS.LERP : CAMERA_ISO.LERP) * dt;
    this.camera.position.lerp(target, Math.min(1, lerp));
    this.camera.lookAt(look);
    this.camera.updateProjectionMatrix();
  }
}
