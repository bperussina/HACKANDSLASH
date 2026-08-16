import Stats from 'stats.js';
import GUI from 'lil-gui';
import type { WebGLRenderer } from 'three';
import { DEMOLISHER, SHOTGUN, SLASH } from '../core/Constants.ts';
import { gameState } from '../core/GameState.ts';

export class DevOverlay {
  private stats: Stats | null = null;
  private gui: GUI | null = null;

  attach(renderer: WebGLRenderer): void {
    if (!import.meta.env.DEV) return;
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    this.gui = new GUI({ title: 'Wound' });
    this.gui.add(DEMOLISHER, 'SPEED', 4, 16);
    this.gui.add(SHOTGUN, 'RANGE', 4, 20);
    this.gui.add(SLASH, 'RANGE', 1, 5);
    this.gui.add(gameState.current, 'cameraMode').listen();
    void renderer;
  }

  frame(renderer: WebGLRenderer): void {
    this.stats?.update();
    if (import.meta.env.DEV && this.gui) {
      const info = renderer.info.render;
      this.gui.title(`Wound  dc:${info.calls} tris:${info.triangles}`);
    }
  }

  dispose(): void {
    this.stats?.dom.remove();
    this.gui?.destroy();
  }
}
