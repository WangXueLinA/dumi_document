---
toc: content
title: vue-router3.x
---

# Vue Router3.x

Vue Router 是 Vue.js 的官方路由。它与 Vue.js 核心深度集成，允许你在 Vue 应用中构建单页面应用（SPA），并且提供了灵活的路由配置和导航功能。让用 Vue.js 构建单页应用变得轻而易举。

## 官网

https://router.vuejs.org/zh/guide/

## 使用

1. 安装 vue-router，命令

<Alert message='vue2 对应的是`vue-router@3.x`， vue3 对应的是`vue-router@4.x`'></Alert>

```bash
npm i vue-router@3.x

```

2. 生成路由配置实例

```js
// router.js
import VueRouter from 'vue-router'; // 引入VueRouter
import About from '../components/About'; // 路由组件
import Home from '../components/Home'; // 路由组件

// 创建router实例对象，去管理一组一组的路由规则
const router = new VueRouter({
  routes: [
    {
      path: '/about',
      component: About,
    },
    {
      path: '/home',
      component: Home,
    },
  ],
});

//暴露router
export default router;
```

3. 注册路由插件并将路由实例注入根组件

```js
import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router'; // 引入VueRouter
import router from './router'; // 引入路由器

Vue.use(VueRouter); // 应用插件

new Vue({
  el: '#app',
  render: (h) => h(App),
  router,
});
```

## router-link

`<router-link>` 是 Vue Router 提供的声明式导航组件，‌ 自动生成 `<a>` 标签 ‌ 且支持路由跳转（无需页面刷新）。

1. 基础语法

```js
<router-link to="/home">首页</router-link>

// 渲染结果：
<a href="#/home" class="router-link-exact-active">首页</a>

```

### 参数

1. to（必需参数）

作用 ‌：指定目标路由路径或路由对象
‌

```html
<!-- 字符串路径 -->
<router-link to="/user/123">用户详情</router-link>

<!-- 对象形式（支持动态参数和命名路由） -->
<router-link
  :to="{ 
    name: 'profile', 
    params: { id: 123 }, 
    query: { from: 'home' }
  }"
  >用户资料
</router-link>
```

2. tag（可选）

‌ 默认值 ‌：'a'

‌ 作用 ‌：指定渲染的 HTML 标签

```js
<router-link to="/about" tag="button">关于我们</router-link>

// 渲染结果：
<button class="router-link-active">关于我们</button>
```

3. active-class（可选）

‌ 默认值 ‌：'router-link-active'

‌ 作用 ‌：自定义激活状态的 CSS 类名，设置高亮样式
‌

```html
<router-link to="/contact" active-class="active-nav">联系我们</router-link>
```

4. 动态参数

```js

<router-link :to="{ name: 'user', params: { id: 123 }}">用户123</router-link>
// URL 结果：#/user/123
```

5. query（URL 查询参数）

```js
<router-link :to="{ path: '/search', query: { keyword: 'vue' }}">搜索</router-link>
// URL 结果：#/search?keyword=vue
```

### router-view

在根组件（如 App.vue）中放置 `<router-view>`：

```html
<template>
  <div id="app">
    <h1>My App</h1>

    <!-- 路由组件在此渲染 -->
    <router-view></router-view>
  </div>
</template>
```

嵌套路由

定义子路由：

```javascript
// router.js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '', component: Profile }, // 默认子路由
      { path: 'posts', component: Posts },
    ],
  },
];
```

父组件中嵌套 `<router-view>`：

```html
<!-- User.vue -->
<template>
  <div>
    <h2>User {{ $route.params.id }}</h2>
    <router-view></router-view>
    <!-- 子路由组件在此渲染 -->
  </div>
</template>
```

## $router 、$route

### $router

`$router` 是全局路由实例（VueRouter 的实例），用于 编程式导航（如跳转页面、前进后退等）。

```js
// 基本跳转
this.$router.push('/home');

// 对象形式（支持 path 或 name）
this.$router.push({ path: '/user/1' });
this.$router.push({ name: 'user', params: { id: 1 } });

// 带查询参数
this.$router.push({ path: '/search', query: { keyword: 'vue' } });

// 替换当前路由（不记录到历史）：
this.$router.replace('/login');

this.$router.go(1); // 前进一步
this.$router.go(-1); // 后退一步

this.$router.back(); // 返回上一页（类似浏览器后退）
```

示例场景

```html
<template>
  <button @click="goToUser(123)">查看用户</button>
  <button @click="goBack">返回</button>
</template>

<script>
  export default {
    methods: {
      goToUser(id) {
        this.$router.push({ name: 'user', params: { id } });
      },
      goBack() {
        this.$router.go(-1);
      },
    },
  };
</script>
```

### $route

`$route`是当前激活的路由信息对象，包含 路径、参数、查询参数 等。

```js
this.$route.path; // 当前路径，如 "/user/1"
this.$route.fullPath; // 完整路径（含查询参数），如 "/user/1?name=vue"

// 动态路由参数（如 path: '/user/:id'）
this.$route.params.id;

// 查询参数（URL 中的 ?key=value）
this.$route.query.name;

this.$route.name; // 路由名称（如果有命名路由）
this.$route.hash; // URL 的 hash（如 #section）
this.$route.matched; // 当前匹配的路由配置数组（用于嵌套路由）
```

## 路由重定向

路由重定向是一种将用户请求的路径自动导航到另一个路径的机制

1. 基本重定向（字符串路径）

将 /a 重定向到 /b：

```javascript
// router.js
const routes = [
  { path: '/a', redirect: '/b' },
  { path: '/b', component: PageB },
];
```

2. 函数式动态重定向

根据逻辑动态决定目标：

```javascript

{
  path: '/dashboard',
  redirect: (to) => {
    // 根据用户角色返回不同路径
    const role = localStorage.getItem('userRole');
    return role === 'admin' ? '/admin' : '/user';
  }
}

```

3. 命名路由重定向

通过路由名称跳转：

```javascript
{
  path: '/old',
  redirect: {
    name: 'newPage' // 跳转到名为 "newPage" 的路由
  }
}
```

## 路由懒加载

路由懒加载可以通过动态导入将路由组件分割成独立的代码块，实现按需加载。

1. 使用动态 import() 语法

```js
// router.js
const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue'), // 懒加载组件
  },
  {
    path: '/about',
    component: () => import('./views/About.vue'), // 按需加载
  },
];
```

2. 结合异步组件处理加载状态

```javascript
// 自定义加载中/加载失败界面
const User = () => ({
  component: import('./views/User.vue'),
  loading: LoadingComponent, // 加载中的占位组件
  error: ErrorComponent, // 加载失败的提示组件
  timeout: 3000, // 超时时间（毫秒）
});

const routes = [{ path: '/user', component: User }];
```

3. 自定义 Webpack 分块名称（魔法注释）

```javascript
// router.js
const routes = [
  {
    path: '/user/:id',
    component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
  },
];
```

打包后会生成 `user.[hash].js`，便于调试和长期缓存。

同一分组的路由可复用块名（适用于嵌套路由）：

```javascript

// 合并到同一个块
() => import(/* webpackChunkName: "group-admin" */ './views/AdminPage.vue')
() => import(/* webpackChunkName: "group-admin" */ './components/AdminSidebar.vue')
```

4. 捕获加载失败（如网络问题）

```javascript
const User = () =>
  import('./views/User.vue').catch(() => import('./views/Fallback.vue'));
```

## meta 路由元信息

路由配置中的 meta 字段是一个 自定义元数据对象，允许你为路由附加任意信息，

meta 的核心作用：

- 存储路由相关的自定义信息。例如：页面是否需要登录、用户权限要求、页面标题、缓存配置等
- 在路由守卫中访问这些信息，通过 to.meta 或 from.meta 在全局守卫中读取元数据
- 不影响路由匹配逻辑，纯粹用于开发者自定义逻辑

基本使用：

```js
// router.js
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true, // 需要登录
      title: '控制面板', // 页面标题
      accessLevel: 'admin', // 访问权限级别
    },
  },
  {
    path: '/public',
    component: PublicPage,
    meta: {
      isPublic: true, // 公开页面
    },
  },
];
```

### 使用场景

1. 权限验证

```javascript
// 路由配置
{
  path: '/admin',
  component: AdminPanel,
  meta: {
    requiresAuth: true,
    allowedRoles: ['superadmin', 'admin'] // 允许的角色
  }
}

// 全局守卫中验证
router.beforeEach((to, from, next) => {
  const userRole = getCurrentUserRole();

  if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userRole)) {
    next('/forbidden'); // 无权限页面
  } else {
    next();
  }
});
```

2. 页面标题管理

```javascript
// 路由配置
{
  path: '/user/:id',
  component: UserProfile,
  meta: {
    title: '用户详情'
  }
}

// 全局后置钩子设置标题
router.afterEach((to) => {
  document.title = to.meta.title || '我的应用';
});
```

3. 布局切换

```js

// 路由配置
{
  path: '/login',
  component: Login,
  meta: {
    layout: 'empty' // 使用无侧边栏布局
  }
}

// 根组件动态选择布局  App.vue
<template>
  <component :is="layout">
    <router-view/>
  </component>
</template>

<script>
export default {
  computed: {
    layout() {
      return this.$route.meta.layout || 'default-layout';
    }
  }
}
</script>
```

4. 嵌套路由的 meta 合并
   当路由嵌套时，子路由的 meta 会与父路由合并：

```javascript
{
  path: '/parent',
  meta: { requiresAuth: true },
  children: [
    {
      path: 'child',
      meta: { title: '子页面' },
      // 最终 meta: { requiresAuth: true, title: '子页面' }
    }
  ]
}
```

## 路由守卫

路由守卫是控制路由跳转的关键机制，可用于 权限验证、数据预加载、访问控制 等场景

按作用范围分为三类，执行顺序如下：

```bash

1. 全局前置守卫（beforeEach）
2. 路由独享守卫（beforeEnter）
3. 组件内守卫（beforeRouteEnter）
4. 全局解析守卫（beforeResolve）
5. 全局后置钩子（afterEach）
6. 组件内离开守卫（beforeRouteLeave）

```

### beforeEach

router.beforeEach - 全局前置守卫

场景：登录验证、权限校验、路由拦截

```js
// router.js
router.beforeEach((to, from, next) => {
  // 1. 检查目标路由是否需要登录
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 2. 检查用户是否登录（假设有store存储token）
    if (!store.getters.isLoggedIn) {
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      next(); // 放行
    }
  } else {
    next(); // 不需要验证的路由直接放行
  }
});
```

### beforeResolve

router.beforeResolve - 全局解析守卫

场景：在导航被确认前，确保异步组件/数据已加载

```js
router.beforeResolve((to, from, next) => {
  // 例如：确保动态加载的组件已解析
  if (to.meta.requiresAsyncData) {
    loadAsyncData().then(() => next());
  } else {
    next();
  }
});
```

### afterEach

router.afterEach - 全局后置钩子

场景：页面访问统计、修改页面标题

```javascript
router.afterEach((to, from) => {
  document.title = to.meta.title || '默认标题';
  // 发送统计事件
  analytics.trackPageView(to.path);
});
```

### beforeEnter

beforeEnter - 路由独享守卫

定义在 路由配置中，仅对该路由生效。

场景：特定路由的权限控制（如 VIP 页面）

```js

// router.js
{
  path: '/vip',
  component: VIPPage,
  beforeEnter: (to, from, next) => {
    if (!store.getters.isVIP) {
      next('/upgrade'); // 跳转到升级提示页
    } else {
      next();
    }
  }
}
```

### beforeRouteEnter

beforeRouteEnter - 组件内守卫: 进入组件前

定义在 Vue 组件内，控制组件级导航。

场景：获取组件初始化数据

⚠️ 此时组件实例未创建，无法访问 this

```javascript
// UserProfile.vue
export default {
  beforeRouteEnter(to, from, next) {
    // 通过回调访问实例
    next((vm) => {
      vm.fetchUserData(to.params.id); // 调用组件方法
    });
  },
};
```

### beforeRouteUpdate

beforeRouteUpdate - 路由参数变化但组件复用时

场景：响应路由参数变化（如 /user/1 → /user/2）

```javascript
// UserProfile.vue
export default {
  beforeRouteUpdate(to, from, next) {
    this.userId = to.params.id; // 更新组件数据
    this.loadData();
    next();
  },
};
```

### beforeRouteLeave

beforeRouteLeave - 离开组件前

场景：阻止未保存的表单离开、清理资源

```javascript
// FormEditor.vue
export default {
  data() {
    return { hasUnsavedChanges: false };
  },
  beforeRouteLeave(to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmLeave = confirm('有未保存的更改，确定离开吗？');
      next(confirmLeave); // true放行，false取消导航
    } else {
      next();
    }
  },
};
```

### 执行流程示例

页面加载时路由守卫触发顺序：

```bash
1. 触发全局的路由守卫 beforeEach
2. 组件在路由配置的独享路由 beforeEnter
3. 进入组件中的 beforeRouteEnter，此时无法获取组件对象
4. 触发全局解析守卫 beforeResolve
5. 此时路由完成跳转 触发全局后置守卫 afterEach
6. 组件的挂载 beforeCreate --> created --> beforeMount
7. 路由守卫 beforeRouterEnter 中的 next回调， 此时能够获取到组件实例 vm
8. 完成组件的挂载 mounted

```

当点击切换路由时： A 页面跳转至 B 页面触发的生命周期及路由守卫顺序：

```bash

1. 导航被触发进入其他路由。
2. 在离开的路由组件中调用 beforeRouteLeave 。
3. 调用全局的前置路由守卫 beforeEach 。
4. 在重用的组件里调用 beforeRouteUpdate 守卫。
5. 调用被激活组件的路由配置中调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件中调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫。
9. 导航被确认。
10. 调用全局后置路由 afterEach 钩子。
11. 触发 DOM 更新，激活组件的创建及挂载 beforeCreate (新)-->created (新)-->beforeMount(新) 。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
13. 失活组件的销毁 beforeDestory(旧)-->destoryed(旧)
14. 激活组件的挂载 mounted(新)
```

### 参数说明

所有守卫函数接收三个参数：

| 参数 | 说明                                   |
| ---- | -------------------------------------- |
| to   | 即将进入的路由对象（目标路由信息）     |
| from | 当前导航正要离开的路由（来源路由信息） |
| next | 函数，必须调用以继续/终止导航          |

next() 函数的用法：

```javascript
next(); // 放行导航
next(false); // 终止导航，停留在当前页
next('/login'); // 跳转到新路径
next(error); // 传入 Error 实例，终止导航并触发 router.onError()
```

### 使用场景

1. 登录状态验证

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isPublicRoute = to.matched.some(record => record.meta.isPublic);
  const isLoggedIn = checkAuth(); // 自定义验证方法

  if (!isPublicRoute && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

// 路由配置标记公开路由
{
  path: '/login',
  component: Login,
  meta: { isPublic: true }
}
```

2. 动态权限加载

```javascript
// 全局前置守卫 + 动态加载用户权限
router.beforeEach(async (to, from, next) => {
  if (!store.getters.userRole) {
    await store.dispatch('fetchUserRole'); // 异步获取用户权限
  }

  const requiredRole = to.meta.requiredRole;
  if (requiredRole && store.getters.userRole !== requiredRole) {
    next('/403'); // 无权限页面
  } else {
    next();
  }
});
```

3. 滚动行为恢复

```javascript
// 利用 afterEach 记录滚动位置
let scrollPositions = {};

router.beforeEach((to, from, next) => {
  scrollPositions[from.path] = window.pageYOffset;
  next();
});

router.afterEach((to, from) => {
  window.scrollTo(0, scrollPositions[to.path] || 0);
});
```

### 错误捕获

可通过 `router.onError()` 全局捕获导航错误

```javascript
router.onError((error) => {
  console.error('路由错误:', error);
  // 跳转到错误页面
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    router.push('/network-error');
  }
});
```

<BackTop></BackTop>