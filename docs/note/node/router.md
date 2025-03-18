---
toc: content
title: 路由
---

# nodejs

## node 原生路由

```js
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  const method = req.method;

  // 基础路由
  if (method === 'GET') {
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Home</h1>');
    } else if (pathname === '/user') {
      const name = query.name || 'Anonymous';
      res.end(`Hello, ${name}`);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  }

  // POST 请求处理
  else if (method === 'POST' && pathname === '/submit') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: body }));
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/html' });
    res.end('<h1>Method Not Allowed</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Express 框架路由

核心简化点

- 内置路由系统：直接通过 app.get()/app.post() 定义
- 中间件支持：自动解析请求体、静态文件等
- 模块化路由：通过 express.Router() 实现

```js
const express = require('express');
const app = express();

// 中间件：解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 基础路由
app.get('/', (req, res) => {
  res.send('<h1>Home</h1>');
});

// 带查询参数的路由
app.get('/user', (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.send(`Hello, ${name}`);
});

// 动态路由参数
app.get('/user/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

// POST 请求处理
app.post('/submit', (req, res) => {
  res.json({ received: req.body });
});

// 404 处理
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

app.listen(3000, () => {
  console.log('Express server running on http://localhost:3000');
});
```

## Koa 框架路由

核心简化点

- 洋葱模型中间件：基于 async/await 的中间件流程控制
- 轻量级设计：需配合 koa-router 和 koa-bodyparser
- 更现代的异步处理：无回调地狱

```js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// 中间件：解析请求体
app.use(bodyParser());

// 基础路由
router.get('/', (ctx) => {
  ctx.body = '<h1>Home</h1>';
});

// 带查询参数的路由
router.get('/user', (ctx) => {
  const name = ctx.query.name || 'Anonymous';
  ctx.body = `Hello, ${name}`;
});

// 动态路由参数
router.get('/user/:id', (ctx) => {
  ctx.body = `User ID: ${ctx.params.id}`;
});

// POST 请求处理
router.post('/submit', (ctx) => {
  ctx.body = { received: ctx.request.body };
});

// 注册路由
app.use(router.routes());
app.use(router.allowedMethods());

// 404 处理
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = 'Custom 404 Page';
});

app.listen(3000, () => {
  console.log('Koa server running on http://localhost:3000');
});
```

<BackTop></BackTop>