#include ./utils.glsl;

vec4 dotScreen (sampler2D texture, vec4 mask, vec2 size, vec2 uv, vec2 center, float strength) {
  vec4 color = texture2D(texture, uv);

  if (uvInMask(mask, uv)) {
    vec2 coord = uv * size - center;
    vec2 point = vec2(coord.x, coord.y) * PI / strength;

    float average = (color.r + color.g + color.b) / 3.0;
    float pattern = sin(point.x) * sin(point.y) * 4.0;

    color = vec4(
      vec3(
        average * 10.0 - 5.0 + pattern
      ), color.a
    );
  }

  return color;
}
