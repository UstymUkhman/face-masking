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

  //
  // PIXELATE:
  //
  // if (vUv.y > mask.x && vUv.x < mask.y &&
  //     vUv.y < mask.z && vUv.x > mask.w
  // ) {
  //   uv += size.xy;
  //   uv *= size.zw;

  //   uv = floor(uv / intensity) * intensity;

  //   uv -= size.xy;
  //   uv /= size.zw;

  //   color = texture2D(tDiffuse, uv);
  // }

  // gl_FragColor = color;

  //
  // SWIRL:
  //
  // float distance = length(coord);

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
  // gl_FragColor = texture2D(tDiffuse, coord / texSize);

  //
  // INK:
  //
  vec2 dx = vec2(1.0 / size.z, 0.0);
  vec2 dy = vec2(0.0, 1.0 / size.w);

  float bigTotal = 0.0;
  float smallTotal = 0.0;

  vec3 bigAverage = vec3(0.0);
  vec3 smallAverage = vec3(0.0);

  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      vec3 sample = texture2D(tDiffuse, uv + dx * x + dy * y).rgb;
      bigAverage += sample;
      bigTotal += 1.0;

      if (abs(x) + abs(y) < 2.0) {
        smallAverage += sample;
        smallTotal += 1.0;
      }
    }
  }

  float strength = 0.1;

  vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);
  gl_FragColor = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);
}
