import { LoadingManager } from 'three';
import { eventBus, Events } from '../core/EventBus.ts';

export class AssetLoader {
  readonly manager = new LoadingManager();

  load(): void {
    this.manager.onLoad = () => {
      eventBus.emit(Events.gameLoaded, {});
    };
    queueMicrotask(() => {
      eventBus.emit(Events.gameLoaded, {});
    });
  }
}
