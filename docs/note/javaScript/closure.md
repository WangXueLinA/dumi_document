---
toc: content
title: 闭包
---

# javascript

## 闭包

### 定义

有权访问另一个函数作用域内变量的函数

### 原理

闭包的实现，实际上是利用了 JavaScript 中作用域链的概念，简单理解就是：在 JavaScript 中，如果在某个作用域下访问某个变量的时候，如果不存在，就一直向外层寻找，直到在全局作用域下找到对应的变量为止，这里就形成了所谓的作用域链。

### 特性

1. 闭包可以访问到父级函数的变量
2. 访问到父级函数的变量不会销毁

### 使用场景

1. 封装私有变量

闭包可以隐藏数据，实现类似面向对象中的“私有属性”。

```javascript
function createCounter() {
  let count = 0; // 私有变量
  return {
    increment() {
      count++;
    },
    get() {
      return count;
    },
  };
}
const counter = createCounter();
counter.increment();
console.log(counter.get()); // 1
```

2. 模块化开发

利用闭包实现模块模式，隔离作用域。

```javascript
const module = (function () {
  let privateVar = 0;
  function privateMethod() {
    /* ... */
  }
  return {
    publicMethod() {
      /* ... */
    },
  };
})();
```

3. 回调函数与事件处理

闭包保留上下文状态，常用于异步操作。

```javascript
function handleClick(id) {
  document.getElementById(id).onclick = function () {
    console.log(`Clicked element: ${id}`); // 闭包保留id的值
  };
}
```

4. 函数柯里化

通过闭包分步传递参数。

```javascript
function add(a) {
  return function (b) {
    return a + b;
  };
}
const add5 = add(5);
console.log(add5(3)); // 8
```

5. 循环中的闭包

解决循环变量捕获问题（如 var 的缺陷）。

```javascript
for (let i = 0; i < 5; i++) {
  // 使用let块级作用域
  setTimeout(() => console.log(i), 100); // 输出0,1,2,3,4
}
```

## 节流防抖

相同点：

- 都可以通过使用 setTimeout 实现
- 目的都是，降低回调执行频率。节省计算资源

不同点：

1.  - 函数防抖：在一段连续操作结束后，处理回调，利用 clearTimeout 和 setTimeout 实现。
    - 函数节流：在一段连续操作中，每一段时间只执行一次，频率较高的事件中使用来提高性能

2.  - 函数防抖：在事件被触发后，在指定的时间内如果事件没有再次被触发，则执行一次函数；如果在这段时间内事件再次被触发，则重新计时。输入框搜索、窗口大小调整等。
    - 函数节流：在规定的时间间隔内，无论事件触发了多少次，都只执行一次函数。如滚动监听、鼠标移动等。

```js
// 节流
function throttle(fn, timeout) {
  let timer = null;
  return function (...arg) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arg);
      timer = null;
    }, timeout);
  };
}

// 防抖
function debounce(fn, timeout) {
  let timer = null;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arg);
    }, timeout);
  };
}
```

<BackTop></BackTop>