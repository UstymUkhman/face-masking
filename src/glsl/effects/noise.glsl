vec4 noise (sampler2D diffuse, vec4 mask, vec2 uv, float strength, float time) {
  vec4 color = texture(diffuse, uv);

  if (uvInMask(mask, uv)) {
    float xs = floor(gl_FragCoord.x / 1.0);
    float ys = floor(gl_FragCoord.y / 1.0);

    vec2 position = vec2(xs * time, ys * time);
    vec3 noise = vec4(rand(position) * strength).rgb;
    color.rgb = mix(color.rgb, noise, strength / 2.0);
  }

  return color;
}
