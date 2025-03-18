---
title: Webpack5
---

# Webpack5

## 官网

官网地址： [webpack5](https://webpack.docschina.org/concepts/)

## 为什么需要 webpack

想要理解为什么使用 webpack，我们可以先回顾下历史，在打包工具出来之前，我们是如何在 web 中使用 javaScript 的。

在浏览器中运行 javaScript 有两种方式

- 1、引用脚步来存放每个功能，比如

<ImagePreview src="/images/webpack/image1.jpg"></ImagePreview>

根据我们 js 在浏览器上的加载特性，那么我们所有的 js 代码从上至下来加载的，因此我们的业务代码要是依赖上面的那些库，那么顺序不能颠倒，如果颠倒了，可能项目就崩溃了。

要是我们把这种文件按照一定的预定顺序合并到一个文件里，那就类似第二种方式

- 2、使用一个包含所有项目代码的大型 js 文件

<ImagePreview src="/images/webpack/image2.jpg"></ImagePreview>

虽然这种方式解决了加载多个 js 顺序问题，可能会导致其他问题，比如，作用域问题，文件太大，可读性差，可维护性弱等问题

### 作用域问题

使用过 jquery 或者 lodash 的话，他会在 window 对象上面来绑定全局变量，，jQuery 绑定的是 `$`,lodash 绑定的是`_`,就连我们的业务文件也可能在全局上面绑定其他变量，这些会严重污染我们的 window 对象，使我们的 window 对象变得非常臃肿，这就是变量作用域问题

### 文件太大

如果我我们 11 个文件分散加载，那页面的内容会随着文件的加载而逐渐来显示内容，可如果我们将 11 个文件合并到一个文件里，那么页面内容会一次性加载，页面加载时间过长，会有一段时间的白屏，用户体验非常差

### 作用域问题解决

早期其实是使用立即调用函数表达式 IIFE 来创建独立作用域

<ImagePreview src="/images/webpack/image33.jpg"></ImagePreview>

变量被单独定义在函数内部，不再被挂载至全局 window 下

```js
(function () {
  var name = '123';
})();
console.log(name); // 报错
```

也可以通过具名函数得到变量

```js
var result = function () {
  var name = '123';
  return name;
};
console.log(result); // 123
```

这样就解决了我们的作用域问题，又可以在外部暴露我们想要暴露的内容。

### 代码拆分

比如下面的例子

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js"></script>
</head>
<body>
    <script>
        const str = _.join([12, 32], '-')
        console.log(str)
    </script>
</body>
</html>
```

上面的例子中，我们引入了 lodash，我们只使用 join 一个方法，就给整个 lodash 全都加载下来。我们能不能有一个方法能给拆成一个个模块呢？

依赖 nodejs 的模块机制，使用 commonJs 的 module.exports 来抛出模块代码，使用 require 来引入模块

```js
// math文件定义的add方法，并暴露出add方法
const add = (x, y) => {
  return x + y;
};
const minus = (x, y) => {
  return x - y;
};
module.exports = {
  add,
  minus,
};
```

像这样的引用形式间接就实现了模块化的形式。

```js
const math = require('./math');
console.log(math.add(1, 2)); // 3
```

但是这种形式在 node 上是支持的，但是浏览器是不支持这个模块化的

### requireJS 等让浏览器支持模块

那我们早期为了让浏览器支持模块，可以使用 browserify、requireJS 等打包工具实现在浏览器中运行 commonsjs 模块的代码，比如 requireJS 提供了 define 方法，通过 define 后创建被定义的模块

```js
// 创建add.js文件
const add = (x, y) => {
  return x + y;
};
define([], function () {
  return add;
});
```

```js
// 创建minus.js文件
const minus = (x, y) => {
  return x - y;
};
define([], function () {
  return minus;
});
```

在 script 标签上添加 data-main 属性，指向引入模块文件。

```js
<script
  src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.js"
  data-main="./main.js"
></script>
```

在 main.js 中引入 add.js 和 minus.js

```js
// 创建main.js文件
require(['./add.js', './minus.js'], function (add, minus) {
  conosole.log(add(1, 2)); // 3
});
```

这时候我们就可以在浏览器上运行了，早期我们就是通过这种方式来实现模块

### 依赖 ES6 实现模块

使用 export default XX 来暴露模块

```js
const minus = (x, y) => {
  return x - y;
};
export default minus;
```

使用 import XX form XX 来引入模块

```js
// 注：需要在script标签上添加 type="module" 属性
<script type="module">
  import add form './esm/add.js' console.log(add(4,5))
</script>
```

缺点

- import 目前支持度尚待完善且版本迭代速度不快

## 介绍

是一种前端资源构建工具，是一个静态模块打包器，具体又是如何的解释，我们来看以下几个例子

### 构建工具

1. html 引入 less
   在 html 中引入 less 文件，在浏览器中没有生效，这是因为 less 对于浏览器来讲并不能进行识别，我们必须借助于工具将 less 转化为 css，这时候才能进行运行

<ImagePreview src="/images/webpack/image1.png"></ImagePreview>

2. import 导入

在项目运用到的 js，为了方便操作 js，项目中可能会引入 jquery，下好包后通过 import 进行导入，这里做了一个小小的演示，通过点击好 h1 标签改变背景颜色。运行之后点击不生效，浏览器报了一个语法错误，是因为 ES6 的模块化语法 import 导入引起的，浏览器并不能识别 ES6 的语法

<ImagePreview src="/images/webpack/image2.png"></ImagePreview>

从上面的例子可以看出来，我们需要一个工具将 less -> css，ES6、ES7 -> js 才能让浏览器进行识别， 以前这些工具得进行分别维护，非常的麻烦，所以前端这时候提出一个概念叫构建工具，这个构建工具得作用是将这些每个工具，操作都包含起来，此时只关系总的工具就可以了

### 静态模块打包器

在 react 跟 vue 开发的时，一个文件夹中可能引入很多依赖，比如下面的这些引入的很多依赖就会交给构建工具 webpack 来进行处理，那 webpack 怎么进行处理呢？

<ImagePreview src="/images/webpack/image3.png"></ImagePreview>

首先告诉 webpack 一个打包的起点，所谓的入口文件，webpack 会以这个入口文件作为起点开始打包，他会将每个依赖都给记录好，形成一个依赖关系树状结构图，就我们做上面的一个例子而言，入口文件为 index.js，引入 jq 跟 less 模块，通过 chunk 生成代码块进行分别打包，生成一个静态资源（bundle）文件

<ImagePreview src="/images/webpack/image4.png"></ImagePreview>

所以在 webpack 看来，前端的多有资源文件(js/json/css/img/less/...)都会作为模块处理，它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源（bundle）资源

## 安装 webpack

1. 安装 node.js https://nodejs.org/zh-cn/ 最新 LTS 版本
2. 验证 node 版本 `node -v`
3. 验证 npm 版本 `npm -v`
4. （可选）执行 `npm i webpack webpack -cli --global` （全局）安装 webapck
5. 在当前文件目录下执行 `webpack -v` 验证版本
6. `npm init -y` 初始化 package 配置文件
7. `npm install webpack webpack-cli --save-dev` 本地安装 webpack 及 webpack-cli

<ImagePreview src="/images/webpack/image35.jpg"></ImagePreview>

## 五个核心概念

### entry（入口）

告诉 webpack 以哪个文件作为文件为入口起点开始打包，分析构建内部依赖图

### output（出口）

webpack 打包后的资源 bundle 输出到哪里去，以及如何命名

### loader

webpack 只能识别 js 文件跟 json 文件，其他的比如样式文件，图片文件，webpack 自身处理不了，需要借助 loader 进行帮我翻译一下，让 webpack 能看懂东西，这时候 webpack 就能处理这些资源

### plugins（插件）

插件可以用于执行的范围更广的任务，插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量等

### mode（模式）

分为两种

| 选项                  | 特点                                                               |
| --------------------- | ------------------------------------------------------------------ |
| development(开发模式) | 能让我们的代码在本地记行调试的环境（配置能较简单些）               |
| production(生产模式)  | 能让代码优化上线运行的环境（配置能复杂些，考虑性能，压缩，兼容等） |

## 验证 js,json,css 文件

在安装包之前我们的初始一下包，执行`yarn init`或者`npm init`，这样的意义是我们接下来要下包了，这样的话会生成一个 pakeage.json 文件，这个文件主要是用来记录这个项目的详细信息的，它会将我们在项目开发中所要用到的包，以及项目的详细信息等记录在这个项目中。方便在以后的版本迭代和项目移植的时候会更加的方便。

之后进行一个项目 pakeage.json 的详细配置，可以参考以下图片，主要的还是 name 名称，其他的都可以进行回车取默认值就可以，然后我们需要下载两个包，一个是 webpack ，一个是`webpack-cli`这个包是通过 webpack 的指令对 webpack 进行一些操作，可以执行 ` yarn add webpack webpack-cli -g`进行安装

<ImagePreview src="/images/webpack/image5.png"></ImagePreview>

### js 文件

安装好了之后，我们就开始验证下 webpack 是否真的能识别 js。

先创建好入口文件夹 src/index.js， 输入文件为 build/built.js 文件中，由于不同的环境中执行的指令以及输入的内容都是不同的

开发环境：

```js
yarn webpack ./src/index.js -o ./build/built.js --mode=development
```

打包后的文件

<ImagePreview src="/images/webpack/image6.png"></ImagePreview>

生产环境：

```js
yarn webpack ./src/index.js -o ./build/built.js --mode=production
```

打包后的文件

<ImagePreview src="/images/webpack/image7.png"></ImagePreview>

总上看来，生产环境跟开发环境能将 ES6 模块化编译成浏览器能识别的模块化，生产环境会压缩我们环境的代码

我们怎么验证打包后的资源是正确的呢？

一种是再打包问题夹新建个 html 文件，将打包后的文件引入，然后再浏览器中进行查看，如图下：

<ImagePreview src="/images/webpack/image8.png"></ImagePreview>

另一种是通过 node 环境中运行

<ImagePreview src="/images/webpack/image9.png"></ImagePreview>

### json 文件

接下来我们来验证下 json 文件是否支持 webpack，显然控制台输出成功，webpack 是支持 json 文件的

<ImagePreview src="/images/webpack/image10.png"></ImagePreview>

### css 文件

打包执行指令时，我们可以看出控制台包红错，css 文件显然是不支持的

<ImagePreview src="/images/webpack/image11.png"></ImagePreview>

## 打包 html 资源

打包 html 文件的时候，我的得下插件为`html-webpack-plugin`，这个包导入一个构造函数 HtmlWebpackPlugin，执行完指令后，在导出文件 build 文件下，我们就看到自动生成了一个名为 index.html 的空文件，自动引入打包输出的所有资源（js/css）。

<Alert message='loader 仅是下载插件直接就可以配置就可以，而这个插件下载下来之后，必须引入，才进行使用。'></Alert>

<ImagePreview src="/images/webpack/image16.png"></ImagePreview>

有的场景就是想要输入跟入口文件中的 html 文件格式一样的，我们只需要在 HtmlWebpackPlugin 这个构造函数中传入参数 template，指定 template 参数的路径，这样就告诉 webpack 要以./src/index.html 为模板，复制这个 html 文件，然后自动引入打包输入所有资源（不需要自己引）

<ImagePreview src="/images/webpack/image17.png"></ImagePreview>

## devServer

在项目中，我们实时需要更改代码，实时想要看到更改后的代码运行的如何，不可能我修改一次代码，我就要重新`yarn webpack`来重新打包一次，效率有点低。

这时候 webpack 提出了一个概念 devServer 自动化，让你自动去打包。特点：只会在内存中编译打包，不会有任何的输出到本地代码，所以之前我们在 build 包下输出的文件都不在输入这里，而是输出在内存中，想要启动 devServer，得下载`webpack-dev-server`这个包，`yarn webpack-dev-server`，此时你会发现光标一直在这停着，证明程序一直在这运行，他会一直监视源代码是否被更改，当你修改代码时并保存，程序会自动重新自动进行编译，然后他就会自动刷新浏览器渲染最新的变化

<ImagePreview src="/images/webpack/image21.png"></ImagePreview>

其实`webpack-dev-server`真正没有输出任何物理文件，他把输出打包以后得 bundle 文件放在内存中。

## 在 webpack 中引入资源

webpack 中给我们提供四种资源类型来加载除了 js 以外的资源，分别是：

- resource 资源：可以生成一个单独的文件并导出 url
- inline 资源：它导出一个资源的 dataUrl，比如可以把 svg 转换成 base64，我们直接可以在业务中直接引用
- source 资源：它可以导出资源的源代码，
- 通用资源类型 asset： 他是在 resource 跟 inline 两者之间自动选择，他选择依据资源的大小。

### resource：发送单独文件并导出 url

```js
module: {
  rules: [
    {
      test: /\.png$/,
      type: 'asset/resource',
    },
  ];
}
```

在 module 中设置文件类型及资源类型，output 端中增加打包后的资源文件夹配置

```js
output:{
  filename: 'bundle.js',
  path: path.resolve(__dirname,'./dist'),
  clean: true,
  assetModuleFilename: 'images/[contenthash][ext]',
}
```

[contenthash]代表自动生成字符串的文件名，[ext]代表文件默认格式

第二种方式在定义 rules 时设置 generator 来进行打包后的文件配置

```js
module: {
  rules: [
    {
      test: /\.png$/,
      type: 'asset/resource',
      generator: {
        filename: 'images/[contenthash][ext]',
      },
    },
  ];
}
```

### inline: 导出资源的 dataurl

实际展示出的文件的 url 为 base64 格式

```js
module: {
  rules: [
    ...{
      test: /\.svg$/,
      type: 'asset/inline',
    },
  ];
}
```

<ImagePreview src="/images/webpack/image34.jpg"></ImagePreview>

### source: 导出资源 源代码

```js
module: {
  rules: [
    ...{
      test: /\.txt$/,
      type: 'asset/source',
    },
  ];
}
```

### asset: 自动选择 url 或源文件

可以通过配置临界值实现自动切换资源格式，更加灵活可控（默认大小为 8kb）

```js
module: {
  rules: [
    ...{
      test: /\.jpg$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 4 * 1024 * 1024,
          //当图片大小大于4M时生成资源文件，否则为base64 url
        },
      },
    },
  ];
}
```

## 打包样式资源

### css-loader

我们之前测试过，webpack 不能打包样式资源，这时候就需要 loader 来进行处理，而 loader 必须按照我们的配置文件去写，所以我们就得新建个 webpack.config.js 这个文件，所有的配置说明如下：

<ImagePreview src="/images/webpack/image12.png"></ImagePreview>

配置好之后，我们执行`yarn webpack`运行，编译出来的结果显然是打包成功了，不然控制台就是红色的错误效果

<ImagePreview src="/images/webpack/image13.png"></ImagePreview>

所以为了看效果，我们在 build 文件下新建个 index.html 文件，将打包好的 built.js 放进去，页面效果生效，并且我们浏览器再 head 标签中添加 style 样式标签，将我们之前写的样式都插入进来
<ImagePreview src="/images/webpack/image14.png"></ImagePreview>

### less-loader

<Alert message="loader 配置的时候，每次配置不同的文件，都得需要配置不同的 loader 来进行处理"></Alert>

<ImagePreview src="/images/webpack/image15.png"></ImagePreview>

经过这几个最基本的配置，你会发现输入文件 build 下 js，其他文件等文件都在一起，没有文件层次划分，我想 js 都放在 js 文件下，图片都放在 img 文件下，这样目录清楚，我们只需要在想要的 loader 下面规定一下`outputPath`属性即可。

<Alert message='css 文件夹因为`css-loader`的原因，会将 css 打包在 js 中，所以说样式并不会输出，css 只会跟 js 为一体的'></Alert>

<ImagePreview src="/images/webpack/image22.png"></ImagePreview>

## 提取 css 文件

我们需要从 js 中将 css 提取出来，我们需要下载一个插件叫做`mini-css-extract-plugin`，这时候虽然引入了 MiniCssExtractPlugin 这个构造函数，但是我们注意下，在 loader 中需要将`style-loader`关掉，我们不需要通过他来创建 style 标签了，我的需要增加的是`MiniCssExtractPlugin.loader`，执行指令后我们发现，所有的 css 打包后都默认放在 build 文件中的 main.css 中，在打包好的 index.html 文件中我们可以发现，main.css 文件是通过 link 标签来引入的，这样就规避了闪屏的问题

<ImagePreview src="/images/webpack/image23.png"></ImagePreview>

如果你需要文件路径保持一致的话，你可以自己进行手动重命名设置下就可以

<ImagePreview src="/images/webpack/image24.png"></ImagePreview>

自定义 filename 生成目录及文件名[contenthash].css

## 压缩 css

本地安装`css-minimizer-webpack-plugin`，和其他插件不同，需在 optimization 中添加配置，并且 mode 要切换为`production`，你会发现打包后的 css 的文件会压缩为一行，这时候你可以看控制台压缩之前压缩之后的明显的体积对比

```js
optimization: {
  minimizer: [new CssMinimizerPlugin()];
}
```

<ImagePreview src="/images/webpack/image36.jpg"></ImagePreview>

## css 兼容处理

css 做兼容性处理需要一个库，叫 postcss，postcss 这个库要写在 webpack 中需要写`postcss-loader`，还得使用一个叫`postcss-preset-env`插件。这个插件能帮我们呢 postcss 能识别某些环境，他能找到 package.json 中 browserslist 里面的配置，通过配置加载指定的 css 兼容性样式，这时候我们就要手动向 package.json 文件中增加 browserslist，如图下，可以根据自己的需求进行添加。添加好了之后，虽然 mode 中我们设置模式为 development，但是我们想要 browserslist 生效的话，得设置 nodejs 环境变量，nodejs 默认环境为生产环境，我们想要设置开发环境，得进行配置`process.env.NODE_ENV = 'development'`，想要恢复生产环境注掉即可

<ImagePreview src="/images/webpack/image25.png"></ImagePreview>

## babel-loader

- babel-loader: 在 webpack 里应用 babel 解析 ES6 的桥梁
- @babel/core: babel 核心库
- @babel-preset-env: babel 的预设，一组 babel 插件的集合

我们在程序中用到的 ES6 语法，有时候在 chorme 浏览器中时看不到什么报错，可能放在 ie 比较低的浏览器，他并不会识别 js 中的 ES6 语法，他会报一堆红错，这时候我们就得做一下 js 的兼容性处理，这时候我们需要`babel-loader`，指示`babel-loader`做怎么样的兼容性处理，需要再下载这两个包`@babel-preset-env` `@babel/core`。

<Alert message='有时候配置的并不是很对，因为版本一直再更新，我们需要借助文档来进行配置，这点很重要，不然你盲目配置还是会错的'></Alert>

<https://webpack.docschina.org/concepts/>

配置完你会发现，你原来定义的 const 的，在打包文件中变成了 var

<ImagePreview src="/images/webpack/image28.png"></ImagePreview>

上面只是能转换写简单的基本语法，如 promise 等就转换不了，所以我们需要一个更强大的`@babel/polyfill`来进行处理全部的 js 兼容性问题，这个不需要下载包，直接在代码中进行 import 引入即可，打包完后，你会发现输出的 built.js 会有很多代码，比之前多多了，体积增加了很多，这是他对 js 所有有兼容性的都进行处理，所以他的弊端就是我只要解决部分的兼容性问题，但是将所有的兼容性代码全部引入，体积太大

<ImagePreview src="/images/webpack/image29.png"></ImagePreview>

所以最优的方法还是我需要做兼容性处理的就做，所有有个`core-js`这个库，可以解决这个问题，这个时候就不需要上面的方案，注掉即可，`core-js`这个配置如下，根据自己项目的需求，可以根据官网来记性配置，你可以通过控制台对比一下上次打包的体积大小来看，这次明显打包后的体积减少了很多

<ImagePreview src="/images/webpack/image30.png"></ImagePreview>

如需兼容 async/await 语法则还需要添加 regeneratorRuntime 模块，他是 webpack 打包生效的全局辅助函数

```js
// 这个包包含regeneratorRuntime，运行时需要
npm install --save @babel/runtime

// 这个插件会在需要regeneratorRuntime的地方自动require导包，编译时需要
npm install --save-dev @babel/plugin-transform-runtime
```

```js
module: {
  rules: [
    ...{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [['@babel/plugin-transform-runtime']],
        },
      },
    },
  ];
}
```

## 压缩 js 跟 html

这是说明下，html 文件是不需要做兼容性处理的，浏览器认识的就认识，不认识的就不认识，js 代码在生产环境中自动就会被压缩，所以我们只需要将`mode：'development'`即可，压缩 html 文件需要配置以下就可以

<ImagePreview src="/images/webpack/image31.png"></ImagePreview>

## 性能优化配置

开发环境性能优化：优化打包构建速度，优化代码调试

生产环境性能优化：优化打包构建速度，优化代码运行性能

## 代码分离

代码分离是 webpack 的特性之一，能够把代码分离到不同的 bundle 中，然后我们把这些文件按需加载或者并行加载。代码分离可以用于获取更小的 bundle，以及控制资源加载的优先级

<ImagePreview src="/images/webpack/image37.jpg"></ImagePreview>

### entry 配置

```js
module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
};
```

并在 output 输出端中直接配置[name]对应 entry 中的 key

```js
output:{
  filename:'[name].bundle.js',
  path:path.resolve(__dirname,'./dist'),
  clean:true,
}
```

执行`npx webpack`后相应包名分别打包且都被引入

<ImagePreview src="/images/webpack/image38.jpg"></ImagePreview>
<ImagePreview src="/images/webpack/image39.jpg"></ImagePreview>

缺点：多入口文件会导致存在相同文件时，重复打包至各自模块。比如 index 跟 another-module 都共享 lodash 第三方库，他会分别打到各自的 chunk 里

### entry 依赖

#### Entry dependencies

当图中两个模块共有 lodash 时，会抽离出来并取名为 lodash。

```js
module.exports = {
  entry:{
    index:{
      import:'./src/index.js',
      dependOn:'shared'
    },
    another:{
      import:'./src/another-module.js',
      dependOn:'shared'
    },
    shared:'lodash'
    index:'./src/index.js',
    another:'./src/another-module.js'
  }
}
```

打包后多出的 shared.budle.js 即为定义中的模块，此时 lodash 是共用的，做到了模块的去重和分离

<ImagePreview src="/images/webpack/image40.jpg"></ImagePreview>

#### SplitChunksPlugin

配置时依旧可以采用独立命名

```js
module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js',
  },
};
```

在 optimization 优化配置项中添加 splitChunks

```js
optimization: {
  splitChunks: {
    chunks: 'all';
  }
}
```

### 动态引入

涉及到动态代码拆分时，webpack 提供两个类似的技术，第一种也是推荐选择的方式是，使用符合 ECMAScript 规范的 import()语法来实现动态导入，第二种则是 webpack 遗留功能，使用 webpack 提供的 require.ensure()语法来实现动态导入。

通过 import 实现动态引入，且不影响其他模块抽离方式

```js
// 创建async-module.js文件
function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    const element = document.createElement('div');
    element.innerHTML = _.join(['hello', 'webpack'], ' ');
    return element;
  });
}

getComponent().then((element) => {
  document.body.appendChild(element);
});
```

在其他文件中引入

```js
import './async-module.js';
```

打包后我们的 lodash 被抽离到一个单独的模块中

<ImagePreview src="/images/webpack/image41.jpg"></ImagePreview>

### 懒加载

动态导入代码分离的方法应用的第一个就是懒加载场景

懒加载或者按需加载，是一种很好的优化网页或者应用的方式，这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块，这样加快了应用的初始加载速度，减轻它的总体积，因为某些代码块可能永远不会被加载。

依旧通过 import 直接引入模块，区别在于：何时调用何时加载模块

```js
button.addEventListener('click', () => {
  import('./math.js').then(({ add }) => {
    console.log(add(4, 5));
  });
});
```

可以看出来我们这是一个按钮的点击效果，它并不会第一次加载，而是在点击按钮时候再进行加载，如果用户从来不点击这个模块的话，不再服务器上加载了，这样会节省我们的网络流量

加上注释 webpackChunkName:'模块名' 后，可以定义打包后的模块名

```js
import(/* webpackChunkName:'math' */ './math.js');
```

<ImagePreview src="/images/webpack/image42.jpg"></ImagePreview>

### 预获取/预加载模块

动态导入的第二个应用是预获取/预加载模块。

在声明 import 时，使用下面这些内置指令，可以让 webpack 输出“resource hint（资源提示）”，来告知浏览器：

- prefetch（预获取）：将来某些导航下可能需要的资源 ，即在浏览器网络空闲时再获取资源

- preload（预加载）：当前导航下可能需要资源，和懒加载效果类似

  依旧在 import 引入时的注释中添加

```js
const button = document.createElement('button');
button.textContent = '点击执行加法运算';
button.addEventListener('click', () => {
  import(/* webpackChunkName:'math',webpackPrefetch:true */ './math.js').then(
    ({ add }) => {
      console.log(add(4, 5));
    },
  );
});
document.body.appendChild(button);
```

<ImagePreview src="/images/webpack/image43.jpg"></ImagePreview>

我们会看出来在 head 标签里会多出来一个属性 rel 为 prefetch 的 link 标签，它的意义在于当我们的首页面的内容都加载完毕后，在网络空闲时再去加载我们打包好的 math.bundle.js 文件

webpackPreload:true 跟懒加载效果类似，首次不会加载，点击按钮时候才进行加载

## 缓存

我们使用 webpack 来打包我们的模块化后的应用程序，webpack 会生成一个可部署的/dist 目录，然后把我们打包后的内容放置在此目录中，只要/dist 目录中的内容部署到 server 上，client（通常是浏览器）就能够访问此 server 的网站及其资源，而最后一步获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为缓存的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然而如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用他的缓存版本。
由于缓存的存在，当你需要获取新的代码时，就会显示很棘手

### 输出文件的文件名

如果 filename 固定写死如：[name].bundle.js，那么每次打包都会是同名文件，这样就会导致浏览器认为文件没有更新，而不会加载新版本的代码，所以我们需要使用 hash 来解决这个问题

```js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

打包后的文件名被添加上了随机字符串，并会在资源更新时自动改变

<ImagePreview src="/images/webpack/image44.jpg"></ImagePreview>

### 缓存第三方库

将第三方库 (library) (例如 lodash) 提取到单独的 vendor chunk 文件中，是比较推荐的做法，第三方库文件很少像本地源码会频繁修改，所以我们可以利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时保证 client 和 server 的代码一致。

在 splitChunks 中定义 cacheGroups 缓存组

```js

module.exports = {
	optimization:{
    ...,
    splitChunks:{
      ...,
      cacheGroups:{
        vendor:{
          test:/[\\/]node_modules[\\/]/,
          name:'vendors',
          chunks:'all'
        }
      },
    }
  }
}

```

### 汇总 js 文件

我们想要把所有的 js 文件放在一个文件夹里，在 output.filename 加上 scripts 前缀即可汇总 js 文件至指定文件夹下生成。

```js
output:{
    filename:'scripts/[name].[contenthash].js',
}
```

## 拆分开发环境和生产环境配置

### 公共路径

可以通过它来指定应用程序中所有资源的基础路径。

如果我们想要根据 cdn 的路径或者我们当前的服务器的某个路径来去修改我们的引入路径的前缀

<ImagePreview src="/images/webpack/image45.jpg"></ImagePreview>

```js
module.exports = {
  output:{
    ...,
    publicPath:'http://localhost:8080/'
  }
}
```

<ImagePreview src="/images/webpack/image46.jpg"></ImagePreview>

## source-map

作为一个开发工程师一一无论是什么开发，要求开发环境最不可少的一点功能就是——debug 功能。之前我们通过 webpack，将我们的源码打包成了 bundle.js。试想：实际上客户端（浏览器）读取的是打包后的 bundle.js,那么当浏览器执行代码报错的时候，报错的信息自然也是 bundle 的内容。我们如何将报错信息（bundle 错误的语句及其所在行列）映射到源码上？

```js
module.exports = {
  //开启 source map
  devtool: 'source-map',
};
```

| 模式                    | 解释                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| eval                    | 每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 //@ sourceURL.                                  |
| source-map              | 生成一个 SourceMap 文件.                                                                                       |
| hidden-source-map       | 和 source-map 一样，但不会在 bundle 末尾追加注释.                                                              |
| inline-source-map       | 生成一个 DataUrl 形式的 SourceMap 文件.                                                                        |
| eval-sourcemap          | 每个 module 会通过 eval()来执行，并且生成一个 DataUrI 形式的 SourceMap.                                        |
| cheap-source-map        | 生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 sourcemap（譬如 babel 的 sourcemap） |
| cheap-module-source-map | 生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。   |

<Alert>

生产环境我们一般不会开启 sourcemap 功能

- 通过 bundle 和 sourcemap 文件，可以反编译出源码,也就是说，线上产物有 soucemap 文件的话，就意味着有暴漏源码的风险。
- 我们可以观察到，sourcemap 文件的体积相对比较巨大，这跟我们生产环境的追求不同(生产环境追求更小更轻量的 bundle)。

</Alert>

我们通过打包`console.log('hello webpack')`来看看每个属性具体有什么不同

### eval

默认不配置 devtool，会使用 eval 模式，会将模块代码包裹在 eval 函数中执行

<ImagePreview src="/images/webpack/image47.jpg"></ImagePreview>

### source-map

source-map 模式会生成一个 SourceMap 文件以外，还生成一个注释为 sourceMappingURL 的注释，这个注释会告诉浏览器，如果遇到错误，如何映射到源码上。

<ImagePreview src="/images/webpack/image48.jpg"></ImagePreview>

### hidden-source-map

不会生成 sourceMappingURL 的注释，不能映射到源码上

### inline-source-map

inline-source-map 模式会生成一个 SourceMap 文件以外，还生成一个 dataurl 形式的注释为 sourceMappingURL 的注释，这个注释会告诉浏览器，如果遇到错误，如何映射到源码上。

<ImagePreview src="/images/webpack/image49.jpg"></ImagePreview>

### eval-source-map

每个 module 会通过 eval（）来执行，并生成一个 DataUrl 形式的 SourceMap

### cheap-source-map

这里有一个重要的属性就是 mappings，这个就是我们的源码跟我们打包代码的一个映射，这只会记录我们的行数，不会记录代码的行数，一般调试代码我们只需要记住我们的行数就行

<ImagePreview src="/images/webpack/image50.jpg"></ImagePreview>

如果这时候我们给 devtool 配置为 source-map，那么就会出现如下情况，这里就会多了一个`,4B`，其实这个就是记录我们的列数

<ImagePreview src="/images/webpack/image51.jpg"></ImagePreview>

### cheap-module-source-map

这个必须通过 babel 相关的包可以看出来 cheap-module-source-map 跟 cheap-source-map 区别

我们书写一段代码

```js
class A {
  constructor() {
    this.str = 'hello webpack';
  }

  sayHello() {
    console.log(this.str);
  }
}
const a = new A();
a.sayHello();
```

对这段代码进行配置打包

```js
module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
};
```

其实我们打包出来的信息跟 cheap-source-map 差不多，但是在浏览器中 cheap-module-source-map 可以精准的定位到源码上

<ImagePreview src="/images/webpack/image52.jpg"></ImagePreview>

而 cheap-source-map 这时候就不能够精准定位到源码上

<ImagePreview src="/images/webpack/image53.jpg"></ImagePreview>

## HMR（模块热替换）

之前我们配置了 DevServer 自动化，这个有一个缺点就是当你修改了 css 文件的时候，浏览器重新加载渲染页面，如果文件够多，都得重新打包，费时，性能不好。我希望的是，修改 css 文件的时候，js 等不变的文件就不需要重新加载，所以就是出现的 HMR，他的作用是一个模块发生变化，只会重新打包这一个模块（而不是打包所有的模块），极大提升的构建的速度

- 当修改了 webpack 配置的时候，新配置要想生效，必须重新启动 webpack 服务

样式文件只需要将 devService 中`hot：true`给来启，`style-loader`中内部就可以自动实现样式热更新

```js
module.exports = {
  devServer: {
    hot: true,
    liveReload: true, // 热加载 新版webpack-dev-server默认已经开启热加载功能
  },
};
```

<ImagePreview src="/images/webpack/image32.png"></ImagePreview>

html 默认不能使用 HMR 功能，所以解决的办法将 html 文件给引 entry 文件中，这时候 entry 文件写法改为一个数组的写法

## eslint 语法检查

结合 webpack 使用 eslint

本地安装 babel-loader、eslint-loader

```js
module:{
	rules:{
		test:/\.js$/,
		use:['bable-loader','eslint-loader']
	}
}
```

我们想要在打开浏览器中也要报错

<ImagePreview src="/images/webpack/image54.jpg"></ImagePreview>

我们只需要增加这样的配置

```js
devServer: {
  client: {
    overlay: true;
  }
}
```

可以有空时候看看下面的关于 airbnb 这个规则

<https://github.com/topics/javascript>

<https://www.npmjs.com/package/eslint-config-airbnb>

## 模块解析

### 何为 webpack 模块

能在 webpack 工程化环境里成功导入的模块，都可以视作 webpack 模块。与 Node.js 模块相比，webpack 模块能以各种方式表达它们的依赖关系。下面是一些示例:

- ES2015import 语句
- CommonJS require() 语句
- AMD define 和 require 语句
- css/sass/less 文件中的 @import 语句
- stylesheet ur1(...)或者 HTML< img src=...>文件中的图片链接

支持的模块类型 Webpack 天生支持如下模块类型：

- ECMAScript 模块
- CommonJS 模块
- AMD 模块
- Assets
- WebAssembly 模块

<ImagePreview src="/images/webpack/image56.jpg"></ImagePreview>

而我们早就发现——通过 loader 可以使 webpack 支持多种语言和预处理器语法编写的模块。loader 向 webpack 描述了如何处理非原生模块，并将相关依赖引入到你的 bundles 中。包括且不限于:

- TypeScript
- Sass
- Less
- JSON
- Yaml

### compiler 与 Resolvers

在我们运行 webpack 的时候(就是我们执行 webpack 命令进行打包时)，其实就是相当
于执行了下面的代码:

```js
const webpack = require('webpack');
const compiler = webpack({
  //...这是我们配置的webpackconfig对象
});
```

webpack 的执行会返回一个描述 webpack 打包编译整个流程的对象，我们将其称之为 compiler。compiler 对象描述整个 webpack 打包流程———它内置了一个打包状态，随着打包过程的进行，状态也会实时变更，同时触发对应的 webpack 生命周期钩子。（简单点讲，我们可以将其类比为一个 Promise 对象，状态从打包前，打包中到打包完成或者打包失败。）每一次 webpack 打包，就是创建一个 compiler 对象，走完整个生命周期的过程。
而 webpack 中所有关于模块的解析，都是 compiler 对象里的内置模块解析器去工作
的————简单点讲，你可以理解为这个对象上的一个属性，我们称之为
Resolvers。webpack 的 Resolvers 解析器的主体功能就是模块解析，它是基于 enhanced-resolve 这个包实现的。换句话讲，在 webpack 中，无论你使用怎样的模块引入语句，本质其实都是在调用这个包的 api 进行模块路径解析。

<ImagePreview src="/images/webpack/image55.jpg"></ImagePreview>

webpack 通过 Resolvers 实现了模块之间的依赖和引用。举个例子:

```js
import_from 'lodash';
// 或者
const add = require('./utils/add');
```

所引用的模块可以是来自应用程序的代码，也可以是第三方库。resolver 帮助 webpack 从每个 require/import 语句中，找到需要引入到 bundle 中的模块代码。当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径。
(webpack_resolver 的代码实现很有思想，webpack 基于此进行 treeshaking)。

### webpack 中的模块路径解析规

1、webpack 中的模块路径解析规则通过内置的 enhanced-resolve，webpack 能解析三种文件路径：

#### 绝对路径

```js
import '/home/me/file';
import 'C:\\Users\\me\\file';
```

由于已经获得文件的绝对路径，因此不需要再做进一步解析

#### 相对路径

```js
import '../utils/reqFetch';
import './styles.css';
```

这种情况下，使用 import 或 require 的资源文件所处的目录，被认为是上下文目录。在 import/require 中给定的相对路径，enhanced-resolve 会拼接此上下文路径，来生成模块的绝对路径 path.resolve(\_\_dirname,RelativePath)。

#### 模块路径

```js
import 'module';
import 'module/lib/file';
```

也就是在 resolve.modules 中指定的所有目录检索模块(node_modules 里的模块已经被默认配置了)。你可以通过配置别名的方式来替换初始模块路径，具体请参照下面 resolve.alias 配置选项。

### resolve

- alias
  上文中提到我们可以通过 resolve.alias 来自定义配置模块路径。
  现在我们来是实现一下:首先，我们 Src 目录下新建一个 utils 文件夹，并新建一个 add.js 文件，对外暴露出一个 add 函数。

```js
//src/utils/add.js
export default function add(a, b) {
  return a + b;
}
```

然后我们在 src/index.js 中基于相对路径引用并使用它：

```js
import add from './utils/add';
console.1og(add);
```

很好，代码跑起来了并且没有报错。 这时我们期望能用@utils/add 的方式去引用它，于是我们这样写了：

```js
import add from '@utils/add';
console.1og(add(a,b));
```

很明显它会报错，因为 webpack 会将其当做一个模块路径来识别———所以
到@utils 这个模块。 这时，我们配置下 resolve:

```js
// webpack.config.js I
const path = require('path');
module.exports = {
  resolve: {
    alias: {
      '@utils': path.resolve(_dirname, 'src/utils/'),
    },
  },
};
```

如代码所示，我们讲 utils 文件夹的绝对路径配置为一个模块路径，起一个别名为
“@utils"。重启服务发现，代码跑起来了。模块识别成功了。

### extentions

上述代码中我们发现，只需要`“import add from '@utils/add"`，webpack 就可以帮我们找到 add.js。事实上，这与`import add from'@utils/add.js‘` 的效果是一致的。为什么会这样？ 原来 webpack 的内置解析器已经默认定义好了一些文件/目录的路径解析规则。 比如当我们
`import utils from'./utils'`;
utils 是一个文件目录而不是模块(文件)，但 webpack 在这种情况下默认帮我们添加了后缀”/index.js"，从而将此相对路径指向到 utils 里的 index.js。这是 webpack 解析器默认内置好的规则。
那么现在有一个问题： 当 utils 文件夹下同时拥有 add.js add.json 时，`“@utils/add"`会指向谁呢?@utils/add.json

```js
{
  name: 'add';
}
```

我们发现仍然指向到 add.js。当我们删掉 add.js，会发现此时的引入的 add 变成了一个 json 对象。 上述现象似乎表明了这是一个默认配置的优先级的问题。 而 webpack 对外暴露了配置属性：resolve.extentions，它的用法形如

```js
module.exports = {
  resolve: {
    extentions: ['.js', '.json'],
  },
};
```

webpack 会按照数组顺序去解析这些后缀名，对于同名的文件，webpack 总是会先解析列在数组首位的后缀名的文件。

### 外部扩展

有时候我们为了减小 bundle 的体积，从而把一些不变的第三方库用 cdn 的形式引入进
来，比如 jQuery:index.html

```js
<script src="https://cdn.bootcdn.net/ajax/1ibs/jquery/3.6.0/jquery.js"></script>
```

这个时候我们想在我们的代码里使用引入的 jquery———但似乎三种模块引入方式都不行，这时候怎么办呢？webpack 给我们提供了 Externals 的配置属性，让我们可以配置外部扩展模块:

```js
module.exports= {
  externals: {
    jquery: 'jQuery',
  }，
}；
```

我们尝试在代码中使用 jQuery:

```js
// index.js
import $ from 'jquery';
console.log($);
```

发现打印成功，这说明我们已经在代码中使用它。

我们如何得知 { jquery: jQuery } 中的'jQuery？其实就是 cdn 里打入到 window 中的变量名，比如 jQuery 不仅有 jQuery 变量名，还有$，那么我们也可以写成这样子：

```js
module.exports= {
  externals: {
    jquery: '$',
  }，
}；
```

重启服务效果一样

## 扩展功能

### PostCSS 与 CSS 模块

PostCSS 是一个用 JavaScript 工具和插件转换 CSS 代码的工具。比如可以使用 Autoprefixer 插件自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮我们自动的 为 CSS 规则添加前缀，将最新的 CSS 语法转换成大多数浏览器都能理解的语法。
CSS 模块 能让你永远不用担心命名太大众化而造成冲突。

具体可以查看官网配置： <https://webpack.docschina.org/loaders/postcss-loader/>

### Web Works

有时我们需要在客户端进行大量的运算，但又不想让它阻塞我们的 js 主线程。你可能第一时间考虑到的是异步。
但事实上，运算量过大(执行时间过长)的异步也会阻塞 js 事件循环，甚至会导致浏览器假死状态。
这时候，HTML5 的新特性 WebWorker 就派上了用场。

html5 之前，打开一个常规的网页，浏览器会启用几个线程？一般而言，至少存在三个线程(公用线程不计入在内):
分别是 js 引擎线程(处理 js)、GUI 渲染线程(渲染页面)、浏览器事件触发线程(控制交互)。
当一段 JS 脚本长时间占用着处理机,就会挂起浏览器的 GUI 更新，而后面的事件响应也被排在队列中得不到处理，从而造成了浏览器被锁定进入假死状态。
现在如果遇到了这种情况，我们可以做的不仅仅是优化代码————html5 提供了解决方案，webworker。
webWorkers 提供了 js 的后台处理线程的 API，它允许将复杂耗时的单纯 js 逻辑处理放在浏览器后台线程中进行处理，让 js 线程不阻塞 UI 线程的渲染。
多个线程间也是可以通过相同的方法进行数据传递。
它的使用方式如下：

```js
//new Worker(scriptURL: string | URL, options?: WorkerOptions)
new Worker('someWorker.js');
```

也就是说，需要单独写一个 js 脚本，然后使用 new Worker 来创建一个 Work 线程实例。
这意味着并不是将这个脚本当做一个模块引入进来，而是单独开一个线程去执行这个脚本。

我们知道，常规模式下，我们的 webpack 工程化环境只会打包出一个 bundle.js，那我们的 worker 脚本怎么办？
也许你会想到设置多入口(Entry)多出口(ouotput)的方式。
事实上不需要那么麻烦，webpack4 的时候就提供了 worker-loader 专门配置
webWorker。
令人开心的是，webpack5 之后就不需要用 loader 啦，因为 webpack5 内置了这个功能。
我们来试验一下：
第一步
创建一个 work 脚本 work.js,我们甚至不需要写任何内容，我们的重点不是 webWorker 的使用，而是在 webpack 环境中使用这个特性。
当然，也可以写点什么，比如：

```js
self.onmessage = ({ data: { question } }) => {
  self.postMessage({
    answer: 42,
  });
};
```

在 index.js 中使用它

```js
// 下面的代码属于业务逻辑
const worker = new Worker(new URL('./work.js', import.meta.url));
worker.postMessage({
  question: 'hi，那边的workder线程，请告诉我今天的幸运数字是多少？',
});
worker.onmessage = ({ data: { answer } }) => {
  console.log(answer);
};
```

<Alert message='import.meta.url 这个参数能够锁定我们当前的这个模块，它不能在 commonjs 中使用。'></Alert>

这时候我们执行打包命令，会发现,dist 目录下除了 bundle.js 之外，还有另外一个
xxx.bundle.js!
这说明我们的 webpack5 自动的将被 new Work 使用的脚本单独打出了一个 bundle。
我们加上刚才的问答代码，执行 npm run dev，发现它是能够正常工作。并且在 network 里也可以发现多了一个 src_worker_js.bundle.js。

总结：选择这种语法是为了实现不使用 bundler 就可以运行代码，它也可以在浏览器中的原生 ECMAScript 模块中使用。

### TypeScript

首先安装 typescript ts-loader

```js
npm install --save-dev typescript ts-loader
```

接下来我们需要在项目根目录下添加一个 ts 的配置文件————tsconfig.json，我们可以用 ts 自带的工具来自动化生成它。

```
npx tsc --init
```

我们发现生成了一个 tsconfig.json，里面注释掉了绝大多数配置。现在，根据我们想要的效果来打开对应的配置。

```js
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "sourceMap": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node"
  }
}
```

例如：

```js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(dirname, 'dist'),
  },
};
```

使用第三方类库
在从 npm 上安装第三方库时，一定要记得同时安装这个库的类型声明文件(typing definition)。

我们可以从 TypeSearch 中找到并安装这些第三方库的类型声明文件(https://www.typescriptlang.org/dt/search?search=) 。

## Tree shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码
(dead-code)。它依赖于 ES2015 模块语法的 静态结构 特性，例如 和
export 。这个术语和概念实际上是由 ES2015 模块打包工具 rollup 普及起来的。
webpack 2 正式版本内置支持 ES2015 模块（也叫做 harmony modules）和未使用模块检测能力。新的 webpack 4 正式版本扩展了此检测能力，通过
的 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件
是 "pure(纯正 ES2015 模块)"，由此可以安全地删除文件中未使用的部分

src/math.js

```js
export function add(x, y) {
  return x + y;
}

export function minus(x, y) {
  return x - y;
}
```

需要将 配置设置成 development，以确定 bundle 不会被压缩：

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'inline-source-map'
  optimization: {
    usedExports: true,
  },
};
```

配置完这些后，更新入口脚本，使用其中一个新方法：

```js
import { add } from './math.js';

console.log(add(5, 6));
```

<Alert message='我们没有从`src/math.js`模块中`import`另外一个`minus`方法。这个函数就是所谓的“未引用代码(dead code)”，也就是说，应该删除掉未被引用的`export`'></Alert>

现在运行 `npm run build` ，并查看输出的 bundle：

<ImagePreview src="/images/webpack/image57.png"></ImagePreview>

你会注意到虽然我们没有引用 `minus` ，但它仍然被包含在 bundle 中

如果此时修改配置`mode: 'production'`

打包后发现无用的代码全部都消失了。Webpack 没看到你使用的代码。Webpack 跟踪整个应用程序的`import/export`语句，因此，如果它看到导入的东西最终没有被使用，它会认为那是未引用代码(或叫做“死代码”—— dead-code )，并会对其进行 tree-shaking 。死代码并不总是那么明确的。下面是一些死代码和“活”代码的例子

```js
// 这会被看作“活”代码，不会做 tree-shaking
import { add } from './math';
console.log(add(5, 6));

// 导入并赋值给 JavaScript 对象，但在接下来的代码里没有用到
// 这就会被当做“死”代码，会被 tree-shaking
import { add, minus } from './math';
console.log(add(5, 6));

// 导入但没有赋值给 JavaScript 对象，也没有在代码里用到
// 这会被当做“死”代码，会被 tree-shaking
import { add, minus } from './math';
console.log('hello webpack');

// 导入整个库，但是没有赋值给 JavaScript 对象，也没有在代码里用到
// 非常奇怪，这竟然被当做“活”代码，因为 Webpack 对库的导入和本地代码导入的处理方式不同。
import { add, minus } from './math';
import 'lodash';
console.log('hello webpack');
```

## 面试

### webpack 中 loader 跟 plugin 区别

#### Loaders（加载器）

Loaders 主要用于转换文件内容。当你导入一个文件时，Webpack 会从左到右依次执行所有相关的 loader，并将输出传递给下一个 loader 或者直接打包到最终的 bundle 中。Loaders 可以同步或异步执行，并且可以被链式调用。

特点：

- 转换文件：Loaders 可以处理各种类型的文件，如 JavaScript、CSS、图片、字体等。
- 链式调用：多个 loaders 可以串联使用，后一个 loader 接收前一个 loader 的输出作为输入。
- 配置方式：在 webpack.config.js 文件中通过 module.rules 配置来指定哪些文件需要经过哪些 loader 处理。

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' }, // 转换 ES6+ 代码到浏览器兼容的版本
          { loader: 'eslint-loader' }, // 检查代码风格
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

#### Plugins（插件）

Plugins 是用来扩展 Webpack 功能性的。它们可以在构建过程中注入额外的行为，比如清理旧的 build 文件夹、定义全局变量、压缩文件等。与 loaders 不同，plugins 在整个编译生命周期的特定时机运行。

特点：

- 扩展功能：Plugins 可以添加、修改或优化 Webpack 的行为。
- 生命周期挂钩：Plugins 可以在编译过程中的特定阶段被触发，比如开始编译之前 (beforeCompile) 或生成文件之后 (afterEmit)。
- 配置方式：在 webpack.config.js 文件中通过 plugins 数组来注册插件实例。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  //...
  plugins: [
    new CleanWebpackPlugin(), // 清除旧的构建文件
    new HtmlWebpackPlugin({
      // 生成 HTML 文件
      template: './src/index.html',
    }),
  ],
};
```

总结

- Loaders 负责转换文件内容，而 Plugins 用来扩展 Webpack 的功能。（对于 loader，它就是一个转换器，将 A 文件进行编译形成 B 文件，这里操作的是文件，比如将 A.scss 或 A.less 转变为 B.css，单纯的文件转换过程。plugin 是一个扩展器，它丰富了 wepack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点，执行广泛的任务。）
- Loaders 在文件被导入时按顺序执行，而 Plugins 在编译的不同阶段被调用。
- Loaders 主要处理单个文件的转换，而 Plugins 更多处理整体构建流程的优化和管理。

### css-loader 和 style-loader

- css-loader 的主要负责解析 CSS 文件，并将 CSS 文件中的 @import 和 url() 等语法导入的资源路径进行解析，是将 CSS 文件转化为 JavaScript 模块
- style-loader 的作用是在运行时（runtime）将 CSS 动态地插入到 DOM 中。这意味着当你的应用加载时，style-loader 会负责创建一个新的 `<style>` 标签，并将 CSS 内容插入到该标签中，然后将其添加到页面的`<head>` 部分。

### webpack 打包原理

1. 模块解析：

   Webpack 从入口文件（entry point）开始，递归地查找项目中的所有依赖模块。这个过程涉及到解析每个文件中的 import/require 语句，找到所有被引用的模块。Webpack 将这些模块组织成一个依赖图谱，其中每个节点代表一个模块，边表示模块间的依赖关系。

2. 模块转换：

   在找到所有依赖模块后，Webpack 会使用配置好的 Loader 对这些模块进行转换。Loader 是可配置的函数，用于转换特定类型的文件。例如，babel-loader 用于将现代 JavaScript 代码转换为浏览器兼容的版本，css-loader 和 style-loader 用于处理 CSS 文件等。

3. 构建模块：

   一旦所有模块都被转换完毕，Webpack 会开始构建模块。这个过程包括将所有模块合并成一个或多个输出文件（chunks）。在构建过程中，Webpack 还会执行一些优化，例如：

   - 提取公共代码：Webpack 可以识别并提取出多个模块之间共有的代码，减少冗余。
   - 代码分割：通过动态 import 等技术，Webpack 可以将代码分割成多个较小的文件，实现按需加载。
   - 压缩：Webpack 可以压缩 JavaScript、CSS 等文件，减少文件大小。
   - 定义环境变量：Webpack 可以在构建时替换某些变量，例如定义 process.env.NODE_ENV 为 'production' 或 'development'。

4. 输出文件:

   最后，Webpack 会根据配置输出最终的文件。这些文件通常会被放置在一个指定的输出目录中，例如 dist。Webpack 支持多种输出格式，可以针对不同的环境和需求进行定制。

5. 插件机制：

   在整个构建过程中，Webpack 的插件系统允许开发者在构建的不同阶段注入自定义的行为。插件可以监听 Webpack 生命周期中的各种事件，并在这些事件发生时执行相应的操作，例如清除输出目录、优化输出文件等

## 手写 loader

Loader 本质就是一个函数

loader 分类：同步 loader，异步 loader，Rawloader，Pitchingloader

### 实现一个简单加载的 txt 文档的 loader

1. 初始化项目
   ```js
   yarn init -y
   ```
2. 安装 webpack 依赖
   ```js
   yarn add webpack webpack-cil
   ```
3. 创建 webpack.config.js 文件
4. 创建如图下文件，打包`npm run build`后执行`node dist/bundle.js`打印文件内容

<ImagePreview src="/images/webpack/image58.jpg"></ImagePreview>

### loader 上下文（this 上的属性跟方法）

1. this.context：被处理的文件所在的路径

   ```js
   module.exports = function (content) {
     console.log(this.context, '===='); // /Users/xuelin/workspace/wepack-loader-plugin/src

     const result = `export default '${content}'`;
     return result;
   };
   ```

2. this.data: loader 有两个阶段，一个是 normal 阶段，一个是 pitching 阶段，通过这个属性，拿到 pitching 阶段保存的值，如果是 loader 中没有定义 pitching 阶段，则值为 null
3. this.callback: 返回 loader 的处理结果，可能是成功的结果，也可能是失败的结果，失败的结果通过 callback 返回第一个参数传递，成功的结果通过第二个参数传递，如果一个参数不为 null，则第二个参数会被无视

4. this.cacheable: 当前 loader 是否可以缓存，默认为 true，如果为 false，则每次都会执行 loader

   ```js
   module.exports = function (content) {
     this.cacheable(false);
     const result = `export default '${content}'`;
     return result;
   };
   ```

5. this.async：函数作用为声明当前的 loader 是异步的，并返回一个 cāllback 函数，通过调用 callback 函数，向 webpack 引擎传递 loader 返回处理结果
6. this.emitFile：生成一个文件，到 output 目录下，函数的第一个参数为路径，第二个参数为文件内容

```js
module.exports = function (content) {
  this.emitFile('index-output.js', content);
  const result = `export default '${content}'`;
  return result;
};
```

### loader 类型

**同步 loader**

```bash
需求文档
1. loader要处理的文件扩展名为xxx.qianfeng
2. 文件的内容，引用到两个全局变量 qianfengName、qianfengUrl（不需要自己定义，由我们webpack为我们定义）
3. 这两个变量的值，从json文件中读取出来
4. 导出js语法正确的转换结果
5. 在页面中执行导出js文件
```

1. 创建 json 文件, var.json

```js
{
    "qianfengName": "千峰",
    "qianfengUrl": "https://www.qianfeng.com"
}
```

2. 创建 main.qianfengw 文件

```js
const h3 = document.createElement('h3');
h3.innerHTML = qianfengName;

const anchor = document.createElement('a');
anchor.innerHTML = '千峰HTML';
anchor.href = qianfengUrl;

document.body.appendChild(anchor);
document.body.appendChild(h3);
```

3. 配置 webpack.config.js 文件

```js
const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.qianfeng$/,
        use: './loaders/my-loader.js',
      },
    ],
  },
};
```

4. 创建 my-loader.js 文件

```js
const path = require('path');
const fs = require('fs');
module.exports = function (content) {
  // 读取json文件
  const jsonPath = path.resolve(__dirname, 'var.json');
  const varResult = fs.readFileSync(jsonPath, 'utf-8');
  const varJson = JSON.parse(varResult);
  // 同步loader直接可以使用return可以返回loader的转换结果
  // 也可以使用this.callback来返回

  const result = `
    var qianfengName = ${JSON.stringify(varJson.qianfengName)};
    var qianfengUrl = ${JSON.stringify(varJson.qianfengUrl)};
    ${content}
    `;

  this.callback(null, result); // 或者使用return result
  // return result;
};
```

5. 在 src 文件下创建 index.js 并引入 main.qianfeng 文件
6. 执行打包并在 html 引入 bundle.js 文件在浏览器中查看

<ImagePreview src="/images/webpack/image61.jpg"></ImagePreview>

**异步 loader**

将上面的 my-loader.js 文件重写为异步方式

```js
const path = require('path');
const fs = require('fs');
module.exports = function (content) {
  // 异步loader必须通过callback来返回文件的处理结果，不能使用return
  // 这样还有一个问题，不写return的话，webpack 默认会return undefined 的，这样会导致错误
  // 在异步loader中，使用异步方式调用this.callback之前，必须调用this.async方法
  // 这样webpack就不会把loader函数返回undefined作为loader的执行结果，而会等待this.callback的调用
  this.async();
  const jsonPath = path.resolve(__dirname, 'var.json');

  fs.readFile(jsonPath, 'utf-8', (err, data) => {
    if (err) {
      this.callback(new Error('读取JSON文件失败'));
      return;
    }
    const varJson = JSON.parse(data);

    const result = `
      var qianfengName = ${JSON.stringify(varJson.qianfengName)};
      var qianfengUrl = ${JSON.stringify(varJson.qianfengUrl)};
      ${content}
    `;

    this.callback(null, result);
  });
};
```

**Raw loader**

默认情况下，webpack 会将处理的文件以 UTF-8 的字符串形式传递给 loader, 有些时候，我们处理的是二进制文件，如果转换为字符串就会出错。这时候我们可以使用 raw-loader 来处理二进制文件 Buffer，当读取二进制文件（如图片、音频或视频文件）时，Buffer 可以用来保存文件内容。

这是我们自己的 loader 去打印的图片的信息，我们发现是一堆乱码是处理不了的，并且复制的图片加载失败就是我们上面说的原因

<ImagePreview src="/images/webpack/image62.jpg"></ImagePreview>

当我们开启 raw-loader 的时候，可以正常打印出图片的信息并且图片加载成功

<ImagePreview src="/images/webpack/image63.jpg"></ImagePreview>

**Pitching loader**

loader 模块中导出函数的 pitching 属性指向的函数称为 pitching loader

我们创建三个 loader，a-loader，b-loader，c-loader，在 webpack.config.js 中配置如下

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.txt/,
        use: [
          './loaders/a-loader.js',
          './loaders/b-loader.js',
          './loaders/c-loader.js',
        ],
      },
    ],
  },
};
```

创建 a-loader.js

```js
function aLoader(content, map, meta) {
  console.log('开始执行aLoader Normal Loader');
}

aLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log('开始执行aLoader Pitching Loader');
  //   console.log(remainingRequest, precedingRequest, data)
};

module.exports = aLoader;
```

b-loader.js、c-loader.js 依次创建如上

我们执行 webpack 命令，发现 loader 执行顺序为：

```bash
aLoader Pitching Loader
bLoader Pitching Loader
cLoader Pitching Loader
cLoader Normal Loader
bLoader Normal Loader
aLoader Normal Loader
```

Pitching Loader 的执行顺序是 从左到右，而 Normal Loader 的执行顺序是 从右到左。具体的执行过程如下图所示:

<ImagePreview src="/images/webpack/image64.jpg"></ImagePreview>

webpack 在解析完配置文件后，会将 loader 转化为内联格式，其实就是文件所在的路径进行加载，如`a-loader.js!b-loader.js!c-loader.js!index.txt`，我们分别看下 aLoader，bLoader，cLoader 的 pitch 的三个参数都打印了什么

aLoader.js

```js
function aLoader(content, map, meta) {}

aLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(remainingRequest, 'remainingRequest'); // /Users/xuelin/workspace/wepack-loader-plugin/loaders/b-loader.js!/Users/xuelin/workspace/wepack-loader-plugin/loaders/c-loader.js!/Users/xuelin/workspace/wepack-loader-plugin/src/index.txt

  console.log(precedingRequest, 'precedingRequest');

  console.log(data, 'data'); // {}
};

module.exports = aLoader;
```

bLoader.js

```js
function bLoader(content, map, meta) {}

bLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(remainingRequest, 'remainingRequest'); // /Users/xuelin/workspace/wepack-loader-plugin/loaders/c-loader.js!/Users/xuelin/workspace/wepack-loader-plugin/src/index.txt

  console.log(precedingRequest, 'precedingRequest'); // /Users/xuelin/workspace/wepack-loader-plugin/loaders/a-loader.js

  console.log(data, 'data'); // {}
};

module.exports = bLoader;
```

cLoader.js

```js
function cLoader(content, map, meta) {}

cLoader.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(remainingRequest, 'remainingRequest'); // Users/xuelin/workspace/wepack-loader-plugin/src/index.txt

  console.log(precedingRequest, 'precedingRequest'); // /Users/xuelin/workspace/wepack-loader-plugin/loaders/a-loader.js!/Users/xuelin/workspace/wepack-loader-plugin/loaders/b-loader.js

  console.log(data, 'data'); // {}
};

module.exports = cLoader;
```

其实我们可以看出各个 loader 里的三个参数对应的什么意思

```bash
remainingRequest: 当前loader后的剩余请求路径
previousRequest: 当前loader前的请求路径
data: 用于此loader的normal阶段进行数据通信的
```

看一下 data 怎么传递呢，我们看下 aLoader.js

```js
function aLoader(content, map, meta) {
  console.log(this.data); // { xiaoming: '小明' }
}

aLoader.pitch = function (remainingRequest, precedingRequest, data) {
  data.xiaoming = '小明';
};

module.exports = aLoader;
```

当一个 pitching 函数有返回值，此时，正常的 loader 执行顺序就会被打破。该返回值会直接传递给下一个要执行的 loader 的 normal 函数，并作为 loader 的参数传递过去。

其实当某个 Pitching Loader 返回非 undefined 值时，就会实现熔断效果也叫熔断机制

我们更新一下 bLoader.pitch 方法，让它返回 "bLoader Pitching 熔断内容" 字符串

<ImagePreview src="/images/webpack/image65.jpg"></ImagePreview>

我们发现 aLoader 的 content 接受到 bLoader 的返回值，并且不会执行 cLoader 的 pitching 阶段跟 normal 阶段，也就是下面的执行顺序

<ImagePreview src="/images/webpack/image66.jpg"></ImagePreview>

## 手写 Plugin

一个最基础的 Plugin 的代码是这样的，从形态上看，插件通常是一个带有 apply 函数的类

```js
class SomePlugin {
  // 在构造函数中获取用户给该插件传入的配置
  // constructor(options) {}

  //Webpack 会调用 SomePlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {}
}
```

apply 函数运行时会得到参数 compiler ，以此为起点可以调用 hook 对象注册各种钩子回调，例如： compiler.hooks.make.tapAsync ，这里面 make 是钩子名称，tapAsync 定义了钩子的调用方式，webpack 的插件架构基于这种模式构建而成，插件开发者可以使用这种模式在钩子回调中，插入特定代码。webpack 各种内置对象都带有 hooks 属性，比如 compilation 对象：

```js
class SomePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('SomePlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync('SomePlugin', () => {});
    });
  }
}
```

### Compiler 和 Compilation

在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：

- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options， loaders， plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

### 事件流

Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

Webpack 通过 [Tapable](https://github.com/webpack/tapable)来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

Webpack 的事件流机制应用了观察者模式，和 Node.js 中的 EventEmitter 非常相似。Compiler 和 Compilation 都继承自 Tapable，可以直接在 Compiler 和 Compilation 对象上广播和监听事件。

```js
// event-name 为事件名称，注意不要和现有的事件重名, params 为附带的参数
compiler.apply('event-name', params);

//监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。同时函数中的 params 参数为事件时附带的参数。
compiler.plugin('event-name', function (params) {});
```

同理， compilation.apply 和 compilation.plugin 使用方法和上面一致。

如一个需求是需要把

```bash
@import "/static/css/vendor.wxss"; 改为：@import "/subPages/enjoy_given/static/css/vendor.wxss";

```

编写一个插件，实现这个需求

```js
class CssPathTransfor {
  apply(compiler) {
    // 在 emit 事件发生时，代表源文件的转换和组装已经完成，在这里可以读取到最终将输出的资源、代码块、模块及其依赖，并且可以修改输出资源的内容
    compiler.plugin('emit', (compilation, callback) => {
      // 遍历所有资源文件
      for (var filePathName in compilation.assets) {
        // 查看对应的文件是否符合指定目录下的文件
        if (/static\/css\/pages/i.test(filePathName)) {
          // 引入路径正则
          const reg = /\/static\/css\/vendor\.wxss/i;
          // 需要替换的最终字符串
          const finalStr = '/subPages/enjoy_given/static/css/vendor.wxss';
          // 获取文件内容
          let content = compilation.assets[filePathName].source() || '';

          content = content.replace(reg, finalStr);
          // 重写指定输出模块内容
          compilation.assets[filePathName] = {
            source() {
              return content;
            },
            size() {
              return content.length;
            },
          };
        }
      }
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    });
  }
}
module.exports = CssPathTransfor;
```

webpack.config.js 导入

```js
var baseWebpackConfig = require('./webpack.base.conf')
var CssPathTransfor = require('../plugins/CssPathTransfor.js')

var webpackConfig = merge(baseWebpackConfig, {
  module: {...},
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {...},
  plugins: [
    ...,
    // 配置插件
    new CssPathTransfor(),
  ]
})

```

## Webpack 的 Tree Shaking 原理

Webpack 的 Tree Shaking 是一个利用 ES6 模块静态结构特性来去除生产环境下不必要代码的优化过程。其工作原理在于：

- 当 Webpack 分析代码时，它会标记出所有的 import 语句和 export 语句。
- 然后，当 Webpack 确定某个模块没有被导入时，它会在生成的 bundle 中排除这个模块的代码。
- 同时，Webpack 还会进行递归的标记清理，以确保所有未使用的依赖项都不会出现在最终的 bundle 中。

确保你使用的是 ES6 模块语法（即 import 和 export），因为只有这样才能让 Tree Shaking 发挥作用。

## 什么是 Webpack 的热更新（Hot Module Replacement）？原理是什么？

Webpack 的热更新，在不刷新页面的前提下，将新代码替换掉旧代码。

HRM 的原理实际上是 webpack-dev-server（WDS）和浏览器之间维护了一个 websocket 服务。当本地资源发生变化后，webpack 会先将打包生成新的模块代码放入内存中，然后 WDS 向浏览器推送更新，并附带上构建时的 hash，让客户端和上一次资源进行对比.

## webpack 构建流程

webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- 确定入口：根据配置中的 entry 找出所有的入口文件
- 编译模块：从入口文件出发，调用所有配置的 loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- 完成模块编译：在经过上一步使用 loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 webpack 提供的 API 改变 webpack 的运行结果。
简单说：

- 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler
- 编译：从 entry 出发，针对每个 Module 串行调用对应的 loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理
- 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

<BackTop></BackTop>