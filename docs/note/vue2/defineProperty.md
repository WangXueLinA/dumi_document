---
toc: content
title: defineProperty
order: -100
---

# Vue2

## Object.defineProperty

Object.defineProperty 是 JavaScript 中用于定义或修改对象属性的方法，可以精确控制属性的行为（如可枚举性、可写性、getter/setter 等）。

### 语法

```js
Object.defineProperty(obj, prop, descriptor);

//  obj: 目标对象
//  prop: 要定义或修改的属性名
//  descriptor: 属性描述符，包含以下可选键：
//    configurable: 是否可删除或修改（默认 false）
//    enumerable: 是否可枚举（默认 false）
//    value: 属性值（默认 undefined）
//    writable: 是否可写（默认 false）
//    get: getter 函数
//    set: setter 函数
```

### 用法

```js
let person = {
  name: '张三',
  sex: '男',
};
// 为对象添加属性,三个参数：对象名，属性名，配置参数
Object.defineProperty(person, 'age', {
  value: 18,
});
console.log(person);
```

### 默认不枚举

使用 Object.defineProperty 添加的属性不可枚举（即不可遍历），同时也不可修改和随意删除

```js
let person = {
  name: '张三',
  sex: '男',
};

Object.defineProperty(person, 'age', {
  value: 18,
});
console.log(person);

console.log(Object.keys(person));
```

上面案例我们在控制台打印下

<ImagePreview src="/images/vue2/image5.jpg"></ImagePreview>

### 配置可枚举

Object.defineProperty 通过配置允许我们添加的属性可枚举

```js
let person = {
  name: '张三',
  sex: '男',
};

Object.defineProperty(person, 'age', {
  value: 18,
  enumerable: true, //控制属性是否可以枚举,默认值是false
  writable: true, //控制属性是否可以被修改，默认是false
  configurable: true, //控制属性是否可以被删除，默认是false
});

console.log(person);
console.log(Object.keys(person));
```

<ImagePreview src="/images/vue2/image6.jpg"></ImagePreview>

### get/set

我们想要实现一个功能，就是里面的 person 对象的 age 属性是通过外面的变量变化而变化

```js
let number = 18;
let person = {
  name: '张三',
  sex: '男',
  age: number,
};
console.log(person); // {name: '张三', sex: '男', age: 18}

name = 20;
console.log(name); // 20

console.log(person); // {name: '张三', sex: '男', age: 18}
```

显然是不可行的，因为 person 是在初始化定义的时候定义好的那时候 number 就是 18，即使后来 number 改变了，但是 person 不会再次定义也就是引用地址没变，所以 person 的 age 不会改变。

Object.defineProperty 提供的 getter 和 setter 可以有助于我们实现这个功能

```js
let number = 18;
let person = {
  name: '张三',
  sex: '男',
};
Object.defineProperty(person, 'age', {
  enumerable: true, //控制属性是否可以枚举,默认值是false
  // 当有人读取person的age属性时，get函数(getter)就会被调用，且返回值就是age的值
  get() {
    return number;
  },
  // 当有人设置person的age属性时，set函数(setter)就会被调用，对age进行设置
  set(value) {
    number = value;
  },
});
console.log(person); // { name: '张三', sex: '男', age: 18 }

number = 20;

console.log(number); // 20
console.log(person); // { name: '张三', sex: '男', age: 20 }

person.age = 30;
console.log(number); // 30
console.log(person); // { name: '张三', sex: '男', age: 30 }
```

number 修改了，person.age 随着修改，直接修改 person.age，number 也随着修改。这是因为，每获取一次 age，都要请求一次 get 函数去获取并返回 number 的值，重新定义一次 person.age，所以 person.age 的值会随着 number 的值进行改变。

## 数据代理定义

数据代理即：通过一个对象代理对另一个对象中属性的操作（读/写），上述例子的 person.age 和 number 就是数据代理。就是我没直接操控这个对象，而是通过 Object.defineProperty 将两个对象关联起来

```js
let obj1 = { x: 100 };
let obj2 = { y: 200 };

Object.defineProperty(obj2, 'x', {
  get() {
    return obj1.x;
  },
  set(value) {
    obj1.x = value;
  },
});
console.log(obj2.x); // 100

obj2.x = 300;
console.log(obj1.x); // 300

obj1.x = 400;
console.log(obj2.x); // 400
```

## Vue2 使用代理

```html
<div id="root">
  <h2>姓名：{{name}}</h2>
  <h2>年龄：{{age}}</h2>
</div>

<script type="text/javascript">
  const vm = new Vue({
    el: '#root',
    data: {
      name: 'yang',
      age: 18,
    },
  });
  console.log(vm, 'vm');
</script>
```

页面显示：

<ImagePreview src="/images/vue2/image7.jpg"></ImagePreview>

所以我们分析出来可能是 vm 对象（vue 对象）来代理 data 对象中属性的操作（读/写）

<ImagePreview src="/images/vue2/image8.jpg"></ImagePreview>

然后我们也可以观察到 data 中的 name 跟 age 在 vue 对象上都有各自的 getter 跟 setter 方法

<ImagePreview src="/images/vue2/image9.jpg"></ImagePreview>

我们翻看 vue 对象中还有`_data`属性，里面的属性值也都是我们自己定义的 data 一样，在`_data`对象里也都有 name 跟 age 各自的 getter 跟 setter 方法

那是不是改了 vm 里的属性值的话，页面数据就会发生变化，同理，改了`_data`对象里的值，也会引起页面数据的变化

<ImagePreview src="/images/vue2/image10.jpg"></ImagePreview>

所以就验证出 vm 对象（vue 对象）是来代理 data 对象中属性的操作（读/写）

所以我们页面也是可以直接使用`_data`，不过为了更加方便的操作 data 中的数据，就可以直接访问 name 和 age

```html
<div id="root">
  <h2>姓名：{{_data.name}}</h2>
  <h2>年龄：{{_data.age}}</h2>
</div>
```

### 原理

vue 设置数据代理的原理，通过 object.defineProperty()把 data 对象中所有属性添加到 vm 上，为每一个添加到 vm 上的属性,都指定一个 getter/setter。在 getter/setter 内部去操作（读/写）data 中对应的属性

<ImagePreview src="/images/vue2/image11.jpg"></ImagePreview>

## 响应式原理

1. 初始化数据：当 Vue 创建实例时，它会遍历 data 里的每一个属性，把它们都变成“响应式”的。
2. 设置 getter 和 setter：Vue 使用 Object.defineProperty 给属性加上“getter”（获取值）和“setter”（修改值）的监听器。当你读取数据时，触发 getter；当你修改数据时，触发 setter。
3. 依赖收集：当触发 getter 时，Vue 会偷偷记下这个属性被哪些地方使用了——这叫“依赖收集”。
4. 更新视图：当属性值变了，Vue 就通过 setter 通知界面需要更新。

## 缺陷

在 Vue 2 中，如果一个属性的 getter/setter 未被定义（比如动态新增的属性或未被初始化的数组下标），Vue 就无法检测到它的变化，也就不会触发视图更新。这是 Vue 2 响应式系统的核心限制，因为它基于 Object.defineProperty 实现。而 Object.defineProperty 不能监听对象新增或删除的属性，也无法很好地处理数组的变化。

### 对象中的缺陷

```js
// 新增属性跟删除属性都无法捕获到getter跟setter
const obj = { a: 1 };

// 通过 Object.defineProperty 监听属性 "a"
Object.defineProperty(obj, 'a', {
  get() {
    console.log('读取属性 a');
    return this._a;
  },
  set(value) {
    console.log('设置属性 a');
    this._a = value;
  },
});

// 修改已有属性 a：可以触发 setter
obj.a = 2; // 输出 "设置属性 a"

// 新增属性 b：不会触getter跟setter发监听
obj.b = 3;
console.log(obj.b); // 控制台输出 3（无getter跟setter日志）

// 删除属性 a：不会触getter跟setter发监听
delete obj.a;
console.log(obj.a); // 输出 undefined（无getter跟setter日志）
```

所以 vue2 中在对象下面的例子不会触发响应式更新

```js
// Vue 2 组件中
data() {
  return {
    user: { name: "Alice" }
  };
},
methods: {
  addAge() {
    // 直接给 user 新增属性 age
    this.user.age = 25; // ❌ 不会触发响应式更新！
  }
  deleteName() {
    // 删除 user 的name属性
    delete this.user.name; // ❌ 不会触发更新！
  }
}
```

所以 Vue2 的 提供 Vue.set（或 this.$set）和 Vue.delete（或 this.$delete） 两个 api 来强制调用 defineProperty 来监听新增属性

```js
this.$set(this.user, 'age', 25); // ✅ 触发更新
this.$delete(this.user, 'name'); // ✅ 触发更新
```

### 数组中的缺陷

```js
// 无法直接监听数组下标赋值或 length 变化
const arr = [1, 2, 3];

// 通过 Object.defineProperty 监听数组下标
arr.forEach((_, index) => {
  Object.defineProperty(arr, index, {
    get() {
      console.log(`读取数组下标 ${index}`);
      return this[`_${index}`];
    },
    set(value) {
      console.log(`设置数组下标 ${index}`);
      this[`_${index}`] = value;
    },
  });
});

// 修改已有下标的值：可以触发 setter
arr[0] = 100; // 输出 "设置数组下标 0"

// 新增下标的值：不会触getter跟setter发监听
arr[3] = 4;
console.log(arr[3]); // 输出 4（无getter跟setter日志）

// 修改数组长度：不会触getter跟setter发监听
arr.length = 0;
console.log(arr); // 输出 []（无getter跟setter日志）
```

所以 vue2 中在数组下面的例子不会触发响应式更新

```js
// Vue 2 组件中
data() {
  return {
    list: [1, 2, 3]
  };
},
methods: {
  updateArray() {
    // 直接通过下标修改数组
    this.list[0] = 100; // ❌ 不会触发更新！
    // 直接修改 length
    this.list.length = 0; // ❌ 不会触发更新！
  }
}
```

所以 Vue 2 重写了数组的 7 个变异方法（如 push、pop、splice 等），在这些方法被调用时手动触发更新。但直接通过索引修改或修改 length 仍需使用 Vue.set 或数组的 splice 方法。

```js
this.list.splice(0, 1, 100); // ✅ 触发更新
this.$set(this.list, 0, 100); // ✅ 触发更新
```

更暴力一点的方式是 vue 提供`vm.$forceUpdate()`函数强制组件重新渲染，尽量避免滥用

<BackTop></BackTop>