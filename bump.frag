#version 120

// bump.frag

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
  // 法線マップから接空間の法線ベクトルを得る
  vec4 fcolor = texture2DProj(color, gl_TexCoord[0]);
  vec3 fnormal = fcolor.rgb * 2.0 - 1.0;

  // 接空間における光線ベクトル
  vec3 flight = normalize(tlight);

  // 拡散反射率
  float diffuse = max(dot(fnormal, flight), 0.0);

  // 接空間における中間ベクトル
  vec3 fhalfway = normalize(tlight + tview);

  // 鏡面反射率
  float specular = shlick(max(dot(fnormal, fhalfway), 0.0),
    fhalfway.y * fhalfway.y * gl_FrontMaterial.shininess);

  // フラグメントの色
  gl_FragColor = gl_FrontLightProduct[0].ambient
               + gl_FrontLightProduct[0].diffuse * diffuse
               + gl_FrontLightProduct[0].specular * specular;
}
