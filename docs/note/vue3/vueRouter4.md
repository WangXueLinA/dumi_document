---
toc: content
title: vue-router4.x
---

# Vue Router4.x

## 官网

https://router.vuejs.org/zh/installation.html

## 创建

vue3 不再使用 new Router()创建实例，而是使用 createRouter 方法。

并且路由模式也不是简单的传递 history、hash、abstract，而是通过 createWebHistory、createWebHashHistory、
createMemoryHistory 并传递 base 来创建。

```bash
import { createMemoryHistory, createRouter } from 'vue-router';
import { createApp } from 'vue';

import HomeView from './HomeView.vue';
import AboutView from './AboutView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  },
});

const app = createApp(App);

app
  .use(router) // 注册路由
  .mount('#app');
```

### createRouter

### 新的 history 配置取代 mode

- "history": createWebHistory()
- "hash": createWebHashHistory()
- "abstract": createMemoryHistory()

```js
const router = createRouter({
  history: createMemoryHistory(),
});
```

#### createWebHistory

创建一个 HTML5 历史，即单页面应用程序中最常见的历史记录
base 为可选参数，当应用程序被托管在非站点根目录文件夹中，诸如 https://example.com/folder/ 之类时非常有用

```js
createWebHistory(); // 没有 base，应用托管在域名 https://example.com 的根目录下。
createWebHistory('/folder/'); // 给出的网址为 https://example.com/folder/
```

#### createWebHashHistory

创建一个 hash 历史记录。

对于没有主机的 web 应用程序 (例如 file://)，或当配置服务器不能处理任意 URL 时这非常有用

注意：如果 SEO 对你很重要，你应该使用 createWebHistory

提供一个可选的 base，默认是 location.pathname + location.search。如果 head 中有一个 `<base>`，它的值将被忽略，而采用这个参数。但请注意它会影响所有的 history.pushState() 调用，这意味着如果你使用一个 `<base>` 标签，它的 href 值必须与这个参数相匹配 (请忽略 # 后面的所有内容)

```js
// https://example.com/folder

createWebHashHistory(); // 给出的网址为 https://example.com/folder#
createWebHashHistory('/folder/'); // 给出的网址为 https://example.com/folder/#

// 如果在 base 中提供了 `#`，则它不会被 createWebHashHistory 添加
createWebHashHistory('/folder/#/app/'); // 给出的网址为 https://example.com/folder/#/app/

// 你应该避免这样做，因为它会更改原始 url 并打断正在复制的 url
createWebHashHistory('/other-folder/'); // 给出的网址为 https://example.com/other-folder/#

// at file:///usr/etc/folder/index.html
// 对于没有 `host` 的位置，base被忽略
createWebHashHistory('/iAmIgnored'); // 给出的网址为 file:///usr/etc/folder/index.html#
```

#### createMemoryHistory(base)

创建一个基于内存的历史记录。这个历史记录的主要目的是处理 SSR。它在一个特殊的位置开始，这个位置无处不在。如果用户不在浏览器上下文中，它们可以通过调用 router.push() 或 router.replace() 将该位置替换为启动位置。
Base 适用于所有 URL，默认为'/'

## 定义路由出口

```vue
<!-- 以前的写法  -->
<keep-alive>
  <transition>
    <router-view></router-view>
  </transition>
</keep-alive>

<template>
  <!-- 通过v-slot获取内部的组件和路由 -->
  <RouterView v-slot="{ Component, route }">
    <!-- 路由的meta内属性绑定过度行为 -->
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <KeepAlive>
        <!-- 通过:is动态渲染组件到keep-alive内部 -->
        <component
          :is="Component"
          :key="route.meta.usePathKey ? route.path : undefined"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>
```

## 路由/组件

在 Vue Router 4 中，引入了几个新的 API，用以更好地集成和利用 Vue 的 Composition API。这些 API 旨在提供更加灵活和强大的路由功能，特别是在使用 Vue 3 时。

### RouterView

RouterView 是 Vue Router 4 中用来渲染当前路由组件的组件。它类似于 Vue Router 3 中的 `<router-view>`

```js
<template>
  <RouterView />
</template>
```

### RouterLink

RouterLink 是用来创建导航链接的组件，类似于 Vue Router 3 中的 `<router-link>`。它允许你创建一个导航链接，当点击时，Vue Router 会尝试匹配到相应的路由并渲染对应的组件。

```js
<template>
  <RouterLink to="/about">About</RouterLink>
</template>
```

### useLink

useLink 函数用于创建一个响应式的 ref，该 ref 可以用来生成带有活跃类（active class）的 `<a>` 标签。这对于创建动态导航链接非常有用

比如封装一个链接

```html
<script setup>
  import { useLink } from 'vue-router';

  const props = defineProps({
    to: {
      type: [String, Object],
      required: true,
    },
  });

  const { href, isActive, isExactActive, navigate } = useLink(props);
</script>

<template>
  <a
    :href="href"
    @click.prevent="navigate"
    :class="{ active: isActive, 'exact-active': isExactActive }"
  >
    <slot></slot>
  </a>
</template>
```

useLink 返回一个包含以下属性的对象：

```js
const {
  route, // 解析后的路由对象（响应式）
  href, // 解析后的 URL 字符串（响应式）
  isActive, // 是否匹配当前路由（响应式）
  isExactActive, // 是否精确匹配（响应式）
  navigate, // 导航处理函数
} = useLink(props);
```

### useRoute

useRoute 函数返回当前路由的状态对象，你可以在组件的 setup 函数中直接使用它来访问当前路由的各种信息，如路径、查询参数等

```html
<script setup>
  import { useRoute } from 'vue-router';

  const route = useRoute();

  console.log(route.path);
  console.log(route.query);
  console.log(route.params.id);
</script>
```

Vue-Router4 中并没有删除$router 和 $route，在模板中我们仍然可以访问 $router 和 $route，所以不需要在 setup 中返回 router 或 route。

### useRouter

用于访问路由实例并实现编程式导航。

```html
<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // 常用方法示例
  const goHome = () => {
    router.push('/'); // 导航到首页
  };

  const replaceProfile = () => {
    router.replace('/profile'); // 替换当前路由
  };

  const goBack = () => {
    router.go(-1); // 返回上一页
  };
</script>
```

| 方法              | 作用描述               | 示例                                                                |
| ----------------- | ---------------------- | ------------------------------------------------------------------- |
| push(location)    | 添加新的历史记录并导航 | router.push('/about')                                               |
| replace(location) | 替换当前历史记录       | router.replace('/login')                                            |
| go(n)             | 在历史记录中前进/后退  | router.go(-2)                                                       |
| back()            | 等效于 go(-1)          | -                                                                   |
| forward()         | 等效于 go(1)           | -                                                                   |
| addRoute(route)   | 动态添加路由规则       | `router.addRoute({ path: '/:pathMatch(._)', component: NotFound })` |
| resolve(location) | 解析路由位置为规范格式 | router.resolve('/user/1')                                           |

## 路由守卫

next 函数变为可选，支持以下返回值：

- false：取消导航
- undefined/true：继续导航
- 路由地址（字符串或对象）：重定向
- Error 实例：终止导航并触发 onError

```bash
import { createRouter } from 'vue-router'

const router = createRouter({ ... })

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) return '/login' // 重定向
  if (!validUser) return false // 取消导航
  // 不返回或返回 true 表示继续
})
```

路由独享守卫参数中去除了 next

```js
routes: [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from) => { ... }
  }
]
```

组件内守卫组合式 API 支持

```bash

import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

export default {
  setup() {
    onBeforeRouteLeave((to, from) => {
      // 不再需要 next，通过返回值控制
      return false // 阻止离开
    })

    onBeforeRouteUpdate((to, from) => { ... })
  }
}
```

导航解析顺序更严格：

1. 触发 失活组件 的 beforeRouteLeave
2. 触发全局 beforeEach
3. 触发 复用组件 的 beforeRouteUpdate
4. 触发路由配置的 beforeEnter
5. 解析异步路由组件
6. 触发 激活组件 的 beforeRouteEnter
7. 触发全局 beforeResolve
8. 导航完成
9. 触发全局 afterEach

## 对 vue-router3 改动

https://router.vuejs.org/zh/guide/migration/
