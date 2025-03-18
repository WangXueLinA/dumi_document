---
toc: content
title: slot 插槽
order: -94
---

# Vue2

## slot 插槽

### 默认插槽

子组件预留位置，父组件传递内容填充。

```vue
<!-- 子组件定义 ChildComponent.vue -->
<template>
  <div>
    <slot>默认内容（当父组件未提供时显示）</slot>
  </div>
</template>

<!-- 父组件使用 ChildComponent.vue -->
<ChildComponent>
  <p>这是父组件传递的内容</p>
</ChildComponent>
```

### 具名插槽

子组件定义多个具名插槽，父组件按名称分发内容。

```html
<!-- 子组件 ChildComponent.vue -->
<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
      <!-- 默认插槽 -->
    </main>
  </div>
</template>

<!-- 父组件使用 -->
<ChildComponent>
  <!-- 新语法（推荐） -->
  <template v-slot:header>
    <h1>这是头部内容</h1>
  </template>

  <!-- 默认插槽内容 -->
  <p>这是主体内容</p>
</ChildComponent>
```

### 作用域插槽

子组件向父组件传递数据，父组件基于数据渲染内容。

```html
<!-- 子组件定义ChildComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item">{{ item.name }}</slot>
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { id: 1, name: 'Apple' },
          { id: 2, name: 'Banana' },
        ],
      };
    },
  };
</script>

<!-- 父组件使用 -->
<ChildComponent>
  <!-- 新语法（推荐） -->
  <template v-slot:default="slotProps">
    <span style="color: blue">{{ slotProps.item.name }}</span>
  </template>
</ChildComponent>
```

### 废弃语法与替代方案

1. 废弃的 slot 属性（具名插槽）

```html
<!-- 旧语法 -->
<ChildComponent>
  <template slot="header">
    <h1>旧语法头部内容</h1>
  </template>
</ChildComponent>
```

替代方案：使用 `v-slot:header` 或简写 `#header`

```html
<template v-slot:header>...</template>
<!-- 简写 -->
<template #header>...</template>
```

2. 废弃的 `slot-scope` 属性（作用域插槽）

```html
<!-- 旧语法 -->
<ChildComponent>
  <template slot-scope="props">
    <span>{{ props.item.name }}</span>
  </template>
</ChildComponent>
```

替代方案：使用 `v-slot:default="props"` 或简写 `#default="props"`

```html
<template v-slot:default="props">...</template>
<!-- 简写 -->
<template #default="props">...</template>
```

3. 废弃的 scope 属性（作用域插槽）

```vue
<!-- 旧语法 -->

<ChildComponent>
  <template scope="props">
    <span>{{ props.item.name }}</span>
  </template>
</ChildComponent>
```

替代方案：同上，使用 `v-slot`。

<BackTop></BackTop>