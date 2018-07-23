import * as THREE from 'three-full/builds/Three.es.min.js'
import stats from 'stats-js'
import clm from 'clmtrackr'

export default class FaceTracking {
  constructor (video, overlay) {
    // this.width = 400
    // this.height = 300

    this.width = window.innerWidth / 10 * 8
    this.height = this.width / 16 * 9

    this.overlay = overlay
    this.video = video

    // this.width = this.video.width
    // this.height = this.video.height

    // this.width = Math.round(this.height * this.video.videoWidth / this.video.videoHeight);

    this.video.width = this.width
    this.video.height = this.height

    this.overlay.width = this.width
    this.overlay.height =  this.height

    this.overlayContext = this.overlay.getContext('2d')
    this.video.oncanplay = this.startExperiment.bind(this)
  }

  startExperiment () {
    // this.width = this.video.width
    // this.height = this.video.height

    // this.width = Math.round(this.height * this.video.videoWidth / this.video.videoHeight);

    // this.createWebGLEnvironment()
    this.createCameraTracking()
    this.video.play()

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

  /* gumSuccess () {
    if ("srcObject" in vid) {
      vid.srcObject = stream;
    } else {
      vid.src = (window.URL && window.URL.createObjectURL(stream));
    }
    vid.onloadedmetadata = function() {
      adjustVideoProportions();
      vid.play();
    }
    vid.onresize = function() {
      adjustVideoProportions();
      if (trackingStarted) {
        ctrack.stop();
        ctrack.reset();
        ctrack.start(vid);
      }
    }
  } */

  /* gumFail () {
  } */

  createCameraTracking () {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

    this.tracker = new clm.tracker();
    this.tracker.init();
    this.tracker.start(this.video);

    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess).catch(this.gumFail);
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true}, this.gumSuccess, this.gumFail);
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

  onResize () {
    // this.width = window.innerWidth / 10 * 8
    // this.height = this.width / 16 * 9

    // this.video.width = this.width
    // this.video.height = this.height

    // this.tracker.stop()
    // this.tracker.reset()
    // this.tracker.start(this.video)

    // this.renderer.setSize(this.width, this.height)
    // this.camera.aspect = this.width / this.height
    // this.camera.updateProjectionMatrix()
  }
}
