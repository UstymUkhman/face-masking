#include ./ink.glsl;
#include ./swirl.glsl;
#include ./pixelate.glsl;

uniform sampler2D tDiffuse;
uniform float strength;
uniform float radius;

uniform vec2 center;
uniform vec2 size;
uniform vec4 mask;

varying vec2 vUv;

void main (void) {
  vec4 color = texture2D(tDiffuse, vUv);

  // gl_FragColor = pixelate(tDiffuse, mask, size, vUv, strength);

  // gl_FragColor = swirl(tDiffuse, vec2(
  //   size.x / size.x, size.y / size.x
  // ), vUv, center, radius, (strength - 13.0) / -2.4);

  gl_FragColor = ink(tDiffuse, vec2(size.x, size.y), vUv, strength / 100.0);
}
