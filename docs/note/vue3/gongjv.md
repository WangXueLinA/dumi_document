---
toc: content
title: 工具函数
---

# Vue3

## 工具函数

工具函数主要应用响应式数据的判断，主要通过以下 API 实现：isRef、isReactive、isReadonly、isProxy。

### isRef

- 作用：检查一个值是否为 ref 对象。
- 基本语法：isRef(value)
- 场景：当需要判断变量是否为 ref 时，例如处理可能被 ref 包裹的值。

<Alert message="ref 在 reactive 对象中会被自动解包，直接访问属性时不再是 ref。"></Alert>

```js
import { ref, isRef, reactive } from 'vue';

const count = ref(0);
console.log(isRef(count)); // true

const state = reactive({ count });
console.log(state.count); // 0（自动解包）
console.log(isRef(state.count)); // false（解包后为原始值）
```

### unref

unref() 是 Vue 3 的一个工具函数，用于安全获取 ref 的内部值。

简化条件判断：替代 isRef 检查。它的作用等价于：

```javascript
// 冗余写法
const value = isRef(target) ? target.value : target;

// 简化写法
const value = unref(target);
```

#### 基本语法

```js
import { unref } from 'vue';
const rawValue = unref(target); // 返回 ref 的 .value 或原始值
```

#### 使用场景

1. 统一处理 ref 和普通值

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<script setup>
import { ref, unref } from 'vue';

// 一个支持传入 ref 或普通值的工具函数
// useDouble 无需关心参数是 ref 还是普通值，unref 统一处理
function useDouble(target) {
  const value = unref(target); // 自动解包 ref
  return value * 2;
}

const count = ref(2);
const doubleCount = useDouble(count); // 传入 ref
const doubleStatic = useDouble(5); // 传入普通值

console.log(doubleCount); // 4
console.log(doubleStatic); // 10
</script>
```

#### 注意的点

1. 不要滥用 unref：明确知道变量是 ref 时，直接使用 .value 更高效：

```javascript
// ✅ 正确做法
const count = ref(0);
console.log(count.value);

// ❌ 冗余写法（虽然结果相同）
console.log(unref(count));
```

2. 嵌套 ref 不会递归解包：unref 仅解包一层 ref，嵌套的 ref 需要手动处理：

```javascript
const innerRef = ref(1);
const wrapperRef = ref(innerRef);

console.log(unref(wrapperRef)); // 返回 innerRef（仍是 ref）
console.log(unref(unref(wrapperRef))); // 1
```

3. 不影响响应性 unref： 不会破坏响应性，返回的值如果是 ref 的 .value，仍然会被响应式系统追踪：

```vue
<script setup>
const count = ref(0);
const rawCount = unref(count); // 0（但不再是响应式）

// 修改 count 后，rawCount 不会更新
setTimeout(() => {
  count.value = 5;
  console.log(rawCount); // 仍然是 0
}, 1000);
</script>
```

4. 在响应式对象中谨慎使用：如果尝试解包响应式对象内的 ref，unref 无法直接作用：

```javascript
const obj = reactive({ data: ref(42) });
console.log(unref(obj.data)); // 42（正确解包）
console.log(unref(obj)); // 返回 obj 自身（无法解包对象）
```

### isReactive

- 作用：检查对象是否是 reactive 创建的响应式代理。
- 基本语法：isReactive(value)
- 场景：判断对象是否经过 reactive 处理，常用于组合式函数参数校验。

<Alert message='若对象被 readonly 包裹但原始对象是 reactive，则 isReactive 仍为 true。'></Alert>

```js
import { reactive, isReactive, readonly } from 'vue';

const raw = {};
const proxy = reactive(raw);
console.log(isReactive(proxy)); // true

const readOnlyProxy = readonly(proxy);
console.log(isReactive(readOnlyProxy)); // true（原始对象是reactive）
```

### isReadonly

- 作用：检查对象是否是 readonly 创建的只读代理。
- 基本语法：isReadonly(value)
- 场景：确保对象不可变，防止意外修改。

<Alert message='readonly 代理的原始对象可以是普通对象或 reactive 对象。'></Alert>

```javascript
import { reactive, readonly, isReadonly } from 'vue';

const raw = {};
const proxy = reactive(raw);
const readOnlyProxy = readonly(proxy);

console.log(isReadonly(readOnlyProxy)); // true
console.log(isReadonly(proxy)); // false
```

### isProxy

- 作用：检查对象是否是 reactive 或 readonly 创建的代理。
- 基本语法：isProxy(value)
- 场景：通用检查对象是否为响应式（无论是可读还是只读）。

<Alert message='同时满足 isReactive 或 isReadonly 时，isProxy 为 true。'></Alert>

```javascript
import { reactive, readonly, isProxy } from 'vue';

const raw = {};
const reactiveProxy = reactive(raw);
const readOnlyProxy = readonly(raw);

console.log(isProxy(reactiveProxy)); // true
console.log(isProxy(readOnlyProxy)); // true
```

<BackTop></BackTop>