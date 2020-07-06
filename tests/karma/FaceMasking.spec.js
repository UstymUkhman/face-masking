import { PerspectiveCamera } from '@three/cameras/PerspectiveCamera';
import { EffectComposer } from '@postprocessing/EffectComposer';
import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

import { Scene } from '@three/scenes/Scene';
import FaceMasking from '@/FaceMasking';
import Tracker from '@/Tracker';

describe('FaceMasking', () => {
  const masks = document.createElement('select');
  const start = document.createElement('button');
  const video = document.createElement('video');
  const input = document.createElement('input');

  let faceMasking = new FaceMasking(masks, start, video, input);
  input.type = 'range';

  it('should be created', () => {
    expect(faceMasking).to.have.own.property('masks', masks);
    expect(faceMasking).to.have.own.property('start', start);
    expect(faceMasking).to.have.own.property('video', video);
    expect(faceMasking).to.have.own.property('range', input);

    expect(faceMasking.scene).to.be.an.instanceof(Scene);
    expect(faceMasking.camera).to.be.an.instanceof(PerspectiveCamera);
    expect(faceMasking.renderer).to.be.an.instanceof(WebGLRenderer);

    expect(faceMasking.composer).to.be.an.instanceof(EffectComposer);
    expect(faceMasking.tracker).to.be.an.instanceof(Tracker);
  });

  it('should set video size', () => {
    faceMasking.setSize();

    expect(faceMasking.width).to.equal(640);
    expect(faceMasking.height).to.equal(480);

    expect(faceMasking.video.width).to.equal(640);
    expect(faceMasking.video.height).to.equal(480);

    expect(faceMasking.ratio).to.closeTo(640 / 480, 0.1);
  });

  it('should update mask', () => {
    faceMasking.tracker.createGeometry();

    expect(faceMasking.onChange({ target: { value: '0' } })).to.satisfy(() => {
      return faceMasking.tracker.shader.material.uniforms.effect.value === 0;
    });

    expect(faceMasking.onChange({ target: { value: '9' } })).to.satisfy(() => {
      return faceMasking.tracker.shader.material.uniforms.effect.value === 9;
    });
  });

  it('should update mask strength', () => {
    faceMasking.tracker.createGeometry();

    expect(faceMasking.onInput({ target: { value: '0' } })).to.satisfy(() => {
      return faceMasking.tracker.shader.material.uniforms.strength.value === 0;
    });

    expect(faceMasking.onInput({ target: { value: '25' } })).to.satisfy(() => {
      return faceMasking.tracker.shader.material.uniforms.strength.value === 25;
    });
  });

  it('should render', () => {
    faceMasking.render();
  });

  it('should destroy', () => {
    faceMasking.destroy();

    expect(faceMasking).not.to.have.own.property('renderer');
    expect(faceMasking).not.to.have.own.property('tracker');
    expect(faceMasking).not.to.have.own.property('camera');
    expect(faceMasking).not.to.have.own.property('scene');
  });
});
