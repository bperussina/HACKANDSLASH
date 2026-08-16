# Research: The Wound — First Massacre

Decisions for the first Demolisher slice. Fantasy locks live in `docs/GAME_DESIGN.md`. This file is how we build them.

## R1. Renderer: vanilla Three.js, not React Three Fiber

- **Decision**: `three@0.185` with `WebGLRenderer`. TypeScript modules. No R3F, Drei, or `@react-three/rapier`.
- **Rationale**: Gun pellets, slashes, executions, and pools hate React mount/unmount. Constitution forbids R3F for core gameplay.
- **Alternatives considered**: R3F + ecctrl (pretty, weak for packs); Babylon.js (wrong engine); WebGPU/TSL (later).

## R2. App shell: Vite + TypeScript

- **Decision**: Vite 7, `"type": "module"`, TypeScript strict. `renderer.setAnimationLoop` in `Game.ts`. Addons via `three/addons/...`.
- **Rationale**: Community default. Strict types catch “mesh is the Demolisher.”

## R3. World model: Miniplex ECS + EventBus + GameState

- **Decision**: Miniplex 2 for entities. EventBus `domain:action`. GameState for run flags (paused, muted, wave, kills, camera mode, silhouette stage).
- **Rationale**: Hundreds of entities, not tens of thousands. bitECS later if we ever spray that many pellets.

## R4. Physics: Rapier, simple shapes

- **Decision**: `@dimforge/rapier3d-compat`. Kinematic capsules for Demolisher and Hell bodies. Shotgun is a cone query (several sphere casts or a convex fan approximated by overlap). Slash is a capsule sweep. Trophies are triggers. Visual GLB is never the collider.
- **Rationale**: Deterministic melee and shotgun without mesh soup.
- **Alternatives considered**: cannon-es; hitscan-only shotgun (less “furnace door”); mesh raycasts.

## R5. Loop timing

- **Decision**: `setAnimationLoop`, delta cap 0.1, physics/combat at 1/60 (max 5 substeps), `document.hidden` pauses, pixel ratio `min(dpr, 2)`, `powerPreference: 'high-performance'`.
- **Rationale**: Shotgun windows and execute beats must be honest on 30/60/144 Hz.

## R6. Input: analog move, aim, shoot, slash, execute, camera toggle

- **Decision**: One InputSystem. Gameplay reads `InputSample` only. Click-to-move is forbidden (bible is Doom-ARPG, not classic Diablo).
- **Rationale**: Separate shoot and slash so the crunch is a cycle, not one button.
- **Helpers**: write our own. Skip FPS controllers and `ecctrl`.

## R7. Camera: two real cameras, one toggle

- **Decision**: `CameraSystem` owns two rigs:
  - **Over-the-shoulder** (default): perspective, behind/above the shoulder, look along aim. God-fantasy. Gun traces read here.
  - **Isometric**: high-angle perspective (or ortho if readability wins in playtest), follow, pack-readable. ARPG. Loot on the floor reads here.
  Toggle interpolates quickly (not a cutscene). No OrbitControls in play. Debug fly-cam is lil-gui only.
- **Rationale**: Bible lock. Dual camera is not optional flavor. Both must pass readable-combat.
- **Alternatives considered**: single high-angle (rejected by bible); true FPS (hides the Demolisher); cinematic blend longer than ~200ms (hides windups).

## R8. Weapons: shotgun cone then blade, then rip

- **Decision**: Shotgun is a short-range cone of pooled pellets/queries, not a sniper hitscan. Blade is a melee arc. Execution is a state machine on champion stagger, not a second slash with bigger numbers.
- **Rationale**: Bible combat identity: gun opens, blade finishes, execution rips.
- **Out of slice**: fist, blade storm, walking artillery, angel-yank chain.

## R9. Assets and look

- **Decision**: GLB in `public/models`. Placeholders legal: bulky dark capsule = Demolisher, rust primitives = Hell iron, red-brown fodder, chained dummy. Mixamo clips: idle, run, shoot, slash, execute, hit, death. Silhouette stages are material/emissive/extra meshes, not a quiet stat roll. Compress with glTF-Transform when real art lands.
- **Rationale**: Core Loop First. Hell-iron look can start as color and spikes. Quiet +3 without a look change is a bible defect.

## R10. Audio: Howler, no voice

- **Decision**: howler.js. Gun, blade, rip, hurt, death, optional industrial/Hell bed. `GameState.muted`. Zero Demolisher VO files. Fodder may shriek.
- **Rationale**: Silence is locked. Howler handles mute and gesture unlock.

## R11. Pathfinding

- **Decision**: Defer recast. Wound is open. Fodder chase and slide on Rapier.
- **Rationale**: Rooms come with later lands.

## R12. Presentation budget

- **Decision**: `MeshStandardMaterial`, one directional + ambient, ash fog. No shadow maps, no EffectComposer. Shared materials. Instance fodder if a wave is large. Juice = muzzle flash, blade spark, camera punch, execute beat — no bloom required.
- **Rationale**: Constitution V. Crunch does not need a composer.

## R13. Testing

- **Decision**: Vitest. Worlds without canvas. Cover cone hit/miss, arc hit/miss, stagger → execute, trophy apply + reset, wave clear vs simultaneous death.
- **Rationale**: Constitution II.

## R14. Not now

| Helper / content | Why not |
|------------------|---------|
| R3F / Drei | Constitution |
| Theatre.js | No cinematics |
| Heaven roster / Diarch | Later lands |
| Nav mesh | Open Wound |
| Postprocessing | Budget |
| Networking | Single player |

## R15. Dev overlay

- **Decision**: lil-gui in DEV: shotgun cone, slash recovery, wave sizes, camera distances. Never in production.
