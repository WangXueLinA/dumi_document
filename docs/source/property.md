---
toc: content
title: 性能优化
---

# 性能优化

## webpack

### swc-loader 代替 babel-loader

- SWC 是基于 Rust 编写的高性能编译器，而 Babel 是基于 JavaScript 的转译器。

- Rust 的底层优化使得 SWC 的代码转译速度远超 Babel。根据官方基准测试，SWC 的转译速度通常是 Babel 的 10-20 倍，尤其在大型项目中差异更明显

- SWC 默认启用多线程，能充分利用多核 CPU 并行处理文件，而 Babel 受限于 Node.js 的单线程模型（需通过 thread-loader 等插件实现并行，但会增加配置复杂度）。

- SWC 内置缓存机制，能自动跳过未变更的代码，显著提升重复构建速度。Babel 需手动配置 cacheDirectory 选项，且缓存效率较低。

```bash
# 移除 Babel 相关包
npm uninstall babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

# 安装 SWC 核心依赖
npm install --save-dev swc-loader @swc/core @swc/helpers swc-plugin-another-transform-imports

# 可选：安装 Polyfill 库（若需要兼容旧浏览器）
npm install core-js regenerator-runtime
```

找到 webpack.config.js，将 babel-loader 规则替换为 swc-loader：

原 babel-loader 配置示例：

```javascript
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          /* Babel 配置 */
        },
      },
    },
  ];
}
```

替换为 swc-loader：

```javascript
module: {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript', // 支持 TypeScript
              tsx: true, // 支持 TSX
              dynamicImport: true, // 支持动态导入
            },
            target: 'es2015', // 目标语法版本
            transform: {
              react: {
                runtime: 'automatic', // React 17+ 自动导入 JSX
              },
            },
          },
          env: {
            targets: '> 0.2%', // 浏览器兼容范围
            mode: 'usage', // 按需注入 Polyfill
            coreJs: 3, // core-js 版本
          },
        },
      },
    },
  ];
}
```

创建或更新 SWC 配置文件（推荐）

在项目根目录新建 .swcrc，集中管理 SWC 配置

```js
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true,
      "decorators": true                  // 支持装饰器语法
    },
    "target": "es2015",
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  },
  "env": {
    "targets": "> 0.2%",
    "mode": "usage",
    "coreJs": 3
  }
}
```

增加`swc-plugin-another-transform-imports` 是一个基于 SWC 的插件，主要用于优化 JavaScript/TypeScript 代码中的模块导入方式，通过智能转换 import 语句实现按需引入模块，从而减少最终打包体积。

将类似 `import { Button } from 'ant-design-vue'`; 的代码转换为按具体路径导入（如 `import Button from 'ant-design-vue/lib/button'`;），避免引入整个库，显著减少代码体积

在转换组件导入的同时，自动关联对应的样式文件（如 .css 或 .less），无需手动引入。

```javascript
import { Button } from 'antd';
// 转换为：
import Button from 'antd/lib/button';
import 'antd/lib/button/style/index.less';
```

适用于 ant-design、lodash 等支持按需加载的库，优化生产环境构建结果

```js
{
  "plugins": [
    ["swc-plugin-another-transform-imports", {
      "ant-design-vue": {
        "transform": "ant-design-vue/lib/${member}", // 路径模板
        "preventFullImport": true // 禁止全量导入
      }
    }]
  ]
}
```

### 动态导入 import

- 减少初始加载时间：将非关键模块延迟加载，减少主包体积，加快首屏渲染速度。
- 按需加载：仅在满足条件（如用户操作、路由跳转）时加载模块，提升资源利用率。
- 代码分割：与打包工具（如 Webpack）结合，自动分割代码为独立文件（chunks），优化缓存策略。

如： 路由懒加载（React 示例），访问对应路由时加载组件，减少首屏资源体积

```js
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Suspense>
    </Router>
  );
}
```

大型第三方库按需加载，数据可视化库仅在用户查看图表时加载，避免初始加载阻塞。

```javascript
function loadDataVisualization() {
  import('d3.js').then((d3) => {
    // 使用d3绘制图表
  });
}
```

### 启用 HMR（热模块替换）

HMR 可以让你在不刷新整个页面的情况下，实时预览代码变化，提高开发效率。

```js
const webpack = require('webpack');

module.exports = {
  devServer: {
    hot: true,
  },
};
```

### 压缩

terser-webpack-plugin 是 Webpack 生态中用于压缩和优化 JavaScript 代码的插件。通过合理配置，它可以显著减少代码体积、提升加载性能，同时优化构建速度。

- 删除无用代码：通过 dead_code 选项移除未使用的代码（Tree Shaking）。
- 缩短变量/函数名：将变量名、函数名替换为更短的形式（如 a, b），减小文件体积。
- 移除空格/注释：删除代码中的注释、换行、空格等冗余内容。
- 合并表达式：简化表达式（如 1+2 → 3），优化逻辑结构

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            dead_code: true, // 删除未使用代码
            drop_console: true, // 移除 console.*
            drop_debugger: true, // 移除 debugger
          },
          format: {
            comments: false, // 移除注释
          },
          mangle: true, // 缩短变量名
        },
      }),
    ],
  },
};
```

### 分割代码

SplitChunksPlugin 是优化代码分割和减少重复打包的核心工具。

```js
module.exports = {
  // ====================== 代码分割优化配置 ======================
  optimization: {
    splitChunks: {
      chunks: 'all', // 处理所有类型的代码块（同步和异步）
      minSize: 30000, // 模块体积 >=30KB 才考虑拆分（避免小文件）
      maxSize: 244000, // 尝试拆分超过 244KB 的模块（适合 HTTP/2 优化）
      minChunks: 1, // 模块被至少 1 个 chunk 引用时才会被拆分
      maxAsyncRequests: 6, // 异步加载时最大并行请求数（防止请求过多）
      maxInitialRequests: 4, // 入口点的最大并行请求数（控制首屏请求数）
      automaticNameDelimiter: '~', // 生成文件名时的分隔符（如 vendors~main.js）

      // ================= 缓存组（核心配置） =================
      cacheGroups: {
        vendor: {
          // 处理 node_modules 中的第三方库
          test: /[\\/]node_modules[\\/]/, // 匹配路径中的 node_modules
          name: 'vendors', // 输出文件名（vendors.js）
          chunks: 'all', // 同步和异步代码均处理
          priority: 20, // 优先级最高（优先匹配此组）
        },
        common: {
          // 公共模块分组
          minChunks: 2, // 被至少 2 个入口引用时才提取
          name: 'common', // 输出文件名（common.js）
          chunks: 'all', // 处理所有类型代码块
          priority: 10, // 优先级低于 vendor
          reuseExistingChunk: true, // 如果已有 chunk 包含该模块，则直接复用
        },
        lodash: {
          // 针对 lodash 单独打包
          test: /[\\/]node_modules[\\/]lodash[\\/]/, // 精确匹配 lodash
          name: 'lodash', // 输出文件名（lodash.js）
          chunks: 'all', // 处理所有类型代码块
        },
      },
    },
  },

  // ====================== 输出文件配置 ======================
  output: {
    filename: '[name].[contenthash].js', // 入口文件命名（内容哈希，长效缓存）
    chunkFilename: '[name].[contenthash].js', // 非入口 chunk 命名（如动态导入的文件）
  },

  // ====================== 持久化缓存配置（Webpack 5 新特性） ======================
  cache: {
    type: 'filesystem', // 使用文件系统缓存（大幅提升二次构建速度）
  },
};
```

- 减少重复代码：第三方库和公共模块被提取为独立文件。
- 提升缓存利用率：contenthash 确保未变更的文件长期缓存。
- 控制请求数量：通过 maxAsyncRequests 和 maxInitialRequests 平衡性能。
- 构建速度优化：文件系统缓存大幅减少重复构建时间。

### 使用外部依赖

编写第三方库（如 UI 组件库），避免将 React、Lodash 等依赖打包进产物。

防止使用方重复引入相同库，减小库体积。

```js
externals: {
  react: {
    commonjs: 'react',
    commonjs2: 'react',
    amd: 'react',
    root: 'React'
  },
  lodash: 'lodash'
}
```

使用 CDN 加载如 React、Vue、jQuery 等常用库。

减少打包体积，利用浏览器缓存提升加载速度。

```javascript

externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
  jquery: 'jQuery'
}
```

HTML 需添加：

```html
<script src="https://cdn.example.com/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://cdn.example.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script src="https://cdn.example.com/jquery@3.6.0/jquery.min.js"></script>
```

### 生成环境抽取 css

mini-css-extract-plugin 是 Webpack 中一个用于 将 CSS 代码从 JavaScript 中提取出来，生成独立 CSS 文件 的插件。它的核心目标是优化前端资源加载性能，尤其适用于生产环境。

1. 分离 CSS 与 JavaScript

- 默认情况下，Webpack 会将 CSS 通过 style-loader 内联到 JavaScript 中（运行时动态插入 <style> 标签）。

- 使用 mini-css-extract-plugin 后，CSS 会被提取为独立的 .css 文件，通过 <link> 标签加载，避免阻塞 JavaScript 执行。

2. 优化缓存

独立的 CSS 文件可以利用浏览器缓存机制，减少重复加载。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // 输出文件名（支持哈希）
    }),
  ],
};
```

### 效果验证

- 体积分析：使用 webpack-bundle-analyzer 分析压缩前后的代码体积。

```js
npm install --save-dev webpack-bundle-analyzer
```

在 webpack.config.js 中配置：

```js
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
plugins: [
  new BundleAnalyzerPlugin({
    analyzerHost: '127.0.0.1', // 默认 127.0.0.1
    analyzerPort: 8889, // 默认 8888
  }),
];
```

打包结束后浏览器自动打开 127.0.0.1:8888 地址，可以看到各个模块的大小

<ImagePreview src="/images/js/image18.jpg"></ImagePreview>

- 构建速度：通过 speed-measure-webpack-plugin 对比启用前后的构建时间。

```js
npm install --save-dev speed-measure-webpack-plugin
```

在 Webpack 配置文件中引入并包裹原有配置

```js
// webpack.config.js
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

// 包裹你的 Webpack 配置对象
module.exports = smp.wrap({
  // 原有 Webpack 配置
  entry: './src/index.js',
  output: {
    /* ... */
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    /* ... */
  ],
});
```

运行 Webpack 构建后，终端会显示类似结果

<ImagePreview src="/images/js/image19.jpg"></ImagePreview>

<BackTop></BackTop>