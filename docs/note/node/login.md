---
toc: content
title: 登录鉴权
---

# nodejs

## cookie 跟 session 登录

核心流程

- 客户端登录：发送用户名密码到服务端
- 创建 Session：服务端验证成功后创建会话记录
- 设置 Cookie：将 Session ID 通过 Cookie 返回客户端
- 后续验证：客户端自动携带 Cookie，服务端通过 Session ID 验证身份

### 原生 node

```js
const http = require('http');
const crypto = require('crypto');
const url = require('url');

// 内存存储 Session（生产环境建议用 Redis）
const sessions = new Map();
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// 生成随机 Session ID
function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url, true);

  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // 登录路由
  if (pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      const user = users.find(
        (u) => u.username === username && u.password === password,
      );

      if (user) {
        // 创建 Session
        const sessionId = generateSessionId();
        sessions.set(sessionId, { userId: user.id });

        // 设置 Cookie
        res.setHeader('Set-Cookie', [
          `sessionId=${sessionId}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
        ]);
        res.end(JSON.stringify({ success: true }));
      } else {
        res.statusCode = 401;
        res.end('Unauthorized');
      }
    });
  }

  // 受保护路由
  else if (pathname === '/profile') {
    // 解析 Cookie
    const cookies =
      req.headers.cookie?.split('; ').reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        acc[key] = value;
        return acc;
      }, {}) || {};

    const sessionId = cookies.sessionId;
    if (!sessionId || !sessions.has(sessionId)) {
      res.statusCode = 401;
      return res.end('Unauthorized');
    }

    const session = sessions.get(sessionId);
    res.end(JSON.stringify({ userId: session.userId }));
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

### Express 实现

```js
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// 中间件配置
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict',
    },
  }),
);

// 登录路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    req.session.userId = user.id; // 自动设置 Session
    res.json({ success: true });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// 鉴权中间件
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) return res.sendStatus(401);
  next();
};

// 受保护路由
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ userId: req.session.userId });
});

// 注销路由
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.sendStatus(500);
    res.clearCookie('connect.sid'); // 清除默认 Cookie
    res.sendStatus(200);
  });
});

app.listen(3000, () => console.log('Express server running on port 3000'));
```

### Koa 实现

```js
const Koa = require('koa');
const Router = require('@koa/router');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// Session 配置
app.keys = ['your-secret-key']; // 签名密钥
const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  httpOnly: true,
  sameSite: 'strict',
};
app.use(session(CONFIG, app));
app.use(bodyParser());

// 登录路由
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    ctx.session.userId = user.id; // 设置 Session
    ctx.body = { success: true };
  } else {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
  }
});

// 鉴权中间件
const authMiddleware = async (ctx, next) => {
  if (!ctx.session.userId) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }
  await next();
};

// 受保护路由
router.get('/profile', authMiddleware, async (ctx) => {
  ctx.body = { userId: ctx.session.userId };
});

// 注销路由
router.post('/logout', async (ctx) => {
  ctx.session = null;
  ctx.body = { success: true };
});

app.use(router.routes());
app.listen(3000, () => console.log('Koa server running on port 3000'));
```

## JWT 鉴权机制

核心流程如下：

- 用户登录：客户端发送凭证（用户名/密码）到服务器
- 生成 Token：服务器验证凭证后生成 JWT 返回给客户端
- 存储 Token：客户端存储 Token（通常存 localStorage 或 cookie）
- 验证 Token：后续请求携带 Token，服务器验证有效性

### 原生 Node.js

```js
const http = require('http');
const url = require('url');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key';
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url, true);

  // 处理 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');

  // 登录路由
  if (pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      const user = users.find(
        (u) => u.username === username && u.password === password,
      );

      if (user) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
          expiresIn: '1h',
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token }));
      } else {
        res.writeHead(401);
        res.end('Unauthorized');
      }
    });
  }

  // 受保护路由
  else if (pathname === '/protected') {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.writeHead(401);
      return res.end('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ data: 'Protected Data', userId: decoded.userId }),
      );
    } catch (err) {
      res.writeHead(403);
      res.end('Invalid Token');
    }
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));
```

### Express 实现

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const SECRET_KEY = 'your-secret-key';
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// 中间件
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization');
  next();
});

// 登录路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
  } else {
    res.status(401).send('Unauthorized');
  }
});

// 鉴权中间件
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

// 受保护路由
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ data: 'Protected Data', userId: req.user.userId });
});

app.listen(3000, () => console.log('Express server running on port 3000'));
```

### Koa 实现

```js
const Koa = require('koa');
const Router = require('@koa/router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const SECRET_KEY = 'your-secret-key';
const users = [{ id: 1, username: 'admin', password: 'admin' }];

// 中间件
app.use(bodyParser());
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Authorization');
  await next();
});

// 登录路由
router.post('/login', async (ctx) => {
  const { username, password } = ctx.request.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: '1h',
    });
    ctx.body = { token };
  } else {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
  }
});

// 鉴权中间件
const authMiddleware = async (ctx, next) => {
  const authHeader = ctx.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 403;
    ctx.body = 'Invalid Token';
  }
};

// 受保护路由
router.get('/protected', authMiddleware, async (ctx) => {
  ctx.body = {
    data: 'Protected Data',
    userId: ctx.state.user.userId,
  };
});

app.use(router.routes());
app.listen(3000, () => console.log('Koa server running on port 3000'));
```

<BackTop></BackTop>