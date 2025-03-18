---
toc: content
title: 过渡与动画
---

# Vue2

## 过渡与动画

Vue2 通过 `<transition>` 和 `<transition-group>` 组件实现元素过渡和动画效果，支持 CSS 过渡类名 和 JavaScript 钩子函数 两种方式。

元素进入的样式

- v-enter 进入的起点
- v-enter-active 进入过程中
- v-enter-to 进入的终点

元素离开的样式

- v-leave 离开的起点
- v-leave-active 离开过程中
- v-leave-to 离开的终点

可以在 attribute 中声明 JavaScript 钩子

```html
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"
  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

### 过渡实现（单个元素）

1. 使用 `<transition>` 包裹要过渡的元素，并配置 name 属性

```vue
<template>
  <button @click="show = !show">切换显示</button>
  <transition name="fade">
    <!--🔴 要让页面一开始就显示动画，需要添加 appear -->
    <!-- <transition name="fade" appear> -->

    <div v-if="show">过渡内容</div>
  </transition>
</template>

<script>
export default {
  data() {
    return { show: true };
  },
};
</script>
```

2. 定义 CSS 过渡类名，需要将上面样式名的 v 换为 name， 如`v-enter-active` => `fade-enter-active`

```css
/* 进入和离开的过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
```

效果说明：

- 进入时：元素从透明（opacity: 0）过渡到不透明（opacity: 1），持续 0.5 秒。
- 离开时：元素渐隐消失。

### 列表过渡

1. 渲染列表并添加过渡，若有多个元素需要过度，则需要使用`<transition-group>`，且每个元素都要指定 key 值

```vue
<template>
  <button @click="addItem">添加项</button>
  <transition-group name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </transition-group>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, text: '项1' },
        { id: 2, text: '项2' },
      ],
    };
  },
  methods: {
    addItem() {
      this.items.push({
        id: this.items.length + 1,
        text: `项${this.items.length + 1}`,
      });
    },
  },
};
</script>
```

2. 定义列表过渡样式

```css
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.8s;
}
```

效果说明：

- 新增项时：从下方 30px 淡入。
- 移除项时：淡出，其他项平滑移动补位。

### 封装可复用的过渡组件

1. 创建全局过渡组件

```javascript
// GlobalTransition.js
export default {
  functional: true,
  render(createElement, { children }) {
    return createElement(
      'transition',
      {
        attrs: {
          name: 'fade',
          mode: 'out-in',
        },
      },
      children,
    );
  },
};
```

2. 全局注册组件

```js
// main.js
import Vue from 'vue';
import GlobalTransition from './components/GlobalTransition';

Vue.component('GlobalTransition', GlobalTransition);
```

3. 使用封装组件

```js
<GlobalTransition>
  <div v-if="show">复用过渡效果的内容</div>
</GlobalTransition>
```

<BackTop></BackTop>