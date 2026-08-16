export type EventHandler = (data?: unknown) => void;

export const Events = {
  gameLoaded: 'game:loaded',
  gameStarted: 'game:started',
  gamePaused: 'game:paused',
  gameRestart: 'game:restart',
  cameraToggled: 'camera:toggled',
  playerShoot: 'player:shoot',
  playerSlash: 'player:slash',
  playerExecute: 'player:execute',
  playerHit: 'player:hit',
  playerDied: 'player:died',
  playerMutated: 'player:mutated',
  enemySpawned: 'enemy:spawned',
  enemyHit: 'enemy:hit',
  enemyStaggered: 'enemy:staggered',
  enemyDied: 'enemy:died',
  waveStarted: 'wave:started',
  waveCleared: 'wave:cleared',
  lootDropped: 'loot:dropped',
  lootCollected: 'loot:collected',
  uiMute: 'ui:mute',
  dummyHit: 'dummy:hit',
} as const;

class EventBus {
  private listeners = new Map<string, Set<EventHandler>>();

  on(event: string, callback: EventHandler): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  once(event: string, callback: EventHandler): void {
    const wrapper: EventHandler = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    this.on(event, wrapper);
  }

  off(event: string, callback: EventHandler): void {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    cbs.delete(callback);
    if (cbs.size === 0) this.listeners.delete(event);
  }

  emit(event: string, data?: unknown): void {
    const cbs = this.listeners.get(event);
    if (!cbs) return;
    for (const cb of [...cbs]) {
      try {
        cb(data);
      } catch (error) {
        console.error(`EventBus error [${event}]:`, error);
      }
    }
  }

  clear(event?: string): void {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
}

export const eventBus = new EventBus();
