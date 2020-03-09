import { ShaderMaterial } from '@three/materials/ShaderMaterial';
import { ShaderPass } from '@postprocessing/ShaderPass';

import { Texture } from '@three/textures/Texture';
import { LinearFilter } from '@three/constants';
import clm from 'clmtrackr/build/clmtrackr';

import vertVideo from '@/glsl/video.vert';
import fragVideo from '@/glsl/video.frag';

export default class Tracker {
  constructor (video, canvas, { width, height }) {
    this.canvas = canvas;
    this.video = video;

    this.createTracker();
    this.resize(width, height);
    this.context = this.canvas.getContext('2d');
  }

  createShader () {
    this.shader = new ShaderPass(
      new ShaderMaterial({
        fragmentShader: fragVideo,
        vertexShader: vertVideo,

        uniforms: {
          tDiffuse: { type: 't', value: null },
          time: { type: 'f', value: 0.0 }
        }
      })
    );

    this.shader.renderToScreen = true;
    return this.shader;
  }

  createVideoGeometry () {
    this.texture = new Texture(this.video);

    this.texture.minFilter = LinearFilter;
    this.texture.magFilter = LinearFilter;

    return this.texture;
  }

  createTracker () {
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.msGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.webkitGetUserMedia;

    // eslint-disable-next-line new-cap
    this.tracker = new clm.tracker();

    this.tracker.init();
    this.tracker.start(this.video);

    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(this.gumSuccess.bind(this))
        .catch(this.gumFail.bind(this));

    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true },
        this.gumSuccess.bind(this),
        this.gumFail.bind(this)
      );

    } else {
      this.gumFail();
    }
  }

  gumSuccess (stream) {
    this.video.srcObject = stream;
    this.video.onloadedmetadata = this.resize.call(this, this.width, this.height);
  }

  gumFail () {
    console.error('D: Camera stream failed...');
  }

  render (delta) {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.context.clearRect(0, 0, this.width, this.height);
      // const position = this.tracker.getCurrentPosition();

      this.shader.material.uniforms.time.value = delta;
      this.texture.needsUpdate = true;

      // if (position) {
      //   this.tracker.draw(this.canvas);
      // }
    }
  }

  resize (width, height) {
    this.width = width;
    this.height = height;

    this.tracker.stop();
    this.tracker.reset();
    this.tracker.start(this.video);
  }

  destroy () {
    console.log(this.tracker);
    // this.tracker.destroy();
  }
}
