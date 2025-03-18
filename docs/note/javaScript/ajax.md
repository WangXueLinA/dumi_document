---
toc: content
title: ajax/axios/fetch
---

# javascript

## Ajax

即异步的 JavaScript 和 XML，是一种创建交互式网页应用的网页开发技术，可以在不重新加载整个网页的情况下，与服务器交换数据，并且更新部分网页。最大优势，<span style='color: red'>无刷新获取页面</span>

Ajax 的原理简单来说通过 XmlHttpRequest 对象来向服务器发异步请求，从服务器获得数据，然后用 JavaScript 来操作 DOM 而更新页面

流程图如下

<ImagePreview src="/images/js/image10.jpg"></ImagePreview>

优点：

1. 可以无需刷新页面与服务器端进行通信
2. 允许你根据用户事件来更新部分页面内容（如 onClick...）

缺点：

1. 没有浏览历史，不能后退
2. 存在跨域问题（同源）
3. SEO 不友好

### 过程

实现 Ajax 异步交互需要服务器逻辑进行配合，需要完成以下步骤：

- 创建 Ajax 的核心对象 XMLHttpRequest 对象
- 通过 XMLHttpRequest 对象的 open() 方法与服务端建立连接
- 构建请求所需的数据内容，并通过 XMLHttpRequest 对象的 send() 方法发送给服务器端
- 通过 XMLHttpRequest 对象提供的 onreadystatechange 事件监听服务器端你的通信状态
- 接受并处理服务端向客户端响应的数据结果
- 将处理结果更新到 HTML 页面中

### 创建 XMLHttpRequest 对象

通过 XMLHttpRequest() 构造函数用于初始化一个 XMLHttpRequest 实例对象

```js
const xhr = new XMLHttpRequest();
```

### 与服务器建立连接

通过 XMLHttpRequest 对象的 open() 方法与服务器建立连接

```js
xhr.open(method, url, async);
```

参数说明：

- method：表示当前的请求方式，常见的有 GET、POST
- url：服务端地址
- async：布尔值，表示是否异步执行操作，默认为 true

如：

```js
xhr.open('POST', '/try/Ajax/demo_post2.php', true);
```

### 给服务端发送数据

通过 XMLHttpRequest 对象的 send() 方法，将客户端页面的数据发送给服务端

```js
xhr.send([body]);
```

body: 在 XHR 请求中要发送的数据体，如果不传递数据则为 null，如果使用 GET 请求发送数据的时候：

<Alert>

- 将请求数据添加到 open()方法中的 url 地址中
- 发送请求数据中的 send()方法中参数设置为 null

</Alert>

如 post 请求：

```js
xhr.send('fname=Henry&lname=Ford');
```

### 绑定 onreadystatechange 事件

onreadystatechange 事件用于监听服务器端的通信状态，主要监听的属性为 XMLHttpRequest.readyState

关于 XMLHttpRequest.readyState 属性有五个状态，如下图显示

<ImagePreview src="/images/js/image11.jpg"></ImagePreview>

只要 readyState 属性值一变化，就会触发一次 readystatechange 事件

XMLHttpRequest.responseText 属性用于接收服务器端的响应结果

### 封装

```js

//封装一个ajax请求
function ajax(options) {
    //创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest()


    //初始化参数的内容
    options = options || {}
    options.type = (options.type || 'GET').toUpperCase()
    options.dataType = options.dataType || 'json'
    const params = options.data

    //发送请求
    if (options.type === 'GET') {
        xhr.open('GET', options.url + '?' + params, true)
        xhr.send(null)
    } else if (options.type === 'POST') {
        xhr.open('POST', options.url, true)
        xhr.send(params)

    //接收请求
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let status = xhr.status
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML)
            } else {
                options.fail && options.fail(status)
            }
        }
    }
    xhr.abort() //用于停止正在进行的请求
}
```

使用方法如下：

```js
ajax({
  type: 'post',
  dataType: 'json',
  data: {},
  url: 'https://xxxx',
  success: function (text, xml) {
    //请求成功后的回调函数
    console.log(text);
  },
  fail: function (status) {
    ////请求失败后的回调函数
    console.log(status);
  },
});
```

## Axios 与 Fetch 区别

Axios 和 Fetch 都是用于在 JavaScript 中发送 HTTP 请求的工具，但它们在设计、用法、特性和兼容性方面存在一些关键差异：

1. 设计与实现
   - Axios 是一个基于 Promise 的第三方库，专为浏览器和 Node.js 环境设计。它提供了简单、直观的 API，易于发送 GET、POST、PUT 等各种类型的 HTTP 请求，并且内置了许多高级特性，如拦截请求和响应、自动转换请求和响应数据、取消请求等。
   - Fetch 是一个原生的 JavaScript Web API，它是 W3C 的标准，无需额外安装，直接在现代浏览器中可用。Fetch 也是基于 Promise 的，但它的设计更加底层，提供了更原始的 HTTP 请求能力，这意味着开发者需要手动处理更多细节，如设置请求头、处理响应等。
2. 语法与用法

- Axios 提供了一个基于 Promise 的、更简洁和直观的 API。它允许你直接通过函数调用发送 GET、POST、PUT 等请求，并且可以方便地在配置对象中设置请求头、请求体、超时等选项。Axios 的设计使得错误处理更为直接，因为它会自动抛出错误，包括网络错误和 HTTP 错误状态。

如 GET 请求:

```js
import axios from 'axios';

axios
  .get('https://api.example.com/data')
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
```

- Fetch 是浏览器的原生 API，使用时可能需要更复杂的操作，比如手动处理请求头、JSON 数据解析等。Fetch 也是基于 Promise，但在处理响应时不会自动将 JSON 转换为 JavaScript 对象，你需要手动调用 response.json() 或其他方法来处理响应体。Fetch 的灵活性较高，但也意味着需要编写更多的代码来处理各种情况。

  如 GET 请求:

```js
fetch('https://api.example.com/data')
  .then((response) => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
```

1. 兼容性
   - Axios 提供了更好的跨环境兼容性，既可在浏览器中使用，也可在 Node.js 环境下运行，而且对旧浏览器的支持通过垫片等方式更容易解决。
   - Fetch 是现代浏览器的标准功能，但在一些较旧的浏览器（特别是 IE11 及以下版本）中可能不被支持，需要引入 polyfill（如 whatwg-fetch）来增加支持。
2. 功能特性：

- 拦截器：
  Axios 支持请求和响应的拦截器，允许在请求发送前或响应到达应用前进行统一处理，如添加认证信息、处理错误等。
- 超时处理：
  Axios 直接提供 timeout 配置来设定请求超时时间，而 Fetch 需要借助 AbortController 来实现类似功能。
- 错误处理：Axios 在遇到网络错误或 HTTP 错误状态码时会自动抛出错误，便于错误处理。Fetch 则需要检查 response.ok 属性或捕获 promise 的拒绝状态来处理错误。
- 数据处理：Axios 默认处理 JSON 数据，自动将响应转换为 JavaScript 对象，而 Fetch 返回的是一个 Response 对象，需要调用 .json() 方法进一步处理。

总结：
尽管 Fetch 是原生的、标准的 API，提供了一些底层的灵活性，但 Axios 因其易用性、丰富的功能集（如拦截器、超时、自动转换）以及更好的跨环境兼容性，常被视为更友好、更高效的选项，特别是在需要快速开发和维护大型项目时。然而，如果项目对体积有严格要求，或者希望充分利用现代浏览器的最新特性，Fetch 也是一个值得考虑的选择。

<BackTop></BackTop>