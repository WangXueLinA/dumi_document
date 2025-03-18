---
toc: content
title: http
order: -95
---

# nodejs

## http

### Content-Type 类型

| Content-Type 类型                   | 格式                                | 请求头场景                           | 响应头场景                                      |
| ----------------------------------- | ----------------------------------- | ------------------------------------ | ----------------------------------------------- |
| `text/plain`                        | `text/plain`                        | 发送纯文本数据（如简单表单或日志）   | 返回纯文本内容（如 API 的简单响应）             |
| `text/html`                         | `text/html`                         | 较少使用（通常客户端不发送 HTML）    | 返回 HTML 页面（服务端渲染或静态 HTML）         |
| `application/json`                  | `application/json`                  | 发送 JSON 格式数据（如 API 请求）    | 返回 JSON 格式数据（如 RESTful API 响应）       |
| `application/x-www-form-urlencoded` | `application/x-www-form-urlencoded` | 普通表单提交（无文件上传）           | 较少使用（服务端通常返回其他格式）              |
| `multipart/form-data`               | `multipart/form-data; boundary=...` | 表单含文件上传或复杂数据             | 较少使用（服务端通常返回其他格式）              |
| `application/xml` / `text/xml`      | `application/xml` 或 `text/xml`     | 发送 XML 格式数据（如传统 API 请求） | 返回 XML 格式数据（如 SOAP 接口或传统系统交互） |
| `application/octet-stream`          | `application/octet-stream`          | 上传任意二进制文件（如原始字节流）   | 返回二进制文件（如文件下载或流媒体）            |
| `image/png` / `image/jpeg`          | `image/png` 或 `image/jpeg`         | 上传图片（较少见，多用于表单）       | 返回图片资源（如静态图片或动态生成的图像）      |
| `application/javascript`            | `application/javascript`            | 上传 JS 脚本（罕见）                 | 返回 JavaScript 文件（如静态资源或动态脚本）    |
| `text/css`                          | `text/css`                          | 上传 CSS 文件（罕见）                | 返回 CSS 样式表（如静态资源）                   |
| `application/pdf`                   | `application/pdf`                   | 上传 PDF 文件（少见）                | 返回 PDF 文件（如文档下载）                     |

### 基础服务器

创建一个简单的 HTTP 服务器，监听请求并返回“Hello World”

```js
const http = require('http');

// 创建服务器实例
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

// 监听3000端口
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

运行代码后，浏览器访问 http://localhost:3000，页面显示“Hello World”

### 处理不同路由和请求方法

根据请求的 URL 和 Method 返回不同响应。

```js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // 处理不同路由
  if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } else if (path === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Page</h1>');
  } else if (req.method === 'GET' && path === '/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data response' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

测试方法：

- 访问 /、/about、/data 查看不同响应。
- 其他路径返回 404。

### 处理 POST 请求及请求体数据

接收 POST 请求并解析 JSON 格式的请求体。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/submit') {
    let body = [];
    req
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        try {
          const data = JSON.parse(body);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'success', data }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('POST handler server running on port 3000');
});
```

测试方法：

使用 Postman 或 curl 发送 POST 请求到 `http://localhost:3000/submit`，Body 为 JSON 数据：

```json
{ "name": "John", "age": 30 }
```

### 发送 GET 请求

```js
const http = require('http');

http
  .get('http://jsonplaceholder.typicode.com/posts/1', (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('GET Response:', JSON.parse(data));
    });
  })
  .on('error', (err) => {
    console.error('GET Error:', err);
  });
```

### 发送 POST 请求

```js
const http = require('http');

const postData = JSON.stringify({ title: 'foo', body: 'bar', userId: 1 });

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length,
  },
};

const req = http.request(options, (res) => {
  let response = '';
  res.on('data', (chunk) => (response += chunk));
  res.on('end', () => {
    console.log('POST Response:', JSON.parse(response));
  });
});

req.on('error', (err) => {
  console.error('POST Error:', err);
});

req.write(postData);
req.end();
```

<BackTop></BackTop>