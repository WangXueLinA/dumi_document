---
toc: content
title: Array数组
---

# javascript

## Array 数组

### 基础

#### 创建数组

```javascript
// 方式1：字面量
const arr1 = [1, 'a', true];

// 方式2：构造函数
const arr2 = new Array(3); // 创建长度为3的空数组 [empty ×3]
const arr3 = new Array(1, 2, 3); // [1, 2, 3]
```

#### 访问与修改元素

```javascript
const arr = [10, 20, 30];
console.log(arr[0]); // 10
arr[1] = 200; // 修改元素 → [10, 200, 30]
arr[3] = 40; // 添加元素 → [10, 200, 30, 40]
```

#### 数组长度

```javascript
console.log(arr.length); // 4
arr.length = 2; // 截断数组 → [10, 200]
```

### 数组\\常用 API

1. 增删元素

| 方法    | 描述         | 是否修改原数组 | 案例                       |
| ------- | ------------ | :------------: | -------------------------- |
| push    | 末尾添加元素 |       ✅       | arr.push(4); // [1,2,3,4]  |
| pop     | 删除末尾元素 |       ✅       | arr.pop(); // [1,2]        |
| unshift | 开头添加元素 |       ✅       | arr.unshift(0); // [0,1,2] |
| shift   | 删除开头元素 |       ✅       | arr.shift(); // [2,3]      |

2. 合并与拆分

| 方法   | 描述               | 是否修改原数组 | 案例                                    |
| ------ | ------------------ | :------------: | --------------------------------------- |
| concat | 合并数组           |       ❌       | arr1.concat(arr2); // 新数组            |
| slice  | 截取子数组         |       ❌       | arr.slice(1,3); // 索引 1 到 2 的元素   |
| splice | 删除/替换/插入元素 |       ✅       | arr.splice(1,1,"x"); // 替换索引 1 元素 |

3. 遍历数组

| 方法    | 描述               | 返回值     | 案例                               |
| ------- | ------------------ | ---------- | ---------------------------------- |
| forEach | 遍历元素           | undefined  | arr.forEach(v => console.log(v))   |
| map     | 映射新数组         | 新数组     | `arr.map(v => v * 2)`; // 双倍值   |
| filter  | 过滤符合条件的元素 | 新数组     | arr.filter(v => v > 2);            |
| reduce  | 累积计算结果       | 最终累积值 | arr.reduce((sum, v) => sum + v, 0) |

4. 查找元素

| 方法      | 描述               | 返回值                    | 案例                       |
| --------- | ------------------ | ------------------------- | -------------------------- |
| indexOf   | 查找元素索引       | 索引/-1 arr.indexOf("a"); |
| find      | 查找符合条件的元素 | 第一个匹配值              | arr.find(v => v.age > 18); |
| findIndex | 查找符合条件的索引 | 索引/-1                   | arr.findIndex(v => v > 2); |
| includes  | 是否包含元素       | true/false                | arr.includes(3);           |

5. 排序与反转

| 方法    | 描述         | 是否修改原数组 | 案例                       |
| ------- | ------------ | :------------: | -------------------------- |
| sort    | 排序数组     |       ✅       | arr.sort((a, b) => a - b); |
| reverse | 反转数组顺序 |       ✅       | arr.reverse();             |

6. 其他实用方法

| 方法    | 描述                 | 是否修改原数组 | 案例                         |
| ------- | -------------------- | :------------: | ---------------------------- |
| join    | 数组转字符串         |       ❌       | arr.join("-"); // "1-2-3"    |
| some    | 是否有元素符合条件   |       ❌       | arr.some(v => v > 2);        |
| every   | 是否所有元素符合条件 |       ❌       | arr.every(v => v > 0);       |
| flat    | 扁平化嵌套数组       |       ❌       | [[1,2],3].flat(); // [1,2,3] |
| flatMap | 先映射后扁平化       |       ❌       | arr.flatMap(v => [v * 2]);   |

### Array.from

将两类对象转为真正的数组：类似数组的对象和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

```js
let arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

还可以接受第二个参数，用来对每个元素进行处理，将处理后的值放入返回的数组

```js
Array.from([1, 2, 3], (x) => x * x);
// [1, 4, 9]
```

### Array.of

用于将一组值，转换为数组

```js
Array.of(3, 11, 8); // [3,11,8]
```

没有参数的时候，返回一个空数组

当参数只有一个的时候，实际上是指定数组的长度

参数个数不少于 2 个时，Array()才会返回由参数组成的新数组

```js
Array(); // []
Array(3); // [, , ,]
Array(3, 11, 8); // [3, 11, 8]
```

### copyWithin

将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组

参数如下：

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

```js
// 将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2
[1, 2, 3, 4, 5].copyWithin(0, 3);

// [4, 5, 3, 4, 5]
```

### fill

指定长度指定值

```js
const arr = new Array(5).fill(42); // 创建一个长度为 10 的数组，并填充所有元素为 42
console.log(arr); // [42, 42, 42, 42, 42]
```

使用给定值，填充一个数组

```js
['a', 'b', 'c'].fill(7);
// [7, 7, 7]

new Array(3).fill(7);
// [7, 7, 7]
```

还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置

```js
['a', 'b', 'c'].fill(7, 1, 2);
// ['a', 7, 'c']
```

<Alert message="如果填充的类型为对象，则是浅拷贝"></Alert>

### toReversed，toSorted，toSpliced

从 ES2022（ECMAScript 2022）开始，引入了一些新的数组实例方法，这些方法以 to 开头

- toReversed()
- toSorted()
- toSpliced()

这些方法的主要特点是它们都<span style='color:red'>不会修改原数组</span>，而是返回一个新的数组，这使得它们非常适合用于函数式编程

#### toReversed

toReversed() 方法用于返回一个新数组，该数组中的元素顺序与原数组相反。这个方法不会修改原数组

```js
const numbers = [1, 2, 3, 4, 5];
const reversedNumbers = numbers.toReversed();
console.log(reversedNumbers); // 输出: [5, 4, 3, 2, 1]
console.log(numbers); // 输出: [1, 2, 3, 4, 5] （原数组未改变）
```

#### toSorted

toSorted() 方法用于返回一个新数组，该数组中的元素按照指定的比较函数进行排序。如果不提供比较函数，默认按照字典顺序排序（即按照字符串的 Unicode 码点顺序排序）

```js
const numbers = [1, 3, 2, 5, 4];
const sortedNumbers = numbers.toSorted();
console.log(sortedNumbers); // 输出: [1, 2, 3, 4, 5]
console.log(numbers); // 输出: [1, 3, 2, 5, 4] （原数组未改变）
```

#### toSpliced

toSpliced() 方法用于返回一个新数组，该数组是在原数组的基础上进行了删除或替换操作的结果。这个方法不会修改原数组。

```js
const numbers = [1, 2, 3, 4, 5];
const splicedNumbers = numbers.toSpliced(1, 2, 9, 10);
console.log(splicedNumbers); // 输出: [1, 9, 10, 4, 5]
console.log(numbers); // 输出: [1, 2, 3, 4, 5] （原数组未改变）
```

<BackTop></BackTop>