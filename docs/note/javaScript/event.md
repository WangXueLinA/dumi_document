---
toc: content
title: 事件委托
order: -100
---

# javascript

## 事件冒泡，事件捕获以及事件委托

### 事件冒泡

事件冒泡是 DOM 事件流的一个重要组成部分，它描述了事件从触发事件的元素（称为“目标元素”）开始，沿着 DOM 树向上逐级传播至根节点（通常是 document）的过程。这个过程就像气泡从水底升至水面一样，因此得名“事件冒泡”。

具体来说，当用户在一个元素上触发某个事件（如点击、鼠标移动等），事件首先在目标元素上触发，然后依次传递到其直接父元素、祖父元素等，直到抵达最顶层的 document 对象。每个层级的元素在接收到事件时，都会执行在此元素上注册的同类型事件处理程序。

```html
<div id="a">
  <div id="b">
    <div id="c"></div>
  </div>
</div>
```

```js
let a = document.getElementById('a');
let b = document.getElementById('b');
let c = document.getElementById('c');

a.addEventListener('click', () => {
  console.log('a被点击');
});

b.addEventListener('click', (event) => {
  console.log('b被点击');
});

c.addEventListener('click', (event) => {
  console.log('c被点击');
});
```

当我们点击 c 的时候，会发现控制台会打印的顺序为 c,b,a

### 阻止默认行为方法

有时候，在处理事件的过程中，我们可能需要阻止事件的默认行为，例如点击链接时阻止跳转页面。在 JavaScript 中，我们可以使用 event.stopPropagation() 方法来阻止事件流的传播。调用该方法后，事件将不再继续传播，不会触发其他元素上的事件处理函数。
在 b 内添加该方法可以阻止 b 之后的事件流传播

```html
<div id="a">
  <div id="b"></div>
</div>
```

```js
let a = document.getElementById('a');
let b = document.getElementById('b');
a.addEventListener('click', () => {
  console.log('a被点击');
});

b.addEventListener('click', (event) => {
  console.log('b被点击');
  event.stopPropagation();
});
```

也就是点击 b 的时候，不会冒泡给 a 事件，a 的事件是不会触发的

### 事件捕获

与事件冒泡相对的是事件捕获。事件捕获是事件流的另一部分，它发生在事件冒泡之前。事件捕获是从 document 开始，沿着 DOM 树向下传播至目标元素的过程。在这个阶段，事件首先由 document 接收，然后传递给最近的祖先元素，再逐级向下直至到达触发事件的目标元素。

事件捕获的设计初衷是为了让处于 DOM 结构较上层的元素有机会在事件实际发生于子元素之前就得到通知。然而，在大多数 Web 开发场景中，事件捕获阶段的事件处理程序并不常用，开发者通常更关注事件冒泡阶段。要指定事件监听器在捕获阶段触发，可以将 addEventListener 的第三个参数设置为 true

```js
document.addEventListener('click', handler, true); // 在捕获阶段触发
```

### 事件委托

事件委托是一种利用事件冒泡（或事件捕获，但通常使用事件冒泡）机制优化事件处理的技术。它的核心思想是：不是直接将事件监听器绑定到可能触发事件的所有子元素上，而是将其绑定到这些子元素的共同父元素或祖先元素上。

当子元素触发事件时，事件会按照事件冒泡的规则向上传播到已绑定事件的父元素。父元素的事件处理器可以通过检查事件对象的 event.target 属性来确定实际触发事件的子元素，然后根据需要执行相应的操作。

事件委托的优点包括：

提高性能：对于动态添加、删除或更新的子元素，无需反复为它们添加或移除事件监听器，只需保持对父元素的单个监听器即可。
减少内存占用：特别是在大型 DOM 树或频繁变化的元素集合中，避免了大量的事件处理器占用内存。
简化代码：对于具有相似事件处理需求的子元素，可以在父元素的事件处理器中统一处理，无需为每个子元素编写独立的事件处理逻辑。

```js
const parentElement = document.getElementById('parent');

parentElement.addEventListener('click', function (event) {
  const target = event.target;

  if (target.matches('.child-element')) {
    // 处理点击了.child-element类的子元素的情况
  } else if (target.matches('.another-child')) {
    // 处理点击了.another-child类的子元素的情况
  }

  // ... 其他子元素的处理逻辑
});
```

在这个例子中，所有.child-element 和.another-child 类的子元素的点击事件都会冒泡到 parentElement，然后由其上的事件处理器根据 event.target 进行相应的处理。这样，即使子元素数量众多或动态变化，也只需维护 parentElement 上的单一事件监听器。

<BackTop></BackTop>