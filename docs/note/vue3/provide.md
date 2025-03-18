---
toc: content
title: provide 与 inject
---

# Vue3

## provide 与 inject

provide 和 inject 用于实现跨层级组件通信，尤其适用于祖先组件向后代组件传递数据的场景。

### 基本语法

- provide：在祖先组件中提供数据，可传递响应式数据。
- inject：在后代组件中注入数据，支持设置默认值。

```vue
<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue';
const message = ref('Hello Vue3!');
provide('msgKey', message); // 提供响应式数据
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue';
const injectedMsg = inject('msgKey', '默认值'); // 第二个参数为默认值
</script>
```

### 响应式数据

当提供 / 注入响应式的数据时，建议尽可能将任何对响应式状态的变更都保持在供给方组件中。这样可以确保所提供状态的声明和变更操作都内聚在同一个组件内，使其更容易维护。

有的时候，我们可能需要在注入方组件中更改数据。在这种情况下，我们推荐在供给方组件内声明并提供一个更改数据的方法函数

```vue
<!-- 在供给方组件内 -->
<script setup>
import { provide, ref } from 'vue';

const location = ref('North Pole');

function updateLocation() {
  location.value = 'South Pole';
}

provide('location', {
  location,
  updateLocation,
});
</script>

<!-- 在注入方组件 -->
<script setup>
import { inject } from 'vue';
const { location, updateLocation } = inject('location');
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

### 使用场景

- 跨多层组件传递数据（如主题、用户信息）。
- 避免 Props 逐层传递（简化深嵌套组件通信）。
- 插件/组件库开发（提供全局配置或方法）。

<BackTop></BackTop>