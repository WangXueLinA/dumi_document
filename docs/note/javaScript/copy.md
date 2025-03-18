---
toc: content
title: 拷贝
---

# javascript

## 深拷贝与浅拷贝

### 浅拷贝

浅拷贝只复制对象的第一层属性，如果属性是一个基本数据类型（如字符串、数字、布尔值等），那么该值会被直接复制。但如果属性是一个复杂的数据类型（如对象、数组等引用类型），浅拷贝只会复制这个引用的地址，而不复制引用地址所指向的实际对象。因此，原对象和拷贝对象会共享这些引用类型的数据，改动其中一个会影响另一个。

浅拷贝可以通过以下方法实现：

- `Object.assign()`:用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象

```js
let obj1 = { a: 1, b: { c: 2 } };
let obj2 = Object.assign({}, obj1);
obj2.b.c = 3; // 修改obj2的b.c也会影响到obj1的b.c
```

- 扩展运算符 ...: 这也可以用于浅拷贝。

```js
let obj1 = { a: 1, b: { c: 2 } };
let obj2 = { ...obj1 };
obj2.b.c = 3; // 同样，修改obj2的b.c也会影响到obj1的b.c
```

- `Array.prototype.slice()` 和 `Array.prototype.concat()`：这两个方法用于数组的浅拷贝。

```js
let arr1 = [1, 2, [3, 4]];
let arr2 = arr1.slice();
arr2[2][0] = 5; // 修改arr2的[2][0]也会影响到arr1的[2][0]
```

### 深拷贝

深拷贝会复制对象的所有层次。如果对象的属性值是一个引用类型，那么会递归地复制这个引用类型，直到其所有的子对象都被复制。因此，修改新对象中的任何值，都不会影响到原对象。

实现深拷贝的方法有：

例如有一个包含嵌套对象的对象

```js
let obj = {
  name: 'Alice',
  details: {
    age: 30,
    address: {
      city: 'New York',
    },
  },
};
```

- 迭代递归法：手动遍历对象的所有属性，如果属性是引用类型，则递归调用深拷贝函数。

```js
function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  let copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }
  return copy;
}

let deepCopyObj = deepCopy(obj);
deepCopyObj.details.address.city = 'Los Angeles';
// 此时，obj.details.address.city 仍为 "New York"
```

- 序列化反序列化法：使用 JSON.stringify()将对象转化为字符串，然后再使用 JSON.parse()将字符串转化为新的对象。这种方法的限制是它不能处理函数和循环引用的情况。

<Alert message="当属性值内包含 undefined 不好用"></Alert>

```js
let deepCopyObj = JSON.parse(JSON.stringify(obj));
deepCopyObj.details.address.city = 'Los Angeles';
// 此时，obj.details.address.city 仍为 "New York"
```

- 使用第三方库: 如 lodash 的 cloneDeep()方法。

```js
import _ from 'lodash';
const deep = _.cloneDeep(obj);
```

<BackTop></BackTop>