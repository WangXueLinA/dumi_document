---
toc: content
title: $nextTick
---

# Vue2

## $nextTick

`$nextTick` 是 Vue2 提供的 异步方法，用于在 下一次 DOM 更新循环结束后 执行回调函数。

核心作用：确保在数据变化后能立即操作更新后的 DOM。

### 写法

1. 回调函数写法

```javascript
this.$nextTick(() => {
  // DOM 更新后的操作
});
```

2. Promise 写法（需 Vue 2.1.0+）

```javascript

this.$nextTick()
  .then(() => {
    // DOM 更新后的操作
  })
  .catch(err => console.error(err));

// 或使用 async/await
async handleUpdate() {
  await this.$nextTick();
  // DOM 更新后的操作
}
```

### 场景与示例

1. 数据更新后操作 DOM

修改数据后立即操作 DOM 元素（如聚焦输入框）。

```html
<template>
  <div>
    <input v-if="showInput" ref="inputRef" type="text" />
    <button @click="showInputAndFocus">显示输入框并聚焦</button>
  </div>
</template>

<script>
  export default {
    data() {
      return { showInput: false };
    },
    methods: {
      showInputAndFocus() {
        this.showInput = true;
        this.$nextTick(() => {
          this.$refs.inputRef.focus(); // ✅ DOM 已更新
        });
      },
    },
  };
</script>
```

2. 子组件渲染后执行操作

场景：父组件修改数据后，等待子组件渲染完成再操作子组件实例。

```vue
<!-- 父组件 -->
<template>
  <div>
    <ChildComponent v-if="showChild" ref="childRef" />
    <button @click="showChild = true">加载子组件</button>
  </div>
</template>

<script>
export default {
  data() {
    return { showChild: false };
  },
  methods: {
    handleChild() {
      this.$nextTick(() => {
        this.$refs.childRef.doSomething(); // ✅ 子组件已渲染
      });
    },
  },
};
</script>
```

3. 结合第三方库初始化

场景：数据变化后初始化依赖 DOM 的第三方库（如 ECharts）。

```html
<template>
  <div ref="chartContainer" style="width: 600px; height: 400px;"></div>
</template>

<script>
  import echarts from 'echarts';

  export default {
    data() {
      return { data: [] };
    },
    watch: {
      data(newData) {
        this.$nextTick(() => {
          this.initChart(newData); // ✅ DOM 容器已更新
        });
      },
    },
    methods: {
      initChart(data) {
        const chart = echarts.init(this.$refs.chartContainer);
        chart.setOption({
          /* 基于 data 的配置 */
        });
      },
    },
  };
</script>
```

### 注意事项

1. 不要滥用 `$nextTick`

错误做法：在每次数据变化后都强制使用 $nextTick。

正确做法：仅在需要操作更新后的 DOM 时使用。

2. 避免与 setTimeout 混淆

```javascript
// ❌ 不可靠（可能先于 DOM 更新执行）
setTimeout(() => { ... }, 0);

// ✅ 可靠（保证 DOM 更新后执行）
this.$nextTick(() => { ... });
```

<BackTop></BackTop>