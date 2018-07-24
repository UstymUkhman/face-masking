// import * as THREE from 'three-full/builds/Three.es.min.js'
// import stats from 'stats-js'
import clm from 'clmtrackr'

export default class FaceTracking {
  constructor (video, overlay) {
    this.video = video
    this.overlay = overlay

    this.overlayContext = this.overlay.getContext('2d')
    this.startExperiment()
  }

  startExperiment () {
    // this.createWebGLEnvironment()
    this.createCameraTracking()
    this.setVideoSize()

    this.onResize()
    this.render()
  }

  createWebGLEnvironment () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000)
    this.camera.position.z = 1000 // Math.round(this.height / 0.8275862)
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(this.renderer.domElement)
  }

  gumSuccess (stream) {
    this.video.srcObject = stream;

    this.video.onloadedmetadata = () => {
      this.setVideoSize();
      this.video.play();
    };
  }

  gumFail () {
    console.error('Camera Stream Fail.');
  }

  createCameraTracking () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    this.video.oncanplay = null;

    this.tracker = new clm.tracker();
    this.tracker.init();
    this.tracker.start(this.video);

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess.bind(this)).catch(this.gumFail.bind(this));
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true}, this.gumSuccess.bind(this), this.gumFail.bind(this));
    }
  }

  render () {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.overlayContext.clearRect(0, 0, this.width, this.height);

      if (this.tracker.getCurrentPosition()) {
        this.tracker.draw(overlay);
      }
    }

    this.frame = requestAnimationFrame(this.render.bind(this))
  }

  setVideoSize () {
    this.width = window.innerWidth / 10 * 6
    this.height = this.width / 4 * 3

    this.video.width = this.width
    this.video.height = this.height

    this.overlay.width = this.width
    this.overlay.height =  this.height
  }

  onResize () {
    this.setVideoSize();

    // this.renderer.setSize(this.width, this.height)
    // this.camera.aspect = this.width / this.height
    // this.camera.updateProjectionMatrix()

    if (this.tracker) {
      this.tracker.stop()
      this.tracker.reset()
      this.tracker.start(this.video)
    }
  }
}
