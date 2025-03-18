---
toc: content
title: keep-alive(缓存)
order: -90
---

# Vue2

## keep-alive

`<keep-alive>` 是一个抽象组件，用于缓存不活跃的组件实例，避免重复渲染和保持组件状态

## 使用场景

### 包裹动态组件

核心功能：按钮切换

- 点击 "显示 A" → 显示 ComponentA

- 点击 "显示 B" → 显示 ComponentB

动态组件：

`<component :is="currentComponent">` 会根据 currentComponent 的值动态渲染对应组件。

状态缓存：

`<keep-alive>` 包裹动态组件，使得切换时 保留组件状态（如表单输入内容、数据等）。

```vue
<template>
  <div>
    <button @click="currentComponent = 'ComponentA'">显示A</button>
    <button @click="currentComponent = 'ComponentB'">显示B</button>

    <keep-alive>
      <component :is="currentComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'ComponentA', // 默认显示 ComponentA
    };
  },
};
</script>
```

按钮点击事件：通过修改 currentComponent 的值控制显示哪个组件。

动态组件：`<component>` 是 Vue 内置组件，`:is` 属性决定当前渲染的具体组件。

缓存机制：`<keep-alive>` 会缓存已渲染的非活跃组件实例，避免重复销毁和重建。

### 条件性缓存（include/exclude）

使用 include/exclude 动态修改时，Vue 2 可能需要强制刷新（用 v-if 触发重新渲染）

```html
<!-- 只缓存 ComponentA 和 ComponentB -->
<keep-alive :include="['ComponentA', 'ComponentB']">
  <component :is="currentComponent"></component>
</keep-alive>

<!-- 排除 ComponentC -->
<keep-alive :exclude="['ComponentC']">
  <component :is="currentComponent"></component>
</keep-alive>
```

### 结合路由视图（缓存路由组件）

```html
<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>
```

### 结合路由元信息动态缓存

```js
// 路由配置
{
  path: '/user',
  component: User,
  meta: { keepAlive: true } // 标记需要缓存
}
```

```html
<template>
  <keep-alive>
    <router-view v-if="$route.meta.keepAlive"></router-view>
  </keep-alive>
  <router-view v-if="!$route.meta.keepAlive"></router-view>
</template>
```

### 限制最大缓存实例数（max）

```html
<keep-alive :max="5">
  <!-- 最多缓存5个组件 -->
  <router-view></router-view>
</keep-alive>
```

## 生命周期

被缓存的组件会触发特殊生命周期钩子：

- activated：组件被激活（进入缓存组件时触发）

- deactivated：组件被停用（离开缓存组件时触发）

示例：自动刷新数据

```javascript
export default {
  activated() {
    this.loadData(); // 重新获取最新数据
  },
  deactivated() {
    this.clearTimer(); // 清理定时器等资源
  },
};
```

## 最佳实践

1. 多标签页切换： 如 Tab 标签页切换，保持每个标签页的状态（表格分页、筛选条件等）。

2. 表单多步骤流程：在步骤 1 填写数据后切换到步骤 2，返回时数据不丢失。

3. 性能优化：避免复杂组件（如大数据量图表、富文本编辑器）重复渲染的开销。

## 常见问题

1. 如何强制刷新缓存组件？

```javascript

// 方案1：移除缓存后重新添加
this.$destroy() // 在组件内销毁自身
this.$router.push('/empty') // 跳转到空路由
setTimeout(() => this.$router.push('/target')) // 延迟跳回

// 方案2：使用 v-if 强制刷新（推荐）
<keep-alive>
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>

```

2. 如何清除特定组件缓存？

```javascript
// 获取缓存实例并手动销毁
const cache = this.$parent.$children.find((child) =>
  child.$vnode.tag.includes('keep-alive'),
).cache;
delete cache['ComponentA'];
```

<BackTop></BackTop>