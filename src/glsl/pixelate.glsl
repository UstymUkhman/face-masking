precision highp float;

vec4 pixelate (sampler2D texture, vec4 mask, vec2 size, vec2 uv, float strength) {
  vec4 color = texture2D(texture, uv);

  if (uv.y > mask.x && uv.x < mask.y &&
    uv.y < mask.z && uv.x > mask.w
  ) {
    uv += vec2(0.0);
    uv *= size.xy;

    uv = floor(uv / strength) * strength;

    uv -= vec2(0.0);
    uv /= size.xy;

    color = texture2D(texture, uv);
  }

  return color;
}
