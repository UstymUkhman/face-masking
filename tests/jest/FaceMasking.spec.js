import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';
import { Scene } from '@three/scenes/Scene';
import FaceMasking from '@/FaceMasking';
import Tracker from '@/Tracker';

describe('FaceMasking', () => {
  const masks = document.createElement('select');
  const start = document.createElement('button');
  const video = document.createElement('video');
  const input = document.createElement('input');

  const faceMasking = new FaceMasking(masks, start, video, input);
  input.type = 'range';

  it('should be created', () => {
    expect(faceMasking).toHaveProperty('masks', masks);
    expect(faceMasking).toHaveProperty('start', start);
    expect(faceMasking).toHaveProperty('video', video);
    expect(faceMasking).toHaveProperty('range', input);

    expect(faceMasking.scene).toBeInstanceOf(Scene);
    expect(faceMasking.camera).toBeInstanceOf(PerspectiveCamera);
    expect(faceMasking.renderer).toBeInstanceOf(Object);

    expect(faceMasking.composer).toBeInstanceOf(Object);
    expect(faceMasking.tracker).toBeInstanceOf(Tracker);
  });

  it('should set video size', () => {
    faceMasking.setSize();

    expect(faceMasking.width).toEqual(640);
    expect(faceMasking.height).toEqual(480);

    expect(faceMasking.video.width).toEqual(640);
    expect(faceMasking.video.height).toEqual(480);

    expect(faceMasking.ratio).toBeCloseTo(640 / 480, 0.1);
  });

  it('should update mask', () => {
    faceMasking.tracker.createGeometry();

    faceMasking.onChange({ target: { value: '0' } });
    expect(faceMasking.tracker.shader.material.uniforms.effect.value).toBe(0);

    faceMasking.onChange({ target: { value: '9' } });
    expect(faceMasking.tracker.shader.material.uniforms.effect.value).toBe(9);
  });

  it('should update mask strength', () => {
    faceMasking.tracker.createGeometry();

    faceMasking.onInput({ target: { value: '0' } });
    expect(faceMasking.tracker.shader.material.uniforms.strength.value).toBe(0);

    faceMasking.onInput({ target: { value: '25' } });
    expect(faceMasking.tracker.shader.material.uniforms.strength.value).toBe(25);
  });

  it('should render', () => {
    faceMasking.composer.render = jest.fn();
    const trackerSpy = jest.spyOn(faceMasking.tracker, 'render');
    const faceMaskingSpy = jest.spyOn(faceMasking, 'render');
    const render = faceMasking.render();

    expect(faceMaskingSpy).toHaveBeenCalled();
    expect(trackerSpy).toHaveBeenCalled();
    expect(render).toBe(undefined);

    faceMaskingSpy.mockRestore();
    trackerSpy.mockRestore();
  });

  it('should destroy', () => {
    const spy = jest.spyOn(faceMasking, 'destroy');
    const destroy = faceMasking.destroy();

    expect(spy).toHaveBeenCalled();
    expect(destroy).toBe(undefined);

    spy.mockRestore();
  });
});
