import { MeshBasicMaterial } from '@three/materials/MeshBasicMaterial';
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';

import { EffectComposer } from '@postprocessing/EffectComposer';
import { PlaneGeometry } from '@three/geometries/PlaneGeometry';
import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

import { RenderPass } from '@postprocessing/RenderPass';
import { ShaderPass } from '@postprocessing/ShaderPass';
import { CopyShader } from '@shaders/CopyShader';

import { Scene } from '@three/scenes/Scene';
import { Mesh } from '@three/objects/Mesh';
import Tracker from '@/Tracker';

export default class FaceMasking {
  constructor (masks, start, video, range) {
    this.masks = masks;
    this.start = start;
    this.video = video;
    this.range = range;

    this.setSize();
    this.createScene();
    this.createCamera();
    this.createRenderer();

    this.createTracker();
    this.createEvents();
  }

  init () {
    this.video.removeEventListener('canplay', this._init, false);
    const texture = this.tracker.createGeometry();
    this.start.classList.add('visible');

    this.scene.add(new Mesh(
      new PlaneGeometry(this.width, this.height, 1, 1),
      new MeshBasicMaterial({ map: texture })
    ));
  }

  onStart (event) {
    this.start.removeEventListener('click', this._onStart, false);
    this.range.parentElement.classList.add('visible');

    event.target.classList.remove('visible');
    this.start.classList.remove('visible');
    this.masks.classList.add('visible');

    this.video.play();
    requestAnimationFrame(this.render.bind(this));
  }

  onChange (event) {
    this.tracker.setMask(+event.target.value);
  }

  onInput (event) {
    this.tracker.setStrength(+event.target.value);
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
    this._onChange = this.onChange.bind(this);

    this.video.addEventListener('canplay', this._init, false);
    this.start.addEventListener('click', this._onStart, false);
    this.range.addEventListener('input', this._onInput, false);
    this.masks.addEventListener('change', this._onChange, false);
  }

  render (delta) {
    this.composer.render();
    this.tracker.render(delta);
    this.raf = requestAnimationFrame(this.render.bind(this));
  }

  destroy () {
    this.masks.removeEventListener('change', this._onChange, false);
    this.range.removeEventListener('input', this._onInput, false);
    document.body.removeChild(this.renderer.domElement);
    cancelAnimationFrame(this.raf);

    delete this.renderer;
    delete this.tracker;
    delete this.camera;
    delete this.scene;
  }
};
