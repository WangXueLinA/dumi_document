---
toc: content
title: 扩展运算符
---

# javascript

## 扩展运算符

ES6 通过扩展元素符...，好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列

```js
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

主要用于函数调用的时候，将一个数组变为参数序列

```js
function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers); // 42
```

可以将某些数据结构转为数组

```js
[...document.querySelectorAll('div')];
```

能够更简单实现数组复制

```js
const a1 = [1, 2];
const [...a2] = a1;
// [1,2]
```

数组的合并也更为简洁了

```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];
[...arr1, ...arr2, ...arr3];
// [ 'a', 'b', 'c', 'd', 'e' ]
```

<Alert message='通过扩展运算符实现的是浅拷贝，修改了引用指向的值，会同步反映到新数组'></Alert>

下面看个例子就清楚多了

```js
const arr1 = ['a', 'b', [1, 2]];
const arr2 = ['c'];
const arr3 = [...arr1, ...arr2];
arr[1][0] = 9999; // 修改arr1里面数组成员值
console.log(arr[3]); // 影响到arr3,['a','b',[9999,2],'c']
```

扩展运算符可以与解构赋值结合起来，用于生成数组

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first; // 1
rest; // [2, 3, 4, 5]

const [first, ...rest] = [];
first; // undefined
rest; // []

const [first, ...rest] = ['foo'];
first; // "foo"
rest; // []
```

如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错

```js
const [...butLast, last] = [1, 2, 3, 4, 5];
// 报错

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// 报错
```

可以将字符串转为真正的数组

```js
[...'hello'];
// [ "h", "e", "l", "l", "o" ]
```

定义了遍历器（Iterator）接口的对象，都可以用扩展运算符转为真正的数组

```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
```

如果对没有 Iterator 接口的对象，使用扩展运算符，将会报错

```js
const obj = { a: 1, b: 2 };
let arr = [...obj]; // TypeError: Cannot spread non-iterable object
```

<BackTop></BackTop>