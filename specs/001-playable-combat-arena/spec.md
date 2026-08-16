# Feature Specification: The Wound — First Massacre

**Feature Branch**: `001-playable-combat-arena`

**Created**: 2026-08-15

**Status**: Draft

**Input**: User description: initiate Spec Kit for a Three.js hack-and-slash action RPG, then fold in `docs/GAME_DESIGN.md` (The Demolisher).

**Fantasy source**: [`docs/GAME_DESIGN.md`](../../docs/GAME_DESIGN.md) — locked title, silence, dual cameras, Hell-then-Heaven, loot look, final boss. This feature is only **The Wound**, the first land.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Lock Breaks (Priority: P1)

The player loads into **The Wound**: ash sky, broken mortal ground, the moment the prison fails. They are already **the Demolisher** — a god-shaped wrecking figure in ugly Hell iron, not a knight and not a marine. No intro speech. They run, they aim, they **shoot** a chained demon dummy with a furnace-door shotgun, then **hack** it with a butcher blade. A camera control toggles **over-the-shoulder** (default, see the god) and **isometric** (see the space). Both views keep the body, the gun cone, and the blade arc readable.

**Why this priority**: This is the identity. If shooting a hole and finishing with the blade is not fun, nothing else is the game.

**Independent Test**: Load in, move, toggle both cameras, shotgun the dummy, slash the dummy. Dummy flinches only when actually hit. No living hunters required.

**Acceptance Scenarios**:

1. **Given** loading has finished, **When** the player moves, **Then** the Demolisher runs inside The Wound and cannot walk through walls or fall out of the world.
2. **Given** a new run, **When** the player has not touched camera, **Then** the view is over-the-shoulder, close enough to read the Demolisher.
3. **Given** the player is in control, **When** they use the camera toggle, **Then** the view switches to isometric (or back) without a cutscene, and gun cone plus blade arc stay readable.
4. **Given** the Demolisher is aiming at the chained dummy, **When** they shoot, **Then** a short-range shotgun blast hits only what is inside the cone and the dummy flinches.
5. **Given** the dummy is inside the blade arc, **When** they slash, **Then** the dummy flinches; if it is outside the arc, it does not.
6. **Given** shoot or slash recovery, **When** the player mashes the same control, **Then** extra presses do nothing until recovery ends.

---

### User Story 2 - Hell Swarms (Priority: P2)

Imps and bone-mutts pour in. They charge. They are loud and honest. The player **shoots a hole in the pack**, then **hacks through whatever is still standing**. Several hunters can be on screen without losing the Demolisher. Hell is not a puzzle. It is meat.

**Why this priority**: A Demolisher with no pack is a statue. This is the first real massacre.

**Independent Test**: Wave-1 Hell fodder spawn, shotgun at least one, blade-kill at least one, survive contact.

**Acceptance Scenarios**:

1. **Given** a fight has started, **When** Hell fodder are present, **Then** they rush the Demolisher and strike at close range.
2. **Given** fodder inside the shotgun cone, **When** the player shoots, **Then** those targets take damage and flinch; targets outside the cone do not.
3. **Given** a close enemy inside the blade arc during an active slash, **When** the hit connects, **Then** that enemy takes damage.
4. **Given** an enemy's health reaches zero without an execution, **When** the killing blow lands, **Then** it plays a defeat reaction and leaves the fight.
5. **Given** three or more enemies on screen, **When** the player looks, **Then** they can still pick out the Demolisher, the nearest threat, and whether the last shot or slash connected.

---

### User Story 3 - The Pack Buries You (Priority: P3)

The Demolisher starts strong, not fragile, but a swarm can still bury them. Health is visible. Hits hurt. At zero, the fight stops — the lock almost takes, the massacre ends — and the player can break out again from a clean Wound. No leftover demons. No stuck gun.

**Why this priority**: Risk makes the power trip real. Restart is how you hunt.

**Independent Test**: Let the pack drop health to zero, choose restart, play a fresh Wound with full health and no leftover foes.

**Acceptance Scenarios**:

1. **Given** an enemy strike connects and hurt invulnerability is down, **When** damage applies, **Then** health drops and a hit reaction plays.
2. **Given** health is still above zero, **When** the player keeps fighting, **Then** the massacre continues.
3. **Given** health reaches zero, **When** the last hit lands, **Then** the fight freezes, a short defeat state appears (no speech from the Demolisher), and move/shoot/slash no longer change the world until restart.
4. **Given** the defeat state, **When** the player restarts, **Then** The Wound, health, enemies, waves, loot, and power return to a first-break state with no ghost damage or stuck controls.

---

### User Story 4 - They Keep Coming (Priority: P4)

Clear the pack. A breath. A worse pack. Wave number is visible. Hell still thinks numbers work. The run lasts until the Demolisher is buried.

**Why this priority**: Waves are the smallest session that still feels like a hunt.

**Independent Test**: Clear wave 1, confirm wave 2 is harder, confirm death restarts at wave 1.

**Acceptance Scenarios**:

1. **Given** every living foe in the wave is gone, **When** a short pause ends, **Then** the next wave spawns and the counter increases.
2. **Given** a later wave, **When** it starts, **Then** it is harder (more fodder, a tougher body, or both).
3. **Given** a wave in progress, **When** the Demolisher falls, **Then** the run ends on that wave and restart begins at wave 1.

---

### User Story 5 - Read the Massacre (Priority: P5)

The player always sees health, wave, and kills. Hits punch. The next attack stays readable. Pause, mute, resume. Keyboard, mouse, gamepad, or touch. The Demolisher never talks. Labels stay short.

**Why this priority**: Fair feedback is how a god-fantasy stays honest.

**Independent Test**: Play a wave with HUD up, pause and resume, mute, finish a fight on desktop or touch, keep both cameras usable.

**Acceptance Scenarios**:

1. **Given** a fight, **When** the player looks at the screen, **Then** they can read health, wave, and kills without covering the Demolisher.
2. **Given** a hit on either side, **When** damage applies, **Then** a short readable reaction plays and the next shot or slash is still visible.
3. **Given** a running fight, **When** the player pauses, **Then** the world freezes and resume restores the same fight.
4. **Given** sound, **When** the player mutes, **Then** music and effects go silent until unmuted.
5. **Given** a touch device, **When** they use on-screen move, aim/shoot, slash, and camera toggle, **Then** those actions match keys and gamepad.

---

### User Story 6 - Rip the Champion (Priority: P6)

A bigger Hell body (armored mutt / champion) shows up in a later wave. Gun and blade can stagger it. When it is ready, an execute control **rips** it. Short, brutal, readable. This is the Demolisher’s voice. A glory-kill beat. Better loot chance than a normal kill (even if loot ships in the next story, the execute must feel like a trophy moment).

**Why this priority**: Executions are locked in the bible. Without them the Demolisher has no voice.

**Independent Test**: Stagger the champion, execute, confirm a normal mash-slash cannot skip the execute window, confirm the body is gone after the rip.

**Acceptance Scenarios**:

1. **Given** a champion is in the execute-ready state, **When** the player uses execute in range, **Then** a short readable rip plays, the champion dies, and the player cannot move through it as a living foe afterward.
2. **Given** a champion is not execute-ready, **When** the player presses execute, **Then** nothing special happens (no random rip).
3. **Given** an execution is playing, **When** other fodder are nearby, **Then** the Demolisher has a brief locked beat (short, not a long cutscene) and readability of remaining threats returns immediately after.

---

### User Story 7 - Loot the Corpse (Priority: P7)

Corpses drop **trophies**, not clutter: Hell-iron chunks, a spike, a furnace shard. Picking one up mutates the gun or blade a little and **cracks the silhouette** — glow, extra iron, wronger shape. Numbers may go up; the body MUST look meaner. Death resets the run’s trophies. This is monster-to-myth inside one Wound, not a town vendor.

**Why this priority**: Loot is how the ARPG sits on the Doom skeleton. Quiet +3 without a look change is forbidden by the bible.

**Independent Test**: Execute or kill until a trophy drops, pick it up, see the body/weapon change and feel a stronger shot or slash, die, confirm the next run starts clean Hell iron.

**Acceptance Scenarios**:

1. **Given** an enemy dies (especially an executed champion), **When** loot is rolled, **Then** a visible Hell-iron trophy can hit the floor.
2. **Given** the Demolisher walks over a trophy, **When** it is collected, **Then** gun and/or blade get meaner and the silhouette looks more cracked/iron than before.
3. **Given** trophies collected this run, **When** the player dies and restarts, **Then** look and power return to the first-break Hell-iron state.

---

### Edge Cases

- Mash shoot or slash during recovery: ignored until recovery ends.
- Shoot and slash on the same frame: one wins by a fixed rule (slash if already in blade range, otherwise shoot) so both do not double-fire.
- Hit during your own slash or shot: both can apply; you are not cancelled unless you die.
- Two enemies hit the same moment: both can apply, then short hurt invulnerability stops a one-frame death spiral.
- Last fodder dies in the same moment you die: defeat wins; next wave does not start.
- Hidden tab: fight pauses; return does not skip time.
- Assets still loading: loading state; no move/shoot/slash.
- Spawn on top of the player: never. Safe radius.
- Camera toggle during execution: queued until the rip ends, then applies.
- Tiny screen: HUD in safe margins; OTS still shows the Demolisher; isometric still shows the pack.
- The Demolisher never speaks on HUD, death, or pickup. Other things may scream.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST present a single enclosed **Wound** arena (ash, broken ground) the Demolisher can fully traverse without falling out of the world.
- **FR-002**: The player character MUST be the Demolisher: silent, already strong, Hell-iron wrecking silhouette, not a trainee knight.
- **FR-003**: Players MUST move with keyboard, gamepad, or on-screen stick, same analog idea on every device.
- **FR-004**: Players MUST aim with mouse, right stick, or move-facing, so shotgun and blade go where they intend.
- **FR-005**: Players MUST shotgun with a short-range cone (keyboard, mouse, gamepad, or touch).
- **FR-006**: A shotgun blast MUST occupy startup/active/recovery, ignore extra presses in recovery, and damage only targets in the cone.
- **FR-007**: Players MUST melee slash with a separate control. Slash has startup/active/recovery and damages only the arc.
- **FR-008**: The Wound MUST include a chained Hell dummy so gun and blade can be proven without a living pack.
- **FR-009**: The game MUST spawn Hell fodder (imps and/or bone-mutts) that rush and melee.
- **FR-010**: Fodder MUST have health, take shotgun and slash damage, and leave the fight at zero HP (unless executed).
- **FR-011**: The Demolisher MUST have health, take damage, and get short hurt invulnerability after a hit. Starting health and damage MUST feel strong, not tutorial-weak.
- **FR-012**: At zero health the game MUST stop the fight, show a wordless-or-minimal defeat state, and offer restart.
- **FR-013**: Restart MUST restore Wound, body, weapons, enemies, waves, trophies, and controls to a first-break state with no leaks.
- **FR-014**: Combat MUST run in numbered escalating waves until death.
- **FR-015**: Enemies MUST spawn inside the arena, not overlapping the Demolisher.
- **FR-016**: HUD MUST show health, wave, and kills during a fight without covering the body.
- **FR-017**: Players MUST pause/resume and mute/unmute. Hidden tab MUST pause.
- **FR-018**: Players MUST toggle **over-the-shoulder** and **isometric** any time they are in control (not during a rip). Default new run: over-the-shoulder. Both MUST keep hero, incoming attacks, and hit range readable.
- **FR-019**: Loading MUST block play until required assets are ready, with visible progress.
- **FR-020**: Audio MUST include mute-respecting gun, blade, hurt, death, and optional bed. No Demolisher voice lines.
- **FR-021**: Later waves MUST include at least one champion that can be staggered into an execute-ready state.
- **FR-022**: Players MUST execute an execute-ready champion in range with a dedicated control. The rip is short, brutal, readable, and is the only “voice.”
- **FR-023**: Deaths (especially executions) MUST be able to drop Hell-iron trophies on the floor.
- **FR-024**: Collecting a trophy MUST make weapons meaner and MUST change the silhouette (cracks, extra iron, glow). Quiet number-only upgrades are not enough.
- **FR-025**: The first slice MUST be single-player, local, no accounts, no town, no Heaven, no Diarch, no online.
- **FR-026**: Combat readability MUST hold with at least 8 fodder on screen in both cameras.

### Key Entities

- **Demolisher**: Player wrecking-god. Position, facing, health, max health, move speed, shotgun damage/cone, slash damage/arc, hurt lock, silhouette stage, alive, input.
- **Hell Fodder**: Imp or bone-mutt. Position, facing, health, rush, melee, wave index, alive.
- **Champion**: Tougher Hell body. Same as fodder plus stagger and execute-ready flag.
- **Chained Dummy**: Stationary Hell target for proving gun and blade.
- **Shotgun Blast**: Short-lived cone volume. Owner, facing, range, spread, damage, hit set, active window.
- **Slash**: Short-lived arc volume. Owner, facing, range, arc, damage, hit set, active window.
- **Execution**: Short locked rip vs an execute-ready champion.
- **Trophy**: Floor loot. Hell-iron look, weapon and/or silhouette mutation.
- **Wave**: Numbered pack. Composition, remaining, pause.
- **Run**: One break of the lock until burial. Wave, kills, trophies, pause, mute, camera mode.
- **The Wound**: Enclosed first land. Bounds, spawns, dummy, ash framing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new player can move, toggle camera, and land both a shotgun hit and a slash on the chained dummy within 45 seconds of The Wound appearing.
- **SC-002**: A player can kill at least one living Hell foe with the gun and at least one with the blade on the first session, with no document besides on-screen prompts.
- **SC-003**: After burial, restart returns a playable Wound in under 3 seconds, full health, wave 1, first-break Hell iron.
- **SC-004**: With 8 fodder on screen, testers can point to the Demolisher, the nearest threat, and whether the last shot or slash hit, in **both** cameras, in one glance.
- **SC-005**: On a typical laptop an 8-enemy wave feels smooth while moving, shooting, and slashing. On a mid-range phone the same wave stays controllable.
- **SC-006**: 9 out of 10 restarts leave no leftover enemies, trophies, missing controls, or ghost damage.
- **SC-007**: Players can complete a 3-wave run (or die trying) without a settings document: pause, mute, move, aim, shoot, slash, and camera toggle are on the screen or obvious keys.
- **SC-008**: A player who rips a champion and loots a trophy can see the body get wronger and feel the next pack die faster; after restart that look and bonus are gone.
- **SC-009**: Reviewers who know the bible agree this slice still answers: **are the evil forces afraid of me yet?** (Early: they swarm. They do not lecture. They do not look like Heaven.)

## Assumptions

- This feature is **The Wound only** — land 1 of the campaign bible. Ash Courts through Both Thrones are later specs.
- Heaven roster, the Pit King, the Judge, and the Diarch are out of scope here.
- Controls are action (run, aim, shoot, slash), not click-to-move Diablo.
- Shotgun is the first gun. Blade is the first melee. Fist, chain, walking artillery are later builds.
- Violence is readable and stylized (crunch, flash, rip beats), not photoreal gore.
- The Demolisher starts strong. Leveling and loot make a monster into a myth, not a weakling into a soldier.
- English UI is fine; prefer few words; never give the Demolisher a line.
- A run lives in the current browser session. No cloud save.
- Touch, keyboard, mouse, and gamepad are in scope.
- Pathfinding is chase-and-slide in an open Wound. Nav mesh later, when lands have rooms.
- Engine and helper choices belong in the plan, not here.
