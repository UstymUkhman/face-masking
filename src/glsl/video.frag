#include <common>
precision highp float;

uniform sampler2D tDiffuse;
// uniform float time;
uniform float bottom;
uniform float right;
uniform float left;
uniform float top;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);

  // Switch UV.y coord in three.js:
  float _top = abs(1.0 - bottom);
  float _bottom = abs(1.0 - top);

  bool x = vUv.x > left && vUv.x < right;
  bool y = vUv.y > _top && vUv.y < _bottom;

  if (x && y) {
    color = vec4(1.0);
  }

  gl_FragColor = color;
}
