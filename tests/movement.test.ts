import { describe, expect, it } from 'vitest';
import { rotateMove } from '../src/systems/InputSystem.ts';
import { CameraSystem } from '../src/systems/CameraSystem.ts';
import { gameState } from '../src/core/GameState.ts';
import { CAMERA_ISO } from '../src/core/Constants.ts';

function nearly(actual: number, expected: number): void {
  expect(actual).toBeCloseTo(expected, 5);
}

describe('WASD vs heading', () => {
  it('walks +Z when the visor faces +Z', () => {
    const move = rotateMove(0, 1, 0);
    nearly(move.x, 0);
    nearly(move.z, 1);
  });

  it('walks -Z when the visor faces the dummy (spawn heading)', () => {
    const move = rotateMove(0, 1, Math.PI);
    nearly(move.x, 0);
    nearly(move.z, -1);
  });

  it('strafes right of the visor, not world-right', () => {
    const facingPlusZ = rotateMove(1, 0, 0);
    nearly(facingPlusZ.x, 1);
    nearly(facingPlusZ.z, 0);

    const facingMinusZ = rotateMove(1, 0, Math.PI);
    nearly(facingMinusZ.x, -1);
    nearly(facingMinusZ.z, 0);
  });

  it('walks +X when the visor faces +X', () => {
    const move = rotateMove(0, 1, Math.PI / 2);
    nearly(move.x, 1);
    nearly(move.z, 0);
  });
});

describe('camera look yaw', () => {
  it('matches game facing (0 looks +Z), not Three.js default -Z', () => {
    const cameras = new CameraSystem();
    cameras.camera.position.set(0, 2, -6);
    cameras.camera.lookAt(0, 1, 4);
    nearly(cameras.yaw(), 0);
  });

  it('reads isometric look as into the scene, away from the camera', () => {
    gameState.patch({ cameraMode: 'iso' });
    const cameras = new CameraSystem();
    cameras.camera.position.set(CAMERA_ISO.OFFSET_X, CAMERA_ISO.OFFSET_Y, CAMERA_ISO.OFFSET_Z);
    cameras.camera.lookAt(0, 1, 0);
    const yaw = cameras.yaw();
    nearly(Math.sin(yaw), Math.sin(Math.atan2(-CAMERA_ISO.OFFSET_X, -CAMERA_ISO.OFFSET_Z)));
    nearly(Math.cos(yaw), Math.cos(Math.atan2(-CAMERA_ISO.OFFSET_X, -CAMERA_ISO.OFFSET_Z)));
    gameState.patch({ cameraMode: 'ots' });
  });
});
