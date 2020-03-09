import { ShaderMaterial } from '@three/materials/ShaderMaterial';
import { ShaderPass } from '@postprocessing/ShaderPass';

import { Texture } from '@three/textures/Texture';
import { LinearFilter } from '@three/constants';
import * as FaceAPI from 'face-api.js';

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

  async createTracker () {
    this.options = new FaceAPI.TinyFaceDetectorOptions({
      scoreThreshold: 0.1,
      inputSize: 128
    });

    await FaceAPI.nets.tinyFaceDetector.load('/models');

    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.msGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.webkitGetUserMedia;

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

  render (delta) {
    FaceAPI.detectSingleFace(this.video, this.options)
      .then((result) => {
        if (result) {
          const dimensions = FaceAPI.matchDimensions(this.canvas, this.video, true);

          FaceAPI.draw.drawDetections(
            this.canvas, FaceAPI.resizeResults(result, dimensions)
          );
        }
      });

    this.shader.material.uniforms.time.value = delta;
    this.texture.needsUpdate = true;
  }

  resize (width, height) {
    this.height = height;
    this.width = width;
  }

  destroy () { }
}
