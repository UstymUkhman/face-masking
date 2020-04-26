#include ./utils.glsl;

vec4 zoomBlur (sampler2D texture, vec4 mask, vec2 size, vec2 uv, vec2 center, float strength) {
  const int MAX = 40;
  vec4 color = gl_FragColor;

  if (uvInMask(mask, uv) && strength > 0.031) {
    float total = 0.0;
    vec4 amount = vec4(0.0);
    float offset = rand(0.0);

    size = normalizeSize(size);
    center = center - uv * size;

    for (int i = 0; i <= MAX; i++) {
      float percent = (float(i) + offset) / float(MAX);
      float weight = 4.0 * (percent - percent * percent);
      vec4 sample = texture2D(texture, uv + center * percent * strength / size);

      sample.rgb *= sample.a;
      amount += sample * weight;
      total += weight;
    }

    color = amount / total;
    color.rgb /= color.a + 0.00001;
  }

  return color;
}
