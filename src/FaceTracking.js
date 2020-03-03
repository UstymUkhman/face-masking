import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';
import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

import Stats from 'three/examples/js/libs/stats.min';
import { Scene } from '@three/scenes/Scene';
import Tracker from '@/Tracker';

export default class FaceTracking {
  constructor (video, canvas) {
    this.canvas = canvas;
    this.video = video;
    this.setSize();

    this.createScene();
    this.createCamera();

    this.createRenderer();
    this.createControls();
    this.createTracker();

    this.createEvents();
    this.createStats();

    this.raf = requestAnimationFrame(this.render.bind(this));
  }

  setSize () {
    this.width = window.innerWidth / 10 * 6;
    this.height = this.width / 4 * 3;

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
    this.camera.position.set(0, 0, 200);
  }

  createRenderer () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);

    document.body.appendChild(this.renderer.domElement);
  }

  createControls () {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
  }

  createTracker () {
    this.tracker = new Tracker(
      this.scene, this.video,
      this.canvas.getContext('2d'), {
        height: this.height,
        width: this.width
      }
    );
  }

  createEvents () {
    this._onResize = this.onResize.bind(this);
    window.addEventListener('resize', this._onResize, false);
  }

  createStats () {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.domElement);
  }

  render () {
    this.stats.begin();
    this.tracker.render();
    this.controls.update();

    this.raf = requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
  }

  onResize () {
    this.setSize();
    this.camera.aspect = this.ratio;
    this.camera.updateProjectionMatrix();

    this.tracker.resize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
  }

  destroy () {
    window.removeEventListener('resize', this._onResize, false);
    document.body.removeChild(this.renderer.domElement);
    document.body.removeChild(this.stats.domElement);

    cancelAnimationFrame(this.raf);
    this.tracker.destroy();

    delete this.controls;
    delete this.renderer;
    delete this.tracker;

    delete this.camera;
    delete this.scene;
    delete this.stats;
  }
};
