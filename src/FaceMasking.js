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

export default class FaceMasking {
  constructor (start, video, range) {
    this.video = video;
    this.start = start;
    this.range = range;

    this.setSize();
    this.createScene();
    this.createCamera();
    this.createRenderer();

    this.createTracker();
    this.createEvents();
    this.createStats();
  }

  init () {
    const texture = this.tracker.createGeometry();
    this.start.parentElement.classList.add('visible');

    this.scene.add(new Mesh(
      new PlaneGeometry(this.width, this.height, 1, 1),
      new MeshBasicMaterial({ map: texture })
    ));

    this.start.parentElement.classList.add('visible');
  }

  onStart (event) {
    this.range.parentElement.classList.add('visible');
    const container = event.target.parentElement;
    container.classList.remove('visible');

    this.video.play();

    requestAnimationFrame(this.render.bind(this));
    this.start.removeEventListener('click', this._onStart, false);
  }

  onInput (event) {
    this.tracker.setIntensity(+event.target.value);
  }

  setSize () {
    this.width = 640;
    this.height = 480;

    this.video.width = this.width;
    this.video.height = this.height;
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
    this.tracker = new Tracker(this.video, this.width, this.height);

    const shader = this.tracker.createShader();
    this.composer.addPass(shader);
  }

  createEvents () {
    this._init = this.init.bind(this);
    this._onStart = this.onStart.bind(this);
    this._onInput = this.onInput.bind(this);

    this.video.addEventListener('canplay', this._init, false);
    this.start.addEventListener('click', this._onStart, false);
    this.range.addEventListener('input', this._onInput, false);
  }

  createStats () {
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
  }

  render () {
    this.stats.begin();
    this.tracker.render();
    this.composer.render();

    this.raf = requestAnimationFrame(this.render.bind(this));
    this.stats.end();
  }

  destroy () {
    this.start.removeEventListener('click', this._onStart, false);

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
