---
toc: content
title: 自定义hook
---

# Vue3

## 自定义 hook

自定义 Hook 函数是一种将逻辑代码抽离组件的方式，类似于 React 中的自定义 Hook。通过自定义 Hook，可以将组件的逻辑复用，使代码更加清晰和可维护。

### 基本定义

自定义 Hook 是一个普通的 JavaScript 函数，通常以 `use` 开头命名，内部可以使用 Vue 3 的 Composition API（如 ref, reactive, computed, watch 等）。

### 使用场景

- 逻辑复用：当多个组件需要共享相同的逻辑时，可以将逻辑抽离到自定义 Hook 中。
- 代码组织：将复杂的逻辑拆分成多个自定义 Hook，使组件代码更加简洁。
- 状态管理：将状态管理逻辑抽离到自定义 Hook 中，便于维护和测试。

1. 使用自定义 Hook 管理窗口大小

```js
// useWindowSize.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  return { width, height };
}
```

在组件中使用：

```html
<template>
  <div>
    <p>Width: {{ width }}px</p>
    <p>Height: {{ height }}px</p>
  </div>
</template>

<script>
  import { useWindowSize } from './useWindowSize';

  export default {
    setup() {
      const { width, height } = useWindowSize();

      return {
        width,
        height,
      };
    },
  };
</script>
```

2. 使用自定义 Hook 管理表单输入

```javascript
// useFormInput.js
import { ref } from 'vue';

export function useFormInput(initialValue) {
  const value = ref(initialValue);

  const handleInput = (event) => {
    value.value = event.target.value;
  };

  return {
    value,
    handleInput,
  };
}
```

在组件中使用：

```html
<template>
  <div>
    <input :value="value" @input="handleInput" />
    <p>You typed: {{ value }}</p>
  </div>
</template>

<script>
  import { useFormInput } from './useFormInput';

  export default {
    setup() {
      const { value, handleInput } = useFormInput('');

      return {
        value,
        handleInput,
      };
    },
  };
</script>
```

<BackTop></BackTop>