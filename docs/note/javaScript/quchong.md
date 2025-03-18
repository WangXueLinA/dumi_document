---
toc: content
title: 去重
---

# javascript

## 简单数组去重

### ES6 的 Set 去重(最推荐)

new Set 是 ES6 新推出的一种类型。他和数组的区别在于，Set 类型中的数据不可以有重复的值。

将一个数组转化为 Set 数据，再转化回来，就完成了去重。

```js
const arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
const setData = Array.from(new Set(arr));
console.log(setData);
```

弊端： 无法去重引用类型的数据。比如对象数组。

<ImagePreview src="/images/js/image12.jpg"></ImagePreview>

### 双重 for 循环去重(最古老的方法)

```js
//双重循环去重
const handleRemoveRepeat = (arr) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j--;
        len--;
      }
    }
  }
  return arr;
};
```

### indexOf 去重

```js
//去重
const handleRemoveRepeat = (arr) => {
  let repeatArr = [];
  for (let i = 0, len = arr.length; i < len; i++)
    if (repeatArr.indexOf(arr[i]) === -1) repeatArr.push(arr[i]);
  return repeatArr;
};
```

### reduce 去重

```js
const arr = [1, 2, 2, 3, 3, 3];
const uniqueArr = arr.reduce((acc, cur) => {
  if (!acc.includes(cur)) acc.push(cur);
  return acc;
}, []);
console.log(uniqueArr); // [1, 2, 3]
```

## 对象数组去重

### 使用 Map + filter（ES6+，推荐）

```javascript
const arr = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }];
const seen = new Map();
const uniqueArr = arr.filter((item) => {
  const key = item.id; // 根据属性去重（如 id、name 等）
  return !seen.has(key) && seen.set(key, true);
});
console.log(uniqueArr); // [{id: 1}, {id: 2}, {id: 3}]
```

适用场景：明确知道对象的唯一属性（如 id）。

### reduce + 对象缓存

```javascript
const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
const uniqueArr = arr.reduce((acc, cur) => {
  const isDuplicate = acc.some((item) => item.id === cur.id); // 检查是否重复
  if (!isDuplicate) acc.push(cur);
  return acc;
}, []);
console.log(uniqueArr); // [{id: 1}, {id: 2}]
```

缺点: 大数据量性能差。

<BackTop></BackTop>