---
toc: content
title: readonly/shallowReadonly
---

# Vue3

## readonly

readonly 会递归地将对象的所有嵌套属性都变为只读，任何尝试修改只读属性的操作都会在开发模式下触发警告。

### 基本语法

```javascript
import { readonly } from 'vue';

const original = { count: 0, nested: { value: 1 } };
const readOnlyObj = readonly(original);
```

### 使用场景

- 当你希望确保某个对象及其嵌套属性不会被修改时，可以使用 readonly。
- 适用于需要保护数据不被意外修改的场景，例如全局状态管理中的某些只读状态。

```vue
<template>
  <div>
    <p>Count: {{ readOnlyObj.count }}</p>
    <p>Nested Value: {{ readOnlyObj.nested.value }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { readonly } from 'vue';

export default {
  setup() {
    const original = { count: 0, nested: { value: 1 } };
    const readOnlyObj = readonly(original);

    const increment = () => {
      // 尝试修改只读属性，会触发警告，但不会阻止修改
      readOnlyObj.count++;
      readOnlyObj.nested.value++;
    };

    return {
      readOnlyObj,
      increment,
    };
  },
};
</script>
```

### shallowReadonly

shallowReadonly 只会将对象的第一层属性变为只读，嵌套对象的属性仍然可以被修改。

### 基本语法

```javascript
import { shallowReadonly } from 'vue';

const original = { count: 0, nested: { value: 1 } };
const shallowReadOnlyObj = shallowReadonly(original);
```

### 使用场景

- 当你希望保护对象的第一层属性不被修改，但允许修改嵌套对象的属性时，可以使用 shallowReadonly。
- 适用于需要部分保护数据的场景，例如某些状态管理中的浅层只读状态。

```vue
<template>
  <div>
    <p>Count: {{ shallowReadOnlyObj.count }}</p>
    <p>Nested Value: {{ shallowReadOnlyObj.nested.value }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { shallowReadonly } from 'vue';

export default {
  setup() {
    const original = { count: 0, nested: { value: 1 } };
    const shallowReadOnlyObj = shallowReadonly(original);

    const increment = () => {
      // 尝试修改第一层属性，会触发警告，但不会阻止修改。
      shallowReadOnlyObj.count++;
      // 修改嵌套属性，不会触发警告
      shallowReadOnlyObj.nested.value++;
    };

    return {
      shallowReadOnlyObj,
      increment,
    };
  },
};
</script>
```

## 注意事项

- 开发模式警告: 在开发模式下，Vue 会发出警告来提醒你尝试修改只读属性，但在生产模式下不会阻止修改。
- 性能考虑: readonly 是递归的，因此对于深层嵌套的对象，可能会有一定的性能开销。shallowReadonly 则不会有这个问题。
- 不可变性: readonly 和 shallowReadonly 并不会真正阻止对象的修改，它们只是提供了一种机制来提醒开发者不要修改只读属性。

<BackTop></BackTop>