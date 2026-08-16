# Contract: InputSystem

Gameplay never reads `KeyboardEvent`, gamepad, or touch directly.

## Sample (copied onto the Demolisher each tick)

```ts
type CameraMode = 'ots' | 'iso';

type InputSample = {
  moveX: number;          // -1..1, camera-relative strafe
  moveZ: number;          // -1..1, camera-relative forward
  aimX: number;           // world aim X, 0 if none
  aimZ: number;           // world aim Z, 0 if none
  shootPressed: boolean;  // edge-triggered
  slashPressed: boolean;  // edge-triggered
  executePressed: boolean;// edge-triggered
  cameraTogglePressed: boolean; // edge-triggered
  pausePressed: boolean;
  mutePressed: boolean;
};
```

## Device mapping

| Action | Keyboard | Mouse | Gamepad | Touch |
|--------|----------|-------|---------|-------|
| Move | WASD / arrows | — | Left stick | Virtual left stick |
| Aim | — | Cursor vs ground (iso) or look (OTS) | Right stick | Facing follows move if no second stick |
| Shoot | Left Ctrl or F | Primary button | RT / R2 | Shoot button |
| Slash | J or Space | Secondary button | West / Square | Slash button |
| Execute | E | — | South / A when prompt shown | Execute button when ready |
| Camera | V or Tab | — | Back / View | Camera button |
| Pause | Escape | — | Start | Pause |
| Mute | M | — | — | HUD mute |

## Rules

- Dead zone 0.15 on sticks.
- Shoot, slash, execute, camera toggle are edge-triggered.
- Same-frame shoot+slash: if a living target is inside blade range, slash wins; otherwise shoot wins.
- Move is rotated into **current** camera yaw so up-on-stick is up-on-screen in both modes.
- If aim length is ~0, facing follows move; if both 0, keep last facing.
- Camera toggle during `executeState = ripping` is queued until the rip ends.
- Touch controls sit above the bottom safe inset. Execute button appears only when a champion is ready.
- Click-to-move MUST NOT be implemented.
