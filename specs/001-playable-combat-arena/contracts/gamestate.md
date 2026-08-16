# Contract: GameState

Singleton at `src/core/GameState.ts`. UI, audio, and camera read it. Combat writes through systems + events.

```ts
type CameraMode = 'ots' | 'iso';

type GameStateShape = {
  started: boolean;
  paused: boolean;
  muted: boolean;
  isPlaying: boolean;
  awaitingRestart: boolean;
  waveIndex: number;
  kills: number;
  cameraMode: CameraMode;
  heroAlive: boolean;
  heroHealth: number;
  heroMaxHealth: number;
  silhouetteStage: number;
  executePrompt: boolean;  // champion ready in range
};

interface GameState {
  readonly current: GameStateShape;
  reset(): void;
  patch(partial: Partial<GameStateShape>): void;
}
```

## Rules

- `reset()` restores Constants first-break stats, `cameraMode: 'ots'`, `silhouetteStage: 0`. Does not dispose the renderer.
- Hidden tab sets `paused = true` without forgetting user-paused; returning restores that flag.
- `muted` persists across restart in the page session.
- `cameraMode` persists across restart in the page session (player already chose a hunt view). Silhouette and trophies do not.
- HUD binds to `current`. No private health copy. No Demolisher dialogue fields.
