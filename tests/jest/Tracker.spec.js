import { ShaderPass } from '@postprocessing/ShaderPass';
import { Texture } from '@three/textures/Texture';
import Tracker from '@/Tracker';

describe('Tracker', () => {
  const video = document.createElement('video');
  const tracker = new Tracker(video, 640, 480);

  global.alert = jest.fn();

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

  it('should update mask', () => {
    tracker.createShader();
    tracker.createGeometry();

    tracker.setMask(0);
    expect(tracker.shader.material.uniforms.effect.value).toBe(0);

    tracker.setMask(9);
    expect(tracker.shader.material.uniforms.effect.value).toBe(9);
  });

  it('should update mask strength', () => {
    tracker.createShader();
    tracker.createGeometry();

    tracker.setStrength(0);
    expect(tracker.shader.material.uniforms.strength.value).toBe(0);

    tracker.setStrength(25);
    expect(tracker.shader.material.uniforms.strength.value).toBe(25);
  });

  it('should render', () => {
    const spy = jest.spyOn(tracker, 'render');
    const render = tracker.render();

    expect(spy).toHaveBeenCalled();
    expect(render).toBe(undefined);

    spy.mockRestore();
  });
});
