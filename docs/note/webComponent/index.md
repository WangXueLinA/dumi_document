---
title: webComponent
---

# WebComponent

## 介绍

Web Components 是一套由 W3C 制定的标准集合，旨在让开发者能够创建可重用、封装良好的自定义 HTML 元素，以实现组件化开发。这一技术允许开发者创建自己的定制化 UI 组件，就像原生 HTML 元素一样，可以嵌套在任何 HTML 文档中，并且具有良好的封装性，使得组件内部样式、结构和行为不会影响到文档的其他部分，同时也不受外部样式和脚本的影响。

使用 Web Components，开发者可以构建高度模块化、可复用的 UI 组件，这些组件不仅能在同一项目中重用，还能跨项目和框架使用，因为它们是基于原生浏览器 API 构建的。

详细描述 mdn: https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components

## 特性

1. **Custom Elements（自定义元素）**：是 Web 标准中的一项功能，它允许开发者自定义新的 HTML 元素，开发者可以使用 JavaScript 和 DOM API，使新元素具有自定义的行为和功能
2. **Shadow DOM**：它可以将一个隐藏的、独立的 DOM 附加到一个元素上
3. **HTML template（HTML 模板）**：`<template>` 和 `<slot>` 元素使你可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

### 自定义元素

<ImagePreview src="/images/webComponent/image1.png"></ImagePreview>

demo: [自定义元素](https://stackblitz.com/edit/stackblitz-starters-xnvmfl?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

这就是我们生成一个比较简单的自定义标签了，我们可以看到我们自定义的标签其实是继承了 HTMLElement 对象的实例上的，其实所有的 HTML 元素都是 HTMLElement 对象的实例。然后开启 ShadowRoot 的 mode 为 open 开启(close 为关闭), 在 ShadowRoot 内部的创建 DOM 树，最后通过 Window 对象上的一个只读 customElements 属性的 define 方法定义和注册的自定义元素。

customElements.define ()方法的第一个参数是要创建的新元素的标签名称。这个参数用于指定自定义元素的名称，<font color="red">必须以小写字母开头，包含一个连字符</font>，第二个参数通常是一个继承了 HTMLElement 的类

#### 自定义元素事件响应

如果希望自定义元素能够响应属性更改，可以重写 attributeChangedCallback 方法，这是一个生命周期回调方法，当元素的任意属性发生变化时会被调用。

demo: [自定义元素事件响应](https://stackblitz.com/edit/stackblitz-starters-dhtqgz?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/gif1.gif"></ImagePreview>

上面的这个例子中：

1. get count() 方法相当于一个属性的 getter，它返回内部私有变量 count 属性值。
2. set count(count) 设置元素的 count 属性，方法相当于一个属性的 setter，它接收一个新的值，并更新内部私有变量 count，同时也更新了对应的属性（通过 setAttribute），这会导致浏览器自动调用 attributeChangedCallback 方法。
3. attributeChangedCallback 方法被浏览器调用，当元素的属性发生更改时。在这里，它调用 count setter 来同步内部状态。
   这样一来，通过属性观察者模式，我们间接实现了对自定义元素属性的 get 和 set 操作，并且能够确保属性变更时，内部状态和界面显示的一致性

### Shadow DOM

DOM 编程模型令人诟病的一个方面就是缺乏封装，不同组件之间的逻辑和样式很容易互相污染。

鉴于这个原因，Web components 的一个重要属性就是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上

Shadow DOM 是 DOM nodes 的附属树。这种 Shadow DOM 子树可以与某宿主元素相关联，但并不作为该元素的普通子节点，而是会形成其自有的作用域；Shadow DOM 中的根及其子节点也不可见。

#### CSS 隔离：

在 Shadow DOM 中定义的样式（CSS）仅对该 Shadow Tree 内部的元素生效，不会影响到外部 DOM 树中的元素，同样，外部的 CSS 规则也无法直接作用于 Shadow DOM 中的元素。除非使用特殊的 CSS 阴影部分（CSS Shadow Parts）和 CSS 自定义属性（CSS Variables）等技术进行通信和样式穿透

demo: [内部样式不影响外部元素](https://stackblitz.com/edit/stackblitz-starters-sjr7ur?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image2.png"></ImagePreview>

可以看出我们在里面写的 div 样式并不会影响到外部，而且不仅仅是里面的样式影响不到外面，外面的样式也影响不到里面,不仅仅是样式，shadow 中的 div 不能被外面的全局的 js 所获取到，里面的也不能获取外面的

demo: [外部样式不影响内部样式](https://stackblitz.com/edit/stackblitz-starters-zpriuk?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image3.png"></ImagePreview>

#### JavaScript 隔离：

JavaScript 也无法直接访问到 Shadow DOM 内部的元素，除非通过 Shadow Root 和相关的 API 方法。Shadow DOM 中的事件处理程序和脚本执行环境也是相对独立的，不会干扰到外部脚本，反之亦然。

demo: [javaScript 隔离](https://stackblitz.com/edit/stackblitz-starters-zlpf1q?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/gif4.gif"></ImagePreview>

在上面的例子中，`JsIsolatedComponent` 是一个自定义元素，它拥有自己的 Shadow DOM。Shadow DOM 中的 JavaScript 能够监听并修改其内部元素的行为，而外部页面的 JavaScript 则不能直接访问或修改 Shadow DOM 内部的 DOM 结构和行为。这就体现了 Shadow DOM 带来的 JavaScript 隔离效果。

相比于以前为了实现封装而只能使用 `<iframe>` 实现的情况，Shadow DOM 无疑是一种更优雅的创建隔离 DOM 树的方法。

### HTML Template

- `<template>` 标签可以用来定义一个 HTML 模板，这个模板中的内容不会直接渲染到页面上，而是在运行时通过 JavaScript 动态实例化。以下是一个简单示例，展示了如何在 HTML 中定义一个模板，并在 JavaScript 中将其内容克隆到 DOM 中：

demo:[template](https://stackblitz.com/edit/stackblitz-starters-6bk5rb?description=HTML/CSS/JS%20Starter&file=script.js,styles.css,index.html%3AL58-L58&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image7.png"></ImagePreview>

- `<slot>`使用模版我们只能传递一些文本变量，这很有局限性，于是 Web Components 引入了`<slot>`（插槽）的概念来增加编码的灵活度。
  我们可以使用 slot 来实现基于模版的部分自定义内容（标签、样式）的渲染，slot 插槽需要在 Shadow DOM 里才能生效。

  demo:[slot](https://stackblitz.com/edit/stackblitz-starters-uktw6w?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image8.png"></ImagePreview>

## 生命周期

- **connectedCallback**：当自定义元素第一次被连接到文档 DOM 时被调用。
- **disconnectedCallback**：当自定义元素与文档 DOM 断开连接时被调用。
- **adoptedCallback**：当自定义元素被移动到新文档时被调用。
- **attributeChangedCallback**：当自定义元素的一个属性被增加、移除或更改时被调用。

## 组件通信

### 父传子

#### HTML 传递

这是最直接的方式，可以通过修改 HTML 模板来实现。例如，创建一个自定义元素`<my-div title="hello"></my-div>`，其中 title 就是传递给组件的属性，组件内部可以通过访问这个属性来获取数据

demo: [通过属性传递数据](https://stackblitz.com/edit/stackblitz-starters-eyfhw3?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image4.png"></ImagePreview>

#### JSON.stringify 处理复杂类型数据

当需要传递包含对象、数组等复杂类型的数据时，可以先使用 JSON.stringify()方法将这些复杂数据转化为字符串，然后再通过属性传递。接收方接收到字符串后，再使用 JSON.parse()方法将其转换回原始数据格式

demo: [JSON.stringify 处理复杂类型数据](https://stackblitz.com/edit/stackblitz-starters-ruk89u?description=HTML/CSS/JS%20Starter&file=index.html%3AL15&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image5.png"></ImagePreview>

### 子传父

子组件 child.js

```js
// 定义使用Shadow DOM的自定义元素
class ShadowChildElement extends HTMLElement {
  constructor() {
    super();

    // 创建Shadow DOM根节点
    const shadowRoot = this.attachShadow({ mode: 'open' });

    // 在Shadow DOM中创建模板
    const template = document.createElement('template');
    template.innerHTML = `
            <button id="notifyButton">Click me</button>
          `;

    // 将模板内容附加到Shadow DOM中
    shadowRoot.appendChild(template.content.cloneNode(true));

    // 为按钮添加点击事件监听器
    const button = shadowRoot.getElementById('notifyButton');
    button.addEventListener('click', () => {
      // 触发自定义事件
      this.dispatchEvent(
        new CustomEvent('child-notification', {
          bubbles: true,
          detail: { message: '来自子组件的消息' },
        }),
      );
    });
  }
}
```

父组件 main.js

```js
// 在父组件中监听自定义事件
document.addEventListener('DOMContentLoaded', () => {
  const parentContainer = document.body; // 或者任何父级元素

  // 查找子组件并为其自定义事件添加监听器
  const shadowChild = parentContainer.querySelector('shadow-child');
  if (shadowChild) {
    shadowChild.addEventListener('child-notification', (event) => {
      const message = event.detail.message;
      const child = document.getElementById('showCild');
      child.innerHTML = message;
    });
  }
});
```

在上述代码中，我们创建了一个名为 ShadowChildElement 的 Web Component，它开启了 Shadow DOM 模式。当点击该组件内部的按钮时，组件会触发一个名为 child-notification 的自定义事件，并附带一条消息。父组件通过在 DOM 加载完成后查找该自定义元素并添加事件监听器，从而能够接收到这个自定义事件并处理其中的消息内容。由于事件设置了 bubbles: true，所以即使在 Shadow DOM 内部触发，事件也会冒泡到 Shadow DOM 之外，允许外部元素监听到它。

demo：[子传父](https://stackblitz.com/edit/stackblitz-starters-zmyzkf?description=HTML/CSS/JS%20Starter&file=child.js,index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/gif3.gif"></ImagePreview>

### 插槽通信

虽然不是严格意义上的“通信”，但通过`<slot>`元素，可以让父组件插入内容到子组件中，从而间接实现内容交互。

```html
<!-- 子组件 -->
<template id="my-template">
  <div class="container">
    <h2>Count:</h2>
    <span id="display">{{count}}</span>
    <slot name="controls"></slot>
    <!-- 父组件可以在这里插入控件 -->
  </div>
</template>

<!-- 父组件 -->
<my-counter>
  <button slot="controls" @click="increment">Increment</button>
</my-counter>
```

### API 方法暴露

子组件 child.js

```js
// 定义一个使用Shadow DOM的Web Component，并暴露API方法
class ShadowAPICustomElement extends HTMLElement {
  constructor() {
    super();
    // 创建Shadow DOM根节点
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // 在Shadow DOM中定义内部状态
    this._internalValue = '子组件内部的状态';
  }

  // 暴露API方法
  getInternalValue() {
    return this._internalValue;
  }
}

// 注册自定义元素
customElements.define('shadow-api-element', ShadowAPICustomElement);
```

父组件 main.js

```js
// 确保DOM加载完毕之后再执行
window.onload = () => {
  // 获取已实例化的自定义元素
  const myComponent = document.getElementById('myElement');

  // 调用暴露的方法获取内部状态
  const valueFromComponent = myComponent?.getInternalValue();

  const main = document.getElementById('main');
  main.innerHTML = valueFromComponent;
};
```

在这个例子中，我们创建了一个名为 ShadowAPICustomElement 的 Web Component，它使用了 Shadow DOM，并在其中定义了一个内部状态变量 internalValue。组件对外暴露了一个 API 方法 getInternalValue，允许外部代码通过调用此方法获取组件内部 Shadow DOM 中的状态。虽然实际 DOM 操作在 Shadow DOM 内部进行，但暴露的 API 方法不受此限制，依旧可以从外部访问组件内部的状态

demo: [Api 方法暴露](https://stackblitz.com/edit/stackblitz-starters-pjepbx?description=HTML/CSS/JS%20Starter&file=index.html%3AL7-L7&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image9.jpg"></ImagePreview>

### 全局状态管理

对于更复杂的场景，可能需要结合第三方状态管理库如 Redux、MobX 等，在组件外共享全局状态，然后在组件内订阅这些状态变化

## css 穿透

### CSS Variables

CSS Variables（CSS 自定义属性）是一种可以在整个文档甚至跨多个层叠上下文（包括 Shadow DOM）中定义和使用可重用值的方式。它们以--开头声明，并通过 var()函数引用

我们可以利用如:root 在 CSS 中是一个伪类选择器，它代表的是整个文档的根元素。在 HTML 文档中，根元素始终是`<html>`标签。使用:root 选择器可以为整个文档设置全局的 CSS 变量（CSS Custom Properties）和样式规则，这些变量和规则可以被文档内的任何元素所继承或参考

```js
// 例如：
:root {
  --primary-color: #ff0000; /* 定义一个全局CSS变量 */
  font-size: 16px; /* 设置全局字体大小 */
}
```

在此例中，`--primary-color` 变量在整个 HTML 文档范围内都是可用的，而 font-size 样式将应用于整个文档的基础字体大小。任何子元素都可以通过 `var(--primary-color)`来引用这个颜色变量，从而保持样式的一致性与可维护性。同时，全局的字体大小设定会影响到所有没有明确设置字体大小的元素。利用这一特性，我们就可以进行样式穿透

demo: [CSS 自定义属性](https://stackblitz.com/edit/stackblitz-starters-q3dpnh?description=HTML/CSS/JS%20Starter&file=index.html&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image6.png"></ImagePreview>

### CSS Shadow Parts

CSS Shadow Parts 是一项 Web Components 技术，它允许开发者指定 Shadow DOM 中的某些部分可以由外部样式表进行样式化。通过使用 ::part() 伪类选择器，外部样式可以定位到那些标记为可公开样式化的 Shadow DOM 元素。

demo: [CSS Shadow Parts](https://stackblitz.com/edit/stackblitz-starters-jaaxlq?description=HTML/CSS/JS%20Starter&file=index.html&file=child.js&terminalHeight=10&title=Static%20Starter)

<ImagePreview src="/images/webComponent/image10.jpg"></ImagePreview>

在这个例子中，`custom-element` 的头部部分通过 `part="header"` 标记为可公开样式化。外部样式表中的 `custom-element::part(header)` 选择器就用来给这个头部添加额外的样式，比如改变字体颜色和添加底部边框。这样，即便是在 Shadow DOM 中的元素，也能通过 CSS Shadow Parts 接受外部样式的影响。

## React 中使用

在 React 中使用 Web Components 时，你可以直接在 React 组件中像使用普通 HTML 元素那样引用自定义元素（即 Web Components）。这是因为 React 允许你将任何有效的 DOM 元素作为 JSX 渲染，包括自定义元素。

例子：
首先，我们假设已经有了一个简单的 Web Component，比如 MyCounter，它可以增加计数并在页面上显示：

```js
// 自定义Web Component的定义（通常在一个单独的.js文件中）
class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        #counter {
          font-size: 2em;
        }
      </style>
      <button id="increment">Increment</button>
      <span id="counter">0</span>
    `;
    this.incrementBtn = this.shadowRoot.querySelector('#increment');
    this.counterDisplay = this.shadowRoot.querySelector('#counter');
  }

  connectedCallback() {
    this.incrementBtn.addEventListener('click', () => this.increment());
  }

  increment() {
    this.count++;
    this.counterDisplay.textContent = this.count;
  }
}

customElements.define('my-counter', MyCounter);
```

接下来，在 React 组件中，我们可以使用 useRef Hook 来访问并控制这个 Web Component：

```js
import React, { useRef, useEffect } from 'react';

function ReactWebComponentExample() {
  // 创建一个ref来保存Web Component实例
  const counterRef = useRef(null);

  // 在React组件中模拟点击按钮增加计数
  const handleClick = () => {
    if (counterRef.current) {
      // 调用Web Component的方法（如果存在）
      counterRef.current.increment();
    }
  };

  // 使用Web Component
  return (
    <div>
      <button onClick={handleClick}>Increment from React</button>
      {/* 将ref绑定到Web Component */}
      <my-counter ref={counterRef} />
    </div>
  );
}

export default ReactWebComponentExample;
```

我们创建了一个 useRef 来存储`<my-counter>`组件的实例。
定义了一个 React 的 handleClick 函数，当点击“Increment from React”按钮时，它会尝试调用 Web Component 的 increment 方法（假设这个方法暴露给了外部调用）。
在 JSX 中，我们将 counterRef 传递给`<my-counter>`组件作为 ref 属性，这样当组件挂载后，ref 对象的.current 属性就会指向 Web Component 的真实 DOM 节点。

demo: [react 中使用 web Component](https://stackblitz.com/edit/vitejs-vite-uc117z?file=index.html,src%2FApp.tsx&file=index.html&terminal=dev)

<ImagePreview src="/images/webComponent/gif2.gif"></ImagePreview>

## 第三方库

### Lit

[Lit](https://lit.dev/) 是 Google 出品的一个用于构建快速、轻量级的 Web Components 库。Lit 的核心是一个消除样板代码的组件基类，它提供 reactive state、 scoped styles 和一个小巧、快速、且富有表现力的 declarative template system。我们可以基于这个库来实现 semi design 那样的组件库。

## 对比其他框架

### 优势

- 跨框架/库兼容性：由于 Web Components 是原生浏览器 API，它们能够在不同框架之间共享和复用，实现最大程度的兼容性。
- 原生支持：不需要额外引入大型框架，降低了项目体积，理论上提高了性能，并减少了对框架特定版本升级带来的维护成本。
- 封装性：Web Components 提供了 Shadow DOM，能够实现样式和行为的良好封装，防止全局样式污染和内部实现细节泄露。
- 自定义元素：允许开发者自定义新的 HTML 标签，使得组件更加语义化且易于理解。
- 标准化：不受单一供应商或框架的影响，具有更好的持久性和稳定性，未来有望得到所有主流浏览器的广泛支持。

### 缺点

- 成熟度和生态：尽管 Web Components 是一项标准，但在实际开发中，现代前端框架拥有更成熟的生态系统和丰富的第三方组件库。
- 开发便利性：相对于 React、Vue 等框架提供的便捷的数据绑定、状态管理、虚拟 DOM、生命周期钩子等功能，Web Components 的开发体验可能不够直观和高效。
- 数据绑定：Web Components 的数据绑定机制不如某些框架自动化，通常需要手动处理属性绑定和事件监听。
- 抽象层次：现代框架提供了更多高级抽象层，比如 React 的函数式编程模型和 Vue 的响应式系统，简化了许多复杂任务。
- 工具链支持：框架通常配有强大的构建工具、热重载、类型检查等工具链支持，而 Web Components 在开发过程中可能需要搭配其他工具才能获得类似的功能。

<BackTop></BackTop>