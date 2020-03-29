import { EffectComposer } from '@postprocessing/EffectComposer';

jest.genMockFromModule('@postprocessing/EffectComposer');
jest.mock('@postprocessing/EffectComposer');

const mockEffectComposer = {
  addPass: jest.fn()
};

EffectComposer.mockImplementation(() => mockEffectComposer);

export { EffectComposer };
