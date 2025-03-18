---
toc: content
title: for方法
---

# javascript

## for 方法

### 传统 for 循环

语法：

```javascript
复制;
for (初始化; 条件; 表达式) {
  // 循环体
}
```

用途：

需要精确控制循环次数或索引的场景（如遍历数组、重复操作等）。

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // 输出 0, 1, 2, 3, 4
}
```

<Alert>

- 可以控制循环方向（如倒序 i--）或跳过某些步骤（如 i += 2）。
- 支持 break（终止循环）和 continue（跳过当前循环）。

</Alert>

### for...in

- 作用：主要用于遍历对象自身的（以及其原型链上的）可枚举属性。
- 使用场景：
  - 当你需要查看或操作对象的所有属性时，无论这些属性是对象自身定义的还是继承自原型链的。
  - 遍历 JSON 对象、自定义对象的键（key）。
- 示例：

```js
let obj = { a: 1, b: 2, c: 3 };
for (let prop in obj) {
  console.log(prop, obj[prop]);
}
// 输出:
// a 1
// b 2
// c 3
```

<Alert>

- 遍历数组时可能得到非预期的结果（如索引为字符串，顺序不保证）。
- 建议用 Object.hasOwnProperty(key) 过滤原型属性：
- 支持 break 和 continue

</Alert>

```javascript
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    // 仅处理对象自身属性
  }
}
```

### for...of

- 作用：主要用于遍历可迭代对象（Iterable objects）的元素，如数组、Set、Map、某些类型的字符串、生成器对象等。
- 使用场景：
  - 遍历数组的元素，而不是索引。
  - 遍历 Set 或 Map 的内容，直接获取集合中的值。
  - 遍历具有迭代接口的其他数据结构。
- 示例：

```js
let arr = [1, 2, 3];
for (let value of arr) {
  console.log(value);
}
// 输出:
// 1
// 2
// 3

let str = 'Hello';
for (let char of str) {
  console.log(char);
}
// 输出:
// H
// e
// l
// l
// o
```

<Alert>

- 不能直接遍历普通对象（需先转换为 Map 或 Object.keys()）。
- 支持 break 和 continue。

</Alert>

## 总结：

1. for...in 循环用于遍历对象的属性名，适用于处理对象结构（慎用原型链）。
2. for...of 循环用于遍历数组、字符串等可迭代对象。

<BackTop></BackTop>