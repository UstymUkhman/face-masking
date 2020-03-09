import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial';
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';
import { EffectComposer } from '@postprocessing/EffectComposer';
import { PlaneGeometry } from '@three/geometries/PlaneGeometry';
import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

import { RenderPass } from '@postprocessing/RenderPass';
import { ShaderPass } from '@postprocessing/ShaderPass';
import Stats from 'three/examples/js/libs/stats.min';
import { CopyShader } from '@shaders/CopyShader';

import { Scene } from '@three/scenes/Scene';
import { Mesh } from '@three/objects/Mesh';
import Tracker from '@/Tracker';

export default class FaceTracking {
  constructor (start, video, canvas) {
    this.canvas = canvas;
    this.video = video;
    this.start = start;

    this.setSize();
    this.createScene();
    this.createCamera();
    this.createRenderer();

    this.createTracker();
    this.createEvents();
    this.createStats();

    this.video.oncanplay = this.init.bind(this);
  }

  init () {
    const texture = this.tracker.createVideoGeometry();
    this.start.parentElement.classList.add('visible');

    this.scene.add(new Mesh(
      new PlaneGeometry(this.width, this.height, 1, 1),
      new MeshBasicMaterial({ map: texture })
    ));
  }

  setSize () {
    this.height = window.innerHeight * 0.9;
    this.width = this.height / 3 * 4;

    this.video.width = this.width;
    this.video.height = this.height;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ratio = this.width / this.height;
  }

  createScene () {
    this.scene = new Scene();
  }

  createCamera () {
    this.camera = new PerspectiveCamera(45, this.ratio, 0.1, 1000);
    const z = Math.round(this.height / 0.8275862);

    this.camera.position.set(0, 0, z);
    window.camera = this.camera;
  }

  createRenderer () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);

    document.body.appendChild(this.renderer.domElement);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
  }

  createTracker () {
    this.composer.addPass(new ShaderPass(CopyShader));

    this.tracker = new Tracker(
      this.video, this.canvas, {
        height: this.height,
        width: this.width
      }
    );

    const shader = this.tracker.createShader();
    this.composer.addPass(shader);
  }

  createStats () {
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
  }

  createEvents () {
    this._onStart = this.onStart.bind(this);
    this._onResize = this.onResize.bind(this);

    window.addEventListener('resize', this._onResize, false);
    this.start.addEventListener('click', this._onStart, false);
  }

  render (delta) {
    this.stats.begin();
    this.composer.render();
    this.tracker.render(delta);

    this.raf = requestAnimationFrame(this.render.bind(this));
    this.stats.end();
  }

  onStart (event) {
    this.start.removeEventListener('click', this._onStart, false);
    const container = event.target.parentElement;
    container.classList.remove('visible');

    this.video.play();
    requestAnimationFrame(this.render.bind(this));
  }

  onResize () {
    this.setSize();
    this.camera.aspect = this.ratio;
    this.camera.updateProjectionMatrix();

    this.tracker.resize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
  }

  destroy () {
    this.start.removeEventListener('click', this._onStart, false);
    window.removeEventListener('resize', this._onResize, false);

    document.body.removeChild(this.renderer.domElement);
    document.body.removeChild(this.stats.domElement);

    cancelAnimationFrame(this.raf);
    this.tracker.destroy();

    delete this.renderer;
    delete this.tracker;

    delete this.camera;
    delete this.scene;
    delete this.stats;
  }
};
