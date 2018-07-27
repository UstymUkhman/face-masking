import * as THREE from 'three-full/builds/Three.es.min.js'
import Stats from 'stats-js'
import clm from 'clmtrackr'

const FACE_VERTICES = 71
const FACE_COORDS = FACE_VERTICES * 3

export default class FaceTracking {
  constructor (video, overlay) {
    this.video = video
    this.overlay = overlay

    this.overlayContext = this.overlay.getContext('2d')
    this.startExperiment()
  }

  startExperiment () {
    this.createStats()
    this.setVideoSize()
    // this.createCameraTracking()
    this.createWebGLEnvironment()
    this.initializeFaceGeometry()

    // video
    this.tracker = new clm.tracker()
    this.tracker.init()
    this.tracker.start(this.video)
    this.video.play()
    // 

    this.onResize()
    this.render()
  }

  createStats () {
    this.stats = new Stats()

    this.stats.domElement.style.top = '0px'
    this.stats.domElement.style.left = '0px'
    this.stats.domElement.style.position = 'fixed'

    document.body.appendChild(this.stats.domElement)
  }

  createWebGLEnvironment () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000)
    this.camera.position.z = 200
    this.camera.updateProjectionMatrix()

    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.update()

    this.renderer.setClearColor(0x000000)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(this.renderer.domElement)
  }

  initializeFaceGeometry () {
    const faceGeometry = new THREE.BufferGeometry()

    faceGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(FACE_COORDS), 3))
    this.facePoints = new THREE.Points(faceGeometry, new THREE.PointsMaterial({ color: 0x00CC00 }))

    this.rightEyebrow = this.createLineGeometry(4)
    this.leftEyebrow = this.createLineGeometry(4)

    this.faceShape = this.createLineGeometry(15)
    this.lipsShape = this.createLineGeometry(13)
    this.mouthShape = this.createLineGeometry(9)

    this.noseShape = this.createLineGeometry(9)
    this.noseSpine = this.createLineGeometry(4)

    this.rightEye = this.createLineGeometry(9)
    this.leftEye = this.createLineGeometry(9)

    this.scene.add(this.rightEyebrow)
    this.scene.add(this.leftEyebrow)

    this.scene.add(this.facePoints)
    this.scene.add(this.faceShape)

    this.scene.add(this.mouthShape)
    this.scene.add(this.lipsShape)

    this.scene.add(this.noseShape)
    this.scene.add(this.noseSpine)

    this.scene.add(this.rightEye)
    this.scene.add(this.leftEye)
  }

  createLineGeometry (points) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(
        Array.from(new Array(points), v => new THREE.Vector3(0, 0, 0))
      ),

      new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        opacity: 0.5
      })
    )
  }

  gumSuccess (stream) {
    this.video.srcObject = stream

    this.video.onloadedmetadata = () => {
      this.setVideoSize()
      this.video.play()
    };
  }

  gumFail () {
    console.error('Camera Stream Fail.')
  }

  createCameraTracking () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

    this.tracker = new clm.tracker()
    this.tracker.init()
    this.tracker.start(this.video)

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess.bind(this)).catch(this.gumFail.bind(this))
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true}, this.gumSuccess.bind(this), this.gumFail.bind(this))
    }
  }

  render () {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.overlayContext.clearRect(0, 0, this.width, this.height);

      const positions = this.tracker.getCurrentPosition()

      if (positions) {
        // this.tracker.draw(overlay)
        this.drawCurrentPosition(positions)
      }
    }

    this.stats.update()
    this.controls.update()

    this.renderer.render(this.scene, this.camera)
    this.frame = requestAnimationFrame(this.render.bind(this))
  }

  drawEyes (point, x, y, z) {
    const leftEye = this.leftEye.geometry.attributes.position.array
    const rightEye = this.rightEye.geometry.attributes.position.array

    switch (point) {
      case 23:
        rightEye[0] = x
        rightEye[1] = y
        rightEye[2] = z
      break;

      case 24:
        rightEye[6] = x
        rightEye[7] = y
        rightEye[8] = z
      break;

      case 25:
        rightEye[12] = x
        rightEye[13] = y
        rightEye[14] = z
      break;

      case 26:
        rightEye[18] = x
        rightEye[19] = y
        rightEye[20] = z
      break;

      case 28:
        leftEye[0] = x
        leftEye[1] = y
        leftEye[2] = z
      break;

      case 29:
        leftEye[6] = x
        leftEye[7] = y
        leftEye[8] = z
      break;

      case 30:
        leftEye[12] = x
        leftEye[13] = y
        leftEye[14] = z
      break;

      case 31:
        leftEye[18] = x
        leftEye[19] = y
        leftEye[20] = z
      break;

      case 63:
        rightEye[3] = x
        rightEye[4] = y
        rightEye[5] = z
      break;

      case 64:
        rightEye[9] = x
        rightEye[10] = y
        rightEye[11] = z
      break;

      case 65:
        rightEye[15] = x
        rightEye[16] = y
        rightEye[17] = z
      break;

      case 66:
        rightEye[21] = x
        rightEye[22] = y
        rightEye[23] = z

        rightEye[24] = rightEye[0]
        rightEye[25] = rightEye[1]
        rightEye[26] = rightEye[2]
      break;

      case 67:
        leftEye[3] = x
        leftEye[4] = y
        leftEye[5] = z
      break;

      case 68:
        leftEye[9] = x
        leftEye[10] = y
        leftEye[11] = z
      break;

      case 69:
        leftEye[15] = x
        leftEye[16] = y
        leftEye[17] = z
      break;

      case 70:
        leftEye[21] = x
        leftEye[22] = y
        leftEye[23] = z

        leftEye[24] = leftEye[0]
        leftEye[25] = leftEye[1]
        leftEye[26] = leftEye[2]
      break;
    }

    this.leftEye.geometry.attributes.position.needsUpdate = true
    this.rightEye.geometry.attributes.position.needsUpdate = true
  }

  drawCurrentPosition (points) {
    const faceShape = this.faceShape.geometry.attributes.position.array

    const noseSpine = this.noseSpine.geometry.attributes.position.array
    const noseShape = this.noseShape.geometry.attributes.position.array

    const lipsShape = this.lipsShape.geometry.attributes.position.array
    const mouthShape = this.mouthShape.geometry.attributes.position.array

    const leftEyebrow = this.leftEyebrow.geometry.attributes.position.array
    const rightEyebrow = this.rightEyebrow.geometry.attributes.position.array

    for (let i = 0, p = 0; i < FACE_COORDS; i += 3, p++) {
      const iX = i
      const iY = i + 1
      const iZ = i + 2

      const x = points[p][0] * this.widthRatio - 100
      const y = points[p][1] * -this.heightRatio + 100

      // eyes
      let z = 2.5

      if ((p > 22 && p < 32) || (p > 62 && p < 71)) {
        this.drawEyes(p, x, y, z)        
      }

      // shape
      if (p < 15) {
        let v = Math.abs(p - 7)
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

        faceShape[iX] = x
        faceShape[iY] = y
        faceShape[iZ] = z
      }

      // eyebrows
      else if (p < 23) {
        z = 4

        if (p < 19) {
          rightEyebrow[iX - 45] = x
          rightEyebrow[iY - 45] = y
          rightEyebrow[iZ - 45] = z
        } else {
          leftEyebrow[iX - 57] = x
          leftEyebrow[iY - 57] = y
          leftEyebrow[iZ - 57] = z
        }
      }

      // nose shape
      else if (p > 32 && p < 41) {
        z = p === 37 ? 4.5 : 3.5

        if (p === 33) {
          noseSpine[0] = x
          noseSpine[1] = y
          noseSpine[2] = z
        } else if (p > 33 && p < 37) {
          noseShape[iX - 102] = x
          noseShape[iY - 102] = y
          noseShape[iZ - 102] = z
        } else if (p === 37) {
          noseShape[iX - 99] = x
          noseShape[iY - 99] = y
          noseShape[iZ - 99] = z
        } else if (p > 37 && p < 41) {
          noseShape[iX - 96] = x
          noseShape[iY - 96] = y
          noseShape[iZ - 96] = z
        }
      }

      // lips
      else if (p > 40 & p < 56) {
        z = 5

        if (p === 41) {
          z = 5.5

          noseSpine[3] = x
          noseSpine[4] = y
          noseSpine[5] = z
        } else if (p === 42) {
          z = 5.5

          noseShape[iX - 117] = x
          noseShape[iY - 117] = y
          noseShape[iZ - 117] = z
        } else if (p === 43) {
          z = 5.5

          noseShape[iX - 114] = x
          noseShape[iY - 114] = y
          noseShape[iZ - 114] = z
        } else if (p > 43) {
          lipsShape[iX - 132] = x
          lipsShape[iY - 132] = y
          lipsShape[iZ - 132] = z
        }
      }

      // mouth
      else if (p > 55 & p < 62) {
        z = 4

        const offset = p > 58 ? 165 : 168

        mouthShape[iX - offset] = x
        mouthShape[iY - offset] = y
        mouthShape[iZ - offset] = z

        if (p === 58) {
          mouthShape[iX - 165] = lipsShape[18]
          mouthShape[iY - 165] = lipsShape[19]
          mouthShape[iZ - 165] = lipsShape[20]
        } else if (p === 61) {
          mouthShape[iX - 162] = lipsShape[0]
          mouthShape[iY - 162] = lipsShape[1]
          mouthShape[iZ - 162] = lipsShape[2]
        }
      }

      // eye balls
      else if (p === 27 || p === 32) {
        z = 3
      }

      // nose tip
      else if (p === 62) {
        z = 8.25

        noseSpine[6] = x
        noseSpine[7] = y
        noseSpine[8] = z

        noseSpine[9] = noseShape[12]
        noseSpine[10] = noseShape[13]
        noseSpine[11] = noseShape[14]
      }

      this.facePoints.geometry.attributes.position.array[iX] = x
      this.facePoints.geometry.attributes.position.array[iY] = y
      this.facePoints.geometry.attributes.position.array[iZ] = z
    }

    lipsShape[36] = lipsShape[0]
    lipsShape[37] = lipsShape[1]
    lipsShape[38] = lipsShape[2]

    mouthShape[24] = mouthShape[0]
    mouthShape[25] = mouthShape[1]
    mouthShape[26] = mouthShape[2]

    this.facePoints.geometry.attributes.position.needsUpdate = true
    this.faceShape.geometry.attributes.position.needsUpdate = true

    this.noseSpine.geometry.attributes.position.needsUpdate = true
    this.noseShape.geometry.attributes.position.needsUpdate = true

    this.lipsShape.geometry.attributes.position.needsUpdate = true
    this.mouthShape.geometry.attributes.position.needsUpdate = true

    this.leftEyebrow.geometry.attributes.position.needsUpdate = true
    this.rightEyebrow.geometry.attributes.position.needsUpdate = true
  }

  setVideoSize () {
    this.width = window.innerWidth / 10 * 6
    this.height = this.width / 4 * 3

    this.video.width = this.width
    this.video.height = this.height

    this.overlay.width = this.width
    this.overlay.height =  this.height

    this.widthRatio = 200 / this.width
    this.heightRatio = 160 / this.height
  }

  onResize () {
    this.setVideoSize()

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    if (this.tracker) {
      this.tracker.stop()
      this.tracker.reset()
      this.tracker.start(this.video)
    }
  }
}
