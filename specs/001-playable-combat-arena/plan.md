# Implementation Plan: The Wound — First Massacre

**Branch**: `001-playable-combat-arena` | **Date**: 2026-08-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-playable-combat-arena/spec.md` plus locked bible [`docs/GAME_DESIGN.md`](../../docs/GAME_DESIGN.md)

## Summary

Ship The Wound: the Demolisher wakes already terrifying, toggles over-the-shoulder and isometric, shotgun-opens Hell fodder, blade-finishes them, can be buried and break out again, rips a champion, and loots Hell-iron trophies that crack the silhouette. Vanilla Three.js renders; Miniplex + Rapier own truth; Howler plays crunch. No R3F. No Heaven. No speeches.

## Technical Context

**Language/Version**: TypeScript 5.9 on ES2022 modules, Node 22+

**Primary Dependencies**: three r185, Vite 7, Miniplex 2, @dimforge/rapier3d-compat, howler, three-mesh-bvh, stats.js, lil-gui (dev overlay only)

**Storage**: None for this slice. Run state lives in memory. Restart rebuilds it.

**Testing**: Vitest for headless simulation (shotgun cone, slash arc, stagger/execute, waves, trophies, reset). Manual playtest for both cameras, input, and juice.

**Target Platform**: Desktop Chromium/Firefox/Safari and mobile Safari/Chrome. WebGL2 required.

**Project Type**: Single-page browser game (Vite app at repository root)

**Performance Goals**: 60 fps on a typical laptop with 8 fodder; playable 30 fps on a mid-range phone. Pixel ratio capped at 2. Draw calls for an 8-enemy wave stay under 100.

**Constraints**: No R3F. No post-processing. No dynamic shadows in this slice. Fixed combat/physics timestep (1/60s) with capped render delta. Tab hide pauses the sim. All GPU resources disposed on restart. Both cameras must stay under the same budget.

**Scale/Scope**: 1 Wound arena, 1 Demolisher, 1 chained dummy, Hell fodder + 1 champion type, shotgun + blade + execute, trophy drops, waves until burial, HUD + pause + mute, dual camera. No Heaven, no Diarch, no town, no netcode.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|------|--------|----------|
| I. Core Loop First | PASS | P1 is move, aim, shotgun, blade, both cameras. P2–P3 add pack and restart. Execute/loot extend the loop. |
| II. Simulation Owns Truth | PASS | Miniplex + Rapier; meshes are views. Vitest covers cones, arcs, execute, reset. |
| III. Restart-Safe Resources | PASS | `GameState.reset()`, pellet/slash/enemy pools, dispose + EventBus.clear. |
| IV. Readable Combat | PASS | Dual camera with shared readability rules; no post-process haze. |
| V. Performance Budget | PASS | Pooled fodder, no shadows/bloom, stats overlay, pixel ratio cap. |
| VI. Fantasy Bible | PASS | Demolisher, silence, Wound/Hell-first, OTS+iso, Hell-iron loot, execute as voice. Heaven/Diarch deferred. |
| Architecture | PASS | See Project Structure and research.md. |
| Workflow | PASS | Feature lives on `001-playable-combat-arena`. |

Post-design re-check: still PASS. Extra systems (shotgun pellets, execute state, trophies) are loop extensions, not new apps.

## Project Structure

### Documentation (this feature)

```text
specs/001-playable-combat-arena/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── events.md
│   ├── input.md
│   └── gamestate.md
└── tasks.md
```

### Source Code (repository root)

```text
index.html
package.json
tsconfig.json
vite.config.ts
public/
├── models/              # Demolisher, fodder, champion, dummy, Wound
├── audio/               # gun, blade, rip, hurt, death, optional bed
└── textures/
src/
├── main.ts
├── core/
│   ├── Game.ts
│   ├── EventBus.ts
│   ├── GameState.ts
│   ├── Constants.ts
│   └── World.ts
├── systems/
│   ├── InputSystem.ts
│   ├── PhysicsSystem.ts
│   ├── CombatSystem.ts
│   ├── MovementSystem.ts
│   ├── CameraSystem.ts      # OTS + isometric, toggle
│   ├── AnimationSystem.ts
│   ├── AudioSystem.ts
│   ├── WaveSystem.ts
│   ├── LootSystem.ts
│   ├── PresentationSystem.ts
│   └── DevOverlay.ts
├── gameplay/
│   ├── demolisher.ts
│   ├── enemy.ts
│   ├── dummy.ts
│   ├── shotgun.ts
│   ├── slash.ts
│   ├── execution.ts
│   ├── trophy.ts
│   └── pools.ts
├── level/
│   ├── AssetLoader.ts
│   └── ArenaBuilder.ts      # The Wound
├── ui/
│   ├── Hud.ts
│   ├── PauseOverlay.ts
│   └── DefeatOverlay.ts
└── debug/
    └── stats.ts
tests/
├── combat.test.ts
├── waves.test.ts
├── reset.test.ts
├── execution.test.ts
└── loot.test.ts
```

**Structure Decision**: Single Vite app at the repo root. Matches constitution layout. Tests import simulation only.

## Complexity Tracking

> No constitution violations. Dual camera is a locked bible requirement, not extra scope.
