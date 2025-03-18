---
toc: content
title: 介绍
order: -100
---

# Vue3

## 官网

https://cn.vuejs.org/

## 安装

:::code-group

```bash [npm]
npm create vue@latest
```

```bash [yarn]
# For Yarn (v1+)
$ yarn create vue

# For Yarn Modern (v2+)
$ yarn create vue@latest

# For Yarn ^v4.11
$ yarn dlx create-vue@latest
```

```bash [pnpm]
$ pnpm create vue@latest
```

```bash [bun]
$ bun create vue@latest
```

:::

## 与 vue2 区别

核心架构优化

### 响应式系统重构

- Vue 2：使用 Object.defineProperty 实现响应式，存在以下问题：
- 无法检测对象属性的新增/删除（需用 Vue.set/Vue.delete）。
- 对数组的监听需通过重写数组方法（如 push, pop）。

Vue 3：改用 Proxy 实现响应式，优势包括：

- 支持动态添加/删除属性，无需额外 API。
- 直接监听数组变化，无需特殊处理。
- 性能更高，内存占用更低。

### 虚拟 DOM 优化

- 编译时优化：

  - 静态提升（Hoist Static）：将静态节点提升到渲染函数外，避免重复创建。

  - 树结构拍平（Tree Flattening）：动态节点与静态节点分离，减少比对复杂度。

- 性能提升：渲染速度提高约 200%，更新性能提升约 133%。

### diff 优化

Vue 3.x 使用了经过优化的单向遍历算法，也就是只扫描新虚拟 DOM 树上的节点，判断是否需要更新，跳过不需要更新的节点，进一步减少了不必要的操作。此外，在虚拟 DOM 创建后，Vue 3 会缓存虚拟 DOM 节点的描述信息，以便于复用，这也会带来性能上的优势。同时，Vue 3 还引入了静态提升技术，在编译时将一些静态的节点及其子节点预先处理成 HTML 字符串，大大提升了渲染性能。

### 开发体验改进

1. 组合式 API（Composition API）

- Vue 2：基于 Options API（data, methods, computed 分块），逻辑分散，复杂组件维护困难。

- Vue 3：引入 setup() 函数和 Composition API：

  - 逻辑按功能组织，而非分散在选项中。
  - 更好的 TypeScript 支持。
  - 支持逻辑复用（替代 Mixins）。

2. TypeScript 全面支持

Vue 3 代码库完全用 TypeScript 重写，提供更好的类型推断和开发工具支持。

### 性能优化

1. 更小的体积

- Tree-shaking：按需引入 API，未使用的功能不打包。
- Vue 3 最小压缩后仅约 10 KB（Vue 2 约 20 KB）。

2. 更高效的初始化与更新

- 优化虚拟 DOM 的生成和比对逻辑。
- 减少不必要的响应式依赖追踪。

3. 服务端渲染（SSR）优化

编译时静态内容直接输出为字符串，提升 SSR 性能。

### 破坏性变化与调整

1. 生命周期调整

- beforeDestroy → beforeUnmount
- destroyed → unmounted
- 新增 onRenderTracked 和 onRenderTriggered（用于调试渲染依赖）。

2. 全局 API 调整

使用 createApp() 替代 new Vue()，避免全局配置污染：

```javascript
import { createApp } from 'vue';
const app = createApp(App);
app.use(router).mount('#app');
```

3. 移除过滤器（Filters）

推荐改用计算属性或方法处理数据格式化。

4. v-model 变更

- 支持多个 v-model（如 v-model:title）。
- 默认使用 modelValue 替代 value 属性。

### 生态与兼容性

1. 兼容性策略

- 支持 Vue 2 的 Options API，但推荐逐步迁移到 Composition API。
- 官方提供迁移工具（@vue/compat）辅助升级。

2. 工具链升级

- Vue CLI → Vite 推荐（更快的构建工具）。
- Vuex 4 → Pinia 推荐（更简洁的状态管理）。

## 创建 Vue 应用

每个 Vue 应用都是通过 createApp 函数创建一个新的 应用实例

```js
import { createApp } from 'vue';

const app = createApp({
  /* 根组件选项 */
});
```

### 根组件

每个应用都需要一个“根组件”，其他组件将作为其子组件。

```js
import { createApp } from 'vue';
// 从一个单文件组件中导入根组件
import App from './App.vue';

// 创建应用实例
const app = createApp(App);

// 挂载到 DOM
app.mount('#app');
```

### 多个应用实例

在同一个页面中，可以创建多个独立的 Vue 应用实例

```js
// 应用 1：主功能区域
const app1 = createApp(App1);
app1.mount('#app1');

// 应用 2：侧边栏小部件
const app2 = createApp(App2);
app2.mount('#app2');
```

## createApp

在 Vue 3 中，createApp 替代了 Vue 2 中的 new Vue() 构造函数

### 为什么引入

Vue 3 引入 createApp 的主要目的是：

- 避免全局污染：Vue 2 的全局 API（如 Vue.component()）会影响到所有 Vue 实例，而 Vue 3 通过应用实例隔离配置。
- 支持多实例：可以同时运行多个独立的 Vue 应用（例如微前端场景）。
- 更好的 Tree-Shaking：未使用的 API 可以通过构建工具优化移除。

在 Vue 2 中，你通过 new Vue() 创建一个根 Vue 实例，并在此实例上配置组件、指令、插件等全局功能。例如：

```javascript
// 全局配置会直接污染所有 Vue 实例（例如通过 Vue.component() 注册的组件全局可用）。
// 单例模式，无法隔离多个独立的应用实例。
import Vue from 'vue';

const vm = new Vue({
  el: '#app',
  data: {
    /* ... */
  },
  components: {
    /* ... */
  },
  directives: {
    /* ... */
  },
});
```

在 Vue 3 中，你需要先通过 createApp() 创建一个应用实例（App Instance），然后在此实例上挂载全局配置，最后调用 mount() 方法将其挂载到 DOM 元素

```js
// 隔离性：每个 createApp() 创建的应用实例是独立的，全局配置不会污染其他应用实例。
// 模块化：所有全局功能（组件、指令等）通过应用实例挂载，而非直接挂在全局 Vue 对象上。
// Tree-Shaking 支持：未使用的功能可以被构建工具优化剔除。
import { createApp } from 'vue';

const app = createApp({
  data() {
    /* ... */
  },
  // 其他选项（如 methods、computed 等）
});

// 注册全局组件
app.component('MyComponent', {
  /* ... */
});

// 注册全局指令
app.directive('focus', {
  /* ... */
});

app.use(plugin); // 注册全局插件
app.use(router); // 使用路由插件
app.use(store); // 使用状态管理插件

// 挂载到 DOM
app.mount('#app');
```

## 组件风格

两种 API 风格都能够覆盖大部分的应用场景。它们只是同一个底层系统所提供的两套不同的接口。实际上，选项式 API 是在组合式 API 的基础上实现的

### 选项式 API

用包含多个选项的对象来描述组件的逻辑，例如 data、methods 和 mounted。选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。

```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0,
    };
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件处理器绑定
  methods: {
    increment() {
      this.count++;
    },
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`);
  },
};
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### 组合式 API

在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。这个 setup 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

```vue
<script setup>
import { ref, onMounted } from 'vue';

// 响应式状态
const count = ref(0);

// 用来修改状态、触发更新的函数
function increment() {
  count.value++;
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`);
});
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

## 模版语法

写法跟 vue2 一样， 在 3.4 版本及以上增加了同名简写。如果 attribute 的名称与绑定的 JavaScript 值的名称相同，那么可以进一步简化语法，省略 attribute 值

```vue
<!-- 与 :id="id" 相同 -->
<div :id></div>

<!-- 这也同样有效 -->
<div v-bind:id></div>
```

## 全局 API 转移

在 Vue 3 中，一些全局 API 已经被转移到了 globalProperties 上，例如 `Vue.prototype` 在 Vue 3 中变成了 `app.config.globalProperties`。这样做是为了更好地隔离全局 API，并为未来可能的更改提供更大的灵活性。

```js
//  Vue2 中添加一个全局的方法
Vue.prototype.$myGlobalMethod = function () {
  return 'Hello World!';
};

//  Vue3 中添加一个全局的方法
const app = createApp(App);
app.config.globalProperties.$myGlobalMethod = function () {
  return 'Hello World!';
};

// Vue3中任何组件中使用这个方法
this.$myGlobalMethod();
```

| Vue 2.x 全局 API  | Vue 3.x 应用实例 API            | 备注                                                              |
| ----------------- | ------------------------------- | ----------------------------------------------------------------- |
| new Vue()         | createApp()                     | createApp 创建独立的应用实例，替代 Vue 2 的根实例构造函数。       |
| Vue.prototype.xxx | app.config.globalProperties.xxx | 挂载全局属性（替代 Vue 2 的 Vue.prototype）                       |
| Vue.config.xxx    | app.config.xxx                  | 全局配置迁移到应用实例（例如 app.config.errorHandler）            |
| el 选项           | app.mount()                     | app.mount('#app') 显式挂载，替代 Vue 2 的 el 选项或 vm.$mount()。 |
| vm.$destroy()     | app.unmount()                   | unmount 自动清理 DOM 和实例资源，替代 Vue 2 的手动销毁流程。      |
| Vue.use()         | app.use()                       | 安装插件（用法相同）                                              |
| Vue.component()   | app.component()                 | 注册全局组件                                                      |
| Vue.directive()   | app.directive()                 | 注册全局自定义指令                                                |
| Vue.mixin()       | app.mixin()                     | 全局混入（不推荐，建议用组合式 API 替代）                         |
| Vue.filter()      | 已移除                          | 移除，推荐用计算属性或方法替代                                    |
| Vue.nextTick()    | 保留但导入方式改变              | 通过 import { nextTick } from 'vue' 导入                          |
| Vue.observable()  | reactive()                      | 用 import { reactive } from 'vue' 替代                            |
| Vue.extend()      | 不推荐使用                      | 改用 defineComponent 和组合式 API                                 |
| Vue.version       | 保留但导入方式改变              | 通过 import { version } from 'vue' 获取                           |

## TypeScript 支持

Vue 3 从一开始就在内部使用了 TypeScript 重写，因此在 TypeScript 的支持上有了显著的提升。这包括更好的类型推断、自动补全，以及更强大的类型安全性。

例如，在 Vue 2 中，我们可能需要使用 `Vue.extend()` 或者 `@Component` 装饰器来确保 TypeScript 类型正确，但在 Vue 3 中，我们可以直接使用 defineComponent 方法，它能正确地推断出组件的类型：

1. 对组件 Props 的类型支持

```ts
// vue2 声明通过 PropType 实现，需要手动指定类型
props: {
  title: { type: Object as PropType<{ text: string }>, required: true }
}

// vue3 直接支持使用 TS 类型
const props = defineProps<{
  title: { text: string };
  count?: number;
}>();

// 结合 withDefaults 可提供默认值
const props = withDefaults(defineProps<{ title?: string }>(), { title: 'Hello' });
```

2. 组件实例与 this 的类型推断

```js
// vue2: 需要依赖 vue-class-component 或 vue-property-decorator 装饰器实现类组件的类型推断
@Component
class MyComponent extends Vue {
  message: string = 'Hello'; // 需要显式声明类型
}

// vue3： 使用 defineComponent 包装组件
export default defineComponent({
  data() {
    return { count: 0 }; // 自动推断为 number
  },
  methods: {
    increment() {
      this.count++;
    }, // this.count 类型正确
  },
});
```

在使用了 `<script lang="ts">` 或 `<script setup lang="ts">` 后，<template> 在绑定表达式中也支持 TypeScript。

```ts
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

<BackTop></BackTop>