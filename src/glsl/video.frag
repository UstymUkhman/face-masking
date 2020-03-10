#include <common>
precision highp float;

uniform sampler2D tDiffuse;
uniform float intensity;

uniform vec4 mask;
uniform vec4 size;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);
  vec2 uv = vUv;

  if (vUv.y > mask.x && vUv.x < mask.y &&
      vUv.y < mask.z && vUv.x > mask.w
  ) {
    uv += size.xy;
    uv *= size.zw;

    uv = floor(uv / intensity) * intensity;

    uv -= size.xy;
    uv /= size.zw;

    color = texture2D(tDiffuse, uv);
  }

  gl_FragColor = color;
}
