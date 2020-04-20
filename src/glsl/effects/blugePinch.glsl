vec4 blugePinch (sampler2D texture, vec2 size, vec2 uv, vec2 center, float radius, float strength) {
  vec2 ratio = vec2(size.x / size.x, size.y / size.x);
  vec2 coord = uv * ratio - center;
  float distance = length(coord);

  if (distance < radius) {
    float percent = distance / radius;

    if (strength > 0.0) {
      coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
    } else {
      coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
    }
  }

  coord += center;
  return texture2D(texture, coord / ratio);
}
