#include <common>
precision highp float;

uniform sampler2D tDiffuse;
uniform float intensity;
uniform float radius;
uniform float angle;

uniform vec2 center;
uniform vec4 mask;
uniform vec4 size;

varying vec2 vUv;

void main (void) {
  vec2 texSize = vec2(size.z / size.z, size.w / size.z);
  vec4 color = texture2D(tDiffuse, vUv);
  vec2 coord = vUv * texSize - center;
  vec2 uv = vUv;

  float distance = length(coord);

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

  // if (distance < radius) {
  //   float percent = (radius - distance) / radius;
  //   float theta = percent * percent * angle;

  //   float s = sin(theta);
  //   float c = cos(theta);

  //   coord = vec2(
  //     coord.x * c - coord.y * s,
  //     coord.x * s + coord.y * c
  //   );
  // }

  // coord += center;
  gl_FragColor = color;
  // gl_FragColor = texture2D(tDiffuse, coord / texSize);
}
