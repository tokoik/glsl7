#version 120

// shlick.frag

// ラスタライザから受け取る接空間の光線ベクトルの補間値
varying vec3 tlight;

// ラスタライザから受け取る接空間の視線ベクトルの補間値
varying vec3 tview;

// テクスチャのサンプラ
uniform sampler2D color;

//
// Shlick の近似
//
float shlick(const in float t, const in float k)
{
  return t / (k - k * t + t);
}

void main ()
{
  // テクスチャから画素の色を得る
  vec4 fcolor = texture2DProj(color, gl_TexCoord[0]);

  // 接空間における法線ベクトル
  vec3 normal = fcolor.rgb * 2.0 - 1.0;

  // 接空間における光線ベクトル
  vec3 light = normalize(tlight);

  // 拡散反射率
  float diffuse = max(dot(normal, light), 0.0);

  // 接空間における視線ベクトル
  vec3 view = normalize(tview);

  // 接空間における中間ベクトル
  vec3 halfway = normalize(light + view);

  // 鏡面反射率
  float specular = shlick(max(dot(normal, halfway), 0.0),
    halfway.y * halfway.y * gl_FrontMaterial.shininess);

  // フラグメントの色
  gl_FragColor = gl_FrontLightProduct[0].ambient
               + gl_FrontLightProduct[0].diffuse * diffuse
               + gl_FrontLightProduct[0].specular * specular;
}
