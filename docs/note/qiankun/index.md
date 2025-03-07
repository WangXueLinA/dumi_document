---
title: qiankun
---

# qiankun

## 介绍

官网： https://qiankun.umijs.org/zh/guide

搭建 demo 使用：https://github.com/WangXueLinA/simple-qiankun

qiankun 的优势有哪些

- 技术栈无关：主框架不限制接入应用的技术栈，微应用具备完全自主权独立开发
- 独立部署：微应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
- 增量升级：在面对各种复杂场景时，我们通常很难对一个已经存在的系统做全量的技术栈升级或重构，而微前端是一种非常好的实施渐进式重构的手段和策略
- 独立运行时：每个微应用之间状态隔离，运行时状态不共享

## 为啥不是 iframe

1. url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
2. UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
3. 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
4. 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

## 搭建主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册子应用需要使用 qiankun 提供的方法 registerMicroApps ，注册之后还需要调用 start 方法进行启动。(这种方式适用于浏览器 url 发生变化时，自动加载相应的微应用的功能)，或者手动加载微应用微应用是一个不带路由的可独立运行的业务组件的 loadMicroApp 方法

我们使用 react 的脚手架创建一个项目，此项目将作为基座

```js
npx create-react-app main-react
```

然后在 main-react 主应用中安装 qiankun

```js
npm i qiankun -S

# or yarn add qiankun

```

然后 main-react 主应用的<span style='color: red'>入口文件</span>(这里为 index.js)中注册 registerMicroApps ，注册之后还需要调用 start 方法进行启动。

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/reset.css';

import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/app-react',
  },
  {
    name: 'vueApp2',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue2',
  },
  {
    name: 'vueApp3',
    entry: '//localhost:8081',
    container: '#container',
    activeRule: '/app-vue3',
  },
]);

// 启动 qiankun
start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

然后我们增加样式的书写，如下界面

![](/images/qiankun/image1.jpg)

## 创建子应用

我使用两个主流的前端框架 react 和 vue 来创建子应用，vue2 跟 vue3 也有所不同，在子应用中要做的事情需要导出子应用的生命周期，由 qiankun 规定的三种生命周期，分别是：bootstrap、mount、 unmount，然后配置微应用的打包工具

生命周期

```js
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(
    <App />,
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root'),
  );
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```

webpack 配置

```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    // jsonpFunction: `webpackJsonp_${packageName}`, webpack4 默认配置
    chunkLoadingGlobal: `webpackJsonp_${packageName}`, // webpack5 配置
  },
};
```

### react 应用

创建一个 react 子应用，并安装 react-router-dom

```js
npx create-react-app app-react

npm install react-router-dom

```

相应的在入口文件中导出子应用的生命周期

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
let root;

function render(props) {
  const { container } = props;
  root = ReactDOM.createRoot(
    container
      ? container.querySelector('#root')
      : document.querySelector('#root'),
  );

  root.render(
    <BrowserRouter
      basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}
    >
      <App />
    </BrowserRouter>,
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  render(props);
  console.log('react app mount', props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  root.unmount();
}
```

然后便是修改 webpack 的配置啦，可以完全按照 [官网](https://qiankun.umijs.org/zh/guide/tutorial#react-%E5%BE%AE%E5%BA%94%E7%94%A8) 的描述来即可。

但是我试了 react18 版本好像不行，启动后打包文件失效，一直连不上子应用，也没有找到解决办法，只能自己下载 webpack 手动进行配置

webpack.config.js

```js
const path = require('path');
const packageName = require('./package.json').name;
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    libraryTarget: 'umd',
    library: `${packageName}-[name]`,
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    port: 3001, // 端口号
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      template: 'public/index.html',
    }),
  ],
};
```

至此 react 子应用搭建成功！

![](/images/qiankun/image2.jpg)

### vue2 应用

首先使用脚手架创建一个 vue2.x 的项目

```js
vue create app-vue2
```

然后修改 main.js，导出三个生命周期，

```bash
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './router';

Vue.config.productionTip = false;

let router = null;
let instance = null;
function render(props = {}) {
  const { container } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/app-vue2' : '/',
    mode: 'history',
    routes,
  });

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = '';
  instance = null;
  router = null;
}
```

还要修改 vue.config.js 文件，还是按照官网走，但是我发现 vue2 的时候 library 得写死，写出主应用中的 name，不然老报生命周期没有配置导出，[官网解决方案](https://qiankun.umijs.org/zh/faq)

```js
const packageName = require('./package.json').name;
module.exports = {
  configureWebpack: (config) => {
    config.output.library = 'vueApp2';
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${packageName}`;
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许跨域
    },
  },
  productionSourceMap: false,
};
```

至此 vue2 子应用搭建成功！

![](/images/qiankun/image3.jpg)

### vue3 应用

跟 vue2 一样，先使用脚手架创建一个 vue3.x 的项目

```js
vue create app-vue2
```

然后修改 main.js，导出三个生命周期

```js
import App from './App.vue';
import { createApp } from 'vue';

/* eslint-disable */
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

let instance = null;

function render(props = {}) {
  instance = createApp(App);
  const { container } = props;
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  //console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
  //console.log('[vue] props from main framework', props);
  render(props);
}
export async function unmount() {
  instance.unmount();
  //instance = null
}
```

还要修改 vue.config.js 文件，还是按照官网走，但是还得增加一个 publicPath 这个属性，不然微应用资源加载找不到的基础路径，，无语，不知道为啥

```js
const packageName = require('./package.json').name;
module.exports = {
  publicPath: '/',
  configureWebpack: {
    output: {
      // 必须打包出一个库文件
      library: `${packageName}-[name]`,
      // 库的格式必须是 umd
      libraryTarget: 'umd',
    },
  },
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*', // 允许跨域
    },
  },
  productionSourceMap: false,
  css: {
    extract: true,
  },
};
```

至此 vue3 子应用搭建成功！

![](/images/qiankun/image4.jpg)

## 手写微前端

![](/images/qiankun/image5.jpg)

[哔哩哔哩网课教程](https://www.bilibili.com/video/BV1H34y117fe/?spm_id_from=333.337.search-card.all.click&vd_source=659147a33d02976d4b12aa69a7733ee1)

### 监控路由变化

跟 react-router，或者 vite-router 一样，我们只需要监听路由变化

路由模式有两种：hash 模式和 history 模式。

1. hash 模式需要监控 window.onhashchange 事件；
2. history 模式 需要监控 pushState、 replaceState、 window.onpopstate 事件。

history.go、history.back、history.forward 使用 popstate 事件 window.onpopstate

```js
window.addEventListener('popstate', () => {});
```

重写: pushState、replaceState 需要通过函数重写的方式进行劫持

```js
const rawPushState = window.history.pushState;
window.history.pushState = function (...args) {
  rawPushState.apply(window.history, args);
  consoe.log('pushState变化了');
};

const rawReplaceState = window.history.replaceState;
window.history.replaceState = function (...args) {
  rawReplaceState.apply(window.history, args);
  consloe.log('replaceState变化了');
};
```

### 匹配子应用

监听路由的变化后，拿到当前路由的路径 window.location.pathname，然后根据 registerMicroApps 的参数是一个数组，子应用都配置了 activeRule，根据这个 activeRule 去查找

```js
const currentApp = apps.find((app) =>
  window.location.pathname.startWith(app.activeRule),
);
```

### 加载子应用

当我们找到了与当前路由匹配的子应用，接着就去加载这个子应用的 html，css，js 资源，就得加载子应用的 entry 这个参数，这时候得保证子应用一定是启动的状态，不然请求不到

```js
// 加载资源
const html = await fetch(currentApp.entry.then((res) => res.text()));

// 将 html 渲染到指定的容器内
const container = document.querySelector(currentApp.container);
```

实则请求到下面的 html 文件

![](/images/qiankun/image6.jpg)

这时候就应该将这个 html 文件渲染到我们注册子应用的 container 容器里，然后我们`container.innerHTML = html`将 html 渲染到指定的容器内, 但是这样是无法显示的。

![](/images/qiankun/image7.jpg)

为什么 html 在节点里已经显示了，但是为啥没有渲染出来？

1. 客户端渲染需要通过执行 javascript 代码来生成内容
2. 浏览器出于安全考虑，innerHTML 中的 scrpit 标签不会被执行，所以需要手动执行，其实就是要拿到里面 script 标签的 src 指向的路径去执行 js，如`<script src="/js/chunk-vendors.js"></script>`,所以我们要拿到字符串`"/js/chunk-vendors.js"`，然后再拼凑出子应用的所有路径如`http://localhost:8080/js/chunk-vendors.js`，如图，我们看请求的网络加载也是这样的，请求到子应用的本机服务器，然后再进行加载里面的资源

![](/images/qiankun/image8.jpg)

3. 最后通过 eval 函数或者 new Function 函数执行，如

```js
eval('console.log("hello world")');
```

通过源码发现 qiankun 是基于 single-spa 实现的，通过 import-html-entry 包处理 html / css，其实大致有几下步骤导出这三个函数：

1. 将获取到的 html 文本，放到 template DOM 节点中
2. 获取所有的 Script 脚本
3. 执行所有的 Script 脚本

```js
export const importHTML = url => {
  const html = await fetch(currentApp.entry).then(res => res.text()

  const template = document.createElement('div')

  template.innerHTML = html

  const scripts = template.querySelectAll('script')

  const getExternalScripts = () => {
    console.log('解析所有脚本: ', scripts)
  }

  const execScripts = () => {}

  return {
    template, // html 文本
    getExternalScripts, // 获取 Script 脚本
    execScripts, // 执行 Sript 脚本
  }
}
```

我们在 getExternalScripts 方法中来处理

```js
const getExternalScripts = async () => {
  return Promise.all(
    Array.from(scripts).map((script) => {
      // 获取 scr 属性
      const src = script.getAttribute('src');

      if (!src) {
        return Promise.resolve(script.innerHTML);
      } else {
        return fetch(src.startWith('http') ? src : `${url}${src}`).then((res) =>
          res.text(),
        );
      }
    }),
  );
};
```

然后我们就可以通过 execScripts 方法去调用 getExternalScripts，拿到所有的脚本内容后，执行！

```js
const execScripts = async () => {
  const scripts = await getExternalScripts();

  scripts.forEach((code) => {
    eval(code);
  });
};
```

### 获取子应用生命周期

我们发现子应用文件加载出来，但是或多或少都有问题，比如子应用给主应用干没了，没有渲染想要的位置。也没有走 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用

在配置子应用时打包输出格式为 umd，并且要允许跨域

umd 格式是一种既可以在浏览器环境下使用，也可以在 node 环境下使用的格式。它将 CommonJS、AMD 以及普通的全局定义模块三种模块模式进行了整合。

```js
// umd格式
(function (global, factory) {
  // global =》 window
  // factory =》 function () {}

  // CommonJS
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : // AMD
    typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : // Window
      ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.qiankun = {})));
})(window, function (exports) {
  // 应用代码
});
```

为什么 qiankun 要求子应用打包为 umd 库格式呢？主要是为了主应用能够拿到子应用在 入口文件 导出的 生命钩子函数，这也是主应用和子应用之间通信的关键

```js
export async function bootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}

export async function mount(app) {
  if (app.mount) {
    await app.mount({
      container: document.querySelector(app.container),
      appInfo: app.appInfo,
    });
  }
}

export async function unmount(app) {
  const container = document.querySelector(app.container);
  if (app.unmount) {
    await app.unmount({ container });
    if (app.proxy) {
      app.proxy.inactive();
    }
  }
  container.innerHTML = '';
}
```

## JavaScript 隔离

qiankun 框架为了实现 js 隔离，提供了三种不同场景使用的沙箱，分别是 snapshotSandbox、proxySandbox、legacySandbox

### 快照沙箱 snapshotSandbox

优劣势：snapshotSandbox 会污染全局 window，但是可以支持不兼容 Proxy 的浏览器。

![](/images/qiankun/image9.jpg)

主要的方法 active 和 inactive， active 表示激活该沙箱，并将 window 上的变量记录在 snapshotWindow 上，对原始 window 上的变量进行 snapshot，并将 modifyMap 修改的值赋值到 window 变量上 。inactive 表示注销该沙箱，这时候要对比激活时快照和当前 window 上变量值的不一致，存储在 modifyMap 变量上，下一次该沙箱激活的时候重新赋值给 window 上。

```js
const iter = (window, callback) => {
  for (const prop in window) {
    if (window.hasOwnProperty(prop)) {
      callback(prop);
    }
  }
};
class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifyPropsMap = {};
  }
  // 激活沙箱
  active() {
    // 缓存active状态的window
    this.windowSnapshot = {};
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop];
    });
    Object.keys(this.modifyPropsMap).forEach((p) => {
      window[p] = this.modifyPropsMap[p];
    });
  }
  // 退出沙箱
  inactive() {
    iter(window, (prop) => {
      if (this.windowSnapshot[prop] !== window[prop]) {
        // 记录变更
        this.modifyPropsMap[prop] = window[prop];
        // 还原window
        window[prop] = this.windowSnapshot[prop];
      }
    });
  }
}
```

一个 SnapshotSandbox 的类我们就实现了

```js
const sandbox = new SnapshotSandbox();
((window) => {
  // 激活沙箱
  sandbox.active();
  window.sex = '男';
  window.age = '22';
  console.log(window.sex, window.age); // 男 22

  // 退出沙箱
  sandbox.inactive();
  console.log(window.sex, window.age); // undefined undefined
  // 激活沙箱
  sandbox.active();
  console.log(window.sex, window.age); // 男 22
})(sandbox.proxy);
```

### 代理沙箱 proxySandbox

优劣势：不会污染全局 window，支持多个子应用同时加载。

![](/images/qiankun/image10.jpg)

主要的方法也是 active 和 inactive，Proxy 对 window 进行代理，get 访问的时候，先去 fakeWindow 中查找，没有的话才会从原始 rawWindow 上取值；set 只有在沙箱激活的时候才会进行赋值操作。

```js
class ProxySandbox {
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  }
  constructor() {
    const rawWindow = window;
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        if (this.sandboxRunning) {
          target[prop] = value;
          return true;
        }
      },
      get: (target, prop) => {
        // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
        let value = prop in target ? target[prop] : rawWindow[prop];
        return value;
      },
    });
    this.proxy = proxy;
  }
}
```

测试

```js
window.sex = '男';
let proxy1 = new ProxySandbox();
let proxy2 = new ProxySandbox();
((window) => {
  proxy1.active();
  console.log('修改前proxy1的sex', window.sex); // 男
  window.sex = '女';
  console.log('修改后proxy1的sex', window.sex); // 女
})(proxy1.proxy);
console.log('外部window.sex=>1', window.sex); // 男

((window) => {
  proxy2.active();
  console.log('修改前proxy2的sex', window.sex); // 男
  window.sex = '111';
  console.log('修改后proxy2的sex', window.sex); // 111
})(proxy2.proxy);
console.log('外部window.sex=>2', window.sex); // 男
```
