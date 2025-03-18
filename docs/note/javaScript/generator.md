---
toc: content
title: generator生成器
---

# javascript

## Generator

### 介绍

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同

回顾下上文提到的解决异步的手段：

- 回调函数
- promise

那么，上文我们提到 promsie 已经是一种比较流行的解决异步方案，那么为什么还出现 Generator？甚至 async/await 呢？

该问题我们留在后面再进行分析，下面先认识下 Generator

### Generator 函数

执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态

形式上，Generator 函数是一个普通函数，但是有两个特征：

- function 关键字与函数名之间有一个星号
- 函数体内部使用 yield 表达式，定义不同的内部状态

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

### 使用

Generator 函数会返回一个遍历器对象，即具有 Symbol.iterator 属性，并且返回给自己

```js
function* gen() {
  // some code
}

var g = gen();

g[Symbol.iterator]() === g;
// true
```

通过 yield 关键字可以暂停 generator 函数返回的遍历器对象的状态

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
var hw = helloWorldGenerator();
```

上述存在三个状态：hello、world、return

通过 next 方法才会遍历到下一个内部状态，其运行逻辑如下：

- 遇到 yield 表达式，就暂停执行后面的操作，并将紧跟在 yield 后面的那个表达式的值，作为返回的对象的 value 属性值。
- 下一次调用 next 方法时，再继续往下执行，直到遇到下一个 yield 表达式
- 如果没有再遇到新的 yield 表达式，就一直运行到函数结束，直到 return 语句为止，并将 return 语句后面的表达式的值，作为返回的对象的 value 属性值。
- 如果该函数没有 return 语句，则返回的对象的 value 属性值为 undefined

```js
hw.next();
// { value: 'hello', done: false }

hw.next();
// { value: 'world', done: false }

hw.next();
// { value: 'ending', done: true }

hw.next();
// { value: undefined, done: true }
```

done 用来判断是否存在下个状态，value 对应状态值

yield 表达式本身没有返回值，或者说总是返回 undefined

通过调用 next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值

```js
function* foo(x) {
  var y = 2 * (yield x + 1);
  var z = yield y / 3;
  return x + y + z;
}

var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); // Object{value:NaN, done:false}
a.next(); // Object{value:NaN, done:true}

var b = foo(5);
b.next(); // { value:6, done:false }
b.next(12); // { value:8, done:false }
b.next(13); // { value:42, done:true }
```

正因为 Generator 函数返回 Iterator 对象，因此我们还可以通过 for...of 进行遍历

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

原生对象没有遍历接口，通过 Generator 函数为它加上这个接口，就能使用 for...of 进行遍历了

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

<BackTop></BackTop>