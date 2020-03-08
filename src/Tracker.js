// import { LineBasicMaterial } from '@three/materials/LineBasicMaterial';
// import { PointsMaterial } from '@three/materials/PointsMaterial';
// import { BufferAttribute } from '@three/core/BufferAttribute';
// import { BufferGeometry } from '@three/core/BufferGeometry';

// import { Points } from '@three/objects/Points';
// import { Vector3 } from '@three/math/Vector3';
import clm from 'clmtrackr/build/clmtrackr';
// import { Line } from '@three/objects/Line';

// const WHITE = 0xFFFFFF;
// const GREEN = 0x00CC00;

// const FACE_VERTICES = 71;
// const FACE_COORDS = FACE_VERTICES * 3;

export default class Tracker {
  constructor (video, canvas, scene, { width, height }) {
    this.canvas = canvas;
    this.video = video;
    this.scene = scene;

    this.createTracker();
    // this.createFaceGeometry();
    this.resize(width, height);
    this.context = this.canvas.getContext('2d');
  }

  start (event) {
    const container = event.target.parentElement;
    container.classList.add('hidden');
    this.video.play();
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

  /* createFaceGeometry () {
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
  } */

  render () {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.context.clearRect(0, 0, this.width, this.height);
      const position = this.tracker.getCurrentPosition();

      if (position) {
        this.tracker.draw(this.canvas);
        // this.drawCurrentPosition(position);
      }
    }
  }

  /* drawCurrentPosition (points) {
    const faceShape = this.faceShape.geometry.attributes.position.array;

    const noseSpine = this.noseSpine.geometry.attributes.position.array;
    const noseShape = this.noseShape.geometry.attributes.position.array;

    const lipsShape = this.lipsShape.geometry.attributes.position.array;
    const mouthShape = this.mouthShape.geometry.attributes.position.array;

    const leftEyebrow = this.leftEyebrow.geometry.attributes.position.array;
    const rightEyebrow = this.rightEyebrow.geometry.attributes.position.array;

    for (let i = 0, p = 0; i < FACE_COORDS; i += 3, p++) {
      const iX = i;
      const iY = i + 1;
      const iZ = i + 2;

      const x = points[p][0] * this.widthRatio - 100;
      const y = points[p][1] * -this.heightRatio + 100;

      // Eyes:
      let z = 2.5;

      if ((p > 22 && p < 32) || (p > 62 && p < 71)) {
        this.drawEyes(p, x, y, z);
      }

      // Face:
      if (p < 15) {
        // let v = Math.abs(p - 7);
        // z = 7 - (v < 2 ? v + 2.5 : v < 4 ? v / 0.4 : v < 6 ? v / 0.45 : 12)

        switch (Math.abs(p - 7)) {
          case 0: z = 4.5; break;
          case 1: z = 3.75; break;
          case 2: z = 1.5; break;
          case 3: z = -1.5; break;
          case 4: z = -3.5; break;
          case 5: z = -4.5; break;
          case 6: z = -4.75; break;
          case 7: z = -5; break;
        }

        faceShape[iX] = x;
        faceShape[iY] = y;
        faceShape[iZ] = z;

        // Eyebrows:
      } else if (p < 23) {
        z = 4;

        if (p < 19) {
          rightEyebrow[iX - 45] = x;
          rightEyebrow[iY - 45] = y;
          rightEyebrow[iZ - 45] = z;
        } else {
          leftEyebrow[iX - 57] = x;
          leftEyebrow[iY - 57] = y;
          leftEyebrow[iZ - 57] = z;
        }

        // Nose Shape:
      } else if (p > 32 && p < 41) {
        z = p === 37 ? 4.5 : 3.5;

        if (p === 33) {
          noseSpine[0] = x;
          noseSpine[1] = y;
          noseSpine[2] = z;
        } else if (p > 33 && p < 37) {
          noseShape[iX - 102] = x;
          noseShape[iY - 102] = y;
          noseShape[iZ - 102] = z;
        } else if (p === 37) {
          noseShape[iX - 99] = x;
          noseShape[iY - 99] = y;
          noseShape[iZ - 99] = z;
        } else if (p > 37 && p < 41) {
          noseShape[iX - 96] = x;
          noseShape[iY - 96] = y;
          noseShape[iZ - 96] = z;
        }

        // Lips:
      } else if (p > 40 & p < 56) {
        z = 5;

        if (p === 41) {
          z = 5.5;

          noseSpine[3] = x;
          noseSpine[4] = y;
          noseSpine[5] = z;
        } else if (p === 42) {
          z = 5.5;

          noseShape[iX - 117] = x;
          noseShape[iY - 117] = y;
          noseShape[iZ - 117] = z;
        } else if (p === 43) {
          z = 5.5;

          noseShape[iX - 114] = x;
          noseShape[iY - 114] = y;
          noseShape[iZ - 114] = z;
        } else if (p > 43) {
          lipsShape[iX - 132] = x;
          lipsShape[iY - 132] = y;
          lipsShape[iZ - 132] = z;
        }

        // Mouth:
      } else if (p > 55 & p < 62) {
        z = 4;

        const offset = p > 58 ? 165 : 168;

        mouthShape[iX - offset] = x;
        mouthShape[iY - offset] = y;
        mouthShape[iZ - offset] = z;

        if (p === 58) {
          mouthShape[iX - 165] = lipsShape[18];
          mouthShape[iY - 165] = lipsShape[19];
          mouthShape[iZ - 165] = lipsShape[20];
        } else if (p === 61) {
          mouthShape[iX - 162] = lipsShape[0];
          mouthShape[iY - 162] = lipsShape[1];
          mouthShape[iZ - 162] = lipsShape[2];
        }

        // Eye Balls:
      } else if (p === 27 || p === 32) {
        z = 3;

        // Nose Tip:
      } else if (p === 62) {
        z = 8.25;

        noseSpine[6] = x;
        noseSpine[7] = y;
        noseSpine[8] = z;

        noseSpine[9] = noseShape[12];
        noseSpine[10] = noseShape[13];
        noseSpine[11] = noseShape[14];
      }

      this.facePoints.geometry.attributes.position.array[iX] = x;
      this.facePoints.geometry.attributes.position.array[iY] = y;
      this.facePoints.geometry.attributes.position.array[iZ] = z;
    }

    lipsShape[36] = lipsShape[0];
    lipsShape[37] = lipsShape[1];
    lipsShape[38] = lipsShape[2];

    mouthShape[24] = mouthShape[0];
    mouthShape[25] = mouthShape[1];
    mouthShape[26] = mouthShape[2];

    this.facePoints.geometry.attributes.position.needsUpdate = true;
    this.faceShape.geometry.attributes.position.needsUpdate = true;

    this.noseSpine.geometry.attributes.position.needsUpdate = true;
    this.noseShape.geometry.attributes.position.needsUpdate = true;

    this.lipsShape.geometry.attributes.position.needsUpdate = true;
    this.mouthShape.geometry.attributes.position.needsUpdate = true;

    this.leftEyebrow.geometry.attributes.position.needsUpdate = true;
    this.rightEyebrow.geometry.attributes.position.needsUpdate = true;
  }

  drawEyes (point, x, y, z) {
    const leftEye = this.leftEye.geometry.attributes.position.array;
    const rightEye = this.rightEye.geometry.attributes.position.array;

    switch (point) {
      case 23:
        rightEye[0] = x;
        rightEye[1] = y;
        rightEye[2] = z;
        break;

      case 24:
        rightEye[6] = x;
        rightEye[7] = y;
        rightEye[8] = z;
        break;

      case 25:
        rightEye[12] = x;
        rightEye[13] = y;
        rightEye[14] = z;
        break;

      case 26:
        rightEye[18] = x;
        rightEye[19] = y;
        rightEye[20] = z;
        break;

      case 28:
        leftEye[0] = x;
        leftEye[1] = y;
        leftEye[2] = z;
        break;

      case 29:
        leftEye[6] = x;
        leftEye[7] = y;
        leftEye[8] = z;
        break;

      case 30:
        leftEye[12] = x;
        leftEye[13] = y;
        leftEye[14] = z;
        break;

      case 31:
        leftEye[18] = x;
        leftEye[19] = y;
        leftEye[20] = z;
        break;

      case 63:
        rightEye[3] = x;
        rightEye[4] = y;
        rightEye[5] = z;
        break;

      case 64:
        rightEye[9] = x;
        rightEye[10] = y;
        rightEye[11] = z;
        break;

      case 65:
        rightEye[15] = x;
        rightEye[16] = y;
        rightEye[17] = z;
        break;

      case 66:
        rightEye[21] = x;
        rightEye[22] = y;
        rightEye[23] = z;

        rightEye[24] = rightEye[0];
        rightEye[25] = rightEye[1];
        rightEye[26] = rightEye[2];
        break;

      case 67:
        leftEye[3] = x;
        leftEye[4] = y;
        leftEye[5] = z;
        break;

      case 68:
        leftEye[9] = x;
        leftEye[10] = y;
        leftEye[11] = z;
        break;

      case 69:
        leftEye[15] = x;
        leftEye[16] = y;
        leftEye[17] = z;
        break;

      case 70:
        leftEye[21] = x;
        leftEye[22] = y;
        leftEye[23] = z;

        leftEye[24] = leftEye[0];
        leftEye[25] = leftEye[1];
        leftEye[26] = leftEye[2];
        break;
    }

    this.leftEye.geometry.attributes.position.needsUpdate = true;
    this.rightEye.geometry.attributes.position.needsUpdate = true;
  } */

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
