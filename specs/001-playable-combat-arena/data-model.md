# Data Model: The Wound — First Massacre

Simulation types. Meshes and Rapier handles are references, never the source of health, stagger, or silhouette.

## Entity: Demolisher

| Field | Type | Rules |
|-------|------|--------|
| position | vec3 | Inside Wound AABB |
| facing | yaw | From aim, else move |
| moveSpeed | number | Starts high (already strong) |
| health / maxHealth | number | Starts strong; trophies may raise max |
| shotgunDamage / coneRange / coneSpread | number | Mutates with trophies |
| slashDamage / slashRange / slashArc | number | Mutates with trophies |
| shotgunState / slashState | idle \| startup \| active \| recovery | Independent weapons; same-frame rule in CombatSystem |
| hurtLock | seconds | |
| executeState | idle \| ripping | |
| silhouetteStage | int ≥ 0 | 0 = first-break Hell iron; trophies increment |
| alive | bool | |
| input | InputSample | |

**Transitions**: `alive true → false` emits `player:died`. Execute locks move. Level/trophy look emits `player:mutated`.

## Entity: HellFodder

Imp or bone-mutt. Rush melee. `kind`, position, facing, health, attackState, waveIndex, alive.

## Entity: Champion

Fodder fields plus `stagger` (0..1) and `executeReady` (bool). Shotgun and slash build stagger. At threshold, execute-ready until timeout or rip.

## Entity: ChainedDummy

Fixed dummy. Takes shotgun and slash. Does not chase. Not removed by waves.

## Entity: ShotgunBlast

Transient cone. `origin`, `facing`, `range`, `spread`, `damage`, `hitIds`, `remaining`. Pooled.

## Entity: Slash

Transient arc. Same pattern as blast with `arcRadians` instead of spread.

## Entity: Execution

Transient. `targetId`, `remaining`. While active, Demolisher `executeState = ripping`. Ends in champion death + loot roll bonus.

## Entity: Trophy

| Field | Type | Rules |
|-------|------|--------|
| position | vec3 | Floor |
| mutation | gun \| blade \| body | Hell-iron only in this slice |
| lifetime | seconds | Despawn if ignored too long (optional) |

Collect on overlap. Applies mutation, increments silhouetteStage, then pools.

## Aggregate: Wave

`index`, `composition` (fodder count + champion flag), `remainingAlive`, `pauseRemaining`. Abort on `player:died`. Last-fodder-death vs player-death: player-death wins.

## Aggregate: Run (GameState)

started, paused, muted, isPlaying, awaitingRestart, waveIndex, kills, cameraMode (`ots` \| `iso`), silhouetteStage.

`reset()` restores first-break Hell iron, camera default OTS, empties world except renderer.

## Validation

- Health never silently upgrades without silhouetteStage change if the source is a trophy.
- Execute only if `executeReady` and in range.
- Spawn ≥ `SPAWN_SAFE_RADIUS` from Demolisher.
- HurtLock after first hit of a clump.
- `muted` persists across restart in the page session; silhouette does not.
