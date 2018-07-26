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

    faceGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(FACE_COORDS), 3));
    this.facePoints = new THREE.Points(faceGeometry, new THREE.PointsMaterial({ color: 0x00CC00 }));

    this.rightEyebrow = this.createLineGeometry(4)
    this.leftEyebrow = this.createLineGeometry(4)

    this.faceShape = this.createLineGeometry(15)
    this.lipsShape = this.createLineGeometry(13)

    this.mouthShape = this.createLineGeometry(9)
    this.noseShape = this.createLineGeometry(9)
    this.noseSpine = this.createLineGeometry(3)

    this.scene.add(this.rightEyebrow)
    this.scene.add(this.leftEyebrow)

    this.scene.add(this.facePoints)
    this.scene.add(this.faceShape)

    this.scene.add(this.mouthShape)
    this.scene.add(this.lipsShape)
    this.scene.add(this.noseShape)
    this.scene.add(this.noseSpine)
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

  drawCurrentPosition (points) {
    const lipsShape = this.lipsShape.geometry.attributes.position.array
    const faceShape = this.faceShape.geometry.attributes.position.array

    const noseSpine = this.noseSpine.geometry.attributes.position.array
    const noseShape = this.noseShape.geometry.attributes.position.array

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

      // shape
      if (p < 15) {
        let v = Math.abs(p - 7)
        z = 7 - (v < 2 ? v + 2.5 : v < 4 ? v / 0.4 : v < 6 ? v / 0.45 : 12)

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
        z = 3.5

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
        z = 7.25

        noseSpine[6] = x
        noseSpine[7] = y
        noseSpine[8] = z
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

    this.rightEyebrow.geometry.attributes.position.needsUpdate = true
    this.leftEyebrow.geometry.attributes.position.needsUpdate = true

    this.facePoints.geometry.attributes.position.needsUpdate = true
    this.faceShape.geometry.attributes.position.needsUpdate = true

    this.mouthShape.geometry.attributes.position.needsUpdate = true
    this.noseShape.geometry.attributes.position.needsUpdate = true
    this.noseSpine.geometry.attributes.position.needsUpdate = true
    this.lipsShape.geometry.attributes.position.needsUpdate = true
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
