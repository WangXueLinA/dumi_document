---
toc: content
title: 增加新组件
---

# Vue3

## Teleport

作用：将组件内容渲染到 DOM 中的指定位置，解决 UI 组件脱离父容器的问题（如模态框、全局提示）。

### 基本语法

```js
<Teleport to="目标DOM选择器">
  <!-- 需要传送的内容 -->
</Teleport>
```

### 使用场景

- 模态框（Modal）
- 通知提示（Notification）
- 下拉菜单需要突破父级 overflow: hidden 的场景

```vue
<!-- public/index.html -->
<body>
  <div id="app"></div>
  <div id="modal-root"></div> <!-- Teleport 目标容器 -->
</body>

<!-- ModalComponent.vue -->
<template>
  <button @click="show = true">打开模态框</button>

  <Teleport to="#modal-root">
    <div v-if="show" class="modal">
      <p>模态框内容</p>
      <button @click="show = false">关闭</button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
```

### 注意事项

- 目标容器必须已存在于 DOM 中（推荐在 Vue 应用外部创建）。
- 允许多个 `<Teleport>` 传送到同一目标，按顺序叠加。
- 可通过 disabled 属性动态禁用传送。

## defineAsyncComponent 异步组件

定义一个异步组件，它在运行时是懒加载的。参数可以是一个异步加载函数，或是对加载行为进行更具体定制的一个选项对象。

在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。Vue 提供了 defineAsyncComponent 方法来实现此功能

```js
import { defineAsyncComponent } from 'vue';

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue'),
);
```

### 加载与错误状态

异步操作不可避免地会涉及到加载和错误状态，因此 defineAsyncComponent() 也支持在高级选项中处理这些状态：

```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),

  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,

  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个 timeout 时间限制，并超时了
  // 也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000,
});
```

异步组件可以搭配内置的 `<Suspense>` 组件一起使用

## Suspense

作用：管理异步组件加载过程中的等待状态，提供优雅的加载中和错误处理。

在 Vue 3 的 `<Suspense>` 组件中，`<template #default>` 和 `<template #fallback>` 是专门用于处理异步组件加载状态的两个核心插槽

### 基本语法

1. `<template #default>`

- 承载异步内容：#default 插槽用于包裹需要异步加载的组件或逻辑（如异步组件、带有 async setup() 的组件）。

- 触发等待机制：当 #default 中的内容存在异步操作时，`<Suspense>` 会自动监听其加载状态，并在加载完成前显示 #fallback 的内容。

2. `<template #fallback>`

- 加载状态占位：在异步内容（#default）加载完成前，显示一个临时占位内容（如加载动画、骨架屏）。
- 无缝切换：一旦异步操作完成，#fallback 的内容会自动替换为 #default 的实际内容。

```html
<Suspense>
  <template #default>
    <!-- 异步组件 -->
  </template>
  <template #fallback>
    <!-- 加载中状态 -->
  </template>
</Suspense>
```

### 使用场景

- 异步加载组件（如路由懒加载）
- 组件内部有异步 setup() 函数
- 数据请求完成前显示骨架屏

1. 数据请求完成前显示加载中...

```vue
<!-- ParentComponent.vue -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div class="loading">加载中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue'),
);
</script>

<style>
.loading {
  color: #666;
  font-size: 16px;
}
</style>

<!-- AsyncComponent.vue -->
<template>
  <h2>{{ data }}</h2>
</template>

<script setup>
// 模拟异步数据请求
const data = await fetchData();

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return '异步数据加载完成';
}
</script>
```

2. 路由懒加载

在 Vue Router 中，路由懒加载的组件天然支持 `<Suspense>`：

```javascript
// router.js
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue'), // 异步路由
  },
];
```

在父组件中直接使用 `<Suspense>` 包裹 `<router-view>` 即可：

```vue
<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>加载页面中...</div>
    </template>
  </Suspense>
</template>
```

### 注意事项

- 实验性功能：未来 API 可能调整。
- 错误处理需结合 onErrorCaptured 生命周期钩子。
- 不支持 SSR（需配合 Nuxt 3 等框架）。

`<Suspense>` 可捕获以下异步操作：

- 异步组件（通过 defineAsyncComponent 定义）。
- 组件的 async setup() 函数。
- 普通异步方法（如 setTimeout）需在 setup() 中结合 await 使用才会被捕获。

## Fragment

作用：允许组件模板有多个根节点，无需包裹额外 DOM 元素。

### 使用方式

直接编写多根节点模板：

```html
<template>
  <header>标题</header>
  <main>内容</main>
  <footer>底部</footer>
</template>
```

### 注意事项

- 需要 Vue 3 版本 ≥ 3.0.0。
- 元素间样式隔离需使用 CSS 作用域（scoped）或 CSS Modules。
- 某些第三方库可能要求单根节点（如过渡动画）。

## KeepAlive

`<KeepAlive>` 是一个内置组件，用法跟 vue2 中的`<keep-alive>`一样

## Transition 增强

Vue 3 对 `<Transition>`组件进行了优化，支持更灵活的动画控制。

新特性

- name 属性自动生成过渡类名
- 支持通过 props 配置 CSS 类名
- 新增 duration 属性控制动画时长

```vue
<template>
  <button @click="show = !show">切换</button>

  <Transition
    name="fade"
    enter-active-class="custom-enter-active"
    leave-active-class="custom-leave-active"
  >
    <p v-if="show">过渡效果内容</p>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义类名 */
.custom-enter-active {
  animation: bounce 0.5s;
}
.custom-leave-active {
  animation: bounce 0.5s reverse;
}
@keyframes bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
```

## TransitionGroup

用于对 v-for 列表中的元素或组件的插入、移除和顺序改变添加动画效果。

`<TransitionGroup>` 支持和 `<Transition>` 基本相同的 props、CSS 过渡 class 和 JavaScript 钩子监听器，但有以下几点区别：

- 默认情况下，它不会渲染一个容器元素。但你可以通过传入 tag prop 来指定一个元素作为容器元素来渲染。
- 过渡模式在这里不可用，因为我们不再是在互斥的元素之间进行切换。
- 列表中的每个元素都必须有一个独一无二的 key attribute。
- CSS 过渡 class 会被应用在列表内的元素上，而不是容器元素上。

```js
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

<BackTop></BackTop>