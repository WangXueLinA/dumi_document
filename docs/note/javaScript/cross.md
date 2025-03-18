---
toc: content
title: 跨域
---

# javascript

## 跨域

跨域问题源于浏览器的同源策略，该策略限制了从一个源加载的文档或脚本如何与来自另一个源的资源进行交互，以保护用户信息的安全。以下是一些常见的跨域解决方案及其实现原理：

### JSONP

原理：
JSONP 利用了 `<script>` 标签可以跨域加载 JavaScript 文件的特性。服务器返回的不是直接的数据，而是一个包含数据的 JavaScript 函数调用，这个函数由前端定义并提供名称作为查询参数传给服务器。浏览器加载这个脚本时，会执行该函数，并将数据作为参数传递。

- 优点：兼容性好，适用于老版本浏览器。不受同源策略限制，可实现简单跨域请求。
- 缺点：只支持 GET 方法。存在安全风险，如可能遭受 XSS 攻击。

**前端准备**

1. 定义回调函数： 首先，在前端 JavaScript 代码中定义一个函数，这个函数将用于接收和处理从服务器返回的数据。例如

```js
function handleResponse(data) {
  console.log('Received data:', data);
  // 在这里处理data
}
```

2. 构造 URL： 在请求的 URL 中，包含一个查询参数（通常命名为 callback 或类似名字），其值为刚刚定义的函数名。如果服务器支持 JSONP，它会使用这个函数名来包裹响应数据。例如：

```js
const url = 'http://example.com/data?callback=handleResponse';
```

3. 插入 使用 DOM 操作动态创建一个`<script>`标签，将其 src 属性设置为我们构造的 URL，这样浏览器就会去加载这个脚本

```js
const script = document.createElement('script');
script.src = url;
document.head.appendChild(script);
```

**服务器端处理**

1. 识别 callback 参数： 当服务器收到带有 callback 参数的请求时，它需要识别这个参数值，即前端定义的函数名。

2. 封装数据： 服务器需要将实际要返回的数据，按照前端提供的函数名进行封装，形成一个可执行的 JavaScript 函数调用。例如，如果数据是{"key": "value"}，服务器返回的响应内容应该是：

```Javascript
handleResponse({"key": "value"});
```

3. 设置正确的 Content-Type： 服务器应该将响应的内容类型设置为 application/javascript，因为实际上返回的是一个 JavaScript 脚本。

**浏览器执行**

当浏览器加载这个`<script>`标签时，会执行其中的 JavaScript 代码，即调用之前定义好的 handleResponse 函数，并将服务器返回的数据作为参数传递进去。

### CORS (Cross-Origin Resource Sharing)

原理：
CORS 是一种更为灵活的跨域请求方式，通过在 HTTP 响应头中添加特定的字段来告知浏览器允许哪些来源的请求。关键的响应头是 `Access-Control-Allow-Origin`，它可以设置为特定源或者 `*` 表示允许任何源的请求（但不建议这样做，因为存在安全隐患）。

- 优点：支持各种 HTTP 方法。安全性较高，可以通过设置控制权限级别。
- 缺点：需要服务器端的支持和配置。

### 代理服务器

原理：
在客户端和服务器之间架设一个代理服务器，客户端的所有请求都发送到这个代理，代理服务器再将请求转发给实际的目标服务器，从而绕过浏览器的同源策略限制。常见的代理方式有 Nginx 代理、Node.js 中的 http-proxy-middleware 等。

- 优点：灵活，可以处理各种复杂场景。可以统一处理跨域问题，简化前端配置。
- 缺点：需要额外维护代理服务器。增加了网络延迟。

#### 打包工具（如 webpack）自带的服务器

Webpack 自带的服务器 (Webpack Dev Server) 支持代理功能（仅针对开发环境），Webpack Dev Server 使用了 Node.js 的 http 模块来处理 HTTP 请求。当配置了代理时，它实际上是使用了一个内置的代理中间件来处理请求。当请求到达时，Webpack Dev Server 会检查请求路径是否匹配任何代理规则。如果匹配，它会使用 Node.js 的 http 模块发送请求到目标服务器，并将响应返回给客户端。

1. 安装 Webpack Dev Server:

```bash
npm install --save-dev webpack-dev-server
```

1. 配置 webpack.config.js:在 webpack.config.js 文件中，你可以配置 devServer 的 proxy 属性来实现代理。

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://backend.example.com', // 代理所有以 /api 开头的请求到 http://backend.example.com
    },
  },
};
```

这个配置将把所有以 /api 开头的请求代理到 `http://backend.example.com。`

3. 启动 Webpack Dev Server:修改 package.json 文件中的 scripts 部分，增加启动命令

```js
"scripts": {
  "start": "webpack serve --open",
  "build": "webpack"
}
```

然后运行 npm start，这将会启动 Webpack Dev Server 并自动打开浏览器。

#### 使用 Node.js 和 Express 创建代理服务器

1. 安装依赖

首先，确保你已安装 Node.js 环境，然后创建一个新的项目目录，进入该目录并初始化 npm：

```js
mkdir my-proxy-server
cd my-proxy-server
npm init -y
```

接着，安装 Express 和 http-proxy-middleware（这是一个用于 Express 的 HTTP 请求代理中间件）：

```js
npm install express http-proxy-middleware
```

2. 创建代理服务器

在项目根目录下创建一个名为 server.js 的文件，编辑该文件以设置 Express 服务器和代理中间件：

```js
// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 设置代理中间件，将所有以'/api/'开头的请求代理到目标服务器
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://target-api.example.com', // 目标服务器地址
  changeOrigin: true, // 使代理服务器设置 origin 头部为 target 的 origin
  pathRewrite: { '^/api': '' }, // 移除请求路径中的/api 前缀，以便正确路由到目标服务器
});

app.use(apiProxy);

// 启动服务器
app.listen(3000, () => {
  console.log(`Proxy server is running on port 3000`);
});
```

在这个例子中，我们创建了一个 Express 应用，并使用 http-proxy-middleware 中间件来处理所有以/api/开头的请求，将其代理到`http://target-api.example.com`这个假设的目标 API 服务器上。

3. 启动服务器

在终端中运行 server.js 文件来启动代理服务器：

```js
node server.js
```

前端请求代码中，原本需要直接向跨域 API 服务器发起的请求，现在改为向本地的代理服务器发送请求。例如，原本的请求可能是：

```js
// 原请求
axios.get('http://target-api.example.com/data');

// 现在改为：
axios.get('/api/data');
```

这里的/api/data 请求会被我们的代理服务器捕获，并转发到`http://target-api.example.com/data`。通过这种方式，前端可以绕过浏览器的同源策略限制，成功访问到不同源的 API 数据，而无需修改浏览器的安全策略或服务器的 CORS 设置。

#### 使用 Nginx 服务器

原理：服务器和服务器之间的通信不存在跨域，因此我们可以开一台中间服务器（nginx），后端无需改变。前端把请求发给 nginx , nginx 服务器把请求毫无变化地转发给后端的服务器，后端的服务器响应给 nginx 服务器，nginx 服务器加上响应头以后，再返回给前端。

<ImagePreview src="/images/js/image13.jpg"></ImagePreview>

```bash
server {
	listen 8866 default_server; # 因为我的 80 端口被其它服务占用了，因此改一下
	listen [::]:8866 default_server;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}

  #允许跨域请求的域，* 代表所有
  add_header 'Access-Control-Allow-Origin' *;
  #允许带上cookie请求
  add_header 'Access-Control-Allow-Credentials' 'true';
  #允许请求的方法，比如 GET/POST/PUT/DELETE
  add_header 'Access-Control-Allow-Methods' *;
  #允许请求的header
  add_header 'Access-Control-Allow-Headers' *;
  location /api {
    proxy_pass http://172.17.16.1:3000; # 把所有的/api 开头的path 代理到这个位置,和vite 配置类似
  }

}

```

### WebSocket

原理：
WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。它允许跨域通信，因为其握手阶段包含了 Origin 头部，服务器可以根据此头部判断是否接受连接。一旦连接建立，后续的数据传输就不受同源策略限制。

- 优点：实时双向通信。适合实时应用，如聊天、游戏。
- 缺点：不是所有场景都需要 WebSocket 的实时性和复杂性。

**前端实现**
使用原生 WebSocket API 来创建一个 WebSocket 连接

```js
// 假设服务器地址为ws://example.com/chat，端口号如果非默认可以加上，如ws://example.com:8080/chat
const socket = new WebSocket('ws://example.com/chat');

socket.addEventListener('open', (event) => {
    console.log('Connection open!');
    socket.send('Hello Server!');
});

socket.addEventListener('message', (event) {
    console.log('Message from server:', event.data);
});

socket.addEventListener('error', (error) => {
    console.error('Error detected: ', error);
});

socket.addEventListener('close', (event) => {
    console.log('Connection closed');
});
```

**后端实现（以 Node.js 和 WebSocket 库 ws 为例）**
在后端，我们需要创建一个 WebSocket 服务器并允许跨域连接。这里使用 ws 库作为 WebSocket 服务器：

首先安装 ws 库：

```js
npm install ws
```

然后创建一个简单的 WebSocket 服务器，允许来自任何源的连接

<Alert message='在生产环境中，出于安全考虑，应当明确指定允许的源'></Alert>

```js
// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message => ${message}`);
    socket.send(`You sent -> ${message}`);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is listening on port 8080');
```

**跨域配置**
虽然 WebSocket 协议本身不强制要求服务器设置特定的 CORS 头，但如果要严格遵守标准和提高安全性，服务器端可以设置适当的响应头来指示允许的源。使用 Node.js 和 ws 库，可以通过监听 HTTP 升级请求来设置这些头：

```js
server.on('upgrade', (request, socket, head) => {
  socket.setTimeout(0); // 防止socket超时关闭
  // 允许任意源连接
  socket.setHeader('Access-Control-Allow-Origin', '*');
  socket.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  socket.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  );

  server.handleUpgrade(request, socket, head, (ws) => {
    server.emit('connection', ws, request);
  });
});
```

这段代码在 WebSocket 服务器接收到 HTTP 升级请求时设置跨域相关的响应头，允许任何源('\*')发起 WebSocket 连接。在实际部署时，你应该根据实际情况调整 Access-Control-Allow-Origin 的值，而不是简单地允许所有源，以避免安全风险。

### postMessage

原理：
HTML5 引入的 window.postMessage 方法允许来自不同源的脚本采用异步方式进行有限制的通信，可以实现跨域消息传递。发送方通过 postMessage 发送消息，接收方监听 message 事件来接收消息。

- 优点：适用于 iframe、Web Workers、不同窗口或不同源的页面间通信。
- 缺点：需要双方配合，且可能引入安全风险，需谨慎处理接收到的消息。

**发送方（源页面）**

假设有一个页面 A（源页面），想要向页面 B（目标页面，位于不同的源）发送消息。如果页面 B 在一个 iframe 中，代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Source Page</title>
  </head>
  <body>
    <iframe
      id="frame"
      src="http://target-domain.com/target.html"
      width="500"
      height="300"
    ></iframe>

    <script>
      document.getElementById('frame').addEventListener('load', () => {
        // 获取iframe的contentWindow，即目标页面的window对象
        let targetWindow = this.contentWindow;

        // 使用postMessage发送消息，第一个参数是要发送的数据，第二个参数是目标源的URL
        targetWindow.postMessage(
          'Hello from source page!',
          'http://target-domain.com',
        );
      });
    </script>
  </body>
</html>
```

**接收方（目标页面）**

在页面 B（目标页面）中，需要设置一个事件监听器来接收 message 事件，从而获取到来自源页面的消息：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Target Page</title>
  </head>
  <body>
    <script>
      // 设置message事件监听器，当接收到消息时执行回调函数
      window.addEventListener(
        'message',
        (event) => {
          // 确保消息来源于预期的源，防止安全问题
          if (event.origin !== 'http://source-domain.com') return; // 检查发送方的源是否匹配

          // 处理接收到的消息
          console.log('Received message:', event.data);

          // 可以在这里根据需要对消息进行处理
        },
        false,
      );
    </script>
  </body>
</html>
```

**工作原理**

发送消息：源页面通过 postMessage 方法将消息发送给目标窗口。这个方法接受两个参数：消息内容和目标窗口的源（协议+域名+端口）。如果目标源设置为'\*'，则表示消息可以发送给任何源，但这通常不推荐，因为存在安全风险。

接收消息：目标页面需要注册一个针对 message 事件的监听器。当消息到达时，事件触发，事件对象包含了发送的消息内容以及发送方的源信息。接收方可以通过检查 event.origin 来验证消息来源，确保消息来自于可信的源。

总结
每种跨域解决方案都有其适用场景和局限性，开发者应根据实际需求选择最适合的方案。CORS 由于其灵活性和安全性，成为了现代 Web 开发中最常用的跨域解决方案。

<BackTop></BackTop>