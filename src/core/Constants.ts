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
  DISTANCE: 5.2,
  HEIGHT: 2.15,
  LOOK_AHEAD: 4.2,
  LOOK_HEIGHT: 1.35,
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

export const COLORS = {
  FOG: 0x140a08,
  AMBIENT: 0x4a2a22,
  DIRECTIONAL: 0xffc4a0,
  FLOOR: 0x2a1a14,
  WALL: 0x1c100c,
  IRON: 0x2b2420,
  IRON_RIM: 0x5a3a22,
  RUST: 0x5c3a28,
  DUMMY: 0x6a4030,
  MUZZLE: 0xffcc66,
  BLADE: 0xc4b8a8,
};

export const ASSET_PATHS = {
  DEMOLISHER: '/models/demolisher.glb',
  DUMMY: '/models/dummy.glb',
  WOUND: '/models/wound.glb',
};
