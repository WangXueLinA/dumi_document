---
title: Redux
---

# Redux，React-redux

## Redux

redux 源码地址: https://github.com/reduxjs/redux/blob/master/src/applyMiddleware.ts

Redux 是一个广泛使用的 JavaScript 状态管理库，特别适用于构建复杂的单页应用程序（SPA）。它提供了一个集中式的存储来管理应用的整个状态树，使得状态变化可预测且容易调试

Redux 的一个关键原则是“单一数据源”，这意味着整个应用的状态都存储在一个单一的 Store 中，这有助于保持数据一致性并简化数据流管理。

demo: https://stackblitz.com/edit/vitejs-vite-qytm48?file=src%2FApp.tsx

Redux 的核心概念包括 Action、Reducer、Store 和 Middleware，下面是对这些核心概念的简介

### Action

Action 是 Redux 中用于描述“发生了什么”的普通 JavaScript 对象。它是触发状态变更的唯一途径。每个 Action 都有一个 type 属性，用于标识该 Action 的意图，其他属性为可选，用来携带更多数据。

Action 基本格式：

```js
{
  type: 'ACTION_TYPE', // 必须的，表示action的类型，通常是字符串常量
  payload: {}, // payload可选的，携带的数据，可以是任何类型
  meta: {}, // 可选的，附加的非业务数据，如时间戳、提示信息等
  error: false, // 可选的，标记该action是否代表一个错误情况，默认为false
}
```

如创建显示和隐藏的 Action Creators：

```js
function show() {
  return {
    type: 'Show', //type是固定的
    payload: true, //payload是任意定义
  };
}

function hide() {
  return {
    type: 'Hide',
    payload: false,
  };
}

export { show, hide };
```

### Reducer

Reducer 是纯函数，接收旧的 state 和一个 Action，返回新的 state。它负责根据 Action 来计算新的应用状态，而且必须是纯的，即给定同样的输入，总是产生同样的输出。多个 Reducer 可以被组合成一个大的 Reducer 来处理整个应用状态树。

如创建一个 reducer.js 文件：

```js
const tabbarReducer = (prevState = true, action) => {
  let { type, payload } = action;

  switch (type) {
    case 'Show':
      const showState = payload;
      return showState;
    case 'Hide':
      const hiddenState = payload;
      return hiddenState;
    default:
      return prevState;
  }
}; // 状态一返回， 表示store状态有更新。
export default tabbarReducer;
```

### Store

Redux 应用中只有一个单一的 Store，它保存着应用的全部状态。Store 有以下几个主要功能：

- 维护应用的 state 状态；
- 提供 getState()方法获取当前状态；
- 允许通过 dispatch(action)来触发状态变更；
- 注册监听器（通过 subscribe(listener)）以便状态变更时能通知到相关组件；

如下创建一个 store

```js
import { createStore, combineReducers } from 'redux';
// 创建store, stores是直接修改不了的，所以通过reducers来进行修改
import isShowReducer from './reducer';
// 合并成reducer
const reducer = combineReducers({
  isShow: isShowReducer,
});

// reducer是自己写的，当成参数传进去，将来进行修改时，reducer来进行处理，
// reducer是专门处理状态的，reducer 唯一修改的地方， 接受老状态 ，深复制 ，
const store = createStore(reducer);

export default store;
```

### Middleware

因为 redux 本身不支持异步 action，所以不能 dispatch 异步 action（如 dispath 包含一个 ajax 请求结果的 action），中间件原理是它会判断 action 是否为一个普通函数，如果不是，就交给中间件处理，redux 提供中间件需要通过 applyMiddleware()函数应用到 Store 中，他会将 action 一级一级传递给中间件，每个中间件处理完后，会调用下一个中间件，直到最后一个中间件，最后将 action 传递给 reducer。

applyMiddleware 是一个非常关键的函数，它允许你在 dispatch action 到 reducer 之前，插入自定义的逻辑，从而扩展 Redux 的基本功能。这个功能特别适用于处理异步操作、日志记录、异常处理、状态持久化等场景。applyMiddleware 的工作原理大致可以概括为以下几点

1. **中间件链的构建**：applyMiddleware 接受一系列的中间件函数作为参数，并返回一个新的 store 创建函数。每个中间件函数都是一个接收 dispatch 和 getState 函数作为参数，并返回一个新的 next 函数的高阶函数。这个新的 next 函数又会接收下一个中间件的 dispatch 函数，形成一个链式调用的结构。最终，链的末端是 Redux 原生的 dispatch 方法。
2. **dispatch 流程的改造**：当使用了 applyMiddleware 创建 store 时，Redux 的原始 dispatch 方法会被替换为一个经过中间件包裹的新 dispatch 方法。这意味着每次调用 store.dispatch(action)时，action 会依次经过每一个中间件处理。每个中间件都有机会在 action 被传递给 reducer 之前对其进行操作，或者在 reducer 处理之后做额外的事情。
3. **中间件执行顺序**：由于中间件是按照它们被传入 applyMiddleware 的顺序链接起来的，所以它们的执行顺序也是从左到右。每个中间件内的 next 函数调用代表了控制权的传递，让下一个中间件或者最终的 reducer 得以执行。

#### 中间件源码

Redux 中间件其实是通过重写 createStore 来增强和扩展原来的 dispatch 方法，使其能够在执行 dispatch 的同时可以同步执行其它方法，下面来展示中间件的使用：

```js
import createStore, { applyMiddleWare } from 'redux';
import thunk from 'redux-thunk'; // 引入thunk风格的支持异步 action中间件
import logger from 'redux-logger'; // 引入logger日志记录中间件

function reducer(state = {}, action) {
  switch (action.type) {
    case 'TEST':
      return { ...state, test: 'test success' };
  }
}
// 中间件作为applyMiddleWare的参数传入createStore
const store = createStore(
  reducer,
  (initState = {}),
  applyMiddleWare(thunk, logger), // 多个依次传入
);
```

我们看出中间件的使用方式是用 applyMiddleWare 把中间件作为参数传入 createStore 中，我们先看下 createStore 方法的第三个参数是什么

```js
// createStor源码简介
export default function createStore(reducer, preloadedState, enhancer) {
  ...
  // 增强器
  // 第三个参数是enhancer，也就是我们传入的applyMiddleWare
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    // 在这里return了enhancer结果
    // 传入了createStore, reducer, preloadedState
    // 实际上是重写了createStore
    return enhancer(createStore)(reducer, preloadedState)
  }
  ...
}
```

看完了 enhancer 的实际作用，我们再看下 applyMiddleWare 的实现原理

```js
// applyMiddleware源码简介

import compose from './compose';

// 传入middlewares中间件
export default function applyMiddleware(...middlewares) {
  // 闭包嵌套返回2个方法
  // 上面的 enhancer(createStore)(reducer, preloadedState)也就是applyMiddleware调用
  return (createStore) => (reducer, preloadedState) => {
    // 返回store
    const store = createStore(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.',
      );
    };

    // 返回一个对象
    // 包含getState方法和dispatch方法
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args),
      // 返回一个全新的dispatch方法，不污染原来的dispatch
    };

    // 执行中间件第一层方法
    // 回顾下中间的格式：({ getState, dispatch }) => next => action => next(action)
    // 为了方便阅读，箭头函数换为普通函数
    // function ({ getState, dispatch }) {
    //   return function (next) {
    //     return function (action) {
    //       return next(action);
    //     }
    //   }
    // }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    // 返回一个中间件的函数集合[next => action => next(action), next => action => next(action)]

    // 使用compose聚合chain函数集合
    // 返回新的dispatch
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
```

重要的函数 compose，接下来看下 compose 怎么处理 chain 函数集合的

```js
// 传入聚合函数集合
// 集合为：[next => action => next(action), next => action => next(action)]
// 返回一个新的函数: (arg) => arg
export default function compose(...funcs) {
  // 判断如果没有则返回一个新函数
  // 可以联想一下dispatch的定义，返回的依然是传入的action
  // function dispatch(action) {
  //     ...
  //     return action
  // }
  // 执行dispatch(action)方法
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  // 判断如果只有一个中间件，则直接返回第一个
  if (funcs.length === 1) {
    return funcs[0];
  }

  // 这里用了reduce函数
  // 把后一个的中间件的结果当成参数传递给下一个中间件
  // 函数列表的每个函数执行后返回的还是一个函数：action => next(action)
  // 这个函数就是新的dispatch
  // 最后返回函数：(...args) => action => args(action)
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args)),
  );
}
```

compose 的源码是通过 reduce 把每个中间件都执行一遍，并且是通过管道式的传输，把每个中间件的返回结果当成参数传递给下一个中间件，实现了剥洋葱式的中间件模式，然后我们举个简单的例子来看下`funcs.reduce((a, b) => (...args) => a(b(...args)))` 所代表的意思

```js
const funcs = [
  function addTwo(x) {
    return x + 2;
  },
  function multiplyThree(x) {
    return x * 3;
  },
  function subtractOne(x) {
    return x - 1;
  },
];

const composedFunction = funcs.reduce(
  (a, b) =>
    (...args) =>
      a(b(...args)),
);

composedFunction(5); // 14

// 第一次循环. a: addTwo ，b: multiplyThree
// 第二次循环. a: addTwo(multiplyThree(x)) ，b: subtractOne
// 第三次循环. a: addTwo(multiplyThree(subtractOne(x))) ，b: null，
// 然后执行addTwo(multiplyThree(subtractOne(x))), 依次从里面开始执行到外侧
```

<!-- 首先，我们有这样一个 funcs 数组

```js
const funcs = [
  function (next) {
    return function (action) {
      return next(action);
    };
  },
  function (next) {
    return function (action) {
      return next(action);
    };
  },
];
```

接下来，我们使用 reduce 方法来组合这些函数：

```js
const composedFunc = funcs.reduce(
  (a, b) =>
    (...args) =>
      a(b(...args)),
);
```

现在，让我们逐步看看 composedFunc 在调用时会发生什么。假设我们调用 composedFunc 并传递一个 action：

```js
const action = { type: 'SOME_ACTION' };
composedFunc(action);
```

由于 composedFunc 是通过 reduce 方法组合 funcs 数组中的函数得到的，我们可以认为 composedFunc 实际上是这样定义的：

```js
const composedFunc = (...args) => {
  return a(b(...args));
};
```

其中 a 和 b 分别是 funcs 数组中的两个函数。我们从 composedFunc 的定义开始：

当我们调用 composedFunc(action) 时，它实际上调用了 a(b(action))。
接下来，我们看 b(action) 的执行。由于 b 是 funcs 数组中的第二个函数，它会接收 action 并直接返回 next(action)。这里的 next 实际上就是 a 函数，因为在 composedFunc 的上下文中，b 函数的 next 参数就是 a。
因此，b(action) 的执行结果就是调用 a 函数，并将 action 作为参数传递给它。
现在我们看 a(action) 的执行。同样地，a 函数也会接收 action 并直接返回 next(action)。这里的 next 在这个上下文中实际上就是 next 函数，因为我们已经到达了 funcs 数组的末尾，a 函数是最后一个函数。
最终，a(action) 的执行结果就是直接返回 action。

综上所述，由于 funcs 数组中的所有函数都只是简单地将 action 传递给下一个函数（即 next），并且在数组的末尾没有其他函数，最终的结果就是 composedFunc 接收 action 并直接返回它，没有做任何额外的处理。

这就是为什么在 funcs 中的函数都只是简单地传递 action 给 next 的情况下，composedFunc 会简单地接收 action 并直接返回，不做任何额外的处理的原因。 -->

<ImagePreview src="/images/redux/image3.jpg"></ImagePreview>

为啥需要这样的设计模式

1. 异步操作的处理：
   Redux 中间件允许你在 action 到达 reducer 之前进行拦截，执行异步操作，如 API 调用，然后在操作完成时分发另一个 action 来更新 store。这使得 Redux 可以处理异步数据流而不破坏其原有的同步数据流模型。
2. 链式调用与控制流：
   Redux 中间件利用了“next => action => next(action)”的模式，形成了一个职责链（Chain of Responsibility），其中每个中间件可以决定是否继续传递 action 给下一个中间件，或者在某个点停止传递。这为控制 action 的流动和处理提供了灵活性。

3. 功能插拔与可扩展性：
   通过将功能封装在中间件中，Redux 允许开发者根据需要选择和组合不同的中间件，这增加了应用的可扩展性和可定制性。你可以选择使用现成的中间件，如 redux-thunk 或 redux-saga，也可以编写自己的中间件来满足特定需求。

4. 无侵入性：
   中间件的设计是无侵入性的，意味着它们不会改变 Redux 核心的任何部分。它们只是添加在 store 创建时的一个额外层，这使得 Redux 保持其核心的简洁性，同时也允许外部功能的无缝集成。

所以洋葱模式的执行流程就是这样

<ImagePreview src="/images/redux/image2.png"></ImagePreview>

然后我们可以再看一些平时用到的第三方中间件的简易源码展示

**redux-logger**

```js
function logger({ getState }) {
  return (next) => (action) => {
    // 打印 action
    console.log('Action:', action);

    // 调用下一个中间件或 reducer
    const result = next(action);

    // 获取新的 state
    const currentState = getState();

    // 打印新的 state
    console.log('New State:', currentState);

    return result;
  };
}
```

**redux-thunk**

```js
function thunkMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    // 如果 action 是一个函数，那么调用它并传递 dispatch 和 getState
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    // 否则，action 是一个普通的 action 对象，直接传递给下一个中间件或 reducer
    return next(action);
  };
}
```

### 工作流程图

大概的工作流程是这样的：
用户触发一个动作或者组件中通过事件触发一个方法叫做 dispatch，传进一个 action（本质就是一个普通对象），这个 action 是由我们的 Action Creators 所生成的，action 到了 Store 中无法进行修改，我们必须放在 Reducers 中进行修改，Reducers 会记录你所有的状态，而 Reducers 在设计中有一个原则，请保证 Reducers 是纯函数设计（接受老状态，但是这个老状态得进行深复制一份，不能进行修改，而且得返回一个新的状态）新状态一返回，我们的 Store 更改了，内部会自动会触发订阅发布者模式的发布动作，这时候我们会通知我们组件中的监听器，订阅者，进行回调函数来实现我们的功能

<ImagePreview src="/images/redux/image1.png"></ImagePreview>

## React-redux

react-redux 是 Redux 库的官方 React 绑定库，它作为一个桥梁，使得在 React 应用中使用 Redux 进行状态管理变得更加方便和高效。Redux 本身是一个独立的状态管理库，可以与多种前端框架或库集成，而 react-redux 专门针对 React 进行了优化，简化了 React 组件与 Redux store 之间的交互过程

具体来说，react-redux 提供了以下几个核心功能：

- Provider 组件：这是一个 React 组件，作为根组件包裹整个应用，负责将 Redux store 传递给所有子组件。这意味着，无需手动将 store 层层传递，所有组件都可以访问到 store。
- connect 函数：这是一个高阶函数，用来连接 React 组件与 Redux store。它让你能够从 store 中选取需要的状态（mapStateToProps），以及将 action dispatchers 映射为 props（mapDispatchToProps），这样 React 组件就可以通过 props 直接与 store 互动，而不需要关心如何订阅 store 或处理更新。
- useSelector 和 useDispatch Hooks：随着 React Hooks 的引入，react-redux 也提供了 Hooks API，使得在函数组件中使用 Redux 变得更加直接。它允许组件直接从 Redux store 中选择状态（state），从而替代了以前使用 connect 高阶组件的方式。useDispatch 则提供了一个直接获取 dispatch 函数的方法，用于触发 actions。

demo：https://stackblitz.com/edit/vitejs-vite-8ayfsz?file=src%2FApp.tsx

<BackTop></BackTop>