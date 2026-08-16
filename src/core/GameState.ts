import { DEMOLISHER } from './Constants.ts';

export type CameraMode = 'ots' | 'iso';

export type GameStateShape = {
  started: boolean;
  paused: boolean;
  muted: boolean;
  isPlaying: boolean;
  awaitingRestart: boolean;
  waveIndex: number;
  kills: number;
  cameraMode: CameraMode;
  heroAlive: boolean;
  heroHealth: number;
  heroMaxHealth: number;
  silhouetteStage: number;
  executePrompt: boolean;
};

function defaults(): GameStateShape {
  return {
    started: false,
    paused: false,
    muted: false,
    isPlaying: false,
    awaitingRestart: false,
    waveIndex: 1,
    kills: 0,
    cameraMode: 'ots',
    heroAlive: true,
    heroHealth: DEMOLISHER.HEALTH,
    heroMaxHealth: DEMOLISHER.HEALTH,
    silhouetteStage: 0,
    executePrompt: false,
  };
}

class GameState {
  current: GameStateShape = defaults();

  reset(): void {
    const muted = this.current.muted;
    const cameraMode = this.current.cameraMode;
    this.current = defaults();
    this.current.muted = muted;
    this.current.cameraMode = cameraMode;
  }

  patch(partial: Partial<GameStateShape>): void {
    Object.assign(this.current, partial);
    this.current.isPlaying =
      this.current.started &&
      !this.current.paused &&
      this.current.heroAlive &&
      !this.current.awaitingRestart;
  }
}

export const gameState = new GameState();
