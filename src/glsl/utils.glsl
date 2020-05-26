bool uvInMask (vec4 mask, vec2 uv) {
  return uv.y > mask.x && uv.x < mask.y && uv.y < mask.z && uv.x > mask.w;
}

vec2 normalizeSize (vec2 size) {
  return vec2(
    size.x / size.x, size.y / size.x
  );
}

float rand (float seed) {
  return fract(sin(dot(
    gl_FragCoord.xyz + seed,
    vec3(12.9898, 78.233, 151.7182)
  )) * 43758.5453 + seed);
}

float rand (vec2 co) {
  return fract(sin(mod(dot(
    co.xy, vec2(12.9898, 78.233)
  ), 3.14)) * 43758.5453);
}

float PI = 3.141592653589793;
