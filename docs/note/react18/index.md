---
title: React v18
---

# React 18 新特性、新 Api 并发渲染机制

## Render API

React18 完全向下兼容 React17，官方完全没有对 React17 做出任何的一部分的删减

React18 已经放弃对 IE 11 的支持，有兼容 IE 的需求需要继续使用 React 17。

React18 引入了一个新的 root Api 支持 new concurrent renderer（并发模式）

### React18 前

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const root = document.getElementById('root')!;

ReactDOM.render(<App />, root);
```

### React18

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
```

### Demo 演示

<https://codepen.io/wangxuelina/pen/jOvpeVq>

React 18 提供了两个根 API，

ReactDOM.render：“遗留”模式运行的 root，其工作方式与 React 17 完全相同。使用此 API 会有一个警告，表明它已被弃用并切换到 New Root API。它仅仅给予了一个警告，并且在整个 18 版本中都为可用兼容状态，并保持着 React 17 版本的特性

ReactDOM.createRoot：这将创建一个在 React 18 中运行的 root，它添加了 React 18 的所有改进并允许使用并发功能。

<ImagePreview src="/images/react18/image1.png"></ImagePreview>

## 服务端渲染

hydrateRoot

如果的应用使用带注水的服务端渲染，请升级 hydrate 到 hydrateRoot

```js
const root = hydrateRoot(container, <App tab="home" />);
// 这里无需执行 root.render
```

在此版本中，也改进了 react-dom/serverAPI 以完全支持服务器上的 Suspense 和流式 SSR。作为这些更改的一部分，将弃用旧的 Node 流式 API，它不支持服务器上的增量 Suspense 流式传输。

- renderToNodeStream => renderToPipeableStream
- 新增 renderToReadableStream 以支持 Deno
- 继续使用 renderToString (对 Suspense 支持有限)
- 继续使用 renderToStaticMarkup (对 Suspense 支持有限)

## 并发模式

对于并发模式并不是第一次听说，在 react16 的时候就已经开始铺路，react17 出现的试验性的并发模式，react18 正式发布。

举个通俗的例子来讲就是：

- 你吃饭吃到一半，电话来了，你一直到吃完了以后才去接，这就说明你不支持并发也不支持并行。
- 你吃饭吃到一半，电话来了，你停了下来接了电话，接完后继续吃饭，这说明你支持并发。
- 你吃饭吃到一半，电话来了，你一边打电话一边吃饭，这说明你支持并行。

并发的关键是具备处理多个任务的能力，但不是在同一时刻处理，而是交替处理多个任务。比如吃饭到一半，开始打电话，打电话到一半发现信号不好挂断了，继续吃饭，又来电话了...但是每次只会处理一个任务。

**Concurrent Mode（并发模式） 本身并不是一个功能，而是一个底层设计**

### React15

react15 版本为了对比新老 dom，diff 算法底层架构中用的是堆栈 diff 这种算法，不可中断式的递归更新方式

当 React 触发更新时

按照时间轴串联的方式，state1 更新完了，才能轮到 state2 更新，state2 更新完了，state3 才能更新

在每个更新过程中不可中断同步更新，如 state1 开始触发更新，然后创建虚拟 dom 节点，然后基于虚拟 dom 对比完了，才开始创建真实 dom 渲染，不可能说打断虚拟 dom 这个过程的这一个情况的

<ImagePreview src="/images/react18/image2.png"></ImagePreview>

### React16

react16 出现了 fiber 这个概念，取代了之前 15 这种堆栈式协调器这种模式。react16 就是可中断式更新机制

目前主流浏览器提供了 requestIdleCallback API，支持在空闲期内调用空闲期回调，执行一些任务。与之相对的，高优先级任务由 requestAnimationFrame API 执行，如动画等。利用任务优先级高低，分别调度执行函数，这样就可以解决 React15 的交互卡顿问题。

js 在执行单线程时候，最上面先执行我们的宏任务，然后再执行微任务，微任务清空后，requestAnimationFrame 是在浏览器执行重排重绘，渲染完的前一刻执行，所以把动画等都在 requestAnimationFrame 调用就会渲染在这一帧中，性能能比较好，如果这个一帧执行完还剩余一点时间，这时候 requestIdleCallback 就会被执行，所以在 requestIdleCallback 中执行一些轻量的任务，react fiber 正是为了 requestIdleCallback 兼容性，react 自己基于原生的 requestIdleCallback 写了一个兼容的方法

所以它就把咋们的创建虚拟 dom，渲染分散成无数个分片任务，如果有高优先级任务，就先执行高优先级任务，如果没有，就执行咱们的分片任务

<ImagePreview src="/images/react18/image3.png"></ImagePreview>

fiber 分两个阶段

协调阶段：这块可以找出那些需要更新的，这个阶段是可以被打断的，可以分高优先级跟低优先级

提交阶段：不允许打断

<ImagePreview src="/images/react18/image4.png"></ImagePreview>

所以为啥 react16 中删除了 componentWillMount，componentWillReceiveProps，componentWillUpdate 这几个生命周期，有几个新的生命周期的出现，因为有些老的生命周期可能会多次执行，低优先级任务被打断了，高优先级执行完之后重新再执行低优先级任务，可能这时候就会再走一次生命周期

演示 15 跟 16 的区别

<https://claudiopro.github.io/react-fiber-vs-stack-demo/>

### React17

试运行并发模式

### React18

<ImagePreview src="/images/react18/image5.png"></ImagePreview>

## 自动批处理更新 State

React18 默认开启批处理来实现性能提升

### React 18 前

我们只在 React 事件处理函数 中进行批处理更新。默认情况下，在 promise、setTimeout、原生事件处理函数中、或任何其它事件内的更新都不会进行批处理：

1.React 事件处理函数

<https://codepen.io/wangxuelina/pen/GRvwboO>

2.setTimeout 跟 async 跟 await

<https://codepen.io/wangxuelina/pen/NWLYzQB>

3.原生 js 事件

<https://codepen.io/wangxuelina/pen/XWPYbgY>

### react18 后

所有的更新都将自动批处理

<https://codepen.io/wangxuelina/pen/OJoEVQR>

<Alert message='以下例子还会在 React 18 中执行两次 render'></Alert>

<https://codepen.io/wangxuelina/pen/QWVxbBq>

### 总结

在 React18 前

在正常的 React 事件流里

setState 跟 useState 函数都是异步执行的，不会立即更新 state 结果

多次执行 setState 跟 useState 函数，组件只会重新渲染一遍

setTimeout 等异步中或者原生事件中

setState 和 useState 函数都是同步执行，立即重新渲染组件

多次执行 setState 和 useState 函数，每一次都会执行调用一下 render

在 React18 后

任何情况都会自动执行批处理，多次更新始终合并为一次

## flushSync

批处理是一个破坏性改动，如果你想退出批量更新，你可以使用 flushSync

### Demo

<https://codepen.io/wangxuelina/pen/PodaPom>

### 注意

flushSync 函数内部的多个 setState 仍然为批量更新，这样可以精准控制哪些不需要的批量更新。

flushSync 会对性能产生很大影响。尽量少用。

## Transition

Transition 本质上解决了渲染并发的问题，在 React 18 关于 startTransition 描述的时候，多次提到 ‘大屏幕’ 的情况，这里的大屏幕并不是单纯指的是尺寸，而是一种数据量大，DOM 元素节点多的场景，比如数据可视化大屏情况，在这一场景下，一次更新带来的变化可能是巨大的，所以频繁的更新，执行 js 事务频繁调用，浏览器要执行大量的渲染工作，所以给用户感觉就是卡顿。

react 更新状态可以分两种

- 紧急更新：比如打字，点击，拖动需要立即响应的行为，如果不立即响应会给你很卡的感觉
- 过渡更新：将 ui 从一个视图过渡到另外一个视图，有些延迟，不立即响应还是可以接受的

**并发模式只是提供可中断的能力，默认情况下，所有的更新都是紧急更新**

当我们在组件中修改 state 时，会遇到复杂一些的 state，当修改这些 state 时，甚至会阻塞到整个应用的运行，为了降低这种 state 的影响，React 为我们提供了 useTransition，通过 useTransition 可以降低 setState 的优先级。

useTransition 会返回一个数组，数组中有两个元素，第一个元素是 isPending，它是一个变量用来记录 transition 是否在执行中。第二个元素是 startTransition，它是一个函数，可以将 setState 在其回调函数中调用，这样 setState 方法会被标记为 transition 并不会立即执行，而是在其他优先级更高的方法执行完毕，才会执行。

<!-- ## -->

除了 useTransition 外，React 还直接为为我们提供了一个 startTransition 函数，在不需要使用 isPending 时，可以直接使用 startTransition 也可以达到相同的效果。

### 使用场景

<https://codepen.io/wangxuelina/pen/NWLBwLY>

### 对比 setTimeout

一个重要的区别是 startTransition 不像 setTimeout 那样在稍后执行，它是立即执行。传递给 startTransition 的函数同步运行，但函数内部的任何更新都标记为 "transitions"。React 将在稍后处理更新时使用该信息来决定如何渲染更新。这意味着我们开始渲染更新的时间比在定时器中包裹的更新的时间要早。在一个网速较快的设备上，两次更新之间的延迟非常小。在一个网速较慢的设备上，延迟会更大，但 UI 会依然保持响应。

另一个重要的区别是 setTimeout 内的存在较大更新时仍然会锁定页面，只不过是在定时器执行之后。当定时触发时，如果用户仍在输入或与页面交互，它们仍将被阻止与页面交互。但是用 startTransition 标记的状态更新是可以中断的，所以它们不会锁定页面

### 对比防抖节流

一方面，节流防抖 本质上也是 setTimeout ，只不过控制了执行的频率，那么通过打印的内容就能发现，原理就是让 render 次数减少了。而 transitions 和它相比，并没有减少渲染的次数。

另一方面，节流和防抖需要有效掌握 Delay Time 延时时间，如果时间过长，那么给人一种渲染滞后的感觉，如果时间过短，那么就类似于 setTimeout(fn,0) 还会造成前面的问题。而 startTransition 就不需要考虑这么多。

## useDeferredValue

useDeferredValue 用来设置一个延迟的 state，比如我们创建一个 state，并使用 useDeferredValue 获取延迟值，useDeferredValue 需要一个 state 作为参数，会为该 state 创建一个延迟值。必须结合 React.memo 或 us 额 Memo 才能发挥作用

例如：

```js
const [str, setStr] = useState('');
const deferredStr = useDeferredValue(str);
```

上边的代码中 str 就是一个常规的 state，deferredStr 就是 str 的延迟值。设置延迟值后每次调用 setState 后都会触发两次组件的重新渲染。第一次时，deferredStr 的值是 str 修改前的值，第二次才是修改后的值。换句话，延迟值相较于 state 来说总会慢一步更新。

### 使用 Demo

<https://codepen.io/wangxuelina/pen/XWPBgeG>

### 使用场景

<https://codepen.io/wangxuelina/pen/poOZWaP>

## useDebugValue

### 定义

useDebugValue 用于在 React 开发者工具（如果已安装，在浏览器控制台 React 选项查看）中显示 自定义 Hook 的标签，用来调试自定义钩子，不常用

useDebugValue 接受一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

### 使用

<https://codepen.io/wangxuelina/pen/xxazWoO>

<ImagePreview src="/images/react18/image6.png"></ImagePreview>

<ImagePreview src="/images/react18/image7.png"></ImagePreview>

### 应用场景

<https://codepen.io/wangxuelina/pen/zYJaWaY>

<ImagePreview src="/images/react18/image8.gif"></ImagePreview>

### 注意

我们不推荐你向每个自定义 Hook 添加 debug 值。当它作为共享库的一部分时才最有价值。

<!-- ## -->

## useId

你想生成唯一 ID

你想要连接 HTML 元素，比如 label 和 input。

但不适用于列表的 key

### 应用场景

例如，如果一个 label 元素的 htmlFor 属性值为 username，那么当用户点击该 label 元素时，与 id 属性值为 username 的表单控件就会获得焦点。这样可以提高表单的可用性和易用性。

<https://codepen.io/wangxuelina/pen/PodBOvE>

## 其他库

以下 hook 是为库作者提供的，用于将库深入集成到 React 模型中，通常不会在应用程序代码中使用。

### useInsertionEffect

useInsertionEffect 主要是解决 CSS-in-JS 库注入样式的性能问题

#### 定义

与 useEffect 相同，但它在所有 DOM 突变 之前 同步触发。使用它在读取 useLayoutEffect 中的布局之前将样式注入 DOM。由于这个 hook 的作用域有限，所以这个 hook 不能访问 refs。

#### 对比

<ImagePreview src="/images/react18/image9.png"></ImagePreview>

组件挂载的一个流程，先给组件挂在上，state 发生改变的时候，用新的 state 去创建 React 元素，然后我们去构建 react 一个树，然后我就会根据上一次的树跟这一次的树进行比较，比较那些东西发生变化了，通过 diff 算法，找到不同的元素以后，然后就把这个修改提交个 dom，然后在触发我们的 dom 改变，改变后我们再绘制到屏幕上，然后我们才能再屏幕上能看到这个现显示

useEffect 执行就是在触发我们屏幕绘制后执行，当然我们依赖项没有变的话，也是不发生改变，我们构建的一过程其实是一个异步的，useEffect 不会影响到我们页面的的一个渲染，他是在屏幕绘制之后进行执行

useLayoutEffect 在执行的时候是元素都有了，但是屏幕还没开始绘制，这个作用就是在 dom 生成后我们可以读取一下网页的布局，在屏幕绘制之前我们就可以绘制一些样式动画啥的

useEffect 绘制完了以后修改再生效会出现一个闪屏的情况，而 useLayoutEffect 他还没绘制就悄悄的改了，绘制屏幕这块就不会闪了，看不出来修改的一个过程，

useInsertionEffect 可以在修改 dom 之前我们可以动态的添加一些新元素，比如一个场景就是我们需要在项目当中设置一些样式，这样我就就可以动态插入这些元素，对比上面两个区别很小，我们在使用的时候直观的看不出来，他存在的意义就是提高的性能，为啥能提高性能，因为上面两种在 dom 后改，页面已经渲染，等于说再对我们网页重新的一个渲染，重新的一个计算，性能比较差一点等于我要渲染两次

执行顺序

<https://codepen.io/wangxuelina/pen/mdGKpLQ>

可以看到 useInsertionEffect 的执行时机要比 useLayoutEffect 提前，useLayoutEffect 执行的时候 DOM 已经更新了，但是在 useInsertionEffect 的执行的时候，DOM 还没有更新。本质上 useInsertionEffect 主要是解决 CSS-in-JS 在渲染中注入样式的性能问题。这个 hooks 主要是应用于这个场景，在其他场景下 React 不期望用这个 hooks 。

useEffect 跟 useLayoutEffect 效果区别

<https://codepen.io/wangxuelina/pen/dyqKdbg>

#### 应用场景

<https://codepen.io/wangxuelina/pen/RwYJMVK>

<!-- ### -->

### useSyncExternalStore

前面提到的几个新 API 都是通过并发更新的形式解决渲染阻塞的问题，但是并发同样会带来新的问题。

我们使用诸如 redux、mobx 等第三方状态库时，如果开启了 Concurrent 模式，那么就有可能会出现状态不一致的情形，给用户带来困扰。针对这种情况， React18 提供了一个新的 useSyncExternalStore，来帮助我们解决此类问题。它实现了对外部数据源订阅时不在需要 useEffect，对并发更新使用到的额外数据进行监听，当并发更新时数据发生变化，进行强制渲染，并且推荐**用于任何与 React 外部状态集成的库**。

通常情况下，当我们修改了一个变量，是无法被动的感知到它的变化的。 React 它通过 setState 来感知状态的变化，再利用 diff 等方法实现更新。这也就是为什么我们可以利用 setState({}) 可以强制更新组件。正因如此，配合上 useSyncExternalStore 我们的外部状态也就可以是一个普通的变量。在我们更新我们的状态时，利用 subscribe 参数接受到的回调来通知组件状态更新了。最后在使用 getSnapshot 来返回新的状态，这就是 useSyncExternalStore 大致的工作流程。

这个 Hooks 返回 store 的值并接受三个参数：

- subscribe: 注册回调的函数，每当 store 更改时调用该回调函数。
- getSnapshot：返回 store 当前值的函数。
- getServerSnapshot：返回服务器渲染期间使用的快照的函数。

```js
function useSyncExternalStore<Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot?: () => Snapshot
): Snapshot;
```

### 应用场景

<https://codepen.io/wangxuelina/pen/XWPBVxN>

目前 React-Redux 8.0 已经基于 useSyncExternalStore 实现。

## Suspense 组件的变化

react18 的 Suspense 组件中国呢，官方堆空的 fallback 属性的处理方式做改变，不再跳过缺失值或者值为 null

的 fallback 的 Suspense 边界。即使不写 fallback 也不会报错

更新前：

以前，如果你的 Suspense 组件没有提供 fallback 属性，React 就会悄悄跳过它，继续向上搜索下一个边界：

```js
// React 17
const App = () => {
  return (
    <Suspense fallback={<Loading />}> // <--- 这个边界被使用，显示 Loading 组件
      <Suspense>                      // <--- 这个边界被跳过，没有 fallback 属性
        <Page />
      </Suspense>
    </Suspense>
  );
};

export default App;
```

React 工作组发现这可能会导致混乱、难以调试的情况发生。例如，你正在 debug 一个问题，并且在没有 fallback 属性的 Suspense 组件中抛出一个边界来测试一个问题，它可能会带来一些意想不到的结果，并且 不会警告 说它 没有 fallback 属性。

更新后：

现在，React 将使用当前组件的 Suspense 作为边界，即使当前组件的 Suspense 的值为 null 或 undefined：

```js
// React 18
const App = () => {
  return (
    <Suspense fallback={<Loading />}> // <--- 不使用
      <Suspense>                      // <--- 这个边界被使用，将 fallback 渲染为 null
        <Page />
      </Suspense>
    </Suspense>
  );
};

export default App;
```

这个更新意味着我们不再跨越边界组件。相反，我们将在边界处捕获并呈现 fallback，就像你提供了一个返回值为 null 的组件一样。这意味着被挂起的 Suspense 组件将按照预期结果去执行，如果忘记提供 fallback 属性，也不会有什么问题。

Suspense 啥时候用？？

场景 1：懒加载代码分割

```js
import React, { Suspense, useState } from 'react';
import './App.css';
// import AList from './AList'
// import BList from './BList'
// import CList from './BList'
const AList = React.lazy(() => import('./AList'));
const BList = React.lazy(() => import('./BList'));
const CList = React.lazy(() => import('./CList'));

function App() {
  const [count, setCount] = useState(1);
  return (
    <div>
      <ul>
        <li onClick={() => setCount(1)}>a列表</li>
        <li onClick={() => setCount(2)}>b列表</li>
      </ul>
      <Suspense fallback={<div>Loading...</div>}>
        {count === 1 ? <AList /> : <BList />}
        <Suspense fallback={<div>c组件Loading...</div>}>
          <CList />
        </Suspense>
      </Suspense>
    </div>
  );
}

export default App;
```

默认首次加载 js 会被合并，一旦组件变多了，就会非常的慢，第一次加载应该只加载我们看到的而不是所有

<ImagePreview src="/images/react18/image12.gif"></ImagePreview>

react17 最外层不写 fallback 报错

<ImagePreview src="/images/react18/image13.png"></ImagePreview>

## 严格模式

### 场景 demo

<https://codepen.io/wangxuelina/pen/poOZGdR>

安装插件 React Developer Tools 大于 4.18 版本才能看出来效果

react18 前会渲染两次，React 会在严格模式下执行两次渲染，以确保组件的渲染结果是一致的。这是一种开发模式下的优化，但是有点误导

<ImagePreview src="/images/react18/image10.png"></ImagePreview>

react18 后也会渲染两次，不过有一次时置灰的状态，便于区分

<ImagePreview src="/images/react18/image11.png"></ImagePreview>

## React 空组件的返回值

<ImagePreview src="/images/react18/image14.png"></ImagePreview>

### 场景 Demo

<https://codepen.io/wangxuelina/pen/KKxedjj>

## 组件卸载更新状态的警告删除

这个错误表示：无法对未挂载（已卸载）的组件执行状态更新。这是一个无效操作，并且表明我们的代码中存在内存泄漏。

这个错误的初衷，原本旨在针对一些特殊场景，譬如 你在 useEffect 里面设置了定时器，或者订阅了某个事件，从而在组件内部产生了副作用，而且忘记 return 一个函数清除副作用，则会发生内存泄漏…… 之类的场景

但是在实际开发中，更多的场景是，我们在 useEffect 里面发送了一个异步请求，在异步函数还没有被 resolve 或者被 reject 的时候，我们就卸载了组件。 在这种场景中，警告同样会触发。但是，在这种情况下，组件内部并没有内存泄漏，因为这个异步函数已经被垃圾回收了，此时，警告具有误导性。

<ImagePreview src="/images/react18/image15.png"></ImagePreview>

### 场景 demo

<https://codepen.io/wangxuelina/pen/vYzaozR>

<BackTop></BackTop>