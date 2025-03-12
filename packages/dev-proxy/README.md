# 本地开发环境 浏览器中代理映射配置

维护人： xuelin

## 功能

本地开发环境中，浏览器中可以直接配置代理连接后端，不用在本地项目中修改配置然后重启项目，<span style="color: red">节省一对多后端联调时间以及不必要重启项目等待时间。</span>

![avatar](./docs/demo.gif)

## 思路

```bash
+-------------------------------+
|       前端配置模块              |
|  +--------------------------+ |
|  | 用户界面层 (React组件)     | |
|  | - 环境设置弹窗            | |
|  | - 输入控件交互处理         | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | 配置管理核心              | |
|  | - 合并默认配置            | |
|  | - 处理localStorage读写    | |
|  | - Cookie管理(acbb)       | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | 配置持久化层              | |
|  | - localStorage存储       | |
|  +--------------------------+ |
+-------------------------------+
               |
               v
+-------------------------------+
|       请求拦截层               |
|  +--------------------------+ |
|  | XHR拦截器                 | |
|  | - 重写XMLHttpRequest.send | |
|  | - 注入DEV_REQUEST_INFO头  | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | Fetch拦截器               | |
|  | - 重写window.fetch        | |
|  | - 处理Headers合并         | |
|  +--------------------------+ |
+-------------------------------+
               |
               v
+-------------------------------+
|     Webpack中间件代理系统       |
|  +--------------------------+ |
|  | 请求处理入口              | |
|  | - 解析DEV_REQUEST_INFO头  | |
|  | - 配置版本比对            | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | 动态代理工厂              | |
|  | - 路径匹配策略           | |
|  | - 代理规则动态生成        | |
|  | - 代理缓存管理           | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | 网络适配层                | |
|  | - IP地址智能转换          | |
|  | - 本地/远程环境判断       | |
|  +------------+-------------+ |
|               |               |
|  +------------v-------------+ |
|  | 安全处理层                | |
|  | - Cookie安全属性移除      | |
|  | - 响应头修改策略          | |
|  +--------------------------+ |
+-------------------------------+
```

### 劫持请求

主要功能：组件在初始化时，会劫持 XMLHttpRequest 和 fetch，在请求头中添加 DEV_REQUEST_INFO，这个头信息包含了代理配置的 JSON 字符串。

```js
import { Modal } from 'antd';
import cookies from 'js-cookie';
import React from 'react';
import ReactDOM from 'react-dom';
import proxyConfig from './proxyConfig';

// 本地存储使用的key
const DEV_REQUEST_INFO = `DEV_REQUEST_INFO`;
// 默认配置对象（使用导入的proxyConfig初始化）
let defaultConfig = proxyConfig;
let acbb = cookies.get('acbb') || '';

// 定义Dev组件
class Dev extends React.Component<any, { visible: boolean }> {
  constructor(props: any) {
    super(props);
    // 初始化状态，控制模态框显示
    this.state = { visible: false };

    if (Object.keys(props.options || {})?.length) {
      defaultConfig = props.options;
    }

    try {
      // 尝试从本地存储读取配置
      const local = JSON.parse(localStorage.getItem(DEV_REQUEST_INFO) as any);
      if (local) {
        defaultConfig = local; // 合并本地存储的配置
      }
    } catch (error) {} // 忽略解析错误

    this.init(); // 初始化请求拦截
  }

  // 初始化请求拦截方法
  init() {
    // 保存原始XMLHttpRequest.send方法
    const _send = window.XMLHttpRequest.prototype.send;
    // 保存原始fetch方法
    const _fetch = window.fetch;

    // 生成请求头信息（替换模板变量）
    const requestInfo = JSON.stringify(defaultConfig)
      .replace(/\${baseUrl}/g, defaultConfig.baseUrl)
      .replace(/\${prefix}/g, defaultConfig.prefix)
      .replace(/\${port}/g, defaultConfig.port);

    // 重写XMLHttpRequest的send方法
    window.XMLHttpRequest.prototype.send = function send(...args) {
      // 添加自定义请求头
      this.setRequestHeader('DEV_REQUEST_INFO', requestInfo);
      // 调用原始send方法
      _send.apply(this, args);
    };

    // 重写fetch方法
    const defaultOptions = { headers: {} };
    window.fetch = function fetch(url, options = defaultOptions) {
      // 添加自定义请求头并调用原始fetch
      return _fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          DEV_REQUEST_INFO: requestInfo, // 注入配置信息
        },
      });
    };
  }

  // 确认按钮处理
  handleOk = () => {
    const { proxy, baseUrl, prefix, port } = defaultConfig;
    try {
      // 保存配置到本地存储
      localStorage.setItem(
        DEV_REQUEST_INFO,
        JSON.stringify({
          baseUrl,
          prefix,
          port,
          // 处理proxy字段的格式（支持字符串或对象）
          proxy: typeof proxy === 'string' ? JSON.parse(proxy) : proxy,
        }),
      );
      // 保存acbb到cookie
      cookies.set('acbb', acbb);
      // 关闭模态框
      this.handleCancel();
      // 清除sessionStorage
      sessionStorage.clear();
      // 刷新页面应用新配置
      window.location.reload();
    } catch (error) {
      console.log('error: ', error);
      return alert('无效的json格式'); // JSON解析错误提示
    }
  };

  // 取消按钮处理
  handleCancel = () => {
    this.setState({ visible: false });
  };

  // 显示模态框
  handleShow = () => {
    this.setState({ visible: true });
  };

  render() {
    return (
      <>
        {/* 环境配置模态框 */}
        <Modal
          prefixCls={this.props.prefixCls ? `${this.props.prefixCls}-modal` : undefined}
          title="环境设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          width="800px"
          onCancel={this.handleCancel}
          maskClosable={false}
        >
          {/* 配置输入区域 */}
          <div className="DEV_REQUEST_INFO">
            <div>baseUrl: </div>
            <input
              defaultValue={defaultConfig.baseUrl}
              onChange={(e) => { defaultConfig.baseUrl = e.target.value }}
            />
            <div>port: </div>
            <input
              defaultValue={defaultConfig.port}
              onChange={(e) => { defaultConfig.port = e.target.value }}
            />
            <div>prefix: </div>
            <input
              defaultValue={defaultConfig.prefix}
              onChange={(e) => { defaultConfig.prefix = e.target.value }}
            />
            <div>acbb: </div>
            <input
              defaultValue={acbb}
              onChange={(e) => { acbb = e.target.value }}
            />
            <div>代理映射 </div>
            {/* 代理配置的JSON编辑区域 */}
            <textarea
              defaultValue={JSON.stringify(defaultConfig.proxy || '', null, 2)}
              rows={10}
              onChange={(e) => { defaultConfig.proxy = e.target.value as any }}
            />
          </div>
        </Modal>
        {/* 触发按钮（固定在页面右下角） */}
        <div id="DEV_REQUEST_INFO" onClick={this.handleShow}>
          DEV
        </div>
      </>
    );
  }
}

// 导出的配置函数
const proxyFun = (options: any, prefixCls?: string) => {
  // 创建容器元素
  const dev = document.createElement('div');
  // 渲染Dev组件到DOM
  ReactDOM.render(<Dev options={options} prefixCls={prefixCls} />, dev);
  // 将容器添加到页面body
  document.body.appendChild(dev);
};

export default proxyFun;
```

### http-proxy-middleware

webpack-dev-server 的热更新的代理功能直接依赖于 http-proxy-middleware。在 webpack 的配置文件中，devServer.proxy 的选项与 http-proxy-middleware 的配置完全兼容。

主要功能就是：获取请求头'DEV_REQUEST_INFO'信息，跟之前的请求头进行比较，然后动态注入代理规则，无需重启服务即可调整代理行为

```js
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      // 匹配以 /api 开头的请求
      '/api': {
        target: 'http://backend-server:3000', // 目标服务器
        changeOrigin: true, // 修改请求头中的 Host 为目标服务器的域名
        pathRewrite: { '^/api': '' }, // 重写路径（移除 /api 前缀）
        secure: false, // 忽略 HTTPS 证书验证（用于测试环境）
      },
    },
  },
};
```

这与直接使用 http-proxy-middleware 的配置方式完全一致：

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://backend-server:3000',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    secure: false,
  }),
);
```

知道这一点，webpack5 提供了一个 setupMiddlewares 函数让我们可以执行自定义函数和应用自定义中间件的能力

```js
// webpack.config.js
const before = require('@xuelin/dev-proxy/before');
module.exports = {
  devServer: {
    port: 3001, // 端口号
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    // 自定义中间件
    setupMiddlewares(_, devServer) {
      before(devServer.app);
      return _;
    },
  },
};
```

具体自定义中间实现

```js
// before.js

const proxyFn = require('http-proxy-middleware'); // 用于创建代理中间件
const os = require('os'); // 用于获取操作系统相关信息（如网络接口）

// 获取当前系统的所有网络接口信息对象，返回结构如{eth0: [{...}], lo: [{...}]}
const interfaces = os.networkInterfaces();
// 提取所有网络接口的IP地址列表：
// 1. Object.values(interfaces) 获取所有接口的配置数组组成的数组，如[[{eth0配置}, ...], [{lo配置}, ...]]
// 2. .flat() 将二维数组扁平化为一维数组，得到所有接口配置对象
// 3. .map((obj) => obj.address) 提取每个配置对象的address属性（IP地址）
const localIps = Object.values(interfaces)
  .flat()
  .map((obj) => obj.address);

// 添加IPv6格式的本地回环地址（::ffff:127.0.0.1对应IPv4的127.0.0.1）
localIps.push('::ffff:127.0.0.1');

// 处理不同版本的http-proxy-middleware库：
// - 新版（1.0+）将createProxyMiddleware作为导出对象的属性
// - 旧版（0.x）直接导出函数
// 这里优先使用新版的createProxyMiddleware，否则回退到旧版导出对象
const createProxyMiddleware = proxyFn.createProxyMiddleware || proxyFn;

// 创建缓存Map，用于存储已生成的代理中间件实例（键为代理路径+目标地址）
const map = new Map();

// 定义处理代理响应的方法（主要用于处理Set-Cookie头）
const onProxyRes = (proxyRes) => {
  // 从响应头中获取Set-Cookie头（可能存在多个cookie，所以是数组）
  const cookies = proxyRes.headers['set-cookie'];
  if (cookies) {
    // 遍历所有cookie，移除Secure和HttpOnly标记（开发环境可能需要禁用这些安全属性）
    // secure: 忽略 HTTPS 证书验证（用于测试环境）
    // HttpOnly: 移除，允许前端JavaScript访问Cookie，方便调试
    proxyRes.headers['set-cookie'] = cookies.map(
      (cookie) => cookie.replace('Secure', '').replace('HttpOnly', ''), // 替换为空字符串
    );
  }
};

// 创建中间件工厂函数，返回实际可用的中间件函数
const createMiddleware = () => {
  // 存储当前的代理配置信息（闭包变量，保证多次请求间共享）
  let _requestInfo = {
    baseUrl: '', // 基础路径（用于缓存清理判断）
    proxy: {}, // 代理配置对象，格式如{'/api': {target: 'http://localhost:3000'}}
  };

  // 返回实际的中间件函数（处理每个请求）
  return (req, res, next) => {
    // 从请求头中获取开发时自定义的代理配置信息（由前端工具或开发服务器注入）
    let requestInfo = req.get('DEV_REQUEST_INFO');
    let info = _requestInfo; // 默认使用上次的配置

    try {
      if (requestInfo) {
        // 尝试解析请求头中的JSON配置（可能动态更新代理配置）
        info = JSON.parse(requestInfo);
        _requestInfo = info; // 更新闭包变量中的配置
      }
    } catch (error) {
      // 解析失败时保持现有配置
      info = _requestInfo;
    }

    // 如果配置中的baseUrl发生变化，清空缓存（确保代理配置完全更新）
    if (info && map.get('baseUrl') !== info.baseUrl) {
      map.clear();
      map.set('baseUrl', info.baseUrl); // 存储新的baseUrl作为缓存标识
    }

    // 处理代理逻辑（当存在代理配置时）
    if (info && info.proxy) {
      // 匹配当前请求URL最长的代理路径：
      // 1. 获取所有代理路径（如['/api', '/static']）
      // 2. 过滤出当前请求URL开头的路径
      // 3. 按路径长度降序排序，优先匹配更长的路径（更精确的匹配）
      const [url] = Object.keys(info.proxy)
        .filter((url) => req.url.startsWith(url))
        .sort((x, y) => y.length - x.length);

      // 未找到匹配的代理路径，继续后续中间件处理
      if (!url) {
        return next();
      }

      // 处理代理目标地址中的本地主机名（动态替换为客户端IP或保持localhost）
      if (info.proxy[url].target) {
        info.proxy[url].target = info.proxy[url].target.replace(
          // 匹配localhost、127.0.0.1或0.0.0.0
          /(localhost|127\.0\.0\.1|0\.0\.0\.0)/,
          // 如果客户端IP在本地IP列表中，使用localhost，否则使用客户端IP
          localIps.includes(req.ip) ? 'localhost' : req.ip,
        );
      }

      // 防止循环代理：如果代理目标包含当前请求的host，跳过代理
      if (info.proxy[url].target.includes(req.headers.host)) {
        return next();
      }

      // 生成缓存键（代理路径+目标地址）
      const key = url + info.proxy[url].target;
      // 从缓存获取已创建的中间件实例
      let middleware = map.get(key);

      // 缓存未命中时创建新的代理中间件
      if (!middleware) {
        // 配置代理选项
        if (typeof info.proxy[url] === 'object') {
          // 重写cookie域名（开发环境可能需要移除域名限制）
          info.proxy[url].cookieDomainRewrite = {
            '*': '', // 所有域名替换为空，使cookie对当前域有效
          };
          // 挂载代理响应处理函数（处理Set-Cookie）
          info.proxy[url].onProxyRes = onProxyRes;
        }
        // 创建代理中间件实例
        middleware = createProxyMiddleware(info.proxy[url]);
        // 存入缓存
        map.set(key, middleware);
      }

      // 输出代理日志（请求路径 => 目标地址）
      console.log('[代理]: ', req.url, ' ==>', info.proxy[url].target);
      // 执行代理中间件处理当前请求
      return middleware(req, res, next);
    }

    // 无代理配置时继续后续中间件
    next();
  };
};

// 导出默认中间件实例（直接调用工厂函数创建）
module.exports = createMiddleware();

// 同时导出工厂函数，允许外部创建多个中间件实例
module.exports.createMiddleware = createMiddleware;
```

核心功能

1. 动态代理配置

- 通过请求头 DEV_REQUEST_INFO 动态注入代理规则，无需重启服务即可调整代理行为。
- 支持多路径代理配置，按最长路径匹配规则处理请求。

2. 本地网络适配

自动识别本地 IP 地址，替换代理目标中的本地主机名，便于局域网设备访问开发环境服务。

3. 开发友好性优化

- 移除响应 Cookie 的 Secure 和 HttpOnly 属性，解决开发环境 HTTPS 缺失导致的 Cookie 问题。
- 使用 cookieDomainRewrite 消除域名限制，简化跨域调试。

4. 性能优化

缓存代理中间件实例，避免重复创建相同配置的中间件，提升请求处理效率。

## 组件总结

主要功能是提供一个模态框，让用户设置代理配置，比如 baseUrl、port、prefix、acbb 和代理映射。当用户保存配置时，这些信息会被存储在 localStorage 和 cookie 中，然后页面会刷新。此外，组件在初始化时，会劫持 XMLHttpRequest 和 fetch，在请求头中添加 DEV_REQUEST_INFO，这个头信息包含了代理配置的 JSON 字符串。

中间件的作用是根据存在本地的 localStorage 请求头中的 DEV_REQUEST_INFO 来动态创建代理。中间件会解析请求头中的配置信息，生成对应的代理中间件，将请求转发到指定的目标地址。中间件还处理了 cookie 的替换，确保跨域时可以正确传递。同时，中间件会缓存已经创建过的代理实例，避免重复创建，提高效率。

## 安装

```sh
npm i @xuelin/dev-proxy
or
yarn add @xuelin/dev-proxy
```

## 用法

```js
//webpack devserve
const before = require('@xuelin/dev-proxy/lib/before');
const middleware = require('@xuelin/dev-proxy/lib/middlewares');

// umi
{
  devServer: {
    beforeMiddlewares:[middleware]
  }
}

// webpack 4
{
  devServer: {
    before
  }
}
// webpack 5

{
  devServer: {
    setupMiddlewares(_, devServer) {
      before(devServer.app);
    },
  }
}

// proxyConfig.js
export default {
  baseUrl: 'https://192.168.31.143',
  prefix: '/catalog-mng',
  port: '8443',
  proxy: {
    '/api': {
      target: '${baseUrl}:${port}',
      changeOrigin: true,
      secure: false,
    },
    '/mng': {
      changeOrigin: true,
      secure: false,
      target: '${baseUrl}:${port}',
    },
    '/catalog-mng/mng': {
      changeOrigin: true,
      secure: false,
      target: '${baseUrl}:${port}',
      pathRewrite: { '^/catalog-mng/mng': '${prefix}/mng' },
    },
  },
}

// 入口文件
import proxyConfig from '../proxyConfig';

if (process.env.NODE_ENV === 'development') {
    require('@xuelin/dev-proxy').default(proxyConfig);
}
```

[代理配置使用说明](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)
