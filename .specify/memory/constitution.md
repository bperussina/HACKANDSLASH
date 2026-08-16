<!--
  Sync Impact Report
  Version change: 1.0.0 → 1.1.0
  Modified principles:
    I. Core Loop First — first increment is gun-then-blade Demolisher loop, not a single melee attack
    Input architecture — shoot, slash, execute, camera toggle
  Added sections:
    VI. Fantasy Bible
  Removed sections: none
  Follow-up TODOs: none
-->

# HACKANDSLASH Constitution

## Core Principles

### I. Core Loop First
Every feature MUST ship a complete play loop before polish: start, play, fail,
and restart. The first increment MUST deliver **the Demolisher** in **The Wound**:
move, aim, a gun that opens a pack, a blade that finishes what is still standing,
one fail condition, and one enclosed arena. Executions and loot MUST extend that
loop, not replace it. Visual effects, post-processing, complex lighting, and extra
systems MUST wait until that loop is fun and restart-safe.

Rationale: The game is the crunch, not a pretty empty land. Fancy scenes without
shoot-hack-rip that feels good are a demo.

### II. Simulation Owns Truth
Gameplay state (position, health, weapon heat, cooldowns, inventory, wave progress)
MUST live in simulation data, not in the Three.js scene graph. Rendering MUST
follow simulation. Combat, movement, and spawn logic MUST be testable without a
WebGL context. Modules MUST NOT treat a mesh as the source of truth for hit
points, facing, or collision.

Rationale: Three.js is a renderer. Coupling rules to meshes makes restarts leak,
tests impossible, and performance work guesswork.

### III. Restart-Safe Resources
`GameState.reset()` MUST restore a clean slate. Restart and scene change MUST
dispose geometries, materials, textures, animation mixers, physics bodies, audio
nodes, and event listeners that the previous run created. Object pools MUST
return every pellet, slash, hit spark, and enemy to a reusable pool instead of
allocating during play. Stale listeners and undisposed GPU resources are bugs.

Rationale: Browser games die from leaks and "second run is broken" more often
than from missing features.

### IV. Readable Combat
The player MUST always be able to see the Demolisher, incoming attacks, and their
own hit range in **both** cameras. Camera, silhouette, enemy telegraphs, and HUD
MUST serve combat readability first. Visual complexity MUST NOT hide attack
windups, damage, or the path out of danger. If a choice is atmosphere vs. clarity,
clarity wins. Camera toggle is a control, not a cutscene.

Rationale: Hack-and-slash fun is reading space and timing. Unreadable 3D is
unfair, not cinematic.

### V. Performance Budget Is Gameplay
The game MUST target 60 frames per second on a typical laptop and remain
playable at 30 on a mid-range phone. Frame time MUST be capped
(`delta = min(clock.getDelta(), 0.1)`). Pixel ratio MUST be capped at 2.
Shadows, bloom, SSAO, and other post-process passes MUST stay off until the
loop is solid and the budget is measured. Repeated props and fodder enemies
MUST use instancing or merged static geometry. Draw-call count and update cost
MUST be visible in a development overlay.

Rationale: Hitches break timing. A dropped frame in an action RPG is a missed
dodge, not a cosmetic glitch.

### VI. Fantasy Bible
Player-facing fantasy MUST follow `docs/GAME_DESIGN.md`. Locked: the Demolisher
is a silent god of violence; Hell first, then Heaven; cameras are over-the-shoulder
and isometric, player-toggled; loot looks Hell-iron then stolen Heaven gold then
cursed holy mix; the final boss is one being from both thrones. If a system does
not make the Demolisher feel more unstoppable, it MUST NOT ship. This constitution
still wins on engineering (simulation, restart, budget). The bible wins on who
you are, how fights should crunch, and what the war looks like.

Rationale: Brody is creative lead. Engineering rules keep the game playable.
Neither document gets to quietly rewrite the other.

## Three.js Architecture

The stack MUST stay small, explicit, and game-oriented:

- **Renderer**: vanilla Three.js (WebGLRenderer by default). React Three Fiber
  MUST NOT be introduced for core gameplay. Action combat needs a tight loop,
  pooling, and headless tests; a React tree around every enemy fights that.
- **Loop**: `renderer.setAnimationLoop()` is the only animation driver.
  Physics and combat MUST use a fixed timestep; rendering may interpolate.
- **World model**: an ECS (Miniplex) holds entities and components. Systems
  iterate queries. Presentation systems copy simulation transforms onto meshes.
- **Talk between modules**: EventBus only, with `domain:action` names
  (`player:hit`, `enemy:died`, `game:over`). Systems MUST NOT import each
  other to poke private state.
- **Config**: every balance number, color, camera value, and asset path MUST
  live in `Constants`. Magic numbers in systems are a defect.
- **Input**: one InputSystem exposes analog `moveX` / `moveZ`, aim, shoot,
  slash, execute, camera toggle, pause, and mute. Gameplay MUST NOT read
  keyboard, mouse, gamepad, or touch directly.
- **Physics**: Rapier for rigid bodies and combat colliders. Visual meshes MUST
  NOT be used as physics shapes. Hitboxes are capsules, spheres, or boxes.
- **Assets**: GLB in `/public`, loaded through a single AssetLoader with
  progress. Compress with glTF-Transform before shipping. Mixamo-style
  animation clips are driven by `AnimationMixer`, never by per-frame hacks.
- **Helpers that are allowed because they remove toil**: Vite, TypeScript,
  Rapier, Miniplex, Howler, three-mesh-bvh, recast-navigation (pathfinding),
  lil-gui + stats in development. New libraries need a one-line justification
  in the feature plan.

Directory layout for game code:

```text
src/
├── core/        # Game, EventBus, GameState, Constants
├── systems/     # Input, physics, audio, camera, combat
├── gameplay/    # Demolisher, enemies, weapons, loot, waves
├── level/       # Arena builder, asset loader, nav
├── ui/          # HUD, pause, death, mute
└── main.ts
```

## Development Workflow

Work MUST follow Spec-Driven Development with Spec Kit:

1. Constitution (this file) constrains every later artifact.
2. `/speckit-specify` describes player-facing behavior, not libraries.
3. `/speckit-plan` chooses stack and architecture against this constitution.
4. `/speckit-tasks` breaks the plan into independently testable stories.
5. `/speckit-implement` builds only what the tasks list.

Feature work MUST land on a numbered Spec Kit branch and a pull request. Direct
commits to `main` are forbidden except for the original empty-repo bootstrap.
Dad reviews code; Brody owns the fantasy and the feel.

Tests for simulation (damage, cooldowns, wave clear, death, reset) MUST run
without WebGL. Manual playtests cover camera, input, and juice. `npm run build`
MUST pass before a PR is ready.

## Governance

This constitution supersedes informal habits, README notes, and chat suggestions
on engineering. `docs/GAME_DESIGN.md` supersedes them on fantasy. If a plan or
patch conflicts with a principle here, the principle wins unless this file is
amended first. If it conflicts with locked bible decisions (title, silence,
cameras, loot look, Hell-then-Heaven, final boss), the bible wins and the spec
MUST be updated.

Amendments MUST:

- Update `Last Amended` to today's date (ISO `YYYY-MM-DD`).
- Bump version: MAJOR for removed or redefined principles, MINOR for new
  principles or material expansion, PATCH for wording-only clarification.
- Record a Sync Impact Report comment at the top of this file.
- Pass review on a pull request, same as any other change.

Compliance review for every PR:

- Does the change keep simulation independent of meshes?
- Can the player still start, play, fail, and restart without leaks?
- Are new numbers in Constants?
- Does the frame-time budget still hold, or is the cost measured?
- Is the work specified, planned, and tasked when it is a new feature?
- Does it make the Demolisher feel more unstoppable, per the fantasy bible?

**Version**: 1.1.0 | **Ratified**: 2026-08-15 | **Last Amended**: 2026-08-15
