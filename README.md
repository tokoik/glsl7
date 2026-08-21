# glsl7 - 第７回 ユーザ定義関数 サンプルプログラム

## 1. 概要

このプログラムは、OpenGL と GLSL (OpenGL Shading Language) における「ユーザ定義関数 (User-Defined Functions)」の記述方法と「Schlick の近似 (Schlick's Approximation)」を学ぶための、学生向けのサンプルプログラムです。本プログラムは、以下のブログ記事の解説に沿って作成したものです。

- [第７回 ユーザ定義関数](https://tokoik.github.io/blog/glsl%20%E5%85%A5%E9%96%80/2005/10/20/glsl.html)

このプログラムでは、前回の「[第６回 異方性反射](https://tokoik.github.io/blog/glsl%20%E5%85%A5%E9%96%80/2005/10/19/glsl.html)」で実装したハイライト計算において、鏡面反射強度の算出に用いられるべき乗 `pow()` 関数の代わりに、GLSL のユーザ定義関数として実装した **Schlick の近似** を用いて計算を行います。

## 2. ビルド方法

このプログラムは [CMake](https://cmake.org/) を用いてビルド環境を整備します。各OSとも、ソースコードが置かれているディレクトリにターミナル（またはコマンドプロンプト）で移動してから、以下の手順を実行してください。なお、プログラムをビルドするためのバイナリディレクトリは、バージョン管理ファイル（.gitignore）の設定に合わせて **build** という名前にします。

### 2.1 Windows (Visual Studio 2022 の場合)

1. コマンドプロンプトまたは PowerShell を開き、このプロジェクトのディレクトリに移動します。
2. 以下のコマンドを実行してビルドディレクトリを作成し、CMake で構成を行います。

   ```bat
   mkdir build
   cd build
   cmake .. -G "Visual Studio 17 2022"
   ```

3. 生成された build フォルダ内の glsl7.sln を Visual Studio で開きます。
4. ソリューションエクスプローラーで **glsl7** プロジェクトを右クリックし、「スタートアップ プロジェクトに設定」を選択します。
5. 「ローカル Windows デバッガー」をクリックするか、F5 キーを押してビルドおよび実行します。

### 2.2 macOS (Xcode の場合)

1. ターミナルを開き、このプロジェクトのディレクトリに移動します。
2. 以下のコマンドを実行してビルドディレクトリを作成し、Xcode 用のプロジェクトを生成します。

   ```sh
   mkdir build
   cd build
   cmake .. -G Xcode
   ```

3. 生成された build/glsl7.xcodeproj を Xcode で開きます。
4. 左上のスキーム選択（再生ボタンの横）が **glsl7** になっていることを確認します。
5. 「Run」ボタン（再生ボタン）をクリックするか、Command + R を押してビルドおよび実行します。

### 2.3 Ubuntu Linux

1. ターミナルを開き、このプロジェクトのディレクトリに移動します。
2. 必要なパッケージ（freeglut3-dev など）がインストールされていることを確認し、以下のコマンドでビルドします。

   ```sh
   mkdir build
   cd build
   cmake ..
   make
   ```

## 3. 使い方

### 3.1 プログラムの起動方法

各OSとも、ビルド後に生成されるバイナリディレクトリ (build) やそのサブフォルダから起動します。（※ CMake の設定により、Windows や Xcode では Debug などのフォルダ下に実行ファイルが置かれることがあります）

- **Windows**

  Visual Studio 上で「ローカル Windows デバッガー」をクリックして実行するか、またはコマンドプロンプトから以下のコマンドで起動します。

  ```cmd
  cd build\Debug
  glsl7.exe
  ```

- **macOS**

  Xcode 上で左上の「Run（再生ボタン）」をクリックするのが楽です。これにより glsl7.app アプリケーションバンドルとして自動的に実行されます。アプリケーションバンドルを直接起動するなら、Finder から build/Debug/glsl7.app をダブルクリックするか、ターミナルから open build/Debug/glsl7.app を実行します (この場合はエラーメッセージ等が表示されません)。

- **Ubuntu Linux**

  ターミナルから以下のコマンドで実行ファイル（バイナリ）を直接起動します。

  ```sh
  cd build
  ./glsl7
  ```

### 3.2 操作方法

- **マウスの左ボタンでドラッグ**

  画面内のオブジェクト（球）を３次元的に回転させることができます。

- **キーボードの q, Q または ESC キー**

  プログラムを終了します。

## 4. 解説

このプログラムは、GLSL 内で関数を自作する方法（引数の修飾子）と、Phong のべき乗計算を代数的な近似式（Schlick の近似）に置き換える手法を示しています。

### 4.1 GLSL におけるユーザ定義関数と引数修飾子

GLSL ではポインタがサポートされていないため、引数の受け渡しモードを修飾子で明示的に指定します。

- `in`: 値渡し（デフォルト）。関数内で仮引数を変更しても呼び出し元の実引数には反映されません。`const in` とすることで仮引数の変更を禁止できます。
- `out`: 出力専用の参照渡し。関数から戻る際に仮引数の値が実引数に書き戻されます。
- `inout`: 入出力兼用の参照渡し。呼び出し時の値が渡され、終了時に変更が反映されます。

### 4.2 フラグメントシェーダ (shlick.frag) と Schlick の近似

このプログラムが読み込むシェーダは、第６回の anisotropic.vert と anisotropic.frag をコピーして名前を変えた shlick.vert と shlick.frag です。バーテックスシェーダ (shlick.vert) の内容は第６回のものと同じで、フラグメントシェーダ (shlick.frag) の中に以下の `shlick()` 関数を定義し、べき乗計算を置き換えています。

```glsl
float shlick(const in float t, const in float k)
{
  return t / (k - k * t + t);
}
```

ここで $t$ は内積値 $\cos\theta$、$k$ は輝き係数（shininess）に関連するパラメータです。これにより、計算負荷の高い超越関数（対数・指数）を用いずに、有理式のみで Phong のコサインローブに類似した鏡面反射ハイライトを計算します。

実際の鏡面反射率の計算は、第６回の `pow()` を `shlick()` に置き換えただけです。

```glsl
// 鏡面反射率
float specular = shlick(max(dot(normal, halfway), 0.0),
  halfway.y * halfway.y * gl_FrontMaterial.shininess);
```
