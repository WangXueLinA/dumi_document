---
toc: content
title: 透传 Attributes
order: -93
---

# Vue3

## 透传 Attributes

父组件传递给子组件的 非 props 声明的 Attributes（如 class、style、事件监听器等），会自动绑定到子组件的 根元素 上。

```html
<!--父组件-->
<script setup>
  import Child from './Child.vue';
</script>

<template>
  <Child
    class="parent-class"
    style="color: red"
    id="parent-id"
    @click="() => console.log('父组件点击事件')"
    data-custom="custom-data"
  />
</template>

<!--子组件-->
<template>
  <!-- 单根元素 div 会自动继承所有 Attributes -->
  <div class="child-class" style="font-size: 16px" id="child-id">
    子组件内容
  </div>
</template>
```

渲染结果：

- class 合并，style 合并，id 被覆盖
- 点击 div 会触发父组件的 @click 事件
- 自定义属性 data-custom 被保留

```html
<div
  class="child-class parent-class"
  style="color: red; font-size: 16px"
  id="parent-id"
  data-custom="custom-data"
>
  子组件内容
</div>
```

## 禁用 Attributes 继承

如果你不想要一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`，透传进来的 attribute 可以在模板的表达式中直接用 `$attrs` 访问到。

```vue
<script>
export default {
  inheritAttrs: false,
};
</script>
```

从 3.3 开始你也可以直接在 `<script setup>` 中使用 `defineOptions`：

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
});
// ...setup 逻辑
</script>
```

举一个完整例子：

```vue
<!--父组件-->
<script setup>
import CustomInput from './CustomInput.vue';
import { ref } from 'vue';

const searchText = ref('');
const handleFocus = () => {
  console.log('输入框获得焦点');
};
</script>

<template>
  <CustomInput
    v-model="searchText"
    class="custom-input"
    style="border-color: blue"
    placeholder="请输入搜索内容"
    data-tracking-id="search-field"
    @focus="handleFocus"
  />
</template>

<!-- 子组件 CustomInput.vue -->
<script>
export default {
  // 1. 关闭自动透传
  inheritAttrs: false,
};
</script>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 2. 处理 v-model（如果需要）
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="input-wrapper">
    <!-- 3. 直接在模板中使用 $attrs 绑定所有透传属性 -->
    <input
      v-bind="$attrs"
      :class="`base-input ${$attrs.class || ''}`"
      :style="`${$attrs.style || ''}; padding: 8px;`"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <button @click="emit('update:modelValue', '')">清空</button>
  </div>
</template>

<style scoped>
.input-wrapper {
  /* 样式保持不变 */
}
.base-input {
  /* 样式保持不变 */
}
</style>
```

你可以在 `<script setup>` 中使用 useAttrs() API 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>
```

如果没有使用 `<script setup>`，attrs 会作为 setup() 上下文对象的一个属性暴露：

```js
export default {
  setup(props, { attrs }) {
    // 透传 attribute 被暴露为 attrs
    console.log(attrs);
  },
};
```

## useAttrs

useAttrs() 是 Vue 3 组合式 API 中的一个工具函数，用于获取组件接收的所有非 props 属性（包括 class、style、事件监听器、自定义 HTML 属性等）。返回一个响应式对象，包含父组件传递但未在子组件 props 中显式声明的属性。

### 基础语法

```js
import { useAttrs } from 'vue';

// 在 setup 或 <script setup> 中使用
const attrs = useAttrs();
```

模板绑定：通过 v-bind 批量传递属性到子元素或组件：

```vue
<template>
  <!-- 将所有非 props 属性绑定到 div -->
  <div v-bind="attrs"></div>
</template>
```

访问特定属性：直接通过 attrs 对象访问属性：

```javascript
console.log(attrs.class); // 获取 class
console.log(attrs.onClick); // 获取事件监听器（注意格式为 onXxx）
```

### 使用场景

1. 属性透传

需要将父组件传递的未知属性自动传递给子组件内部的元素，避免手动声明每个 prop。

典型场景：封装基础组件（如按钮、输入框）时透传 class、style 或 ARIA 属性。

2. 高阶组件（HOC）

在包装组件中接收父组件传递的所有属性，并向下传递到被包裹的组件。

3. 动态属性处理

当父组件可能传递动态属性（如自定义数据属性、事件）时，无需子组件预先声明。

4. 第三方库集成

需要将属性传递给第三方库的组件，但不确定具体需要哪些属性。

```vue
<!-- 父组件 Parent.vue -->
<template>
  <CustomButton
    class="my-button"
    @click="handleClick"
    data-test="button-1"
    title="Submit"
  >
    点击我
  </CustomButton>
</template>

<script setup>
import CustomButton from './CustomButton.vue';

const handleClick = () => {
  console.log('按钮被点击');
};
</script>

<!-- 子组件 CustomButton.vue -->
<template>
  <button
    v-bind="filteredAttrs"
    :class="['default-style', attrs.class]"
    @click="handleButtonClick"
  >
    <slot />
  </button>
</template>

<script setup>
import { useAttrs, computed } from 'vue';

const attrs = useAttrs();

// 过滤掉不想传递的属性（如 title）
const filteredAttrs = computed(() => {
  const { title, ...rest } = attrs;
  return rest;
});

// 自定义点击逻辑
const handleButtonClick = (e) => {
  console.log('自定义点击处理');
  // 手动触发父组件传递的点击事件
  if (attrs.onClick) {
    attrs.onClick(e);
  }
};

// 输出属性
console.log(attrs);
// 输出：{ class: 'my-button', onClick: fn, 'data-test': 'button-1', title: 'Submit' }
</script>

<style>
.default-style {
  padding: 8px 16px;
  background-color: #f0f0f0;
}
</style>
```

### 注意事项

1. 不要直接解构：attrs 是响应式对象，解构会失去响应性：

```javascript
// ❌ 错误！解构后不再是响应式
const { class, style } = useAttrs();

// ✅ 正确：通过 attrs 对象访问
console.log(attrs.class);
```

2. 属性优先级：如果子组件同时声明了 props 和 attrs 中的同名属性，props 会覆盖 attrs：

```vue
<!-- 父组件 -->
<ChildComponent title="Parent Title" />

<!-- 子组件 -->
<script setup>
defineProps({ title: String }); // 声明 title prop
const attrs = useAttrs();

console.log(attrs.title); // 输出 undefined，因为 title 已被 props 捕获
</script>
```

3. 事件监听器格式：父组件传递的事件在 attrs 中以 onXxx 格式存在：

```vue
<!-- 父组件 -->
<ChildComponent @click="handleClick" />

<!-- 子组件 -->
<script setup>
const attrs = useAttrs();
console.log(attrs.onClick); // 输出函数引用
</script>
```

### 常见问题

1.  为什么 v-bind="attrs" 不生效？

- 确保没有在子组件中声明同名 prop，否则该属性会被 prop 捕获，不会进入 attrs。
- 检查是否有重复绑定的属性（如同时写了 v-bind="attrs" 和 :class="..."），后者会覆盖前者。

2. 如何监听 attrs 变化？

```javascript
import { watchEffect } from 'vue';

watchEffect(() => {
  console.log('attrs 变化:', attrs.class);
});
```

3. TypeScript 类型提示？为 attrs 添加类型声明：

```typescript
import { UseAttrsReturn } from 'vue';

const attrs: UseAttrsReturn = useAttrs();
// 或直接推断类型
const attrs = useAttrs(); // 自动推断为 Record<string, any>
```

<BackTop></BackTop>