import * as THREE from 'three-full/builds/Three.es.min.js'
// import stats from 'stats-js'
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
    this.setVideoSize()
    // this.createCameraTracking()
    this.createWebGLEnvironment()

    // video
    this.tracker = new clm.tracker()
    this.tracker.init()
    this.tracker.start(this.video)
    this.video.play()
    // 

    this.onResize()
    this.render()
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

    const faceGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(FACE_COORDS)

    faceGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.facePoints = new THREE.Points(faceGeometry, new THREE.PointsMaterial({ color: 0x00CC00 }));

    this.scene.add(this.facePoints)
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
        this.tracker.draw(overlay)
        this.drawCurrentPosition(positions)
      }
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
    this.frame = requestAnimationFrame(this.render.bind(this))
  }

  drawCurrentPosition (points) {
    for (let i = 0, p = 0; i < FACE_COORDS; i += 3, p++) {
      const x = points[p][0] * this.widthRatio - 100
      const y = points[p][1] * -this.heightRatio + 100

      // eyes
      let z = 2.5

      // shape
      if (p < 15) {
        let v = Math.abs(p - 7)
        z = 7 - (v < 2 ? v + 2.5 : v < 4 ? v / 0.4 : v < 6 ? v / 0.45 : 12)
      }

      // eyebrows
      else if (p < 23) {
        z = 4
      }

      // nose shape
      else if (p > 32 & p < 41) {
        z = 3.5
      }

      // lips
      else if (p > 40 & p < 56) {
        z = (p === 42 || p === 43) ? 5.5 : 5
      }

      // mouth
      else if (p > 55 & p < 62) {
        z = 4
      }

      // eye balls
      else if (p === 27 || p === 32) {
        z = 3
      }

      // nose tip
      else if (p === 62) {
        z = 6.5
      }

      this.facePoints.geometry.attributes.position.array[i] = x
      this.facePoints.geometry.attributes.position.array[i + 1] = y
      this.facePoints.geometry.attributes.position.array[i + 2] = z
    }

    this.facePoints.geometry.attributes.position.needsUpdate = true
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
    this.setVideoSize();

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
