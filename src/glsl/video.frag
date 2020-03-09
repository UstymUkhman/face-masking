#include <common>
precision highp float;

uniform sampler2D tDiffuse;
uniform float time;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);
  vec3 result = color.rgb;

  float xs = floor(gl_FragCoord.x / 1.0);
  float ys = floor(gl_FragCoord.y / 1.0);

  vec2 noisePosition = vec2(xs * time, ys * time);
  vec3 noiseColor = vec4(rand(noisePosition) * 1.0 * 2.0).rgb;

  color.rgb = mix(result, noiseColor, 1.0 / 4.0);
  gl_FragColor = color;
}
