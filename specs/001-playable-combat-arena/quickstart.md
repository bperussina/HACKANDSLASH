# Quickstart: The Wound — First Massacre

Validate this feature by playing the crunch, not by reading code. Fantasy check: you should feel like a locked weapon that just woke up, not a soldier on a tutorial island.

## Prerequisites

- Node 22+
- npm
- Chromium-based browser for the happy path

## Setup

```bash
npm install
npm test
npm run dev
```

Open the URL Vite prints (default `http://localhost:3000`). Wait until loading finishes.

## Play checks (map to spec stories)

1. **The lock breaks (P1)** — Default camera is over-the-shoulder. Toggle isometric with V / camera button. Shotgun the chained dummy. Slash it. Dummy flinches only on real hits.
2. **Hell swarms (P2)** — Fodder rush. Open a hole with the gun. Finish a close one with the blade.
3. **Burial (P3)** — Drop to 0 HP. Wordless defeat. Restart. Full health, wave 1, clean Hell iron, no leftover demons.
4. **Waves (P4)** — Clear wave 1. Wave 2 is worse. Death restarts at 1.
5. **Read it (P5)** — Health, wave, kills visible. Pause. Mute. Touch or pad still works. Both cameras stay readable.
6. **Rip (P6)** — Stagger the champion. Execute. Short rip. Not a cutscene.
7. **Loot (P7)** — Trophy on the floor. Pick it up. Silhouette gets wronger. Next pack dies faster. Restart wipes the look.

## Headless checks

```bash
npm test
```

Expected: combat (cone + arc), execute, waves, loot+reset tests pass with no WebGL.

## Performance glance (dev only)

8 fodder, both cameras, near 60 fps on a laptop, draw calls well under 100, geometry counts do not climb across restarts.

## Contracts

- Events: [contracts/events.md](./contracts/events.md)
- Input: [contracts/input.md](./contracts/input.md)
- Run state: [contracts/gamestate.md](./contracts/gamestate.md)
- Entities: [data-model.md](./data-model.md)
- Bible: [docs/GAME_DESIGN.md](../../docs/GAME_DESIGN.md)
