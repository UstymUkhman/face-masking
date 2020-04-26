// float rand (vec2 co) {
//   highp float a  = 12.9898;
//   highp float b  = 78.233;
//   highp float c  = 43758.5453;

//   highp float dt = dot(co.xy, vec2(a, b));
//   highp float sn = mod(dt, 3.14);
//   return fract(sin(sn) * c);
// }

vec4 noise (sampler2D texture, vec4 mask, vec2 uv, float strength, float time) {
  vec4 color = texture2D(texture, uv);

  if (uv.y > mask.x && uv.x < mask.y &&
    uv.y < mask.z && uv.x > mask.w
  ) {
    float xs = floor(gl_FragCoord.x / 1.0);
    float ys = floor(gl_FragCoord.y / 1.0);

    vec2 position = vec2(xs * time, ys * time);
    vec3 noise = vec4(rand(position) * strength).rgb;
    color.rgb = mix(color.rgb, noise, strength / 2.0);
  }

  return color;
}
