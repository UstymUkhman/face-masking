#include <common>
precision highp float;

uniform sampler2D tDiffuse;
// uniform float time;
uniform vec4 mask;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);

  if (vUv.y > mask.x && vUv.x < mask.y &&
      vUv.y < mask.z && vUv.x > mask.w
  ) {
    color = vec4(1.0);
  }

  gl_FragColor = color;
}
