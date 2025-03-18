---
toc: content
title: 登录鉴权
---

# 登录鉴权

项目 demo：https://github.com/WangXueLinA/login-authentication

HTTP 是无状态的协议（对于事务处理没有记忆能力，每次客户端和服务端会话完成时，服务端不会保存任何会话信息）：每个请求都是完全独立的，服务端无法确认当前访问者的身份信息，无法分辨上一次的请求发送者和这一次的发送者是不是同一个人

这就让我们保存用户的身份信息成了一个问题。比方说我这个浏览器登录成功之后，服务器要给我一个响应是吧？你登录成功了，那为了避免以后再请求的时候，我又不知道他是谁了。所以当我在响应的时候，我再给他响应了一个东西，这个东西能够代表他的身份。如果说我直接把他的身份信息，比方说用户的 ID 或者是用户的账号直接给他响应过去。

<ImagePreview src="/images/http/image13.jpg"></ImagePreview>

这样做肯定是不合适的，因为服务器那边是无法信任这个信息的。因为这个信息存在，客户端是极容易被伪造的。无论你是存在哪儿，存在 cookie 里面，cookie 可以改，存在 localStorage, localStorage 也可以返还，它都是可以更改的。

## 前端 cookie + 后端 session 库

### session 库

Session（会话） 是服务器端用来跟踪用户状态的技术。由于 HTTP 协议是无状态的（每个请求独立），Session 通过在服务器存储用户数据（如登录状态、购物车信息），并为每个用户分配唯一标识符（Session ID），使得服务器能识别同一用户的多次请求。

<ImagePreview src="/images/other/image2.jpg"></ImagePreview>

典型的 session 登陆/验证流程：

- 浏览器登录发送账号密码，服务端查用户库，校验用户
- 服务端把用户登录状态存为 Session，生成一个 sessionId
- 通过登录接口返回，把 sessionId set 到 cookie 上
- 此后浏览器再请求业务接口，sessionId 随 cookie 带上
- 服务端查 sessionId 校验 session
- 成功后正常做业务处理，返回结果

<ImagePreview src="/images/other/image4.jpg"></ImagePreview>

### Cookie

Cookie 是网站存储在用户浏览器中的小型文本数据（通常小于 4KB），用于跟踪用户状态、记录用户行为或保存个性化设置。通过 Cookie，服务器可以识别用户的身份或历史操作，从而提供个性化服务（如自动登录、购物车记录等）。

Cookie 的组成参数
每个 Cookie 包含多个参数，通过 HTTP 响应头的 Set-Cookie 字段设置。

| 参数       | 说明                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name=value | 键值对，设置 Cookie 的名称及相对应的值，都必须是字符串类型。<br/>如果值为 Unicode 字符，需要为字符编码。<br/>如果值为二进制数据，则需要使用 BASE64 编码。                                                                                                     |
| domain     | 指定 cookie 所属域名，默认是当前域名                                                                                                                                                                                                                          |
| path       | 指定 cookie 在哪个路径（路由）下生效，默认是 '/'。<br/>如果设置为 /abc，则只有 /abc 下的路由可以访问到该 cookie，如：/abc/read。                                                                                                                              |
| maxAge     | cookie 失效的时间，单位秒。<br/>如果为整数，则该 cookie 在 maxAge 秒后失效。<br/>如果为负数，该 cookie 为临时 cookie,关闭浏览器即失效，浏览器也不会以任何形式保存 cookie 。<br/>如果为 0，表示删除该 cookie 。默认为 -1。<br/> `60 * 60 * 24 * 365`（即一年） |
| expires    | 过期时间，在设置的某个时间点后该 cookie 就会失效。<br/>一般浏览器的 cookie 都是默认储存的，当关闭浏览器结束这个会话的时候，这个 cookie 也就会被删除                                                                                                           |
| secure     | 该 cookie 是否仅被使用安全协议传输。<br/>安全协议有 HTTPS，SSL 等，在网络上传输数据之前先将数据加密。<br/>默认为 false。当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。                                                                  |
| httpOnly   | 如果给某个 cookie 设置了 httpOnly 属性，则无法通过 JS 脚本 读取到该 cookie 的信息，但还是能通过 Application 中手动修改 cookie，所以只是在一定程度上可以防止 XSS 攻击，不是绝对的安全                                                                          |

Cookie 的特点

- cookie 保存在浏览器本地，只要不过期关闭浏览器也会存在。
- 正常情况下 cookie 不加密，用户可轻松看到
- 用户可以删除或者禁用 cookie
- cookie 可以被篡改
- cookie 可用于攻击
- cookie 存储量很小，大小一般是 4k
- 发送请求自动带上登录信息

### 代码展示

前端代码几乎不会管 cookie 的，顶多后端需要再取

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <div>用户名:<input id="username" /></div>
      <div>密码:<input type="password" id="password" /></div>
      <div><button id="loginpost">登录</button></div>
    </div>

    <script>
      const ologinpost = document.querySelector('#loginpost');
      const username = document.querySelector('#username');
      const password = document.querySelector('#password');

      ologinpost.onclick = () => {
        fetch(`/login`, {
          method: 'POST',
          body: `username=${username.value}&password=${password.value}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((res) => res.json())
          .then(({ code, message }) => {
            if (code === 200) {
              location.href = '/home';
              alert(`${message}`);
            } else {
              alert(`${message}`);
            }
          });
      };
    </script>
  </body>
</html>
```

后端 koa 代码

```js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal'); //每个用户生成唯一 Session ID进行加密
const router = require('./routes');
app.use(bodyParser()); //获取post参数

//session 配置
app.use(
  session({
    key: 'sessionId', // 这个key将来回自动存在浏览器的cookie标识
    cookie: {
      maxAge: 10 * 1000, // 60s后过期
    },
  }),
);

// 登录接口，验证登录名密码
router.post('/', (ctx) => {
  const { username, password } = ctx.request.body;
  if (username === 'xuelin' && password === '1125') {
    // 设置 sessionId名，后端随意写，给自己做逻辑判断用，
    // 为了后端自己以后识别sessionId是否失效
    ctx.session.user = {
      username: 'xuelin',
    };
    ctx.body = {
      code: 200,
      message: '登录成功',
    };
  } else {
    ctx.body = {
      code: 301,
      message: '用户名密码不匹配，登录失败',
    };
  }
});

// session判断拦截，
app.use(async (cxt, next) => {
  if (cxt.url.includes('login')) {
    await next();
    return;
  }
  // 上面设置的 sessionId如果没失效，继续运行现在的逻辑代码
  // 如果自己设置的sessionId找不到，就重定向登录页面
  if (cxt.session.user) {
    await next();
  } else {
    cxt.redirect('/login');
  }
});

// 退出登录时候将浏览器的cookie删除掉
router.put('/', (ctx) => {
  ctx.cookies.set('sessionId', '', { maxAge: 0 });
  ctx.body = {
    code: 200,
    message: '退出成功',
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => console.log('服务监听在3000端口'));
```

前端也可以通过 js-cookie 库来对 cookie 进行保护，可以直接删除 cookie 或者拿到 cookie 值

<Player src='/mp4/session.mp4'></Player>

### 优势

1. 省事：

- 浏览器自动带着 Cookie 后端直接读 Session，不用每个请求都手动传账号密码。

例子：用户登录后，点其他页面不用再输密码，直接进。

2. 开发简单：

- 后端框架（如 Express、Django）自带 Session 功能，配个 Redis 就能用，不用自己造轮子。

3. 灵活控制：

- 服务端随时能踢人下线（删 Session），适合需要强制退出的场景。

例子：用户改密码后，所有设备自动退出。

4. 兼容性强：

- 老项目、老浏览器都能用，不像新方案（如 JWT）可能兼容出问题。

### 劣势

1. 安全问题多：

- Cookie 被偷：如果没锁好（没开 HttpOnly），黑客用 JS 就能偷走你的 SessionID。

→ 例子：点了恶意链接，账号就被盗。

- 跨站攻击（CSRF）：恶意网站冒充你操作，浏览器自动带上 Cookie，后端以为是本人。

→ 例子：你在论坛看帖，暗地里被转账。

- 数据被偷看：如果不用 HTTPS，Cookie 在传输中像明信片，谁都能看。

2. 扩展性差：

- 存储压力大：用户多了，所有 Session 存在 Redis 里，Redis 一挂，全站没法登录。

→ 例子：抢购活动时，登录系统崩了。

- 集群麻烦：服务器多了，Session 要同步，否则 A 服务器存的 Session，B 服务器不认识。

→ 例子：用户刷新页面后，被分配到另一台服务器，提示重新登录。

3. 移动端不友好：

- App 和微信小程序对 Cookie 支持差，得手动处理，不如 Token（如 JWT）直接塞 Header 方便。

→ 例子：App 登录后，每次请求要手动带 Session ID。

4. 跨域头疼：

- 前端域名和后端不同时，Cookie 可能带不过去，要折腾 CORS 配置。一般会把 sessionId 跟在 url 参数后面即重写 url，所以 session 不一定非得需要靠 cookie 实现

→ 例子：前端用 vue.dev，后端用 api.dev，登录状态丢了。

5. 浪费资源：

- 每个用户登录后，后端都要存一份 Session 数据，用户量大了内存/Redis 开销大。

→ 例子：10 万用户在线，Redis 内存撑不住。

### 什么情况还能用？

- 内部系统：人少、不对外，图省事（比如公司内部的管理后台）。
- 传统网站：纯服务端渲染（比如 JSP、PHP 老项目），不用分离前后端。
- 短期活动页：临时活动，用户量不大，用完即弃。

### 什么时候赶紧换方案？

- App/小程序：用 Token（JWT）。
- 高并发网站：用无状态的 JWT 或 OAuth。
- 跨国分布式系统：别让 Session 拖累全球节点。

## jwt

JWT 是一种开放标准，用于在网络应用间安全地传输信息。它以 JSON 对象的形式存储数据，并通过数字签名（如 HMAC 或 RSA）确保信息的完整性和可信性。JWT 通常用于身份认证和授权。

<ImagePreview src="/images/http/image14.jpg"></ImagePreview>

### 格式

JWT 的原理是，服务器认证以后，生成一个 JSON 对象，发回给用户，就像下面这样。

```bash
{
  "姓名": "张三",
  "角色": "管理员",
  "到期时间": "2018年7月1日0点0分"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上签名

JWT 的结构由三部分组成，用 . 分隔：

```bash
Header  -->   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
Payload -->  eyJzdWIiOiIxMjM0IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
Signature  -->  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

<ImagePreview src="/images/http/image15.jpg"></ImagePreview>

客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。

此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息 Authorization 字段里面。

`Authorization: Bearer <token>`

另一种做法是，跨域的时候，JWT 就放在 POST 请求的数据体里面。

<ImagePreview src="/images/other/image3.jpg"></ImagePreview>

### 代码展示

前端代码，登录页面响应器里去存 token 值，其他页面拦截器里拿本地存储的 token 塞到请求的头 header 信息 Authorization 字段里面，响应器里拿响应头 headers 的 Authorization 重新更新本地 token 值，如果反正 401 状态码清除本地存储的 token

```html
<!-- 登录页面 -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
      //拦截器，
      axios.interceptors.request.use(
        function (config) {
          // console.log("请求发出前，执行的方法")
          return config;
        },
        function (error) {
          return Promise.reject(error);
        },
      );

      axios.interceptors.response.use(
        function (response) {
          const { authorization } = response.headers;
          authorization && localStorage.setItem('token', authorization);
          return response;
        },
        function (error) {
          return Promise.reject(error);
        },
      );

      // 其他页面如详情页的拦截器

      // axios.interceptors.request.use(function (config) {
      //   const token = localStorage.getItem("token")
      //   config.headers.Authorization = `Bearer ${token}`
      //   return config;
      // }, function (error) {
      //   return Promise.reject(error);
      // });

      // axios.interceptors.response.use(function (response) {
      //   // console.log("请求成功后 ，第一个调用的方法")
      //   const {
      //     authorization
      //   } = response.headers
      //   authorization && localStorage.setItem("token", authorization)
      //   return response;
      // }, function (error) {
      //   // console.log(error.response.status)
      //   if (error.response.status === 401) {
      //     localStorage.removeItem("token")
      //     location.href = "/login"
      //   }
      //   return Promise.reject(error);
      // });
    </script>
  </head>

  <body>
    <h1>token登录页面</h1>
    <div>
      <div>用户名:<input id="username" /></div>
      <div>密码:<input type="password" id="password" /></div>
      <div><button id="login">登录</button></div>
    </div>

    <script>
      var username = document.querySelector('#username');
      var password = document.querySelector('#password');
      var login = document.querySelector('#login');

      login.onclick = () => {
        axios
          .post('/login', {
            username: username.value,
            password: password.value,
          })
          .then((res) => {
            if (res.data.code === 200) {
              //存储token
              location.href = '/';
            } else {
              alert('用户名密码不匹配');
            }
          });
      };
    </script>
  </body>
</html>
```

后端代码

```js
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const jwt = require('jsonwebtoken');

app.use(bodyParser()); //获取post参数

// 设置一个密钥
const secret = 'xuelin-anydata';
const JWT = {
  // value，待生成token的对象
  // expires 过期时间
  generate(value, expires) {
    return jwt.sign(value, secret, { expiresIn: expires });
  },
  verify(token) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return false;
    }
  },
};

// token 判断拦截
app.use(async (ctx, next) => {
  if (ctx.url.includes('login')) {
    await next();
    return;
  }
  const token = ctx.headers['authorization']?.split(' ')[1];
  // 请求头里有token
  if (token) {
    const payload = JWT.verify(token);
    if (payload) {
      // 重新计算过期时间
      const newToken = JWT.generate(
        {
          _id: payload._id,
          username: payload.username,
        },
        '5s',
      );
      ctx.set('Authorization', newToken);
      await next();
    } else {
      // 401
      ctx.status = 401;
      ctx.body = { errCode: -1, errInfo: 'token过期' };
    }
  } else {
    await next();
  }
});

// 登录接口
router.post('/', (ctx) => {
  const { username, password } = ctx.request.body;
  if (username === 'xuelin' && password === '1125') {
    //设置header
    const token = JWT.generate(
      {
        _id: '111',
        username: 'xuelin',
      },
      '5s',
    );

    // token返回在header
    ctx.set('Authorization', token);
    ctx.body = {
      code: 200,
      message: '登录成功',
    };
  } else {
    ctx.body = {
      code: 403,
      message: '用户名密码不匹配，登录失败',
    };
  }
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => console.log('服务端口3000启动成功'));
```

<Player src='/mp4/token.mp4'></Player>

### 优势

1. 无状态

服务器不用记“谁登录了”，Token 里自带用户信息。适合多个服务器协同工作（比如微服务），谁拿到 Token 都能直接验

2. 跨域友好，随便传！

可以放在 URL、请求头、甚至随便一个地方传，不像 Cookie 有跨域限制。适合前后端分离、手机 App、不同域名服务。

3. 防伪造，安全！

Token 自带签名（比如用密码或公私钥），篡改立刻被发现。

<Alert message='内容默认是明文（能看到用户 ID 等），想加密得额外操作。'></Alert>

4. 灵活

Token 里可以塞自定义数据（比如用户角色、权限），用的时候直接读，不用反复查数据库。

5. 适合现代应用！

手机 App、单页网页（如 React/Vue）存 Token 更方便，不需要依赖 Cookie。

### 劣势

1. Token 发出去就收不回！

一旦发出去，在过期前一直有效。想强行让某个 Token 失效（比如用户改密码），得额外搞“黑名单”或“短有效期+自动续期”，麻烦！

2. 被盗用就完蛋！

如果 Token 被偷（比如网络拦截、本地泄露），攻击者可以冒充用户。必须用 HTTPS 传输，存 Token 要防 XSS 攻击（别放容易被 JS 读的地方）。

3. 可能变“胖”影响速度！

往 Token 里塞太多数据（比如用户全部信息），每次请求都要带这个大 Token，浪费流量，尤其手机端要注意。

4. 续期麻烦！

怎么让用户无感知地续期？常见方案是：快过期时发个新 Token，或者拆成“短期 Token + 长期 Refresh Token”，但复杂度增加。

### 适合场景 vs 不适合场景

1. 适合用 JWT：

- 高并发、多服务器协作的系统（如电商、社交平台）。
- 前后端分离、跨域 API、手机 App。
- 需要快速读取用户基本信息的场景（比如直接读 Token 里的用户角色）。

2. 不适合用 JWT：

- 需要严格实时控制用户权限（比如立刻踢人下线）。
- 敏感信息多，必须每次查数据库确认最新状态。
- 嫌处理 Token 续期、黑名单麻烦的小项目。

## 单点登录 SSO

因为有些公司，他的产品现在很多，比方说有一家公司他搞了一个小游戏，又搞了一个商城两套系统，他可能还有更多的系统，他不可能为了每一套系统单独去做一套用户管理，反正都是属于这家公司的，他们的用户是双通的。淘宝上的用户可以在天猫上无缝使用。这个时候他就会把用户系统抽离出来，形成一个认证中心，用户要登录，要注册登录到这个认证中心来，包括修改一些用户的基本信息，也在这个认证中心，他是专门来管理用户的。

这样子一来，用户对自身信息的所有操作都在同一个点这叫单点登录，这个单点登录要实现这个单点登录，其实有模式有很多，没有什么非常固定的模式。这些模式里边有些是标准模式，像什么 CAS，像什么 OAuth2, 也有一些是非标准的。就是每个公司自己搞一套。不过这些模式最终应用到技术层面的话，大部分都是两种做法，一种是 session + cookie ，一种是 token 这种模式。

### session+cookie

<ImagePreview src="/images/http/image16.jpg"></ImagePreview>

首先用户要去认证中心登录，把账号密码传过去，传过去过后，认证中心会判断这个账号密码是否正确。如果说是正确， 它里边会有一个表格叫做 session 表格（可以想象成表格），里面记录的是键值对，这个表格里边每一个键，它是有生成的一个唯一 ID 的。它的值就是用户的身份信息。一旦用户登录成功了，他就会往这个表格里边记录一条，把这个用户的身份信息记录进去，这个身份信息里边也包含了用户的唯一 ID, 还有他的账号，他的名字等等等等。只要这个 session 表格里边有这条记录，就说明这个用户是登录成功的。反之，只要这个表格里边没有这条记录，说明这个用户是没有登录的，或者是登录已经过期了。因为这个表格，它每一条记录它有一个时效过了，这个时效它就可以干掉了。

至于这个表格它是保存有可能是保存在数据库的，也有可能是保存在内存。只要他发现用户登录成功了，他就会往表格里边生成这么一条信息。他会用 cookie，把这个信息里边的那个 SID, 就是唯一的 ID 给用户带过去。浏览器里面就会保存那个 SID。将来去访问子系统的时候，它会把这个 cookie，这个 SID 给他带过去，发给让子系统来判定一下他到底有没有登录。但是子系统他判定不了，子系统没有这些表格。所以子系统会把这个 SID 又发给认证中心。然后这个时候认证中心就会去查，查到了，就说明已经登录了，就会告诉这个子系统，这个用户是已经完成登录的，是有权限的，甚至会把这个用户的信息也告诉子系统。子系统可以自己处理。子系统看到他有登录了。于是，就把那些需要登录过后才能访问的资源就发给了这个用户。这基本的模式对于子系统 A 是如此，对于子系统 B 也是如此。

这种模式一个好处就在于认证中心具有非常强的控制力。比方说某一个地区的用户或者是某一些用户出现了一些违规操作，违规不能让他登录了。非常简单，我啥也不用做，我都不用去通知用户，我直接从这个表格里把它干掉就完事儿了。下一次用户把 SID 带给子系统，子系统把这个 SID 带给认证中心，认证中心一查也没有，没有这个身份，因此就会通知子系统。他是无效的，于是子系统就会告诉用户，你去重新登录。那如果说再加上一些黑名单控制登录，登录都登录不了了。所以说很多用户量很大的那种大厂，特别是一些公共互联网的产品，还要保持对用户的绝对控制。因此他会选择使用这种模式。

但是这种模式它的一个劣势就在于它会烧钱，影响到一些用户量比较大的应用。它可能同时在线几百万人，甚至像一些短视频平台？做了很大的，它同时还可能达到几千万的甚至上亿。然后认证中心的压力是不是特别大，各种子系统都不断的去发给他那些 SID 进行判断。而且这个表格也是变得非常大。还要考虑到这个认证中心一旦挂掉了，所有的系统全部要完蛋。

### jwt 的 token

<ImagePreview src="/images/http/image17.jpg"></ImagePreview>

token 模式下边认证中心的压力瞬间减小，基本上没啥压力。你玩你的，我玩我的。不过它的功能还是一样，就是我还是要承担那个用户登录的注册的一些功能。然后我们看一下这个 token 模式下它是如何来运作的。

用户去登录。登录完了过后，认证中心判断它登录是不是成功了，它不再像什么服务器的这个表格里面去记录任何东西了，就生成一个不能被篡改的字符串作为一个 token 发给用户。

那么这个 token 的格式一般来说是 JWT，这个 token 发给用户之后，用户就给他存起来，你可以存 cookie 里或者 localStorage 里都行。接下来认证中心就完全不管了，用户去访问那些子系统的时候，他就会把这个 token 给他带过去，子系统拿到这个 token 过后，他不会询问认证中心，自己就可以认证了，这是可以做到的，比如子系统跟认证中心之间交换一个密钥啥的，这个密钥是相通的，子系统拿到这个密钥之后他就可以自己去认证这个 token 是不是之前认证中心颁发的，是不是伪造的，一旦他自己认证成功，他就会把资源就发给用户。

可以看出子系统不再去频繁的去认证中心询问任何东西。因为可以自己认证，因为它的好处是显而易见的，就是它成本非常低，对这个东西的要求也不高，它不需要存太多东西，至少没有 session 那个表格了，并且那些子系统也基本上没有向认证中心发出任何请求。所以说 token 模式是一种分布式的模式。

他的劣势也是非常明显，就是认证中心失去了对用户的控制。比方说有一天我希望坤坤下线，你会发现这事儿就变得非常麻烦了。因为认证中心没有存任何东西的，他最多说说不让坤坤登录了，但是坤坤手里面那个 token, 他仍然是可以向子系统发送请求的那你就不得不去通知每一个子系统。让他不能登录了，他的 token 必须要认证不通过，那两个子系统还稍微好一点。如果说是十几个二十几个子系统的话，那就非常麻烦。然后同步这个信息变得非常困难，就是用户的控制力在减弱。

### 双 token 模式

<ImagePreview src="/images/http/image18.jpg"></ImagePreview>

基于上面的劣势，于是就搞出来这么一个综合的模式，就是双 token 模式，一个是普通的 token，一个是刷新 token，用户还是一样向认证中心去登录。登录完成之后，认证中心会给他颁发两个 token。一个是所有子系统都能够自己的认识的 token。另一个是只有认证中心才认识的 token，要刷新的，两个 token 都要存起来。

- Access Token：短期有效，用于接口鉴权
- Refresh Token：长期有效，专门用于获取新 Access Token

但是第一个 token，时间非常短，比如说 10 分钟，20 分钟，第二个 token 时间要长一点，比如说一个月 1 周都是有可能的。然后用户在请求子系统的时候，带的是那个短 token，子系统自行去验证，没问题的话就给他资源。但是由于这个 token 时间很短，可以看旁边的图，就会导致了用户这个 token 很快就失效了。失效过后怎么办呢？

用户那边不是还保存了一个刷新 token，那就用这个刷新 token 去访问认证中心。因为只有认证中心才认识这个刷新 token，认证中心看刷新 token 没问题，我就给你颁发一个新的 token，你后边再用这个新的 token 去请求子系统，然后让子系统自行验证。这种模式它的意义在于就是要让用户每隔一小段时间来一次，来一次的作用是什么作用？就是我方便控制。

比方说坤坤做了一些违规操作，我虽然没办法让他立即下线，但是他过一会还得来，等他来的时候，我就不给你换新 token 了，在认证中心进行统一的控制，其他子系统是完全无感的，它就是为了增加这个控制力，这就是双 token 的意义。

### 无感刷新 token

是上面双 token 模式下如何在用户无感知的情况下自动刷新即将过期的访问令牌（如 JWT）去换新 token，避免因令牌过期导致用户需要重新登录。

核心流程

```bash
发起请求 → 检查Token有效期 → 有效 → 正常请求
               ↓ 无效/后端返401
              触发刷新 → 获取新Token → 重试原请求
               ↓ 其他请求等待
              队列机制保序执行
```

双 Token 存储管理

```js
// 建议存储方案
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// 安全存储（根据安全等级选择）
localStorage.setItem(ACCESS_TOKEN_KEY, 'xxx'); // 存localStorage 或 sessionStorage
document.cookie = `${REFRESH_TOKEN_KEY}=xxx; HttpOnly; Secure`; // 后端设置更安全
```

请求拦截示例

```js
let isRefreshing = false; // 刷新锁定状态
let requestsQueue = []; // 请求等待队列

// 请求拦截器：自动注入Token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理401情况
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // 非401错误或已重试过的请求直接抛出
    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    // 加入队列等待刷新后重试
    if (isRefreshing) {
      return new Promise((resolve) => {
        requestsQueue.push(() => resolve(axios(config)));
      });
    }

    // 标记刷新状态
    isRefreshing = true;
    config._retry = true;

    try {
      // 刷新Token
      const { access_token, refresh_token } = await refreshToken();

      // 更新存储
      localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
      setRefreshTokenCookie(refresh_token); // 示例方法

      // 重试所有等待请求
      requestsQueue.forEach((cb) => cb());
      requestsQueue = [];

      // 重试当前请求
      return axios(config);
    } catch (refreshError) {
      // 刷新失败：跳转登录页等
      logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
```

<BackTop></BackTop>