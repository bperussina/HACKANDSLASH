import { yawToDir } from '../gameplay/shotgun.ts';
import { CAMERA_OTS } from '../core/Constants.ts';

export type InputSample = {
  moveX: number;
  moveZ: number;
  aimX: number;
  aimZ: number;
  shootPressed: boolean;
  slashPressed: boolean;
  executePressed: boolean;
  cameraTogglePressed: boolean;
  pausePressed: boolean;
  mutePressed: boolean;
  lookDelta: number;
};

export const EMPTY_INPUT: InputSample = {
  moveX: 0,
  moveZ: 0,
  aimX: 0,
  aimZ: 0,
  shootPressed: false,
  slashPressed: false,
  executePressed: false,
  cameraTogglePressed: false,
  pausePressed: false,
  mutePressed: false,
  lookDelta: 0,
};

export class InputSystem {
  mouseNdc = { x: 0, y: 0 };
  private keys = new Set<string>();
  private shootEdge = false;
  private slashEdge = false;
  private executeEdge = false;
  private cameraEdge = false;
  private pauseEdge = false;
  private muteEdge = false;
  private mouseLeft = false;
  private mouseRight = false;
  private prevMouseLeft = false;
  private prevMouseRight = false;
  private lookDx = 0;

  attach(canvas: HTMLElement): void {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('contextmenu', this.onContextMenu);
  }

  detach(canvas: HTMLElement): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('contextmenu', this.onContextMenu);
  }

  sample(cameraYaw: number, aimX: number, aimZ: number): InputSample {
    let x = 0;
    let z = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z -= 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;

    const len = Math.hypot(x, z);
    if (len > 1) {
      x /= len;
      z /= len;
    }

    const moved = rotateMove(x, z, cameraYaw);
    const moveX = moved.x;
    const moveZ = moved.z;

    const shootKey = this.consume(this.shootEdge);
    const slashKey = this.consume(this.slashEdge);
    this.shootEdge = false;
    this.slashEdge = false;

    const mouseShoot = this.mouseLeft && !this.prevMouseLeft;
    const mouseSlash = this.mouseRight && !this.prevMouseRight;
    this.prevMouseLeft = this.mouseLeft;
    this.prevMouseRight = this.mouseRight;

    const cameraTogglePressed = this.consume(this.cameraEdge);
    const executePressed = this.consume(this.executeEdge);
    const pausePressed = this.consume(this.pauseEdge);
    const mutePressed = this.consume(this.muteEdge);
    this.cameraEdge = false;
    this.executeEdge = false;
    this.pauseEdge = false;
    this.muteEdge = false;

    return {
      moveX,
      moveZ,
      aimX,
      aimZ,
      shootPressed: shootKey || mouseShoot,
      slashPressed: slashKey || mouseSlash,
      executePressed,
      cameraTogglePressed,
      pausePressed,
      mutePressed,
      lookDelta: 0,
    };
  }

  consumeLookDelta(): number {
    const delta = Math.max(-CAMERA_OTS.LOOK_MAX, Math.min(CAMERA_OTS.LOOK_MAX, this.lookDx * CAMERA_OTS.LOOK_SENS));
    this.lookDx = 0;
    return delta;
  }

  private consume(value: boolean): boolean {
    return value;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat) return;
    this.keys.add(event.code);
    if (event.code === 'KeyF' || event.code === 'ControlLeft') this.shootEdge = true;
    if (event.code === 'KeyJ' || event.code === 'Space') {
      event.preventDefault();
      this.slashEdge = true;
    }
    if (event.code === 'KeyE') this.executeEdge = true;
    if (event.code === 'KeyV' || event.code === 'Tab') {
      event.preventDefault();
      this.cameraEdge = true;
    }
    if (event.code === 'Escape') this.pauseEdge = true;
    if (event.code === 'KeyM') this.muteEdge = true;
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.code);
  };

  private onPointerMove = (event: PointerEvent): void => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.mouseNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.lookDx += event.movementX;
  };

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button === 0) this.mouseLeft = true;
    if (event.button === 2) this.mouseRight = true;
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (event.button === 0) this.mouseLeft = false;
    if (event.button === 2) this.mouseRight = false;
  };

  private onContextMenu = (event: Event): void => {
    event.preventDefault();
  };
}

/** WASD in character/camera yaw: W walks the visor heading, D strafes right. Yaw 0 is +Z. */
export function rotateMove(localX: number, localZ: number, yaw: number): { x: number; z: number } {
  const forward = yawToDir(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  return {
    x: rightX * localX + forward.x * localZ,
    z: rightZ * localX + forward.z * localZ,
  };
}
