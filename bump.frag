// bump.frag

uniform sampler2D texture;

varying vec3 light;
varying vec3 view;

float shlick(const in float t, const in float k)
{
  return t / (k - k * t + t);
}

void main ()
{
  vec4 color = texture2DProj(texture, gl_TexCoord[0]);
  vec3 fnormal = vec3(color) * 2.0 - 1.0;
  vec3 flight = normalize(light);
  float diffuse = dot(flight, fnormal);

  gl_FragColor = gl_FrontLightProduct[0].ambient;
  if (diffuse > 0.0) {
	vec3 fview = normalize(view);
    vec3 halfway = normalize(flight - fview);
    float specular = shlick(max(dot(fnormal, halfway), 0.0), halfway.y * halfway.y * gl_FrontMaterial.shininess);
    gl_FragColor += gl_FrontLightProduct[0].diffuse * diffuse
                 + gl_FrontLightProduct[0].specular * specular;
	}
}
