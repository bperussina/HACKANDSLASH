import * as THREE from 'three';
import { DELTA_CAP, FIXED_DT, MAX_SUBSTEPS, PIXEL_RATIO_CAP } from './Constants.ts';
import { eventBus, Events } from './EventBus.ts';
import { gameState } from './GameState.ts';
import { createWorld, type Entity } from './World.ts';
import { spawnDemolisher } from '../gameplay/demolisher.ts';
import { spawnDummy } from '../gameplay/dummy.ts';
import { InputSystem } from '../systems/InputSystem.ts';
import { PhysicsSystem } from '../systems/PhysicsSystem.ts';
import { CameraSystem } from '../systems/CameraSystem.ts';
import { MovementSystem } from '../systems/MovementSystem.ts';
import { CombatSystem } from '../systems/CombatSystem.ts';
import { PresentationSystem } from '../systems/PresentationSystem.ts';
import { AnimationSystem } from '../systems/AnimationSystem.ts';
import { DevOverlay } from '../systems/DevOverlay.ts';
import { AssetLoader } from '../level/AssetLoader.ts';
import { ArenaBuilder } from '../level/ArenaBuilder.ts';

export class Game {
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private clock = new THREE.Clock();
  private accumulator = 0;
  private world = createWorld();
  private hero!: Entity;
  private dummy!: Entity;
  private input = new InputSystem();
  private physics = new PhysicsSystem();
  private cameras = new CameraSystem();
  private movement = new MovementSystem();
  private combat = new CombatSystem();
  private presentation = new PresentationSystem();
  private animation = new AnimationSystem();
  private overlay = new DevOverlay();
  private assets = new AssetLoader();
  private arena = new ArenaBuilder();
  private raycaster = new THREE.Raycaster();
  private ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private aim = new THREE.Vector3();
  private mouse = new THREE.Vector2();
  private userPaused = false;
  private hiddenPause = false;
  private started = false;

  async init(): Promise<void> {
    const host = document.getElementById('game-container');
    if (!host) throw new Error('Missing #game-container');

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);

    await this.physics.init();
    this.arena.build(this.scene);
    this.scene.add(this.presentation.group);

    this.hero = this.world.add(spawnDemolisher());
    this.dummy = this.world.add(spawnDummy());

    this.input.attach(this.renderer.domElement);
    this.cameras.resize(window.innerWidth, window.innerHeight);
    this.overlay.attach(this.renderer);

    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);

    eventBus.on(Events.gameLoaded, () => {
      document.getElementById('loading')?.classList.add('hidden');
      gameState.patch({ started: true, isPlaying: true });
      this.started = true;
      eventBus.emit(Events.gameStarted, {});
    });

    this.assets.load();
    this.renderer.setAnimationLoop(() => this.tick());
  }

  private tick(): void {
    const delta = Math.min(this.clock.getDelta(), DELTA_CAP);
    const ripping = this.hero.executeState === 'ripping';
    this.cameras.flushQueue(ripping);

    const aim = this.aimPoint();
    const sample = this.input.sample(this.cameras.yaw(), aim.x, aim.z);

    if (sample.cameraTogglePressed) this.cameras.requestToggle(ripping);
    if (sample.pausePressed) {
      this.userPaused = !this.userPaused;
      gameState.patch({ paused: this.userPaused || this.hiddenPause });
      eventBus.emit(Events.gamePaused, { paused: gameState.current.paused });
    }
    if (sample.mutePressed) {
      gameState.patch({ muted: !gameState.current.muted });
      eventBus.emit(Events.uiMute, { muted: gameState.current.muted });
    }

    const playing = this.started && !gameState.current.paused;
    if (playing) {
      this.accumulator += delta;
      let steps = 0;
      while (this.accumulator >= FIXED_DT && steps < MAX_SUBSTEPS) {
        this.physics.step(FIXED_DT);
        this.movement.step(this.hero, sample, FIXED_DT);
        this.combat.step(this.hero, this.dummy, sample, FIXED_DT);
        this.accumulator -= FIXED_DT;
        steps += 1;
      }
    }

    this.presentation.sync(this.hero, this.dummy, delta);
    this.animation.step(
      this.hero,
      this.dummy,
      this.presentation.group.children[0]!,
      this.presentation.group.children[1]!,
      delta,
    );
    this.cameras.follow(this.hero, delta);
    this.renderer.render(this.scene, this.cameras.camera);
    this.overlay.frame(this.renderer);
  }

  private aimPoint(): { x: number; z: number } {
    this.mouse.set(this.input.mouseNdc.x, this.input.mouseNdc.y);
    this.raycaster.setFromCamera(this.mouse, this.cameras.camera);
    const hit = this.raycaster.ray.intersectPlane(this.ground, this.aim);
    if (!hit) return { x: 0, z: 0 };
    return {
      x: this.aim.x - this.hero.position.x,
      z: this.aim.z - this.hero.position.z,
    };
  }

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cameras.resize(window.innerWidth, window.innerHeight);
  };

  private onVisibility = (): void => {
    this.hiddenPause = document.hidden;
    gameState.patch({ paused: this.userPaused || this.hiddenPause });
    eventBus.emit(Events.gamePaused, { paused: gameState.current.paused });
    if (!document.hidden) this.clock.getDelta();
  };
}
