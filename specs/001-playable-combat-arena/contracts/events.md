# Contract: EventBus events

All cross-system chatter uses `eventBus.emit(Events.*, payload)`. Payloads are plain data, never Three.js objects.

| Event | Payload | Emitters | Listeners (typical) |
|-------|---------|----------|---------------------|
| `game:loaded` | `{ }` | AssetLoader | Game, UI |
| `game:started` | `{ }` | Game | WaveSystem, Audio |
| `game:paused` | `{ paused: boolean }` | Input, visibility | Physics, Audio, UI |
| `game:restart` | `{ }` | DefeatOverlay | Game |
| `camera:toggled` | `{ mode: 'ots' \| 'iso' }` | Input / CameraSystem | GameState, Audio (optional click) |
| `player:shoot` | `{ facing, damage }` | CombatSystem | Audio, Presentation |
| `player:slash` | `{ facing, damage }` | CombatSystem | Audio, Presentation |
| `player:execute` | `{ targetId }` | CombatSystem | Audio, Presentation, LootSystem |
| `player:hit` | `{ amount, sourceId }` | CombatSystem | GameState, Audio, UI |
| `player:died` | `{ wave, kills }` | CombatSystem | Game, UI, Audio, WaveSystem |
| `player:mutated` | `{ silhouetteStage }` | LootSystem | Presentation, UI |
| `enemy:spawned` | `{ id, kind, waveIndex }` | WaveSystem | Presentation |
| `enemy:hit` | `{ id, amount }` | CombatSystem | Audio, Presentation |
| `enemy:staggered` | `{ id }` | CombatSystem | Presentation, UI |
| `enemy:died` | `{ id, waveIndex, executed: boolean }` | CombatSystem | Loot, Wave, Audio, pools |
| `wave:started` | `{ index }` | WaveSystem | UI, Audio |
| `wave:cleared` | `{ index }` | WaveSystem | UI |
| `loot:dropped` | `{ id }` | LootSystem | Presentation |
| `loot:collected` | `{ id, mutation }` | LootSystem | Audio, Presentation |
| `ui:mute` | `{ muted: boolean }` | Input, Hud | Audio, GameState |
| `dummy:hit` | `{ amount, weapon: 'shotgun' \| 'slash' }` | CombatSystem | Presentation, Audio |

## Rules

- Subscribe in setup; `eventBus.clear()` on reset then rebind.
- Do not re-enter the same event on the same stack.
- Presentation MUST NOT emit combat outcomes.
- Never emit a Demolisher voice line event. There is none.
