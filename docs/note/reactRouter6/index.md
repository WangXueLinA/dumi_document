---
title: React Router v6
---

# React Router v6

## 安装

使用的包管理器来安装依赖

```js
// npm
npm install react-router-dom@6

// yarn
yarn add react-router-dom@6

```

在介绍 React Router 的概念以前，需要先区分两个概念：

- react-router：为 React 应用提供了路由的核心功能；
- react-router-dom：基于 react-router，加入了在浏览器运行环境下的一些功能。

## BrowserRouter

导入了 BrowserRouter 组件，然后使用该组件包裹了 App 组件

BrowserRouter 是最常用的路由方式，即浏览器路由。官方文档也建议将 BrowserRouter 组件用于 Web 应用程序。除了这种方式，React Router 还支持其他几种路由方式：

- HashRouter：在路径前加入#成为一个哈希值，Hash 模式的好处是不会因为刷新页面而找不到对应路径；
- MemoryRouter：不存储 history，路由过程保存在内存中，适用于 React Native 这种非浏览器环境；
- NativeRouter：配合 React Native 使用，多用于移动端；
- StaticRouter：主要用于服务端渲染时。

```js
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

## 路由原理

1. `<HashRouter>`，它基于 URL 的哈希部分（#）来模拟路由状态，当 window.location.hash 发生变化时，会触发 window.onhashchange 事件，React-Router 可以监听此事件并据此切换不同的路由组件。

```js
window.onhashchange = () => {
  console.log('监视到hash变化了');
};
```

2. `<BrowserRouter>`，它利用 HTML5 History API 来操作地址栏 URL，而无需刷新页面。通过 history.pushState()、history.replaceState() 方法可以直接修改浏览器的历史记录栈，并更新当前 URL，而不会导致页面刷新。同时，用户点击浏览器的前进/后退按钮或调用 history.go()、history.back()、history.forward() 时，会触发 window.onpopstate 事件，React-Router 通过监听这个事件来相应地切换路由。在 React-Router 中，需要对原生的 History API 进行封装或劫持，通过保存原生方法的引用，然后重写这些方法，在调用原生方法的同时执行额外的操作（例如触发路由更新等）。

```js
// 用户点击浏览器的前进/后退按钮或调用 history.go()、history.back()、history.forward() 时
window.addEventListener('popstate', () => {
  console.log('监视到popstate变化了');
});
```

```js
// react-router类似劫持 pushState
const rawPushState = window.history.pushState;
window.history.pushState = (...args) => {
  rawPushState.apply(window.history, args);
  console.log('监视到pushState变化了');
};

// react-router类似劫持 replaceState
const rawReplaceState = window.history.replaceState;
window.history.replaceState = (...args) => {
  rawReplaceState.apply(window.history, args);
  console.log('监视到replaceState变化了');
};
```

## NavLink

它是一个导航链接组件，类似于 HTML 中的`<a>`标签。NavLink 组件使用 to 来指定需要跳转的链接

```js
import { NavLink } from 'react-router-dom';
import './styles.css';

export default function App() {
  return (
    <nav>
      <NavLink to="">首页</NavLink>
      <NavLink to="product">产品</NavLink>
      <NavLink to="about">关于</NavLink>
    </nav>
  );
}
```

当点击“首页”时，就会跳转至路由 `/`,当点击“产品”时，就会跳转至路由 `/product`, 当点击“关于”时，就会跳转至路由 `/about`

NavLink 是存在 active 状态的，所以可以为 active 状态和非 active 状态的导航链接添加样式

```css
.nav-active {
  color: red;
  font-weight: bold;
}
```

接下来为导航链接添加样式判断条件，选择性的为其添加 nav-active 类

```js
import { NavLink } from 'react-router-dom';
import './styles.css';

export default function App() {
  return (
    <nav>
      <NavLink
        to=""
        className={({ isActive }) => (isActive ? 'nav-active' : void 0)}
      >
        首页
      </NavLink>
      <NavLink to="product">产品</NavLink>
      <NavLink to="about">关于</NavLink>
    </nav>
  );
}
```

## Link

在 react-router-dom 中，可以使用 Link 组件来创建常规链接。Link 组件与 NavLink 组件非常相似，唯一的区别就是 NavLink 存在 active 状态，而 Link 没有

```js
import { Link } from 'react-router-dom';
import './styles.css';

export default function Product() {
  return (
    <div className="product">
      <header>
        <Link to="/">返回首页</Link>
      </header>
    </div>
  );
}
```

如果需要对 Link 进行更多控制，也可以传递给 to 一个对象，在这个对象中，可以通过 search 属性来添加查询字符串或通过 hash 属性来传递 hash 值，

```js
<Link
  to={{
    pathname: '/settings',
    search: '?sort=date',
    hash: '#hash',
  }}
>
  设置
</Link>
```

点击“设置”时，路由就变成了：`/settings?sort=date#hash`

## Routes

我们需要在 Routes 组件中使用 Route 组件来定义所有路由。该组件接受两个 props：

- path：页面 URL 应导航到的路径，类似于 NavLink 组件的 to；
- element：页面导航到该路由时加载的元素。

```js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="product" element={<Product />} />
  <Route path="about" element={<About />} />
  <Route path="aboutUs" element={<Navigate to="about-us" />} />
  <Route path="*" element={<Error />} />
</Routes>
```

## 编程式导航

React Router 提供了两种不同的编程式导航方式：

- 声明式导航组件：`<Navigate>` 组件
- 命令式导航方法：`useNavigate` Hook

### Navigate

`<Navigate>`组件是一种声明式的导航方式。在 Navigate 组件中通过 `to` 来指定要跳转的路径

```js
import { Routes, Route, Navigate } from 'react-router-dom';
import Product from './Product';
import About from './About';
import Home from './Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="product" element={<Product />} />
      <Route path="about" element={<About />} />
      <Route path="aboutUs" element={<Navigate to="about-us" />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
```

### useNavigate

useNavigate Hook 是一种命令式导航方式，然后传递给它需要跳转的路由即可

```js
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  return <Form afterSubmit={() => navigate('/aaa')} />;
}
```

## 路由传递状态

在 react-router-dom 中可以通过以下三种方式来传递状态：

- 使用 Link 组件
- 使用 Navigate 组件
- 使用 useNavigate 钩子

### Link

使用 Link 组件通过 state 来将数据进行传递

```js
import React from 'react';
import { Link } from 'react-router-dom';
function Contact() {
  return (
    <Link to="/" state={'From About'}>
      返回
    </Link>
  );
}
export default Contact;
```

接收信息的页面中使用一个名为 useLocation 的钩子来获取数据：

```js
import { useLocation } from 'react-router-dom';

export default function Settings() {
  let location = useLocation();
  return (
    <div className="App">
      <p>{location.state}</p>
    </div>
  );
}
```

### Navigate

使用方式和 Link 组件类似，接收信息的页面同上。

```js
<Route path="/about" element={<Navigate to="/" state={'From About'} />} />
```

### useNavigate

navigate() 函数接受两个参数，第一个参数就是跳转的路径，第二个参数是包含状态的对象。接收信息的页面同上。

```js
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  return (
    <div>
      <Form afterSubmit={() => navigate('/', { state: 'From About' })} />
    </div>
  );
}
```

## 动态路由

动态路由只需要将 Route 组件的 path 声明为这样

```js
<Route path="/wiki/:keyword" element={<Wiki />} />
```

这时，无论是访问`/wiki/javascript` 还是`/wiki/react`，都会加载 Wiki 组件

如何在组件中访问 URL 中的动态部分呢？

从 v5.1 开始，React Router 就提供了一个 useParams Hook，它返回一个对象，该对象具有 URL 参数及其值之间的映射。使用方式如下

```js
import React from 'react';
import { useParams } from 'react-router';

function Wiki() {
  const { keyword } = useParams();

  return <div>{keyword}</div>;
}
```

这样，通过获取到的 URL 参数

## 嵌套路由

嵌套路由允许父路由充当包装器并控制子路由的渲染。比如，在应用中点击消息时，会跳转到 `/messages` 路由，并显示所有的通知列表。当点击某一条消息时，就会跳转到 `/messages/:id` 路由，这时就能看到指定 id 的消息详情，同时消息列表是显示在左侧的。这个场景就要依赖嵌套路由来实现。

```js
function App() {
  return (
    <Routes>
      <Route path="/messages" element={<Messages />} />
    </Routes>
  );
}
```

现在，我们希望 Messages 能够控制渲染子路由，那能不能直接在 Messages 组件中来定义子路由呢？就像这样

```js
import { Routes, Route } from 'react-router-dom';
import MessagesDetails from './MessagesDetails';

function Messages() {
  return (
    <Routes>
      <Route path=":id" element={<MessagesDetails />} />
    </Routes>
  );
}
```

现在，当用户导航到 `/messages` 时， React Router 会呈现 Messages 组件。Messages 组件中通过 Conversations 组件来显示消息列表，然后使用将 `/messages/:id` 映射到 Chat 组件的 Route 来渲染另一个 Routes。

<Alert message='这里不必在嵌套路由中包含完整的 `/messages/:id` 路径，因为 Routes 是很智能的，当省略了前导 /，就会认为这条路径是相对于父级 /messages 的。'></Alert>

如果只是将路径修改为 /messages/\*会怎样呢？

```js
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/messages/*" element={<Messages />} />
    </Routes>
  );
}
```

通过将 `/*` 附加到 /messages 路径的末尾，实际上是在告诉 React Router，Messages 有一个嵌套的 Routes 组件。并且父路径应该匹配 `/messages` 以及与 `/messages/*` 匹配的任何其他路由

当我们希望在子 Route 控制渲染嵌套路由时，这是有效的。但是如果我们希望在 App 组件包含创建嵌套路由所需的所有信息，而不是必须在 Messages 组件中定义呢？React Router 也是支持这种创建嵌套路由的方式

```js
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/messages" element={<Messages />}>
        <Route path=":id" element={<MessagesDetails />} />
      </Route>
    </Routes>
  );
}
```

这里以声明式的方式将子 Route 嵌套为父 Route 的子级。和上面一样，子路由是相对于父路由的，因此不需要包含父 (/messages) 路径。
现在，只需要告诉 React Router 应该在父路由（Messges）中的哪个位置渲染子路由（MessagesDetails）。这就就需要使用 React Router 的 Outlet 组件

```js
import { Outlet } from 'react-router-dom';
import Conversations from './Conversations';

function Messages() {
  return (
    <div>
      <Conversations />
      <Outlet />
    </div>
  );
}
```

如果应用的路由与嵌套 `Route` 的路径匹配，`Outlet` 组件就会渲染 Route 的元素。 根据上面的 Routes，如果在当前的路由是 `/messages`，`Outlet` 组件将渲染为 null；如果当前的路由是 `/messages/1`，`Outlet` 组件将渲染 `<MessagesDetails />` 组件

## 查询参数

在 React Router 中，如何从 URL 中获取参数呢？例如以下 URL

```bash
twitter.com/search?q=react&src=typed_query&f=live
```

从 v6 开始，React Router 使用 URLSearchParams API 来处理查询字符串，URLSearchParams 内置于所有浏览器（IE 除外）中，并提供了处理查询字符串的实用方法。当创建 URLSearchParams 实例时，需要向它传递一个查询字符串

```js
const queryString = '?q=react&src=typed_query&f=live';
const sp = new URLSearchParams(queryString);

sp.has('q'); // true
sp.get('q'); // react
sp.getAll('src'); // ["typed_query"]
sp.get('nope'); // null

sp.append('sort', 'ascending');
sp.toString(); // "?q=react&src=typed_query&f=live&sort=ascending"

sp.set('q', 'bytes.dev');
sp.toString(); // "?q=bytes.dev&src=typed_query&f=live&sort=ascending"

sp.delete('sort');
sp.toString(); // "?q=bytes.dev&src=typed_query&f=live"
```

React Router 提供了一个自定义的 useSearchParams Hook，它是基于 URLSearchParams 进行的封装。useSearchParams 返回一个数组，该数组第一个元素是 URLSearchParams 的实例，第二个元素是更新查询参数的一个方法。
对于上面的 URL，使用 useSearchParams 从查询字符串中获取值：

```js
import { useSearchParams } from 'react-router-dom'

const Results = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q')
  const src = searchParams.get('src')
  const f = searchParams.get('f')

  return (
    // ...
  )
}

```

如果需要更新查询字符串，可以使用 setSearchParams，向它传递一个对象，该对象的 `key/value` 对将作为 `&key=value` 添加到 url：

```js
const Results = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q')
  const src = searchParams.get('src')
  const f = searchParams.get('f')

  const updateOrder = (sort) => {
    setSearchParams({ sort })
  }

  return (
    ...
  )
}

```

## Route 配置

React Router v6 内置了一个 useRoutes Hook，它在功能上等同于 `<Routes>`，但它是使用 JavaScript 对象而不是 `<Route>` 元素来定义路由。这个对象具有与普通 `<Route>` 元素相同的属性，但它们不需要使用 JSX 来编写。

`useRoutes` 的返回值要么是一个有效的 React 元素（可以使用它来渲染路由树），如果没有匹配项，则返回 null

使用 `<Route>` 组件来定义路由将会是这样的

```js
export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/invoices" element={<Invoices />}>
          <Route path=":id" element={<Invoice />} />
          <Route path="pending" element={<Pending />} />
          <Route path="complete" element={<Complete />} />
        </Route>
      </Routes>
    </div>
  );
}
```

而 useRoutes 是利用 JavaScript 对象完成的，而不是使用 React 元素 (JSX) 来声明路由。定义形式如下

```js
import { useRoutes } from 'react-router-dom';
import Home from './Home';
import Invoices from './Invoices';
import Invoice from './Invoice';
import Pending from './Pending';
import Complete from './Complete';
import Navbar from './Navbar';

const routes = useRoutes([
  { path: '/', element: <Home /> },
  {
    path: '/invoices',
    element: <Invoices />,
    children: [
      { path: ':id', element: <Invoice /> },
      { path: '/pending', element: <Pending /> },
      { path: '/complete', element: <Complete /> },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <Navbar />
      {routes}
    </div>
  );
}
```

<BackTop></BackTop>