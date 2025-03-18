---
toc: content
title: shallowReactive/shallowRef
order: -97
---

# Vue3

## shallowReactive

shallowReactive 创建一个浅层响应式对象，只有对象的第一层属性是响应式的，嵌套的对象不会被递归地转换为响应式。

### 基本语法

```js
import { shallowReactive } from 'vue';

const state = shallowReactive({
  count: 0,
  nested: {
    value: 1,
  },
});
```

### 使用场景

- 当你只需要对象的第一层属性是响应式时。
- 当你明确知道嵌套对象不需要响应式，或者嵌套对象的响应式处理会带来性能开销时。

```vue
<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <p>Nested Value: {{ state.nested.value }}</p>
    <button @click="incrementCount">Increment Count</button>
    <button @click="incrementNestedValue">Increment Nested Value</button>
  </div>
</template>

<script>
import { shallowReactive } from 'vue';

export default {
  setup() {
    const state = shallowReactive({
      count: 0,
      nested: {
        value: 1,
      },
    });

    function incrementCount() {
      state.count++; // 是响应式的，修改它会触发视图更新
    }

    function incrementNestedValue() {
      state.nested.value++; // 不是响应式的，修改它不会触发视图更新
    }

    return {
      state,
      incrementCount,
      incrementNestedValue,
    };
  },
};
</script>
```

## shallowRef

shallowRef 创建一个浅层响应式引用，只有 .value 属性是响应式的，嵌套的对象不会被递归地转换为响应式。

### 基本语法

```js
import { shallowRef } from 'vue';

const state = shallowRef({
  count: 0,
  nested: {
    value: 1,
  },
});
```

### 使用场景：

- 当你只需要 .value 属性是响应式时。
- 当你明确知道嵌套对象不需要响应式，或者嵌套对象的响应式处理会带来性能开销时。

```vue
<template>
  <div>
    <p>Count: {{ state.value.count }}</p>
    <p>Nested Value: {{ state.value.nested.value }}</p>
    <button @click="incrementCount">Increment Count</button>
    <button @click="incrementNestedValue">Increment Nested Value</button>
  </div>
</template>

<script>
import { shallowRef } from 'vue';

export default {
  setup() {
    const state = shallowRef({
      count: 0,
      nested: {
        value: 1,
      },
    });

    function incrementCount() {
      state.value.count++; // 是响应式的，修改它会触发视图更新。
    }

    function incrementNestedValue() {
      state.value.nested.value++; // 不是响应式的，修改它不会触发视图更新。
    }

    return {
      state,
      incrementCount,
      incrementNestedValue,
    };
  },
};
</script>
```

## 注意事项

1. 嵌套对象的响应式：shallowReactive 和 shallowRef 不会递归地将嵌套对象转换为响应式，因此如果你需要嵌套对象的响应式，应该使用 reactive 或 ref。
2. 性能优化：在大型对象或嵌套层级较深的情况下，使用 shallowReactive 或 shallowRef 可以减少响应式系统的开销，因为它们不会递归地处理嵌套对象。
3. 视图更新：由于嵌套对象不是响应式的，修改嵌套对象的属性不会触发视图更新。如果你需要视图更新，可以考虑手动触发更新或使用 reactive/ref。
4. 类型安全：在使用 TypeScript 时，确保类型定义正确，以避免类型错误。

## triggerRef

triggerRef 是 Vue 3 的一个响应式 API，用于手动触发与 shallowRef 关联的副作用更新

### 基本语法

```js
triggerRef(ref);
```

### 使用场景

1. shallowRef 的深层属性修改：当使用 shallowRef 包装对象时，直接修改其深层属性不会触发响应式更新。

```vue
<template>
  <div>Count: {{ state.count }}</div>
  <button @click="increment">Increment</button>
</template>

<script setup>
import { shallowRef, triggerRef } from 'vue';

const state = shallowRef({ count: 0 });

// shallowRef 仅跟踪 .value 的变化。修改 state.value.count 不会自动触发更新，需调用 triggerRef。
function increment() {
  state.value.count++; // 直接修改深层属性，不会触发更新
  triggerRef(state); // 手动触发视图更新
}
</script>
```

2. 异步操作后的强制更新：在异步回调（如 setTimeout 或 fetch）中修改数据后，可能需要手动触发更新。

```vue
<template>
  <div>Data: {{ data.value }}</div>
</template>

<script setup>
import { shallowRef, triggerRef } from 'vue';

const data = shallowRef({ value: 'Loading...' });

// 异步操作（如 setTimeout）中修改 shallowRef 的深层属性后，必须手动调用 triggerRef
setTimeout(() => {
  data.value.value = 'Async Data Updated!'; // 异步修改数据
  triggerRef(data); // 手动触发更新
}, 2000);
</script>
```

3. 第三方库集成：当第三方库直接修改 DOM 或数据时，确保 Vue 能感知到变化。

```html
<template>
  <div ref="chartEl"></div>
</template>

<script setup>
  import { shallowRef, triggerRef, onMounted } from 'vue';
  import { drawChart } from 'third-party-chart-library';

  const chartEl = shallowRef(null);
  const chartData = shallowRef({ values: [1, 2, 3] });

  onMounted(() => {
    drawChart(chartEl.value, chartData.value.values);
    // 第三方库直接修改数据
    chartData.value.values.push(4);
    triggerRef(chartData); // 强制 Vue 更新相关组件
  });
</script>
```

### 注意事项

1. 仅适用于 ref 或 shallowRef，不可用于 reactive 对象。

```js
// ❌ 错误用法！
import { reactive, triggerRef } from 'vue';
const obj = reactive({ a: 1 });
triggerRef(obj); // 无效，且可能导致错误
```

2. 普通 ref 不需要手动触发，只有 shallowRef 需要手动干预，普通 ref 会深度监听。

```javascript
// 正常情况无需 triggerRef
const deepRef = ref({ a: 1 });
deepRef.value.a = 2; // 自动触发更新
```

3. 优先使用普通 ref，仅在需要优化性能时使用 shallowRef + triggerRef。避免过度调用，频繁调用 triggerRef 可能导致性能问题，确保仅在必要时使用。

4. 确保在数据修改后调用，如果先调用 triggerRef 再修改数据，更新将不会生效。

```javascript
// ❌ 错误顺序！
triggerRef(state); // 此时无变化
state.value.count++;
```

<BackTop></BackTop>