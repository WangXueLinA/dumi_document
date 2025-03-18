---
toc: content
title: 自定义指令
---

# Vue3

## 自定义指令

自定义指令主要是为了重用涉及普通元素的底层 DOM 访问的逻辑。

### 局部注册

下面是一个自定义指令的例子，当 Vue 将元素插入到 DOM 中后，该指令会将一个 class 添加到元素中

```vue
<script setup>
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight');
  },
};
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

不使用 `<script setup>` 的情况下，自定义指令需要通过 directives 选项注册

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-highlight
    highlight: {
      /* ... */
    },
  },
};
```

### 全局注册

将一个自定义指令全局注册到应用层级也是一种常见的做法：

```js
const app = createApp({});

// 使 v-highlight 在所有组件中都可用
app.directive('highlight', {
  /* ... */
});
```

### 生命周期

| Vue2 钩子        | Vue3 钩子      | 触发时机                                                     | 参数差异与关键变化                                               |
| ---------------- | -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| -                | created (新增) | 元素属性/事件监听器应用前调用（Vue3 新增，Vue2 无对应钩子）  | 用于在应用属性/事件前执行逻辑                                    |
| bind             | beforeMount    | 元素绑定到父组件时调用（但尚未插入 DOM）                     | -                                                                |
| inserted         | mounted        | 元素插入 DOM 后调用                                          | -                                                                |
| update           | beforeUpdate   | 组件更新前调用（父组件可能已更新，子组件未更新）             | Vue3 将 update 拆分为 beforeUpdate（更新前）和 updated（更新后） |
| componentUpdated | updated        | 组件及其子组件更新后调用                                     | -                                                                |
| unbind           | beforeUnmount  | 元素卸载前调用（Vue3 新增的 beforeUnmount，行为类似 unbind） | -                                                                |
| -                | unmounted      | 元素卸载后调用（Vue3 新增的最终清理钩子）                    | Vue3 新增，用于替代 Vue2 中 unbind 的部分清理逻辑                |

### 简化形式 ​

对于自定义指令来说，一个很常见的情况是仅仅需要在 mounted 和 updated 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：

```js
<div v-color="color"></div>;

app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value;
});
```

### 对象字面量 ​

如果你的指令需要多个值，你可以向它传递一个 JavaScript 对象字面量。别忘了，指令也可以接收任何合法的 JavaScript 表达式。

```js
<div v-demo="{ color: 'white', text: 'hello!' }"></div>;

app.directive('demo', (el, binding) => {
  console.log(binding.value.color); // => "white"
  console.log(binding.value.text); // => "hello!"
});
```

### 不推荐在组件上

⚠️ 不推荐在组件上使用自定义指令。当组件具有多个根节点时可能会出现预期外的行为。

当在组件上使用自定义指令时，它会始终应用于组件的根节点，和透传 attributes 类似。

```html
<MyComponent v-demo="test" />

<!-- MyComponent 的模板 -->

<div>
  <!-- v-demo 指令会被应用在此处 -->
  <span>My component content</span>
</div>
```

<Alert message="组件可能含有多个根节点。当应用到一个多根组件时，指令将会被忽略且抛出一个警告。和 attribute 不同，指令不能通过 v-bind='$attrs' 来传递给一个不同的元素。"></Alert>

<BackTop></BackTop>