---
toc: content
title: new 操作符
group: 源码
---

# new 操作符

## 实现原理

手写一个 new 操作符的核心在于模拟它执行的几个关键步骤：

1. 创建一个新的空对象；
2. 将新建对象的原型链接至构造函数的 prototype；
3. 在新创建的对象上下文中调用构造函数；
4. 如果构造函数返回一个对象，则返回这个对象，否则返回新创建的对象。

## 手动实现

```js
// 手写 new 操作符
function manualNew(Constructor, ...args) {
  // 创建一个空对象
  const newObj = {};

  // 将新对象的 [[Prototype]] 链接到构造函数的 prototype
  newObj.__proto__ = Constructor.prototype; // ES5 实现
  // 或者使用 Object.setPrototypeOf 方法（ES6）
  // Object.setPrototypeOf(newObj, Constructor.prototype);

  // 在新创建的对象上下文中调用构造函数
  const result = Constructor.apply(newObj, args);

  // 如果构造函数返回了一个对象，那么返回这个对象；否则返回新创建的对象
  return result instanceof Object && result !== null ? result : newObj;
}

// 测试用例
function Person(name) {
  this.name = name;
}

let person = manualNew(Person, 'Alice');
console.log(person.name); // 输出 "Alice"
```

<BackTop></BackTop>