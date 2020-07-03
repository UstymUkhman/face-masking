vec4 ink (sampler2D diffuse, vec4 mask, vec2 size, vec2 uv, float strength) {
  vec4 color = texture(diffuse, uv);

  if (uvInMask(mask, uv)) {
    vec2 dx = vec2(1.0 / size.x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / size.y);

    vec3 smallAverage = vec3(0.0);
    vec3 bigAverage = vec3(0.0);

    float smallTotal = 0.0;
    float bigTotal = 0.0;

    for (float x = -2.0; x <= 2.0; x += 1.0) {
      for (float y = -2.0; y <= 2.0; y += 1.0) {
        vec3 colorSample = texture(diffuse, uv + dx * x + dy * y).rgb;
        bigAverage += colorSample;
        bigTotal += 1.0;

        if (abs(x) + abs(y) < 2.0) {
          smallAverage += colorSample;
          smallTotal += 1.0;
        }
      }
    }

    vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);
    color = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);
  }

  return color;
}
