#include <common>
precision highp float;

uniform sampler2D tDiffuse;
uniform float time;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);

  // float xs = floor(gl_FragCoord.x / 1.0);
  // float ys = floor(gl_FragCoord.y / 1.0);

  // vec2 noisePosition = vec2(xs * time, ys * time);
  // vec3 noiseColor = vec4(rand(noisePosition) * 1.0 * 2.0).rgb;

  // color.rgb = mix(color.rgb, noiseColor, 1.0 / 4.0);

  // if (0.2 < vUv.x && vUv.x < 0.8) color = vec4(1.0);
  gl_FragColor = color;
}
