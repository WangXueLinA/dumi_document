---
toc: content
title: call,apply,bind
group: 源码
---

# call,apply,bind

## call

### 实现原理

call 方法的作用是调用函数，并且改变函数内部的 this 指向，同时可以传递参数给该函数。call 方法的基本原理是利用 JavaScript 的函数调用机制，其中 this 的值取决于函数调用的位置。通过创建一个新的函数并将其 this 绑定到指定的对象，然后立即调用该函数，就可以实现 call 的效果。

### 手动实现

```js
// 手动实现 call 方法
Function.prototype.myCall = function (context, ...args) {
  // 确保 context 不为 null 或 undefined，因为在严格模式下，null 或 undefined 无法作为函数的 this 值
  context = context || (typeof window !== 'undefined' ? window : global); // 在浏览器中为 window，在 Node.js 中为 global

  // 创建一个临时函数，目的是让 this 在调用时指向 context
  const that = context;
  const tempFn = function () {
    return this.fn(...args);
  };

  // 将待调用的函数（即 this 函数）赋值给临时函数的 fn 属性
  tempFn.fn = this;

  // 通过上下文调用临时函数，间接实现 this 的绑定和参数传递
  const result = that[tempFn]();

  // 清理临时函数的 fn 属性，以免影响后续操作
  delete tempFn.fn;

  // 返回函数调用的结果
  return result;
};

// 测试用例
function Test() {
  this.value = 'From Test';
}

Test.prototype.greet = function (name) {
  console.log(`Hello, ${name}, I am from ${this.value}`);
};

let obj = new Test();
Test.prototype.greet.myCall(obj, 'World'); // 输出：Hello, World, I am from From Test
```

创建了一个临时函数 tempFn，并将当前函数（this）赋值给它的 fn 属性。然后通过 that[tempFn]() 的方式调用，这里的 that 是传入的 context 参数，这样就实现了在指定上下文中调用函数的效果。同时，我们还传入了参数，确保了和原生 call 方法一致的功能。

## apply

### 实现原理

apply 方法允许你调用一个函数，并指定一个上下文（this 的值）以及一个参数数组。在函数内部，apply 会将参数数组展开并传递给调用函数。其基本原理同样是利用 JavaScript 函数调用时 this 的动态绑定特性，同时将数组形式的参数转换成单独参数传递给函数。

### 手动实现

```js
Function.prototype.myApply = function (context, argsArray) {
  // 确保 context 不为 null 或 undefined，因为在严格模式下，null 或 undefined 无法作为函数的 this 值
  context = context || (typeof window !== 'undefined' ? window : global); // 在浏览器中为 window，在 Node.js 中为 global

  // 如果参数数组为空或不是数组，创建一个空数组
  if (!Array.isArray(argsArray)) {
    argsArray = [];
  }

  // 创建一个临时函数，用于改变上下文并在新的上下文中执行
  const fn = function (...innerArgs) {
    return this(...argsArray.concat(innerArgs));
  };

  // 将当前函数（即 this）赋值给临时函数的 fn 属性
  fn.fn = this;

  // 使用上下文调用临时函数
  const result = context[fn]();

  // 清理临时函数的 fn 属性
  delete fn.fn;

  // 返回函数调用的结果
  return result;
};

// 测试用例
function multiply(a, b) {
  console.log(this.name + ' multiplied:', a, 'and', b, 'to get', a * b);
}

let obj = { name: 'Calculator' };
multiply.myApply(obj, [3, 4]); // 输出：Calculator multiplied: 3 and 4 to get 12
```

创建了一个临时函数 fn，将待调用的函数（即 this 函数）赋值给 fn 的 fn 属性。然后将 argsArray 中的参数通过 concat 方法与 innerArgs（在实际调用时为空）合并，传入到函数调用中，以此模拟原生 apply 方法的参数传递行为。最后，通过 context[fn]() 的方式执行函数，并确保 this 指向正确的上下文。

## bind

### 实现原理

bind 方法用于创建一个新的函数，当调用这个新函数时，它的 this 值被设置为 bind 方法的第一个参数，其余参数将作为原函数调用时的预设参数。这意味着 bind 并不是立即执行函数，而是返回一个函数的引用，该函数的上下文和初始参数已经被提前绑定好。

### 手动实现

```js
Function.prototype.myBind = function (context, ...boundArgs) {
  // 确保 context 不为 null 或 undefined，因为在严格模式下，null 或 undefined 无法作为函数的 this 值
  context = context || (typeof window !== 'undefined' ? window : global); // 根据运行环境选择合适的全局对象

  // 保存原函数引用
  const fn = this;

  // 返回一个新函数，这个新函数内部负责设置上下文并调用原函数
  return function (...callArgs) {
    // 如果调用新函数时提供了额外的参数，则与已绑定参数结合
    const args = boundArgs.concat(callArgs);

    // 在指定的上下文上调用原函数，并传递组合好的参数
    return fn.apply(context, args);
  };
};

// 测试用例
function greeting(name, timeOfDay) {
  console.log(
    `Hello, ${this.user}! Today is a ${timeOfDay}. Your name is ${name}.`,
  );
}

let userObject = { user: 'John' };

// 使用自定义 bind 方法创建一个新的函数
let customGreeting = greeting.myBind(userObject, 'afternoon');

// 调用新函数，传递剩余参数
customGreeting('Jane'); // 输出：Hello, John! Today is a afternoon. Your name is Jane.
```

myBind 方法接受一个 context 参数（即将成为新函数调用时的 this）和一系列预设参数 boundArgs。它返回一个新的函数，该函数内部封装了 apply 方法来调整 this 的上下文并传递参数。这样，当你调用返回的新函数时，它实际上就是在预先设定的 context 下调用了原始函数，并传入了绑定和即时传入的所有参数。

<BackTop></BackTop>