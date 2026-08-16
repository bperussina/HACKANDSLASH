declare module 'stats.js' {
  export default class Stats {
    dom: HTMLElement;
    showPanel(panel: number): void;
    update(): void;
  }
}
