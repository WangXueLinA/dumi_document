---
toc: content
title: intanceof 操作符
group: 源码
---

# intanceof 操作符

instanceof 是 JavaScript 中的一个操作符，用于检测一个对象是否属于某个构造函数的实例，或者说是它的原型链上是否存在构造函数的 prototype 属性

## 实现原理

instanceof 操作符的工作原理是沿着对象的原型链逐层向上查找，直到找到构造函数的 prototype 对象或者到达原型链顶端（即 null）。如果在原型链中找到了构造函数的 prototype，那么 instanceof 返回 true，否则返回 false。

例如，假设我们有一个构造函数 Foo，当我们创建了一个 Foo 的实例 bar，并且执行 bar instanceof Foo，JavaScript 引擎会按照以下步骤检查：

1. 获取 bar 的内部 `[[Prototype]]`（即 **proto** 或者通过 `Object.getPrototypeOf(bar)` 获取）。
2. 检查这个原型对象是否等于 `Foo.prototype`。
3. 如果不相等，则继续获取原型对象的原型，重复步骤 2。
4. 如果在原型链中找到了 `Foo.prototype`，则返回 true，否则在原型链顶端仍未找到时返回 false。

## 手动实现

```js
function myInstanceof(left, right) {
  while (left !== null) {
    if (left === right.prototype) {
      return true;
    }
    left = Object.getPrototypeOf(left);
  }
  return false;
}
```

以上代码实现了 instanceof 的基本功能，通过递归地遍历 left 的原型链，直至找到 right.prototype 或到达原型链尽头

<BackTop></BackTop>