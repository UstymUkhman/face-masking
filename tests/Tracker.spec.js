import { ShaderPass } from '@postprocessing/ShaderPass';
import { Texture } from '@three/textures/Texture';
import Tracker from '../src/Tracker';

describe('Tracker', () => {
  const video = document.createElement('video');
  let tracker = null;

  beforeEach(() => {
    tracker = new Tracker(video, 640, 480);
  });

  afterEach(() => {
    tracker.destroy();
    tracker = null;
  });

  it('should be created', () => {
    expect(tracker.width).to.equal(640);
    expect(tracker.height).to.equal(480);

    expect(tracker).to.have.own.property('options');
    expect(tracker).to.have.own.property('stream', video);
  });

  it('should getUserMedia fail', () => {
    expect(tracker.gumFail).to.throw();
  });

  it('should create texture geometry', () => {
    expect(tracker.createGeometry()).to.be.an.instanceof(Texture);
  });

  it('should create shader pass', () => {
    expect(tracker.createShader()).to.be.an.instanceof(ShaderPass);
  });

  it('should update shader intensity', () => {
    tracker.createShader();
    tracker.createGeometry();

    expect(tracker.setIntensity(0)).to.satisfy(() => {
      return tracker.shader.material.uniforms.intensity.value === 0;
    });

    expect(tracker.setIntensity(25)).to.satisfy(() => {
      return tracker.shader.material.uniforms.intensity.value === 25;
    });
  });
});
