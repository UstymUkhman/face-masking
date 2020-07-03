vec4 hueSaturation (sampler2D diffuse, vec4 mask, vec2 uv, float strength) {
  vec4 color = texture(diffuse, uv);

  if (uvInMask(mask, uv)) {
    float hue = strength * PI;
    float cosine = cos(hue);
    float sine = sin(hue);

    vec3 intensity = (vec3(
      2.0 * cosine, -sqrt(3.0) * sine - cosine, sqrt(3.0) * sine - cosine
    ) + 1.0) / 3.0;

    color.rgb = vec3(
      dot(color.rgb, intensity.xyz),
      dot(color.rgb, intensity.zxy),
      dot(color.rgb, intensity.yzx)
    );

    color.rgb += ((color.r + color.g + color.b) / 3.0 - color.rgb) * -50.0;
  }

  return color;
}
