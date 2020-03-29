import { WebGLRenderer } from '@three/renderers/WebGLRenderer';

jest.genMockFromModule('@three/renderers/WebGLRenderer');
jest.mock('@three/renderers/WebGLRenderer');

const canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');

const mockWebGLRenderer = {
  setPixelRatio: jest.fn(),
  domElement: canvas,
  setSize: jest.fn()
};

WebGLRenderer.mockImplementation(() => mockWebGLRenderer);

export { WebGLRenderer };
