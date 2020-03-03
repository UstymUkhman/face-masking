import { LineBasicMaterial } from '@three/materials/LineBasicMaterial';
import { PointsMaterial } from '@three/materials/PointsMaterial';
import { BufferAttribute } from '@three/core/BufferAttribute';
import { BufferGeometry } from '@three/core/BufferGeometry';

import { Points } from '@three/objects/Points';
import { Vector3 } from '@three/math/Vector3';
import { Line } from '@three/objects/Line';

import clm from 'clmtrackr';

const WHITE = 0xFFFFFF;
const GREEN = 0x00CC00;

const FACE_VERTICES = 71;
const FACE_COORDS = FACE_VERTICES * 3;

export default class Tracker {
  constructor (scene, video, context, { width, height }) {
    this.scene = scene;
    this.video = video;
    this.context = context;

    this.createTracker();
    this.createFaceGeometry();
    this.resize(width, height);
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

    this.video.onloadedmetadata = () => {
      this.resize(this.width, this.height);
      this.createStartButton();
    };
  }

  gumFail () {
    console.error('D: Camera stream failed...');
  }

  createStartButton () {
    document.addEventListener('click', this.playVideo.bind(this));
  }

  playVideo () {
    document.removeEventListener('click', this.playVideo.bind(this));
    this.video.play();
  }

  createFaceGeometry () {
    const faceGeometry = new BufferGeometry();

    faceGeometry.setAttribute('position', new BufferAttribute(new Float32Array(FACE_COORDS), 3));
    this.facePoints = new Points(faceGeometry, new PointsMaterial({ color: GREEN }));

    this.rightEyebrow = this.createLineGeometry(4);
    this.leftEyebrow = this.createLineGeometry(4);

    this.faceShape = this.createLineGeometry(15);
    this.lipsShape = this.createLineGeometry(13);
    this.mouthShape = this.createLineGeometry(9);

    this.noseShape = this.createLineGeometry(9);
    this.noseSpine = this.createLineGeometry(4);

    this.rightEye = this.createLineGeometry(9);
    this.leftEye = this.createLineGeometry(9);

    this.scene.add(this.rightEyebrow);
    this.scene.add(this.leftEyebrow);

    this.scene.add(this.facePoints);
    this.scene.add(this.faceShape);

    this.scene.add(this.mouthShape);
    this.scene.add(this.lipsShape);

    this.scene.add(this.noseShape);
    this.scene.add(this.noseSpine);

    this.scene.add(this.rightEye);
    this.scene.add(this.leftEye);
  }

  createLineGeometry (points) {
    return new Line(
      new BufferGeometry().setFromPoints(Array.from(
        new Array(points), v => new Vector3(0, 0, 0)
      )),

      new LineBasicMaterial({
        color: WHITE,
        opacity: 0.5
      })
    );
  }

  render () {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.context.clearRect(0, 0, this.width, this.height);

      const position = this.tracker.getCurrentPosition();

      if (position) {
        // this.tracker.draw(overlay);
        this.drawCurrentPosition(position);
      }
    }
  }

  resize (width, height) {
    this.width = width;
    this.height = height;

    this.tracker.stop();
    this.tracker.reset();
    this.tracker.start(this.video);

    this.widthRatio = 200 / this.width;
    this.heightRatio = 160 / this.height;
  }

  destroy () {
    console.log(this.tracker);
    // this.tracker.destroy();
  }
}
