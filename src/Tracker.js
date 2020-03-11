import { ShaderMaterial } from '@three/materials/ShaderMaterial';
import { ShaderPass } from '@postprocessing/ShaderPass';

import { Texture } from '@three/textures/Texture';
import { LinearFilter } from '@three/constants';
import { Vector4 } from '@three/math/Vector4';

import vertVideo from '@/glsl/video.vert';
import fragVideo from '@/glsl/video.frag';
import * as FaceAPI from 'face-api.js';

export default class Tracker {
  constructor (stream, width, height) {
    this.width = width;
    this.height = height;
    this.stream = stream;

    this.createTracker();
  }

  async createTracker () {
    this.options = new FaceAPI.TinyFaceDetectorOptions({
      scoreThreshold: 0.1,
      inputSize: 128
    });

    await FaceAPI.nets.tinyFaceDetector.load('./models');

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
    this.stream.srcObject = stream;
  }

  gumFail () {
    throw new Error('Camera stream failed.');
  }

  createGeometry () {
    this.texture = new Texture(this.stream);

    this.texture.minFilter = LinearFilter;
    this.texture.magFilter = LinearFilter;

    return this.texture;
  }

  createShader () {
    this.shader = new ShaderPass(
      new ShaderMaterial({
        fragmentShader: fragVideo,
        vertexShader: vertVideo,

        uniforms: {
          mask: { type: 'v4', value: new Vector4() },
          size: { type: 'v4', value: new Vector4() },
          intensity: { type: 'f', value: 10.0 },
          tDiffuse: { type: 't', value: null }
        }
      })
    );

    this.shader.renderToScreen = true;
    return this.shader;
  }

  setIntensity (intensity) {
    this.shader.material.uniforms.intensity.value = intensity;
    this.texture.needsUpdate = true;
  }

  render () {
    FaceAPI.detectSingleFace(this.stream, this.options)
      .then((result) => {
        if (result) {
          const { bottom, right, left, top } = result.relativeBox;

          this.shader.material.uniforms.mask.value.set(
            Math.abs(1.0 - bottom) + 0.1, right,
            Math.abs(1.0 - top) + 0.1, left
          );

          this.shader.material.uniforms.size.value.set(
            0.0, 0.0, this.width, this.height
          );
        }
      });

    this.texture.needsUpdate = true;
  }

  destroy () { }
}
