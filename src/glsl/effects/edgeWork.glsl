vec4 edgeWork (sampler2D diffuse, vec4 mask, vec2 size, vec2 uv, float radius, float strength) {
  if (uvInMask(mask, uv) && strength > 1.0) {
    vec2  color  = vec2(0.0);
    vec2  total  = vec2(0.0);
    float offset = rand(0.0);
    vec2  delta  = vec2(radius / size.x, radius / size.y) * strength;

    for (float i = -30.0; i <= 30.0; i++) {
      float percent = (i + offset - 0.5) / 30.0;
      float weight  = 1.0 - abs(percent);

      vec3 colorSample = texture(diffuse, uv + delta * percent).rgb;
      float average = (colorSample.r + colorSample.g + colorSample.b) / 3.0;

      color.x += average * weight;
      total.x += weight;

      if (abs(i) < 15.0) {
        weight   = weight * 2.0 - 1.0;
        color.y += average * weight;
        total.y += weight;
      }
    }

    vec4 result = vec4(color / total, 0.0, 1.0);

    color  = vec2(0.0);
    total  = vec2(0.0);
    offset = rand(0.0);

    for (float i = -30.0; i <= 30.0; i++) {
      float percent = (i + offset - 0.5) / 30.0;
      float weight  = 1.0 - abs(percent);
      vec2  colorSample = result.xy;

      color.x += colorSample.x * weight;
      total.x += weight;

      if (abs(i) < 15.0) {
        weight   = weight * 2.0 - 1.0;
        color.y += colorSample.y * weight;
        total.y += weight;
      }
    }

    vec2 res = color / total;
    float filtered = clamp(10000.0 * (res.y - res.x) + 0.5, 0.0, 1.0);

    return mix(
      texture(diffuse, uv),
      vec4(filtered, filtered, filtered, 1.0),
      clamp((strength - 1.0) / 5.0, 0.0, 1.0)
    );
  }

  return texture(diffuse, uv);
}
