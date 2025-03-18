---
title: Vite
---

# vite

## 原理

### ES module

传统的打包工具如 Webpack 通常会在启动开发服务器之前解析所有依赖并进行打包构建。这意味着 Dev Server 必须等待所有模块构建完成，即使在开发过程中只修改了一个子模块，整个 bundle 文件也会重新打包，导致启动时间随着项目规模增大而变长

<ImagePreview src="/images/vite/image1.jpg"></ImagePreview>

Vite 充分利用了浏览器对 ESM 的原生支持。当代码执行到模块加载时，浏览器会动态地下载导入的模块，而不需要等待整个项目的构建完成。这种动态加载的方式实现了即时编译，使得灰色部分（即暂时未用到的路由）不会参与构建过程。因此，随着项目规模的增大和路由的增加，Vite 的构建速度不会受到影响。

<ImagePreview src="/images/vite/image2.jpg"></ImagePreview>

它是基于浏览器的 type 为 module 的 script 可以直接下载 es module 模块实现的。

其最大的特点是在浏览器端使用 export import 的方式导入和导出模块，在 script 标签里设置 type="module" ，然后使用模块内容

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Simple ES Module Example</title>
  </head>
  <body>
    <h1>Simple ES Module Example</h1>
    <p id="greeting"></p>

    <!-- 使用 type="module" 加载模块 -->
    <script type="module" src="app.js"></script>
  </body>
</html>
```

app.js 创建一个简单的 ES Module 文件

```js
// app.js
// 导出一个简单的函数
export function greet(name) {
  return `Hello, ${name}!`;
}

// 导入并使用这个函数
import { greet } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  const greeting = greet('World');
  document.getElementById('greeting').textContent = greeting;
});
```

### 预构建

Vite 会读取 package.json 文件，了解应用的依赖关系。Vite 会将 node_modules 下的所有依赖转换为 ES Modules 格式，并进行缓存。这个过程只在首次启动时进行，后续请求会使用缓存。当你请求某个模块时，Vite 会根据需要加载该模块及其依赖，而不是一次性加载所有依赖。如果这些依赖已经被预构建过，Vite 会直接使用缓存版本。

vite 会用 esbuild（底层是由 Go 语言编写的， 运行时、编译速度快）分析依赖，然后用 esbuild 打包成 esm 的包之后输出到 node_modules/.vite 下，并生成了一个 metadata.json 来记录 hash。然后用 max-age 强缓存这些预打包的模块，带了 hash 的 query。这样当重新 build 的时候，可以通过修改 query 来触发更新。依赖一般不会变，不用每次都请求，强缓存就行。

### Rollup

虽然 Vite 没有直接采用 Webpack 作为打包工具，但它借鉴了 Rollup 的思想。Rollup 是一个轻量级的模块打包器，它采用基于 ESM 的 tree shaking 技术，可以去除未使用的代码，减少打包体积。Vite 在构建生产环境代码时，会利用 Rollup 进行打包。因此 Vite 还附带了一套构建优化的构建命令，开箱即用。

### 模块热更新

1. 模块标识符的处理：Vite 在处理模块时，通过识别 import 语句中的模块标识符，可以动态地构建出模块之间的依赖关系图。

2. WebSocket 通信：Vite 启动一个 WebSocket 服务器，用于与客户端建立持久连接，实现双向通信。通过 WebSocket，Vite 可以向客户端发送消息，告知其发生了模块变化，并触发热更新操作。

3. 模块替换：当开发者修改了某个模块的代码后，Vite 检测到变化后，会重新编译并构建该模块。然后，Vite 通过 WebSocket 向客户端发送更新消息，告知客户端有模块发生了变化。

4. 客户端处理：客户端接收到更新消息后，会根据更新消息中的信息，以及之前构建好的模块依赖关系图，进行相应的模块替换操作。具体来说，它会以非阻塞的方式请求被更新的模块，然后将新的模块代码插入到当前页面中，完成热更新操作。

5. 局部更新：Vite 可以实现局部更新，即仅更新发生变化的模块，而不需要重新加载整个应用程序。这样可以显著减少开发过程中的刷新时间，提高开发效率

## vite 比 webpack 快在哪里

### 开发模式的差异

在开发环境中，Webpack 是先打包再启动开发服务器，而 Vite 则是直接启动，然后再按需编译依赖文件。（大家可以启动项目后检查源码 Sources 那里看到）
这意味着，当使用 Webpack 时，所有的模块都需要在开发前进行打包，这会增加启动时间和构建时间。
而 Vite 则采用了不同的策略，它会在请求模块时再进行实时编译，这种按需动态编译的模式极大地缩短了编译时间，特别是在大型项目中，文件数量众多，Vite 的优势更为明显。

**Webpack 启动**

<ImagePreview src="/images/webpack/image59.jpg"></ImagePreview>

**Vite 启动**

<ImagePreview src="/images/webpack/image60.jpg"></ImagePreview>

### 对 ES Modules 的支持

现代浏览器本身就支持 ES Modules，会主动发起请求去获取所需文件。Vite 充分利用了这一点，将开发环境下的模块文件直接作为浏览器要执行的文件，而不是像 Webpack 那样先打包，再交给浏览器执行。这种方式减少了中间环节，提高了效率。

### 底层语言的差异

Webpack 是基于 Node.js 构建的，而 Vite 则是基于 esbuild 进行预构建依赖。esbuild 是采用 Go 语言编写的，Go 语言是纳秒级别的，而 Node.js 是毫秒级别的。因此，Vite 在打包速度上相比 Webpack 有 10-100 倍的提升。

### 热更新的处理

在 Webpack 中，当一个模块或其依赖的模块内容改变时，需要重新编译这些模块。
而在 Vite 中，当某个模块内容改变时，只需要让浏览器重新请求该模块即可，这大大减少了热更新的时间。

## vite 对比 webpack ，优缺点在哪

### 优点

- 更快的冷启动：Vite  借助了浏览器对  ESM  规范的支持，采取了与  Webpack  完全不同的  unbundle  机制
- 更快的热更新：Vite  采用  unbundle  机制，所以  dev server  在监听到文件发生变化以后，只需要通过  ws  连接通知浏览器去重新加载变化的文件，剩下的工作就交给浏览器去做了。

### 缺点

- 开发环境下首屏加载变慢：由于  unbundle  机制，Vite  首屏期间需要额外做其它工作。不过首屏性能差只发生在  dev server  启动以后第一次加载页面时发生。之后再  reload  页面时，首屏性能会好很多。原因是  dev server  会将之前已经完成转换的内容缓存起来
- 开发环境下懒加载变慢：跟首屏加载变慢的原因一样。Vite  在懒加载方面的性能也比  Webpack  差。由于  unbundle  机制，动态加载的文件，需要做  resolve、load、transform、parse  操作，并且还有大量的  http  请求，导致懒加载性能也受到影响。
- webpack 支持的更广：由于 Vite 基于 ES Module，所以代码中不可以使用 CommonJs；webpack 更多的关注兼容性, 而 Vite 关注浏览器端的开发体验。Vite 目前生态还不如  Webpack。

<BackTop></BackTop>