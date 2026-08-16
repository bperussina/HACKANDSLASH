# Tasks: The Wound — First Massacre

**Input**: Design documents from `/specs/001-playable-combat-arena/` plus `docs/GAME_DESIGN.md`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Headless Vitest for simulation. Not full TDD-first.

**Organization**: Tasks grouped by user story so each crunch can ship alone.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Vite + TypeScript app that boots a blank WebGL canvas

- [x] T001 Create root `.gitignore` ignoring `node_modules/`, `dist/`, `.env`, and OS junk
- [x] T002 Initialize `package.json` with `"type": "module"` and scripts `dev`, `build`, `preview`, `test` per plan.md
- [x] T003 [P] Add `tsconfig.json` (strict, ES2022, bundler resolution) and `vite.config.ts` (port 3000, open, `publicDir`)
- [x] T004 [P] Create `index.html` with `#game-container`, overlay roots, and `/src/main.ts` entry
- [x] T005 Install runtime deps `three@0.185`, `miniplex`, `@dimforge/rapier3d-compat`, `howler` and dev deps `vite`, `typescript`, `vitest`, `stats.js`, `lil-gui`
- [x] T006 Create empty folders `src/core`, `src/systems`, `src/gameplay`, `src/level`, `src/ui`, `src/debug`, `tests`, `public/models`, `public/audio`

**Checkpoint**: `npm run dev` shows a page; `npm run build` succeeds with a stub `main.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Loop, events, Wound shell, dual camera rigs, input sample — no gunfire yet

**⚠️ CRITICAL**: No user story work until this phase is complete

- [x] T007 Implement EventBus + `Events` in `src/core/EventBus.ts` per `specs/001-playable-combat-arena/contracts/events.md`
- [x] T008 [P] Implement GameState with `reset()` / `patch()` in `src/core/GameState.ts` per `contracts/gamestate.md` (default `cameraMode: 'ots'`, `silhouetteStage: 0`)
- [x] T009 [P] Fill `src/core/Constants.ts` with DEMOLISHER, SHOTGUN, SLASH, EXECUTE, FODDER, CHAMPION, WAVE, CAMERA_OTS, CAMERA_ISO, WOUND, COLORS, ASSET_PATHS
- [x] T010 [P] Define Miniplex types and `createWorld()` in `src/core/World.ts` per `data-model.md`
- [x] T011 Implement Game orchestrator in `src/core/Game.ts`: WebGLRenderer (high-performance, pixel ratio cap 2), ash fog, lights, `setAnimationLoop`, delta cap 0.1, fixed 1/60 accumulator, resize, visibility pause
- [x] T012 Wire `src/main.ts` to construct Game and `init()`
- [x] T013 Implement InputSystem in `src/systems/InputSystem.ts` per `contracts/input.md` (keyboard + mouse first; touch/gamepad stubs OK until US5)
- [x] T014 Implement PhysicsSystem in `src/systems/PhysicsSystem.ts` (Rapier world, ground cuboid, step, dispose on reset)
- [x] T015 Implement AssetLoader in `src/level/AssetLoader.ts` with `LoadingManager`; emit `game:loaded`; primitive fallbacks if GLBs missing
- [x] T016 Build The Wound (ash floor, walls, chained-dummy marker) in `src/level/ArenaBuilder.ts` with Rapier colliders
- [x] T017 Implement CameraSystem in `src/systems/CameraSystem.ts` with OTS and isometric rigs, toggle, queued toggle during rips, no OrbitControls in play
- [x] T018 Implement PresentationSystem stub in `src/systems/PresentationSystem.ts` (copy transforms; Hell-iron palette)
- [x] T019 [P] Add `src/debug/stats.ts` and `src/systems/DevOverlay.ts` (stats + `renderer.info` + lil-gui) gated by `import.meta.env.DEV`
- [x] T020 Add Vitest config and smoke test that EventBus + GameState.reset restore OTS and silhouette 0 in `tests/reset.test.ts`

**Checkpoint**: Empty Wound, both cameras toggle, loop runs, tab-hide pauses, overlay in DEV

---

## Phase 3: User Story 1 - The Lock Breaks (Priority: P1) 🎯 MVP

**Goal**: Demolisher runs in The Wound, toggles cameras, shotguns and slashes the chained dummy

**Independent Test**: OTS default, toggle iso, dummy flinches only on real shotgun cone and blade arc

- [x] T021 [P] [US1] Add object pools in `src/gameplay/pools.ts` (meshes, colliders, blasts, slashes)
- [x] T022 [P] [US1] Spawn Demolisher + kinematic capsule in `src/gameplay/demolisher.ts` (already-strong Constants, Hell-iron look)
- [x] T023 [US1] Implement MovementSystem in `src/systems/MovementSystem.ts` (move relative to current camera yaw, bounds, facing from aim)
- [x] T024 [US1] Implement shotgun blast entity + cone query in `src/gameplay/shotgun.ts`
- [x] T025 [US1] Implement slash entity + arc in `src/gameplay/slash.ts`
- [x] T026 [US1] Implement CombatSystem shoot/slash windows, same-frame rule, recovery ignore in `src/systems/CombatSystem.ts`
- [x] T027 [US1] Spawn chained dummy in `src/gameplay/dummy.ts`; apply shotgun and slash hits; emit `dummy:hit`
- [x] T028 [US1] Placeholder shoot/slash/idle/run in `src/systems/AnimationSystem.ts`
- [x] T029 [US1] Dummy flinch + muzzle/blade spark in `src/systems/PresentationSystem.ts`
- [x] T030 [US1] Add `tests/combat.test.ts` for cone hit/miss, arc hit/miss, recovery ignore, same-frame rule

**Checkpoint**: P1 is a game. Stop and play it.

---

## Phase 4: User Story 2 - Hell Swarms (Priority: P2)

**Goal**: Imps/mutts rush; gun opens; blade finishes; Demolisher stays readable

**Independent Test**: Shotgun one, blade one, pack of 3+ still shows the Demolisher

- [ ] T031 [P] [US2] Pooled Hell fodder in `src/gameplay/enemy.ts` (kinds, chase, melee windup)
- [ ] T032 [US2] Extend CombatSystem in `src/systems/CombatSystem.ts` for fodder strikes vs hurtLock and player weapons vs fodder HP; emit `enemy:hit` / `enemy:died` / `player:hit`
- [ ] T033 [US2] Death pooling + Hell death flash in `src/gameplay/pools.ts` and `src/systems/PresentationSystem.ts`
- [ ] T034 [US2] Demolisher contrast (dark iron + rim) vs red-brown fodder in `src/gameplay/demolisher.ts`
- [ ] T035 [US2] Extend `tests/combat.test.ts` for fodder death and overlapping-hit hurtLock

**Checkpoint**: Massacre works; dummy still works

---

## Phase 5: User Story 3 - The Pack Buries You (Priority: P3)

**Goal**: Strong health, burial overlay, clean first-break restart

**Independent Test**: Die, restart, full HP, no ghost demons, Hell iron stage 0

- [ ] T036 [US3] Drive health/alive into GameState; emit `player:died` from `src/systems/CombatSystem.ts`
- [ ] T037 [US3] Wordless DefeatOverlay in `src/ui/DefeatOverlay.ts` emitting `game:restart` (no Demolisher lines)
- [ ] T038 [US3] `Game.resetRun()` in `src/core/Game.ts`: reset state, clear bus, drain physics/pools, dispose transients, rebuild Demolisher/dummy
- [ ] T039 [US3] Freeze gameplay input when `awaitingRestart` in InputSystem / MovementSystem
- [ ] T040 [US3] Expand `tests/reset.test.ts` for full HP, zero enemies, wave 1, no leftover blast/slash, silhouette 0

**Checkpoint**: Burial and break-out match SC-003 / SC-006

---

## Phase 6: User Story 4 - They Keep Coming (Priority: P4)

**Goal**: Escalating Hell waves, safe spawns

**Independent Test**: Wave 2 harder; death restarts at 1

- [ ] T041 [US4] WaveSystem in `src/systems/WaveSystem.ts` (Constants composition, spawn radius, pause, last-hit-vs-death)
- [ ] T042 [US4] Emit `wave:started` / `wave:cleared`; patch `waveIndex` in `src/systems/WaveSystem.ts`
- [ ] T043 [US4] Add `tests/waves.test.ts` for next index, escalation, simultaneous clear+death preferring death

**Checkpoint**: A run is a hunt, not one skirmish

---

## Phase 7: User Story 5 - Read the Massacre (Priority: P5)

**Goal**: HUD, pause, mute, juice, touch/gamepad; both cameras stay usable

**Independent Test**: Read HP/wave/kills, pause, mute, play on touch, toggle camera

- [ ] T044 [P] [US5] Hud in `src/ui/Hud.ts` (health, wave, kills, execute prompt) bound to GameState, safe-area CSS, no voice copy
- [ ] T045 [P] [US5] PauseOverlay in `src/ui/PauseOverlay.ts`; pause edge; visibility pause already in Game.ts
- [ ] T046 [US5] AudioSystem in `src/systems/AudioSystem.ts` (Howler gun/blade/hurt/death/bed, respect muted, no VO)
- [ ] T047 [US5] Finish touch (move, shoot, slash, camera) and gamepad mapping in `src/systems/InputSystem.ts`
- [ ] T048 [US5] Hit juice (flash, number, camera punch) without EffectComposer in PresentationSystem / CameraSystem
- [ ] T049 [US5] Mute on HUD + M key via `ui:mute` in `src/ui/Hud.ts`

**Checkpoint**: P5 acceptance scenarios pass in play

---

## Phase 8: User Story 6 - Rip the Champion (Priority: P6)

**Goal**: Stagger a champion, short readable execute, Demolisher’s voice

**Independent Test**: Execute only when ready; rip removes the body; not a long cutscene

- [ ] T050 [US6] Champion kind + stagger / executeReady in `src/gameplay/enemy.ts` and Constants
- [ ] T051 [US6] Execution state machine in `src/gameplay/execution.ts` and CombatSystem (range, lock, queued camera toggle)
- [ ] T052 [US6] Execute prompt on HUD when ready-in-range in `src/ui/Hud.ts`
- [ ] T053 [US6] Rip presentation (short, brutal, readable) in `src/systems/PresentationSystem.ts` / AnimationSystem
- [ ] T054 [US6] Add `tests/execution.test.ts` for not-ready ignore, ready rip, lock duration, death flag `executed: true`

**Checkpoint**: The Demolisher has a voice

---

## Phase 9: User Story 7 - Loot the Corpse (Priority: P7)

**Goal**: Hell-iron trophies mutate weapons and silhouette; restart wipes them

**Independent Test**: Pickup looks meaner and hits harder; restart is clean iron

- [ ] T055 [US7] Trophy entity + drop/collect in `src/gameplay/trophy.ts` and `src/systems/LootSystem.ts` (execute bonus roll)
- [ ] T056 [US7] Apply gun/blade/body mutations and increment silhouetteStage on Demolisher in `src/gameplay/demolisher.ts`
- [ ] T057 [US7] Visible silhouette stages (cracks, extra iron, glow) in `src/systems/PresentationSystem.ts`
- [ ] T058 [US7] Add `tests/loot.test.ts` for drop, collect mutation, reset-to-stage-0

**Checkpoint**: Quiet +3 without a look change is impossible

---

## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T059 [P] Placeholder or compressed GLBs under `public/models` and SFX under `public/audio`; keep primitives if art is missing and note it in README
- [ ] T060 Audit dispose paths on restart in `src/core/Game.ts`
- [ ] T061 Confirm no post-processing, no shadow maps, shared materials, both cameras under budget
- [ ] T062 Run `npm test`, `npm run build`, and `quickstart.md`; fix failures
- [ ] T063 Confirm README + `docs/GAME_DESIGN.md` still match the shipped loop (Wound only, silent, Hell-first)

---

## Dependencies & Execution Order

- **Setup**: none
- **Foundational**: depends on Setup — BLOCKS stories
- **US1**: after Foundational — MVP
- **US2**: after US1
- **US3**: after US2
- **US4**: after US2 + US3
- **US5**: after US3 recommended (HUD can start after US1)
- **US6**: after US2 + US4 (champion in later waves)
- **US7**: after US6 recommended (execute bonus); can drop from normal kills after US2
- **Polish**: after desired stories

### Suggested MVP

T001–T030 (Setup + Foundation + US1). That is already The Demolisher.

### Incremental delivery

1. Lock breaks (gun + blade + cameras)
2. Hell swarms
3. Burial / restart
4. Waves
5. HUD / mute / touch
6. Rip
7. Loot look
8. Polish

---

## Notes

- Do not add React Three Fiber, Drei, bloom, or Heaven enemies in these tasks
- Do not give the Demolisher a voice line
- Keep numbers in `src/core/Constants.ts`
- Commit after each story checkpoint
- If a task does not make the Demolisher feel more unstoppable, it is the wrong task
