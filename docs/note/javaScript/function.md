---
toc: content
title: function函数
---

# javascript

## function 函数

### 定义方式

1. 函数声明

```javascript
function sayHello(name) {
  return `Hello, ${name}!`;
}
console.log(sayHello('Alice')); // 输出: Hello, Alice!
```

2. 函数表达式

```javascript
const sayHello = function (name) {
  return `Hello, ${name}!`;
};
console.log(sayHello('Bob')); // 输出: Hello, Bob!
```

3. 箭头函数

```javascript
const sayHello = (name) => `Hello, ${name}!`;
console.log(sayHello('Charlie')); // 输出: Hello, Charlie!
```

4. 构造函数 不推荐

```javascript
const sayHello = new Function('name', "return 'Hello, ' + name + '!'");
console.log(sayHello('Dave')); // 输出: Hello, Dave!
```

### 调用方式

1. 直接调用

```javascript
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 输出: 5
```

2. 方法调用（作为对象属性）

```javascript
const calculator = {
  multiply: function (a, b) {
    return a * b;
  },
};
console.log(calculator.multiply(4, 5)); // 输出: 20
```

3. 构造函数调用（通过 new）

```javascript
function Person(name) {
  this.name = name;
}
const person = new Person('Eve');
console.log(person.name); // 输出: Eve
```

4. 通过 call/apply/bind

```javascript
function greet() {
  return `Hello, ${this.name}`;
}
const user = { name: 'Frank' };

console.log(greet.call(user)); // 输出: Hello, Frank
console.log(greet.apply(user)); // 同上
const boundGreet = greet.bind(user);
console.log(boundGreet()); // 同上
```

### 函数参数

1. 默认参数（ES6+）

```javascript
function createUser(name, role = 'user') {
  return { name, role };
}
console.log(createUser('Grace')); // 输出: { name: "Grace", role: "user" }
```

2. 剩余参数

```javascript
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}
console.log(sum(1, 2, 3)); // 输出: 6
```

3. arguments 对象

```javascript
function showArgs() {
  console.log([...arguments]); // 转换为数组
}
showArgs(1, 'a', true); // 输出: [1, "a", true]
```

### 高阶函数与函数组合

1. 回调函数

```javascript
function fetchData(callback) {
  setTimeout(() => callback('Data received'), 1000);
}
fetchData((data) => console.log(data)); // 1秒后输出: Data received
```

2. 返回函数的函数

```javascript
function createMultiplier(factor) {
  return (num) => num * factor;
}
const double = createMultiplier(2);
console.log(double(5)); // 输出: 10
```

3. 函数组合

```javascript
const add = (x) => x + 1;
const multiply = (x) => x * 2;
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);
const transform = compose(multiply, add);
console.log(transform(3)); // 输出: (3+1)*2=8
```

### 特殊函数类型

1. 立即调用函数表达式（IIFE）

```javascript
(function () {
  console.log('IIFE executed!');
})();
// 输出: IIFE executed!
```

1. 生成器函数（Generator）ES6+

```javascript
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
const gen = idGenerator();
console.log(gen.next().value); // 输出: 1
console.log(gen.next().value); // 输出: 2
```

### 函数属性和方法

1. name 属性

```javascript
function foo() {}
console.log(foo.name); // 输出: "foo"
```

2. length 属性

```javascript
function bar(a, b, c) {}
console.log(bar.length); // 输出: 3
```

rest 参数也不会计入 length 属性

```js
(function (...args) {}).length; // 0
```

如果设置了默认值的参数不是尾参数，那么 length 属性也不再计入后面的参数了

```js
(function (a = 0, b, c) {}).length(
  // 0
  function (a, b = 1, c) {},
).length; // 1
```

3. toString()

```javascript
function test() {
  return 'test';
}
console.log(test.toString()); // 输出函数源码字符串
```

### 递归函数

```javascript
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
console.log(factorial(5)); // 输出: 120
```

### 箭头函数

使用“箭头”（=>）定义函数

```js
var f = (v) => v;

// 等同于
var f = function (v) {
  return v;
};
```

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分

```js
var f = () => 5;
// 等同于
var f = function () {
  return 5;
};

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function (num1, num2) {
  return num1 + num2;
};
```

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用 return 语句返回

```js
var sum = (num1, num2) => {
  return num1 + num2;
};
```

如果返回对象，需要加括号将对象包裹

```js
let getTempItem = (id) => ({ id: id, name: 'Temp' });
```

<Alert>

- 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用 new 命令，否则会抛出一个错误
- 不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数

</Alert>

<BackTop></BackTop>