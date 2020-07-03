vec4 pixelate (sampler2D diffuse, vec4 mask, vec2 size, vec2 uv, float strength) {
  vec4 color = texture(diffuse, uv);

  if (uvInMask(mask, uv)) {
    uv += vec2(0.0);
    uv *= size.xy;

    uv = floor(uv / strength) * strength;

    uv -= vec2(0.0);
    uv /= size.xy;

    color = texture(diffuse, uv);
  }

  return color;
}
