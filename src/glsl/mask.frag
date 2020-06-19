precision highp float;

// #include ./utils.glsl;
// #include ./effects/ink.glsl;
// #include ./effects/blur.glsl;
// #include ./effects/swirl.glsl;
// #include ./effects/noise.glsl;
// #include ./effects/edgeWork.glsl;
// #include ./effects/pixelate.glsl;
// #include ./effects/zoomBlur.glsl;
#include ./effects/dotScreen.glsl;
// #include ./effects/blugePinch.glsl;
// #include ./effects/hueSaturation.glsl;


#define MAX_BLUR  33.333333333333333
#define MAX_NOISE 13.333333333333333

uniform sampler2D tDiffuse;
uniform float strength;
uniform float radius;
uniform float time;

uniform vec2 center;
uniform vec2 size;
uniform vec4 mask;

varying vec2 vUv;

void main (void) {
  gl_FragColor = dotScreen(tDiffuse, mask, size, vUv, center, (strength + 3.0) / 2.0);

  // gl_FragColor = hueSaturation(tDiffuse, mask, vUv, (strength - 13.0) / 12.0);

  // gl_FragColor = edgeWork(tDiffuse, mask, size, vUv, radius, strength);

  // gl_FragColor = zoomBlur(tDiffuse, mask, size, vUv, center, strength / MAX_BLUR);

  // gl_FragColor = blugePinch(tDiffuse, vec2(
  //   size.x / size.x, size.y / size.x
  // ), vUv, vec2(center.x, center.y - 0.05), radius, (strength - 13.0) / 12.0);

  // gl_FragColor = noise(tDiffuse, mask, vUv, (strength - 1.0) / MAX_NOISE, time);

  // gl_FragColor = blur(tDiffuse, mask, vUv, strength / 512.0);

  // gl_FragColor = pixelate(tDiffuse, mask, size, vUv, strength);

  // gl_FragColor = swirl(tDiffuse, vec2(
  //   size.x / size.x, size.y / size.x
  // ), vUv, center, radius, (strength - 13.0) / -2.4);

  // gl_FragColor = ink(tDiffuse, mask, size, vUv, (strength - 1.0) / 24.0);
}
