# Art Style — Hard-Edge Divine Ruin

How **The Demolisher** looks. Fantasy lives in [`GAME_DESIGN.md`](GAME_DESIGN.md). This file wins on color, shape, material, and what must never appear on screen.

**Creative lead**: Brody  
**Locked**: 2026-08-15

If a picture is pretty but you cannot read the swing, the gun cone, or the Demolisher in a pack, it is wrong. Clarity beats atmosphere. The constitution still wins on frame budget: no bloom soup, no cinematic shadows, no photoreal pores.

---

## The look in one sentence

Chunky god-shapes, two palettes that hate each other, materials that look **stolen**, readable from over-the-shoulder and from the sky.

Not a marine shooter. Not muddy Diablo brown. Not pretty stained-glass Heaven. Hell is ugly and honest. Heaven is clean and worse. The Demolisher is the crack between them.

---

## Pillars

1. **Silhouette first.** The Demolisher is a walking siege engine. Enemies are graphic monsters, not anatomy studies. If you squint, you still know who is who.
2. **Two palettes.** Ember-and-iron vs marble-and-gold. They do not mix until cursed-holy endgame, and then the mix is the point.
3. **Hard edges.** Bevels, plates, spikes, halos as hardware. Soft fur, cloth sim, and skin detail are banned.
4. **Light is a tell.** Ember mouths, halo seams, muzzle flash, slash streaks. Light shows the attack. It is not mood fog.
5. **Oversized tools.** Guns like furnace doors. Blades like butcher tools. Halos used as saws. If it could be a real museum sword, it is too small.
6. **Power is visible.** Levels crack the body. Loot bolts new iron or stolen gold onto the silhouette. Numbers may rise; the picture MUST get meaner.

---

## What it is / what it is not

| It is | It is not |
| --- | --- |
| Stylized PBR, chunky, graphic | Photoreal, film grain, Unreal cinematic |
| Doom Eternal readability + Darksiders god-body | Cute, chibi, anime face, Fortnite |
| Hades-level color coding in a 3D world | Brown sludge, black-on-black demons |
| Heaven as a courtroom / hospital of light | Church-calendar angels with fluffy wings |
| Short brutal executions, big readable shapes | Torture porn, gore soup, ragdoll spaghetti |

Touchstones (steal the *job*, not the assets): Doom 2016/Eternal (material crunch, enemy read), Darksiders (god-shaped wrecking figure), Hades (silhouette + color coding), Ultrakill (graphic violence that still plays).

---

## The Demolisher

A god-shaped wrecking figure. Not a knight. Not a marine. No face. Silence has a visor.

**Shape:** Wide trapezoid torso, thick arms, short neck, heavy boots. A walking bunker. From behind (OTS) the shoulders and gun read as a triangle. From above (iso) the body is a dark iron wedge with an ember slit.

**Face:** Sealed helm. One horizontal ember visor so facing is obvious. No mouth. No eyes. No talking jaw.

**Starting armor (Hell iron):** Cooked leather, black plate, rust rivets, bone teeth used as clasps. Ugly on purpose.

**Later:** Gold cracks through the iron like the metal is trying to become holy and failing. Broken halo shards bolt on as pauldron junk.

**Endgame:** Split silhouette. Ash and gold in the same body. Looks like both realms glued a god together and it hated them for it.

**Read color:** Ember visor `#FF6B1A` is unique. No enemy uses that exact slit. That is how you pick the hero out of a swarm.

---

## Palettes (use these hexes)

Put them in `Constants`. Do not invent a third brown.

### Hell — ember and iron

| Role | Hex | Use |
| --- | --- | --- |
| Ash black | `#1A1410` | Sky voids, deep plate, shadows |
| Iron | `#3D342C` | Armor, guns, bars |
| Rust | `#8B3A1F` | Wear, Hell-iron loot |
| Ember | `#E85D04` | Mouths, cracks, muzzle, slash heat |
| Bone | `#C4B7A6` | Spikes, dummy, trophies |
| Blood | `#6B1212` | Hits, leftover war |

### Heaven — marble and judgment

| Role | Hex | Use |
| --- | --- | --- |
| Marble | `#E8E4DC` | Floors, statues, soldier plates |
| Cold white | `#F5F7FA` | Wings-as-planes, erase flashes |
| Pale gold | `#C9A227` | Halos, stolen loot, Judge trim |
| Surgical | `#A8D4D8` | Heal auras, formation lines |
| Halo shadow | `#2A3340` | Heaven’s dark is blue-gray, not Hell black |
| Erase light | `#FFF8E7` | The “holy” hit that is actually a delete |

### Shared / UI

| Role | Hex | Use |
| --- | --- | --- |
| Hero visor | `#FF6B1A` | Demolisher only |
| Ground Wound | `#4A4540` | Ashen mortal stone |
| HUD blood | `#C41E3A` | Health, readable on both palettes |
| HUD gold | `#E0C36A` | Wave, trophies |

Hell light is warm and dirty. Heaven light is cold and even. Never light Heaven with Hell orange. Never light Hell with surgical cyan.

---

## Lands

Each land is a new material, not a tinted copy of the last arena.

1. **The Wound** — broken mortal ground. Ash concrete. Sky like a bruise with ember tears. Black-iron prison pieces half-sunk in the floor. This is the first slice. It should already look like a massacre, not a tutorial gym.
2. **Ash Courts** — cinders, bone fences, low red sky. Fodder school.
3. **Blood Cities** — stacked iron, chained architecture, fire that thinks (glowing veins in the walls).
4. **Pit King court** — a throne of meat and rust. Huge. Ugly. Honest.
5. **The Gate Between** — dead white-and-black. No warmth. No gold. A drained world. This is the palette reset before Heaven.
6. **The Choir** — too-clean marble, repeating arches, gold lines that look like jail bars.
7. **High Host** — living statues, law-weapons, space that feels measured with a ruler.
8. **Both Thrones** — the two palettes slammed into one room. Split floor: ash left, marble right. The Diarch stands on the crack.

---

## Enemies

Graphic types, not zoology.

**Hell:** Hunched. Asymmetric. Claws, jaws, extra iron bolted to meat. Telegraph = ember in the mouth or fists (winds up bright, then strikes). Fodder is smaller than the Demolisher. Champions are thicker, not taller-and-skinny.

**Heaven:** Upright. Symmetric until they unfold. Wings are hard planes or gold rings, never feathers. Telegraph = a halo seam lighting up, or a gold line drawing the attack path on the floor. They look like people until they don’t — then the body opens into geometry.

**The Diarch:** One body, two faces. Left melted Hell king. Right perfect Judge. Two crowns. The split is a vertical material seam, readable from both cameras. When they talk over each other, the matching half lights.

Facing and windup must read in **both** cameras. A tell that only works in close-up OTS is illegal.

---

## Weapons and loot

**Hell iron:** Furnace-door shotgun. Butcher blade. Bone, rust, spikes. Scuffed. Heavy.

**Stolen Heaven gold:** Marble furniture turned into guns. Halo discs as blades. Clean edges on a killer. It should look *wrong* in the Demolisher’s hands — too holy, held like a club.

**Cursed holy:** Gold cracked with ash. Halo saws. A cannon that coughs ember and erase-light together. Nothing blessed. Everything taken.

Ground loot is chunky trophies (a spike, a furnace shard, a cracked halo), not tiny gems. If you cannot see it in isometric, it is too small.

---

## VFX (keep it cheap and loud)

First slice: unlit/simple materials, no bloom, no SSAO, no dynamic shadows. Style still holds.

- Muzzle: one orange flash plane + a few ember sparks. Not a particle hurricane.
- Slash: a short hot-iron arc that matches the real hit volume.
- Hit: chunky spark + a dark blood decal or a gold-chip, depending on victim.
- Execution: big readable poses, 1–2 seconds, then loot. No camera shake that hides the body.
- Death: Hell foes collapse into ash/iron. Heaven foes shatter into marble chips. The Demolisher’s defeat is the visor going dark — the lock almost takes. No speech.

---

## Cameras are part of the art

**Over-the-shoulder:** Show the god. Shoulder plates, gun, visor glow. Keep a clear hole down the aim line. Do not put a giant pauldron over the shotgun.

**Isometric:** Show the pack. Unique top-down silhouettes. Hero = iron wedge + ember. Hell fodder = hunched blobs. Heaven later = circles and wings. Floor contrast must keep feet readable.

Same character. Same materials. Two reads.

---

## UI

HUD is scrap and relic, not a phone overlay.

- Health: a blood-iron bar, not a heart cartoon.
- Wave: stamped numbers, bone or gold depending on land.
- Camera toggle and mute: simple hard icons, high contrast.
- Defeat: visor dark, short lock-bars slamming. No quote from the Demolisher.
- Pause: the world holds. No cute mascot.

Text is heavy, condensed, a little cracked. Never script, never comic bubble.

---

## First-slice target (The Wound)

Enough to start building without the rest of the campaign:

- Ash ground `#4A4540`, bruise sky, broken iron prison bits.
- Demolisher in Hell iron, ember visor, furnace shotgun, butcher blade.
- Chained dummy in bone and rust.
- Hell fodder: hunched, smaller, ember mouths.
- Trophy: a chunk of ugly iron you can see from iso.
- Lights: one dirty key, one dim fill. Ember as accent only on visor, muzzle, mouths.

If this screenshot does not look like a god just broke out of a cage, the art is not done.

---

## Never

- Photoreal faces, pores, or “normal-map flex.”
- Fluffy angel wings or cute imps.
- Mud-brown everything.
- Bloom that hides a telegraph.
- Black enemies on black floors.
- A Heaven that looks kind.
- A Demolisher with a chatty mouth or anime eyes.
- Loot sparkles like an MMO coin shower.
- Cloth capes that fight the silhouette.

---

Protect this picture:

> A sealed iron god with an ember visor, too-big gun, too-big blade, standing on ash, about to ruin a throne — and later, a gold one too.
