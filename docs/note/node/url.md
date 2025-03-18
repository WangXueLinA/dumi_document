---
toc: content
title: url
order: -96
---

# nodejs

## url

url 模块用于解析和操作 URL 字符串，帮助你提取 URL 的各个组成部分（如协议、主机名、路径、查询参数等）

### 解析 URL

```js
const { URL } = require('url');

// 解析 URL
const myUrl = new URL(
  'https://www.example.com:8080/path/page?name=John&age=30#section',
);

// 提取各部分
console.log('协议:', myUrl.protocol); // https:
console.log('主机名:', myUrl.hostname); // www.example.com
console.log('端口:', myUrl.port); // 8080
console.log('路径:', myUrl.pathname); // /path/page
console.log('查询参数:', myUrl.search); // ?name=John&age=30
console.log('哈希:', myUrl.hash); // #section

// 直接获取查询参数
const params = myUrl.searchParams;
console.log('name:', params.get('name')); // John
console.log('age:', params.get('age')); // 30
```

### 构建 URL 对象并生成字符串

```js
const { URL } = require('url');

// 创建 URL 对象
const myUrl = new URL('https://www.example.com');
myUrl.pathname = '/api/v1/users';
myUrl.searchParams.set('role', 'admin');
myUrl.searchParams.set('country', 'us');

console.log('生成的 URL:', myUrl.href);
// 输出: https://www.example.com/api/v1/users?role=admin&country=us
```

### 拼接相对路径

```js
const url = require('url');

// 拼接基础 URL 和相对路径
const fullUrl = url.resolve('https://www.example.com/blog/', '/2023/post.html');
console.log(fullUrl); // https://www.example.com/2023/post.html

const relativeUrl = url.resolve(
  'https://www.example.com/blog',
  '2023/post.html',
);
console.log(relativeUrl); // https://www.example.com/blog/2023/post.html
```

<BackTop></BackTop>