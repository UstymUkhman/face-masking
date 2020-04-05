precision highp float;

vec4 swirl (sampler2D texture, vec2 size, vec2 uv, vec2 center, float radius, float strength) {
  vec2 coord = uv * size - center;
  float distance = length(coord);

  if (distance < radius) {
    float percent = (radius - distance) / radius;
    float theta = percent * percent * strength;

    float s = sin(theta);
    float c = cos(theta);

    coord = vec2(
      coord.x * c - coord.y * s,
      coord.x * s + coord.y * c
    );
  }

  coord += center;
  return texture2D(texture, coord / size);
}
