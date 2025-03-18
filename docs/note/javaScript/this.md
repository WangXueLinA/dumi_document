---
toc: content
title: this
---

# javascript

## this

### 全局上下文或普通函数调用

在全局上下文中（非严格模式下），this 指向全局对象，在浏览器中是 window，在 Node.js 中是 global。

```js
console.log(this); // 在浏览器中输出window，Node.js中输出global
```

当一个函数不作为某个对象的方法调用，而是独立调用时，this 同样指向全局对象（非严格模式）或 undefined（严格模式）。

```js
function sayHello() {
  console.log(this);
}

sayHello(); // 非严格模式下输出window或global，严格模式下输出undefined
```

### 对象方法中的 this

当函数作为某个对象的方法被调用时，this 指向该对象。

```js
const person = {
  name: 'Alice',
  sayHello: function () {
    console.log(this.name); // 输出'Alice'，因为this指向person对象
  },
};

person.sayHello();
```

### 构造函数中的 this

在使用 new 关键字调用构造函数时，this 指向新创建的对象实例。

```js
function Person(name) {
  this.name = name;
  console.log(this);
}

const alice = new Person('Alice'); // this指向新创建的alice对象
```

### 箭头函数

箭头函数不绑定自己的 this，它会捕获其所在上下文的 this 值作为自己的 this 值。

```js
const person = {
  name: 'Bob',
  sayHello: () => {
    console.log(this.name); // 这里的this仍然指向全局对象，因为箭头函数没有自己的this
  },
};

person.sayHello(); // 可能输出undefined或其他全局变量名，取决于环境
```

为了避免这种情况，如果需要在对象方法中使用箭头函数并希望 this 指向对象本身，可以在定义对象方法时使用普通函数。

### Function.prototype.call(), .apply(), 和 .bind()

这些方法可以显式地设置函数调用时 this 的值。

```js
function showName() {
  console.log(this.name);
}

const person1 = { name: 'Charlie' };
const person2 = { name: 'David' };

showName.call(person1); // 输出'Charlie'
showName.apply(person2); // 输出'David'

// 使用.bind()创建一个新的函数，其this值预先设定为person1
const boundShowName = showName.bind(person1);
boundShowName(); // 输出'Charlie'
```

### call

- 作用：调用函数并在指定的 this 上下文中执行，同时可以直接传递参数。
- 语法：fun.call(thisArg[, arg1[, arg2[, ...]]])
- 示例：

```js
function greet(name) {
  console.log(`Hello, ${this.name}, ${name}`);
}
let user = { name: 'John' };
greet.call(user, 'Doe'); // 输出：Hello, John, Doe
```

### apply

- 作用：与 call() 类似，也是调用函数并在指定的 this 上下文中执行，但是它接收参数的方式不同。
- 语法：fun.apply(thisArg, [argsArray])
- 示例：

```js
function add(a, b) {
  console.log(this.label + ' -> ' + (a + b));
}
let calculator = { label: 'Calculator' };
add.apply(calculator, [10, 20]); // 输出：Calculator -> 30
```

### bind

- 作用：创建一个新的函数，当调用这个新函数时，它的 this 值被永久地绑定到了 bind() 的第一个参数上。新函数并不会立即执行，而是返回一个已绑定上下文的新函数引用。
- 语法：fun.bind(thisArg[, arg1[, arg2[, ...]]])
- 示例：

```js
function logMessage(message) {
  console.log(`${this.user}: ${message}`);
}
let userContext = { user: 'User1' };
let boundLog = logMessage.bind(userContext);
boundLog('Some message'); // 输出：User1: Some message
// 可以延迟调用
setTimeout(boundLog, 1000, 'Delayed message'); // 输出：User1: Delayed message
```

总结：

1. call 和 apply 都是在调用时就立刻执行原函数，只是参数传递方式不同，call 接受的是一个个单独的参数，apply 接收的是一个数组作为参数列表。
2. bind 并不执行函数，而是创建并返回一个新的函数，这个新函数保持了对其原函数的引用，并且具有预先设定好的 this 值。它可以用于事件处理函数、定时器回调等场合，确保在回调函数执行时 this 指向预期的对象。

<BackTop></BackTop>