export const FIXED_DT = 1 / 60;
export const MAX_SUBSTEPS = 5;
export const DELTA_CAP = 0.1;
export const PIXEL_RATIO_CAP = 2;
export const STICK_DEADZONE = 0.15;

export const DEMOLISHER = {
  HEALTH: 220,
  SPEED: 9,
  RADIUS: 0.55,
  HEIGHT: 1.9,
  SHOTGUN_DAMAGE: 42,
  SLASH_DAMAGE: 55,
};

export const SHOTGUN = {
  RANGE: 11,
  SPREAD: Math.PI / 4.2,
  STARTUP: 0.04,
  ACTIVE: 0.08,
  RECOVERY: 0.38,
};

export const SLASH = {
  RANGE: 2.55,
  ARC: Math.PI * 0.7,
  STARTUP: 0.05,
  ACTIVE: 0.1,
  RECOVERY: 0.28,
};

export const EXECUTE = {
  RANGE: 2.2,
  DURATION: 0.7,
};

export const FODDER = {
  HEALTH: 40,
  SPEED: 5.2,
  DAMAGE: 12,
};

export const CHAMPION = {
  HEALTH: 160,
  SPEED: 3.6,
  DAMAGE: 22,
  STAGGER_THRESHOLD: 1,
};

export const WAVE = {
  PAUSE: 1.6,
  SPAWN_SAFE_RADIUS: 8,
};

export const CAMERA_OTS = {
  DISTANCE: 5.6,
  HEIGHT: 2.35,
  LOOK_AHEAD: 4.6,
  LOOK_HEIGHT: 1.45,
  SHOULDER: 1.05,
  LERP: 10,
};

export const CAMERA_ISO = {
  OFFSET_X: 11,
  OFFSET_Y: 16,
  OFFSET_Z: 11,
  LERP: 8,
};

export const WOUND = {
  SIZE: 42,
  WALL_HEIGHT: 4.5,
  WALL_THICKNESS: 1.4,
  DUMMY_X: 0,
  DUMMY_Z: -8,
};

export const HELL = {
  ASH_BLACK: 0x1a1410,
  IRON: 0x3d342c,
  RUST: 0x8b3a1f,
  EMBER: 0xe85d04,
  BONE: 0xc4b7a6,
  BLOOD: 0x6b1212,
};

export const HEAVEN = {
  MARBLE: 0xe8e4dc,
  COLD_WHITE: 0xf5f7fa,
  PALE_GOLD: 0xc9a227,
  SURGICAL: 0xa8d4d8,
  HALO_SHADOW: 0x2a3340,
  ERASE_LIGHT: 0xfff8e7,
};

export const UI = {
  VISOR: 0xff6b1a,
  GROUND_WOUND: 0x4a4540,
  HUD_BLOOD: 0xc41e3a,
  HUD_GOLD: 0xe0c36a,
};

export const WOUND_LOOK = {
  SKY: 0x24151a,
  FOG: 0x1a1410,
};

export const COLORS = {
  FOG: WOUND_LOOK.FOG,
  SKY: WOUND_LOOK.SKY,
  AMBIENT: 0x2a2420,
  DIRECTIONAL: 0xb8a090,
  FLOOR: UI.GROUND_WOUND,
  WALL: HELL.ASH_BLACK,
  ASH: HELL.ASH_BLACK,
  IRON: HELL.IRON,
  RUST: HELL.RUST,
  BONE: HELL.BONE,
  EMBER: HELL.EMBER,
  BLOOD: HELL.BLOOD,
  VISOR: UI.VISOR,
  MUZZLE: HELL.EMBER,
  BLADE: HELL.BONE,
};

export const ASSET_PATHS = {
  DEMOLISHER: '/models/demolisher.glb',
  DUMMY: '/models/dummy.glb',
  WOUND: '/models/wound.glb',
};
