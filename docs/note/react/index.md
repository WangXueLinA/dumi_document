---
title: React
---

# React

## JSX

一个 JSX 语法的示例，如下所示

```js
const element = <h1>Hello, world!</h1>;
```

这种语法形式，既不是 HTML，也不是字符串，而是称之为 JSX，是 React 里用来描述 UI 和样式的语法，JSX 最终会被编译为合法的 JS 语句调用（编译器在遇到`{`时采用 JS 语法进行解析，遇到`<`就采用 HTML 规则进行解析）

JSX 实质通过 babel 编译，而 babel 实际上把 JSX 编译给`React.createElement()`调用。

```js
const element = <h1 className="greeting">Hello, world!</h1>;
```

是等同于以下的语句的

```js
const elem = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!',
);
```

React.createElement()方法会首先进行一些避免 BUG 的检查，然后返回类似以下例子的对象：

```js
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world',
  },
};
```

## Diff 算法

React 是基于 vdom 的前端框架，组件 render 产生 vdom，然后渲染器把 vdom 渲染出来。
state 更新的时候，组件会重新 render，产生新的 vdom，在浏览器平台下，为了减少 dom 的创建，React 会对两次的 render 结果做 diff，尽量复用 dom，提高性能。

<ImagePreview src="/images/react/image4.jpg"></ImagePreview>

一句话总结虚拟 DOM 就是一个用来描述真实 DOM 的 javaScript 对象

Diff 算法是虚拟 DOM 技术的核心，其目的是为了高效地找出虚拟 DOM 树变化的部分，并将这些变化应用到真实 DOM 上，从而避免不必要的 DOM 操作，提升性能。

### React 16 前

Diff 算法基本步骤

- 树的遍历比较：从根节点开始，递归比较两棵树的节点，直到叶子节点。

<ImagePreview src="/images/react/image1.jpg"></ImagePreview>

只有删除、创建操作，没有移动操作

<ImagePreview src="/images/react/image2.jpg"></ImagePreview>

react 发现新树中，R 节点下没有了 A，那么直接删除 A，在 D 节点下创建 A 以及下属节点
上述操作中，只有删除和创建操作

- 节点的类型比较：如果新旧节点的类型不同，直接替换整个节点。
- 节点的属性比较：如果节点类型相同，对比它们的属性是否有变化，如有变化则更新属性。
- 子节点的比较：递归地对子节点进行上述过程，同时利用“key”属性来优化列表的更新逻辑，确保元素的正确对应和移动。

<ImagePreview src="/images/react/image3.jpg"></ImagePreview>

通过 key 可以准确地发现新旧集合中的节点都是相同的节点，因此无需进行节点删除和创建，只需要将旧集合中节点的位置进行移动

### React 16 后

JavaScript 引擎和页面渲染引擎两个线程是互斥的，当其中一个线程执行时，另一个线程只能挂起等待 如果 JavaScript 线程长时间地占用了主线程，那么渲染层面的更新就不得不长时间地等待，界面长时间不更新，会导致页面响应度变差，用户可能会感觉到卡顿。而这也正是 React 15 的 Stack Reconciler 所面临的问题，当 React 在渲染组件时，从开始到渲染完成整个过程是一气呵成的，无法中断。如果组件较大，那么 js 线程会一直执行，然后等到整棵 VDOM 树计算完成后，才会交给渲染的线程。这就会导致一些用户交互、动画等任务无法立即得到处理，导致卡顿的情况

Fiber 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行 即可以中断与恢复，恢复后也可以复用之前的中间状态，并给不同的任务赋予不同的优先级，其中每个任务更新单元为 React Element 对应的 Fiber 节点。实现的上述方式的是 requestIdleCallback 方法 window.requestIdleCallback()方法将在浏览器的空闲时段内调用的函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

React 16 以前递归对比虚拟 DOM 树的方案有一个明显的问题：阻塞主线程。旧的 React 架构中，Diff 算法和组件更新都是同步执行的。这意味着一旦更新开始，React 会一直占用主线程直到整个更新过程完成。在这期间，浏览器无法响应用户操作，导致界面卡顿，尤其是在执行大规模的 DOM 更新时。

<ImagePreview src="/images/react/image5.jpg"></ImagePreview>

React 16 为了优化性能，会先把虚拟 DOM 树转换成 Fiber，也就是从树转换成链表，再基于 Fiber 进行渲染。这个过程分成两个阶段：

- reconcile（可中断） ：从虚拟 DOM 转换成 Fiber，并给需要操作的节点打上标记。
- commit（不可中断） ：对有标记的 Fiber 节点进行操作。

Fiber 架构通过将渲染工作划分为小的、可管理的单元，使得 React 能够更好地利用浏览器的主线程，并提供更流畅的用户体验。

#### 创建 fiber

第一次渲染不需要 Diff，直接将虚拟 Dom 转为 Fiber。

<ImagePreview src="/images/react/image7.jpg"></ImagePreview>

#### 更新 fiber

再次渲染的时候，就需要更新 Fiber 了。这一步的关键是：**<span style='color: red'>尽可能复用</span>**，尽可能复用旧的 Fiber(这里举例的旧 fiber 是我们上图第一次创建的 fiber)，来生成本次的 Fiber。

<ImagePreview src="/images/react/image8.jpg"></ImagePreview>

具体的实现方法为两次遍历

**第一次遍历**

- 方法是对比 vdom 和老的 fiber，复用<span style='color: red'>位置和内容都相同</span>的结点。如果可以复用就处理下一个节点，否则就结束遍历。

- 如果所有的新的 vdom 都处理完了，那就把剩下的老 fiber 节点删掉就行。

- 如果还有 vdom 没处理，那就进行第二次遍历：

如上图，相比初始的 Fiber，A、B、C 都是完全没变的，直接复用，再往下走原本是 E，但现在变成了 D，发现不能复用，直接返回，然后来到第二次遍历。

**第二次遍历**

把剩下的内容填上，方法是先把剩余的旧 Fiber 结点做成一个 Map，key 就是节点的 key，然后遍历新 DOM 树，构建新 Fiber 的时候查查 Map，能复用就复用，用不了就新建。

如上图，构建 D、F、H 的时候发现旧 Fiber 里有，那么可以拿过来复用，M 以前没有，那就新建一个。

第二轮遍历完了之后，把剩余的老 fiber 删掉，剩余的 vdom 新增。

## React 的事件机制

React 基于浏览器的事件机制自身实现了一套事件机制，包括事件注册、事件的合成、事件冒泡、事件派发等
在 React 中这套事件机制被称之为合成事件

### 合成事件

合成事件是 React 模拟原生 DOM 事件所有能力的一个事件对象，即浏览器原生事件的跨浏览器包装器
根据 W3C 规范来定义合成事件，兼容所有浏览器，拥有与浏览器原生事件相同的接口，例如：

```js
<button onClick={handleClick}>按钮</button>
```

如果想要获得原生 DOM 事件，可以通过 e.nativeEvent 属性获取

```js
<button onClick={(e) => console.log(e.nativeEvent)}>按钮</button>
```

从上面可以看到 React 事件和原生事件也非常的相似，但也有一定的区别

```js

● 事件名称命名方式不同

// 原生事件绑定方式
<button onclick="handleClick()">按钮命名</button>

// React 合成事件绑定方式
<button onClick={handleClick}>按钮命名</button>


● 事件处理函数书写不同

// 原生事件 事件处理函数写法
<button onclick="handleClick()">按钮命名</button>

// React 合成事件 事件处理函数写法
<button onClick={handleClick}>按钮命名</button>
```

关于 React 合成事件与原生事件执行顺序，可以看看下面一个例子

```js
import React from 'react';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }

  componentDidMount() {
    console.log('React componentDidMount！');

    this.parentRef.current?.addEventListener('click', () => {
      console.log('原生事件：父元素 DOM 事件监听！');
    });

    this.childRef.current?.addEventListener('click', () => {
      console.log('原生事件：子元素 DOM 事件监听！');
    });

    document.addEventListener('click', (e) => {
      console.log('原生事件：document DOM 事件监听！');
    });
  }

  parentClickFun = () => {
    console.log('React 事件：父元素事件监听！');
  };

  childClickFun = () => {
    console.log('React 事件：子元素事件监听！');
  };

  render() {
    return (
      <div ref={this.parentRef} onClick={this.parentClickFun}>
        <div ref={this.childRef} onClick={this.childClickFun}>
          分析事件执行顺序
        </div>
      </div>
    );
  }
}
export default App;
```

输出代码为顺序为

```
原生事件：子元素 DOM 事件监听！
原生事件：父元素 DOM 事件监听！
React 事件：子元素事件监听！
React 事件：父元素事件监听！
原生事件：document DOM 事件监听！
```

可以得出以下结论：

- React 所有事件都挂载在 document 对象上
- 当真实 DOM 元素触发事件，会冒泡到 document 对象后，再处理 React 事件
- 所以会先执行原生事件，然后处理 React 事件
- 最后真正执行 document 上挂载的事件

<ImagePreview src="/images/react/image9.png"></ImagePreview>

所以想要阻止不同时间段的冒泡行为，对应使用不同的方法，对应如下：

- 阻止合成事件间的冒泡，用 e.stopPropagation()
- 阻止合成事件与最外层 document 上的事件间的冒泡，用 e.nativeEvent.stopImmediatePropagation()
- 阻止合成事件与除最外层 document 上的原生事件上的冒泡，通过判断 e.target 来避免

React 事件机制总结如下：

- React 上注册的事件最终会绑定在 document 这个 DOM 上，而不是 React 组件对应的 DOM(减少内存开销就是因为所有的事件都绑定在 document 上，其他节点没有绑定事件)
- React 自身实现了一套事件冒泡机制，所以这也就是为什么我们 event.stopPropagation()无效的原因。
- React 通过队列的形式，从触发的组件向父组件回溯，然后调用他们 JSX 中定义的 callback
- React 有一套自己的合成事件

## 生命周期

老生命周期

<ImagePreview src="/images/react/image10.jpg"></ImagePreview>

新生命周期

<ImagePreview src="/images/react/image11.jpg"></ImagePreview>

## 引入 css 的方式

组件式开发选择合适的 css 解决方案尤为重要
通常会遵循以下规则：

- 可以编写局部 css，不会随意污染其他组件内的原生；
- 可以编写动态的 css，可以获取当前组件的一些状态，根据状态的变化生成不同的 css 样式；
- 支持所有的 css 特性：伪类、动画、媒体查询等；
- 编写起来简洁方便、最好符合一贯的 css 风格特点

而在 react 中，其引入 css 的方式有很多种，各有利弊

常见的 CSS 引入方式有以下：

- 在组件内直接使用
- 组件中引入 .css 文件
- 组件中引入 .module.css 文件
- CSS in JS

### 在组件内直接使用

直接在组件中书写 css 样式，通过 style 属性直接引入，如下：

```ts
import React, { Component } from "react";

const div1 = {
  width: "300px",
  margin: "30px auto",
  backgroundColor: "#44014C",  //驼峰法
  minHeight: "200px",
  boxSizing: "border-box"
};

class Test extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
     <div>
       <div style={div1}>123</div>
       <div style={{backgroundColor:"red"}}>
     </div>
    );
  }
}

export default Test;
```

上面可以看到，css 属性需要转换成驼峰写法

这种方式优点：

- 内联样式, 样式之间不会有冲突
- 可以动态获取当前 state 中的状态

缺点：

写法上都需要使用驼峰标识

- 某些样式没有提示
- 大量的样式, 代码混乱
- 某些样式无法编写(比如伪类/伪元素)

### 组件中引入 css 文件

将 css 单独写在一个 css 文件中，然后在组件中直接引入
App.css 文件：

```css
.title {
  color: red;
  font-size: 20px;
}

.desc {
  color: green;
  text-decoration: underline;
}
```

组件中引入：

```ts
import React, { PureComponent } from 'react';
import Home from './Home';
import './App.css';

export default class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <h2 className="title">我是 App 的标题</h2>
        <p className="desc">我是 App 中的一段文字描述</p>
        <Home />
      </div>
    );
  }
}
```

这种方式存在不好的地方在于样式是全局生效，样式之间会互相影响

### 组件中引入 .module.css 文件

将 css 文件作为一个模块引入，这个模块中的所有 css，只作用于当前组件。不会影响当前组件的后代组件

这种方式是 webpack 特工的方案，只需要配置 webpack 配置文件中 modules:true 即可

```ts
import React, { PureComponent } from 'react';
import Home from './Home';
import './App.module.css';

export default class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <h2 className="title">我是 App 的标题</h2>
        <p className="desc">我是 App 中的一段文字描述</p>
        <Home />
      </div>
    );
  }
}
```

这种方式能够解决局部作用域问题，但也有一定的缺陷：

- 引用的类名，不能使用连接符(.xxx-xx)，在 JavaScript 中是不识别的
- 所有的 className 都必须使用 {style.className} 的形式来编写
- 不方便动态来修改某些样式，依然需要使用内联样式的方式；

### CSS in JS

CSS-in-JS， 是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部文件中定义
此功能并不是 React 的一部分，而是由第三方库提供，例如：

- styled-components
- emotion
- glamorous

下面主要看看 styled-components 的基本使用，本质是通过函数的调用，最终创建出一个组件：

- 这个组件会被自动添加上一个不重复的 class
- styled-components 会给该 class 添加相关的样式

基本使用如下：

创建一个 style.js 文件用于存放样式组件：

```js
export const SelfLink = styled.div`
  height: 50px;
  border: 1px solid red;
  color: yellow;
`;

export const SelfButton = styled.div`
  height: 150px;
  width: 150px;
  color: ${(props) => props.color};
  background-image: url(${(props) => props.src});
  background-size: 150px 150px;
`;
```

引入样式组件也很简单：

```ts
import React, { Component } from 'react';
import { SelfLink, SelfButton } from './style';

class Test extends Component {
  constructor(props, context) {
    super(props);
  }

  render() {
    return (
      <div>
        <SelfLink title="People's Republic of China">app.js</SelfLink>
        <SelfButton color="palevioletred" style={{ color: 'pink' }} src={fist}>
          SelfButton
        </SelfButton>
      </div>
    );
  }
}

export default Test;
```

### 区别

通过上面四种样式的引入，可以看到：

- 在组件内直接使用 css 该方式编写方便，容易能够根据状态修改样式属性，但是大量的演示编写容易导致代码混乱
- 组件中引入 .css 文件符合我们日常的编写习惯，但是作用域是全局的，样式之间会层叠
- 引入.module.css 文件能够解决局部作用域问题，但是不方便动态修改样式，需要使用内联的方式进行样式的编写
- 通过 css in js 这种方法，可以满足大部分场景的应用，可以类似于预处理器一样样式嵌套、定义、修改状态等

<BackTop></BackTop>