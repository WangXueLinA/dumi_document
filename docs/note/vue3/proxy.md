---
toc: content
title: Proxy
order: -100
---

# Vue3

## Proxy

Proxy 是 ES6 引入的内置对象，用于创建目标对象的代理，从而拦截并自定义对象的底层操作（如属性读写、函数调用等）‌。其核心作用是为对象操作添加“中间层”，开发者可通过定义 ‌ 陷阱函数（Traps）‌ 实现逻辑控制（如数据验证、缓存等）‌

### 语法

```js
new Proxy(target, handler);

// target参数表示所要拦截的目标对象
// handler参数也是一个对象，用来定制拦截行为。
```

### 用法

```js
let person = {
  name: '张三',
  sex: '男',
};

const p = new Proxy(person, {
  get(target, prop) {
    console.log(`读取属性：${prop}`);
    return target[prop];
  },
});
console.log(p.name); // 读取属性：name   张三
```

验证 defineProperty 痛点，Proxy 对新增属性跟删除属性都能监测到

```js
let person = {
  name: '张三',
  sex: '男',
};

const p = new Proxy(person, {
  // 读取某个属性时调用
  get(target, propName) {
    console.log(`读取p身上的属性：${propName}`);
    return target[propName];
  },
  // 修改或者追加某个属性时调用
  set(target, propName, value) {
    console.log(`设置p身上的属性：${propName}`);
    target[propName] = value;
  },
  // 删除属性时调用
  deleteProperty(target, propName) {
    console.log(`删除p身上的属性：${propName}`);
    delete target[propName];
  },
});
console.log(p); // Proxy {name: "张三", sex: "男"}
p.name = '李四'; // 设置p身上的属性：name
console.log(person); // {name: "李四", sex: "男"}
delete p.name; // 删除p身上的属性：name
```

### 引出 Reflect

我们一般读取属性时候通过对象的访问方式读取

```js
const obj = {
  a: 1,
};
console.log(obj.a); // 1
```

还有一种方式是借助于 Reflect, Reflect 是 ES6 引入的全局内置对象，提供了一系列与对象底层操作对应的静态方法 来进行读取，在 Proxy 的捕获器中调用 Reflect 方法实现默认行为，避免手动操作目标对象

```js
const obj = {
  a: 1,
};
console.log(Reflect.get(obj, 'a')); // 1
```

## vue3 响应式原理

- 通过 Proxy(代理)：拦截对象中的任意属性的变化，包括属性值的读写，属性的添加，属性的删除等
- 通过 Reflect(反射)：对源对象的属性进行的操作

```js
let person = {
  name: '张三',
  sex: '男',
};

const p = new Proxy(person, {
  get(target, propName) {
    console.log(`读取p身上的属性：${propName}`);
    return Reflect.get(target, propName);
  },
  set(target, propName, value) {
    console.log(`设置p身上的属性：${propName}`);
    return Reflect.set(target, propName, value);
  },
  deleteProperty(target, propName) {
    console.log(`删除p身上的属性：${propName}`);
    return Reflect.deleteProperty(target, propName);
  },
});

console.log(p); // Proxy {name: "张三", sex: "男"}
p.name = '李四'; // 设置p身上的属性：name
console.log(person); // {name: "李四", sex: "男"}
delete p.name; // 删除p身上的属性：name
```

## Proxy 只能代理一层

Proxy 只能代理对象的第一层属性，所以如果对象的属性是嵌套对象的话，直接 Proxy 可能无法深度监听。

```js
let person = {
  name: '张三',
  sex: '男',
  obj: {
    a: 1,
  },
};

const p = new Proxy(person, {
  get(target, propName) {
    console.log(`读取p身上的属性：${propName}`);
    return Reflect.get(target, propName);
  },
  set(target, propName, value) {
    console.log(`设置p身上的属性：${propName}`);
    return Reflect.set(target, propName, value);
  },
  deleteProperty(target, propName) {
    console.log(`删除p身上的属性：${propName}`);
    return Reflect.deleteProperty(target, propName);
  },
});

// 会触发getter，但是不会触发setter
p.obj.a = 2;
console.log(p.obj.a); // 2 失去响应式
```

## reactive 深度响应

实现深度响应式，关键在于递归地为嵌套对象创建代理，下面代码的思路大概是 Vue3 提供的 reactive 响应式函数实现原理

```js
const person = {
  name: '张三',
  sex: '男',
  obj: {
    a: 1,
  },
};
const reactiveMap = new WeakMap(); // 用于缓存已代理的对象

function reactive(target) {
  // 如果已经是代理对象则直接返回
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target);
  }

  const proxy = new Proxy(target, {
    get(target, propName, receiver) {
      console.log(`读取属性：${propName}`);
      const result = Reflect.get(target, propName, receiver);

      // 如果获取的是对象，则返回其响应式代理
      if (result !== null && typeof result === 'object') {
        return reactive(result);
      }
      return result;
    },
    set(target, propName, value, receiver) {
      console.log(`设置属性：${propName}`);

      // 如果设置的值是对象，先转换为响应式
      if (value && typeof value === 'object') {
        value = reactive(value);
      }
      return Reflect.set(target, propName, value, receiver);
    },
    deleteProperty(target, propName) {
      console.log(`删除属性：${propName}`);
      return Reflect.deleteProperty(target, propName);
    },
  });

  reactiveMap.set(target, proxy);
  return proxy;
}

const p = reactive(person);

// getter跟setter拦截到了
p.obj.a = 2; // 读取属性：obj  设置属性：a
console.log(p.obj.a);
```

## Proxy 基础类型限制

基础类型（如 string/number/boolean）是值类型而非对象，其本身不具备属性和方法，因此无法直接作为 Proxy 的 target 参数 ‌，若尝试用 Proxy 包装基础类型，会抛出 TypeError：

```js
const str = 'hello';
new Proxy(str, {}); // ❌ TypeError: Cannot create proxy with a non-object as target or handler
```

## ref 基本类型

思路大概是 Vue3 提供的 ref 响应式函数实现原理，增加 .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。

```js
const reactiveMap = new WeakMap();

function reactive(target) {
  if (reactiveMap.has(target)) return reactiveMap.get(target);

  const proxy = new Proxy(target, {
    get(target, prop) {
      console.log(`读取属性：${prop}`);
      const value = Reflect.get(...arguments);
      return typeof value === 'object' ? reactive(value) : value;
    },
    set(target, prop, value) {
      console.log(`设置属性：${prop}`);
      if (typeof value === 'object') value = reactive(value);
      return Reflect.set(...arguments);
    },
  });

  reactiveMap.set(target, proxy);
  return proxy;
}

// ref 实现
function ref(initialValue) {
  const wrapper = {
    value:
      typeof initialValue === 'object' ? reactive(initialValue) : initialValue,
  };

  return new Proxy(wrapper, {
    get(target, prop) {
      console.log(`读取ref的${prop}属性`);
      const value = Reflect.get(...arguments);
      // 当访问 .value 且值为对象时返回响应式版本
      return prop === 'value' && typeof value === 'object'
        ? reactive(value)
        : value;
    },
    set(target, prop, value) {
      console.log(`设置ref的${prop}属性`);
      if (prop === 'value' && typeof value === 'object') {
        value = reactive(value);
      }
      return Reflect.set(...arguments);
    },
  });
}

// 使用示例
const count = ref(0); // 基本类型
const user = ref({
  // 对象类型
  name: '张三',
  address: {
    city: '北京',
  },
});

// 操作基本类型
count.value = 1; // 会触发：设置ref的value属性
console.log(count.value); // 会触发：读取ref的value属性 → 1

// 操作对象类型
user.value.name = '李四';
/* 触发顺序：
    1. 读取ref的value属性（获取代理对象）
    2. 设置属性：name → '李四'
*/

user.value.address.city = '上海';
/* 触发顺序：
  1. 读取ref的value属性
  2. 读取属性：address（返回代理对象）
  3. 设置属性：city → '上海'
*/
```

<BackTop></BackTop>