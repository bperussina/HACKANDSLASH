# HACKANDSLASH

**The Demolisher.** A silent god of violence that Hell and Heaven both tried to use. Now you hunt both of them.

This repo is set up with [GitHub Spec Kit](https://github.com/github/spec-kit) so we write **what the game is** before we write the code.

Creative bible (fantasy wins here): [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md)  
Engineering rules: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)

## Play (once it is built)

```bash
npm install
npm test
npm run dev
```

Then follow [the Wound quickstart](specs/001-playable-combat-arena/quickstart.md).

The first slice is **The Wound** — not the full campaign. You wake already terrifying. Shotgun opens the pack. Blade finishes what is still standing. You can toggle over-the-shoulder and isometric. Hell swarms you. You rip a champion. You loot ugly iron off the corpse. Heaven comes later.

## How we build

1. **Bible** — Brody locks the fantasy in `docs/GAME_DESIGN.md`
2. **Constitution** — engineering laws the code cannot shrug off
3. **Specify** — player-facing behavior
4. **Plan** — Three.js stack and helpers
5. **Tasks** — boxes to check
6. **Implement** — only what the tasks say
7. **Pull request** — never dump features onto `main`

Active feature:

- Spec: [`specs/001-playable-combat-arena/spec.md`](specs/001-playable-combat-arena/spec.md)
- Plan + research: [`specs/001-playable-combat-arena/plan.md`](specs/001-playable-combat-arena/plan.md)
- Tasks: [`specs/001-playable-combat-arena/tasks.md`](specs/001-playable-combat-arena/tasks.md)

In Cursor, Spec Kit skills live under `.cursor/skills/`.

## Three.js stack (first slice)

Three.js is a **renderer**, not a game engine. Helpers stay small so combat stays honest:

| Piece | Choice | Why |
|-------|--------|-----|
| App | Vite + TypeScript | Fast refresh, strict types |
| Render | vanilla Three.js r185 `WebGLRenderer` | Tight loop, no React around every demon |
| World | Miniplex ECS | Entities are data; meshes are views |
| Physics | Rapier | Capsules, shotgun cone, blade sweep |
| Audio | Howler | Mute, crunch, no voice boilerplate |
| Input | one InputSystem | Move, aim, shoot, slash, execute, camera |
| Tests | Vitest | Combat and reset with **no** WebGL |

No React Three Fiber, Drei, bloom, or dynamic shadows in this slice. Pretty comes after the crunch is fun.

Why those choices: [`specs/001-playable-combat-arena/research.md`](specs/001-playable-combat-arena/research.md).

## Spec Kit locally

Initialized with `specify` 0.16.4 (Cursor skills + git extension). After clone:

```bash
specify check
```
