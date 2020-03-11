import FaceMasking from '../src/FaceMasking';

describe('FaceMasking', () => {
  const start = document.createElement('button');
  const video = document.createElement('video');
  const input = document.createElement('input');

  let faceMasking = null;
  input.type = 'range';

  beforeEach(() => {
    faceMasking = new FaceMasking(start, video, input);
  });

  it('should set video size', () => {
    faceMasking.setSize();

    expect(video.width).to.equal(640);
    expect(video.height).to.equal(480);

    expect(faceMasking.width).to.equal(640);
    expect(faceMasking.height).to.equal(480);

    expect(faceMasking.ratio).to.closeTo(640 / 480, 0.1);
  });
});
