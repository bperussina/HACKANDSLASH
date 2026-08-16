import { describe, expect, it } from 'vitest';
import { eventBus } from '../src/core/EventBus.ts';
import { gameState } from '../src/core/GameState.ts';

describe('GameState.reset', () => {
  it('restores over-the-shoulder wait no — keeps camera, resets silhouette', () => {
    gameState.patch({
      silhouetteStage: 3,
      cameraMode: 'iso',
      heroHealth: 10,
      muted: true,
    });
    eventBus.on('game:loaded', () => undefined);
    gameState.reset();
    expect(gameState.current.silhouetteStage).toBe(0);
    expect(gameState.current.cameraMode).toBe('iso');
    expect(gameState.current.heroHealth).toBe(220);
    expect(gameState.current.muted).toBe(true);
    eventBus.clear();
  });

  it('defaults a fresh state to ots and silhouette 0', () => {
    gameState.patch({ cameraMode: 'ots', muted: false });
    gameState.reset();
    expect(gameState.current.cameraMode).toBe('ots');
    expect(gameState.current.silhouetteStage).toBe(0);
  });
});
