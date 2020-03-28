// https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html
// https://github.com/evanw/glfx.js/tree/master/src
// https://evanw.github.io/glfx.js/demo/

import FaceMasking from '@/FaceMasking';

export default new FaceMasking(
  document.getElementById('start'),
  document.getElementById('video'),
  document.getElementById('intensity')
);
