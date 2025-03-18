---
toc: content
title: toRef/toRefs
order: -96
---

# Vue3

## toRef

toRef 用于将响应式对象的某个属性转换为一个 ref 对象。这个 ref 对象会保持与源对象的响应式连接，即当源对象的属性发生变化时，ref 对象也会同步更新。

### 使用场景

当你只需要从响应式对象中提取一个属性，并且希望这个属性保持响应式时，可以使用 toRef

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { reactive, toRef } from 'vue';

export default {
  setup() {
    const state = reactive({
      count: 0,
      name: 'Vue 3',
    });

    // 将 state.count 转换为 ref
    const count = toRef(state, 'count');

    const increment = () => {
      count.value++;
    };

    return {
      count,
      increment,
    };
  },
};
</script>
```

### 注意事项

1. toRef 只能用于响应式对象（如 reactive 创建的对象）。
2. toRef 返回的 ref 对象与源对象的属性保持同步，修改 ref 对象的值会同时修改源对象的属性。

## toRefs

toRefs 用于将整个响应式对象的所有属性转换为 ref 对象。返回的对象是一个普通对象，但其每个属性都是一个 ref 对象。

### 使用场景

当你需要将整个响应式对象的属性解构出来，并且希望这些属性保持响应式时，可以使用 toRefs。

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Name: {{ name }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  setup() {
    const state = reactive({
      count: 0,
      name: 'Vue 3',
    });

    // 将 state 的所有属性转换为 ref
    const { count, name } = toRefs(state);

    const increment = () => {
      count.value++;
    };

    return {
      count,
      name,
      increment,
    };
  },
};
</script>
```

### 注意点

1. toRefs 返回的对象是一个普通对象，但其属性是 ref 对象。
2. 使用 toRefs 后，可以直接在模板中使用解构后的属性，而不需要再通过 state.xxx 访问。
3. toRefs 适用于需要解构响应式对象的场景，尤其是在组合式 API 中。

## 常见坑点

1. toRef 和 toRefs 只能用于响应式对象：如果尝试将它们用于普通对象，Vue 会抛出警告，并且返回的 ref 对象不会具有响应式特性。
2. toRef 和 toRefs 返回的 ref 对象是只读的：虽然你可以修改 ref 对象的值，但你不能直接替换整个 ref 对象。例如，`count = ref(10)` 是不允许的。
3. toRefs 会丢失响应式对象的原型链：toRefs 返回的是一个普通对象，因此它会丢失原响应式对象的原型链方法。

<BackTop></BackTop>