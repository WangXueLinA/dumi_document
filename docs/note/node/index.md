---
toc: content
title: 介绍
order: -100
---

# nodejs

## 介绍

- nodejs 并不是 JavaScript 应用，也不是编程语言，因为编程语言使用的 JavaScript,Nodejs 是 JavaScript 的运行时。
- Nodejs 是构建在 V8 引擎之上的，V8 引擎是由 C/C++编写的，因此我们的 JavaSCript 代码需要由 C/C++转化后再执行。
- NodeJs 使用异步 I/O 和事件驱动的设计理念，可以高效地处理大量并发请求，提供了非阻塞式 I/O 接口和事件循环机制，使得开发人员可以编写高性能、可扩展的应用程序,异步 I/O 最终都是由 libuv 事件循环库去实现的。

## 浏览器环境 vs node 环境

| **比较维度**     | **浏览器环境**                                                      | **Node.js 环境**                                                   |
| ---------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **执行环境**     | 在用户浏览器中运行（如 Chrome、Firefox）                            | 在服务器或本地计算机上运行                                         |
| **全局对象**     | `window`（代表浏览器窗口）                                          | `global`（全局对象）或 `module.exports`（模块系统）                |
| **模块系统**     | ES Modules（通过 `<script type="module">` 支持）                    | CommonJS 模块（默认），也支持 ES Modules（需配置）                 |
| **API 访问**     | 访问浏览器相关 API（DOM、BOM、Web APIs 如 `fetch`、`localStorage`） | 访问系统级 API（文件系统 `fs`、网络 `http`、操作系统接口 `os` 等） |
| **主要用途**     | 前端开发（处理用户界面、交互逻辑）                                  | 后端开发（服务器、CLI 工具、脚本等）                               |
| **文件操作**     | 受限（需用户触发，如 `<input type="file">` 或 File API）            | 直接读写文件（通过 `fs` 模块）                                     |
| **网络请求**     | 使用 `XMLHttpRequest` 或 `fetch` API（受 CORS 限制）                | 使用 `http`/`https` 模块或第三方库（如 `axios`，无 CORS 限制）     |
| **安全性限制**   | 严格（同源策略、沙箱机制、无法直接操作系统资源）                    | 宽松（可访问本地文件、网络端口等，需开发者自行确保安全）           |
| **依赖管理**     | 通过 CDN 或 npm + 打包工具（如 Webpack）引入                        | 直接通过 npm/yarn 安装和管理                                       |
| **事件循环**     | 基于浏览器的事件循环（处理 UI 事件、宏任务/微任务）                 | 基于 libuv 的事件循环（优化 I/O 密集型任务）                       |
| **调试工具**     | 浏览器开发者工具（断点、性能分析等）                                | 使用 `--inspect` 标志配合 Chrome DevTools 或 VS Code 调试          |
| **DOM 操作**     | 支持（直接操作 DOM 树）                                             | 不支持（无 DOM 环境，可借助第三方库如 `jsdom` 模拟）               |
| **多线程支持**   | Web Workers（独立线程，但无法访问 DOM）                             | Worker Threads（通过 `worker_threads` 模块实现）                   |
| **版本更新控制** | 依赖用户浏览器版本（碎片化问题）                                    | 由开发者控制 Node.js 版本（通过版本管理工具如 `nvm`）              |
| **包管理器**     | 无原生包管理，依赖 npm 结合打包工具                                 | 原生支持 npm/yarn/pnpm                                             |

## 特性：

### 单线程

在 Java、php 等服务器端语言中，会为每一个客户端连接创建一个新的线程，每个线程会消耗内存，想要 Web 应用程序支持更多的用户，就需要增加服务器的数量。Node.js 不为每个客户连接创建一个新的线程，而仅仅使用一个线程。当有用户连接了，就触发一个内部事件，通过非阻塞 I/O、事件驱动机制，让 Node.js 程序宏观上也是并行的。

好处：减少了内存开销，操作系统的内存换页，最擅长高并发。

坏处：一个用户造成了线程的崩溃，整个服务都崩溃了，其他人也崩溃了

### 非阻塞 I/O

当访问数据库取得数据时，需要一段时间。在传统的单线程处理机制中，在执行了访问数据库代码之后，整个线程都将暂停下来，等待数据库返回结果，才能执行后面的代码。也就是说，I/O 阻塞了代码的执行，极大地降低了程序的执行效率。由于 Node.js 中采用了非阻塞型 I/O 机制，因此在执行了访问数据库的代码之后，立即执行其后面的代码，把数据库返回结果的处理代码放在回调函数中，从而提高了程序的执行效率。阻塞模式下，一个线程只能处理一项任务，要想提高吞吐量必须通过多线程。而非阻塞模式下，一个线程永远在执行计算操作，这个线程的 CPU 核心利用率永远是 100%。nodejs 不会傻等 I/O 语句结束，而会执行后面的语句

### 事件驱动

Node 中，在一个时刻，只能执行一个事件回调函数，但是在执行一个事件回调函数的中途，可以转而处理其他事件（比如，又有新用户连接了），然后返回继续执行原事件的回调函数，这种处理机制，称为“事件环”机制。Node.js 中所有的 I/O 都是异步的，

## 环境

Node.js 的使用 JavaScript 进行编程，运行在 JavaScript 引擎上（V8）。

Node.js 可以解析 JS 代码（没有浏览器安全级别的限制）提供很多系统级别的 API，如：

- 文件的读写 (File System)

  ```js
  const fs = require('fs');

  fs.readFile('./ajax.png', 'utf-8', (err, content) => {
    console.log(content);
  });
  ```

- 进程的管理 (Process)

  ```js
  function main(argv) {
    console.log(argv);
  }

  main(process.argv.slice(2));
  ```

- 网络通信 (HTTP/HTTPS)

  ```js
  const http = require('http');

  http
    .createServer((req, res) => {
      res.writeHead(200, {
        'content-type': 'text/plain',
      });
      res.write('hello nodejs');
      res.end();
    })
    .listen(3000);
  ```

<BackTop></BackTop>