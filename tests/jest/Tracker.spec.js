import { ShaderPass } from '@postprocessing/ShaderPass';
import { Texture } from '@three/textures/Texture';
import Tracker from '@/Tracker';

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
    expect(tracker.width).toEqual(640);
    expect(tracker.height).toEqual(480);

    expect(tracker).toHaveProperty('options');
    expect(tracker).toHaveProperty('stream', video);
  });

  it('should getUserMedia fail', () => {
    expect(tracker.gumFail).toThrow();
  });

  it('should create texture geometry', () => {
    expect(tracker.createGeometry()).toBeInstanceOf(Texture);
  });

  it('should create shader pass', () => {
    expect(tracker.createShader()).toBeInstanceOf(ShaderPass);
  });

  it('should update shader intensity', () => {
    tracker.createShader();
    tracker.createGeometry();

    tracker.setIntensity(0);
    expect(tracker.shader.material.uniforms.intensity.value).toBe(0);

    tracker.setIntensity(25);
    expect(tracker.shader.material.uniforms.intensity.value).toBe(25);
  });
});
