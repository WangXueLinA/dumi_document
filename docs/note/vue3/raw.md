---
toc: content
title: toRaw/markRaw
order: -95
---

# Vue3

## toRaw

toRaw 用于获取 Vue 响应式对象的原始对象。Vue 3 的响应式系统会为对象创建一个代理（Proxy），toRaw 可以返回这个代理背后的原始对象

### 基本语法：

```javascript
import { toRaw } from 'vue';

const rawObject = toRaw(proxyObject);
```

### 使用场景：

- 当你需要直接操作原始对象，而不希望触发 Vue 的响应式更新时。
- 在某些性能敏感的场景下，直接操作原始对象可能比操作响应式对象更高效。

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="incrementRaw">Increment Raw</button>
  </div>
</template>

<script>
import { reactive, toRaw } from 'vue';

export default {
  setup() {
    const state = reactive({
      count: 0,
    });

    const increment = () => {
      state.count++; // 响应式对象 state 更新 count，触发 Vue 响应式更新
    };

    const incrementRaw = () => {
      // 获取 state 的原始对象 并直接修改它 不会触发 Vue 响应式更新，因此界面不会自动刷新。
      const rawState = toRaw(state);
      rawState.count++;
      console.log('Raw State:', rawState);
    };

    return {
      count: state.count,
      increment,
      incrementRaw,
    };
  },
};
</script>
```

## markRaw

markRaw 用于标记一个对象，使其不会被 Vue 的响应式系统转换为响应式对象。即使这个对象被传递给 reactive 或 ref，它也不会变成响应式的。

### 基本语法

```js
import { markRaw } from 'vue';

const nonReactiveObject = markRaw(rawObject);
```

### 使用场景

- 当你有一个对象，你明确不希望它被 Vue 的响应式系统代理时。
- 当你需要将一个大型对象或第三方库的对象传递给 Vue，但不希望 Vue 对其进行响应式处理时。

```vue
<template>
  <div>
    <p>User: {{ user.name }}</p>
    <button @click="updateUser">Update User</button>
  </div>
</template>

<script>
import { reactive, markRaw } from 'vue';

export default {
  setup() {
    const rawUser = {
      name: 'John Doe',
    };

    const state = reactive({
      user: markRaw(rawUser),
    });

    const updateUser = () => {
      // 直接修改原始对象  markRaw 标记了 rawUser 不是响应式的，界面不会自动更新。
      rawUser.name = 'Jane Doe';
      console.log('Updated User:', rawUser);
    };

    return {
      user: state.user,
      updateUser,
    };
  },
};
</script>
```

## 注意事项

1. toRaw 的使用场景有限：

toRaw 主要用于调试或性能优化场景。在大多数情况下，你应该直接操作响应式对象，而不是绕过 Vue 的响应式系统。

2. markRaw 的对象不会被代理：

一旦一个对象被 markRaw 标记，它将永远不会被 Vue 的响应式系统代理。这意味着即使你将这个对象传递给 reactive 或 ref，它也不会变成响应式的。

3. 性能考虑：

使用 toRaw 和 markRaw 可以提高性能，特别是在处理大型对象或频繁操作对象时。但过度使用可能会导致代码难以维护，因为你绕过了 Vue 的响应式系统。

4. 响应式丢失：

如果你不小心将一个响应式对象传递给 markRaw，那么它的响应式特性将会丢失。这可能会导致一些难以调试的问题。

<BackTop></BackTop>