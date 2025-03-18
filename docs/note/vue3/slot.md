---
toc: content
title: slot插槽
order: -92
---

# Vue3

## slot 插槽

Vue3 的插槽机制在语法上更加统一和简洁，通过 `v-slot` 和 `#` 简写提高了代码可读性，同时增强了动态插槽和作用域数据传递的能力。与 Vue2 相比，主要差异在于语法改进和功能扩展，开发者可以更灵活地实现组件内容分发和数据交互

### 默认插槽

子组件中定义 `<slot>` 作为占位符，父组件传递内容到子组件标签内部，替换默认插槽。

```vue
<!--父组件-->
<script setup>
import SubmitButton from './SubmitButton.vue';
</script>

<template>
  <!-- 渲染<button type="submit">Submit</button> -->
  <SubmitButton />

  <!-- 渲染<button type="submit">Save</button>t -->
  <SubmitButton>Save</SubmitButton>
</template>

<!--子组件-->
<template>
  <button type="submit">
    <slot> Submit </slot>
  </button>
</template>
```

### 具名插槽

子组件通过 `<slot name="xxx">` 定义多个插槽，父组件使用 `v-slot:xxx`（或 #xxx 简写方式）指定内容填充位置。
使用场景：复杂布局组件（如页面的头部、主体、底部）

```html
<!-- 子组件 Layout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <slot name="default"></slot>
    <slot name="aaa"></slot>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件 -->
<Layout>
  <template #header>
    <h1>name为header</h1>
  </template>
  <p>不写name默认为default</p>
  <template #aaa>
    <p>name为aaa</p>
  </template>
  <template v-slot:footer>
    <p>name为footer</p>
  </template>
</Layout>
```

使用 JavaScript 函数来类比可能更有助于你来理解具名插槽

```js
// 传入不同的内容给不同名字的插槽
BaseLayout({
  header: `...`,
  default: `...`,
  footer: `...`,
});

// <BaseLayout> 渲染插槽内容到对应位置
function BaseLayout(slots) {
  return `<div class="container">
      <header>${slots.header}</header>
      <main>${slots.default}</main>
      <footer>${slots.footer}</footer>
    </div>`;
}
```

### 条件插槽

有时你需要根据插槽是否存在来渲染某些内容。

你可以结合使用 `$slots` 属性与 `v-if` 来实现。

在下面的示例中，我们定义了一个卡片组件，它拥有三个条件插槽：header、footer 和 default。 当 header、footer 或 default 存在时，我们希望包装它们以提供额外的样式

```vue
<!--父组件-->
<script setup>
import Card from './Card.vue';
</script>

<template>
  <Card>
    <template #header>
      <h1>This is the header</h1>
    </template>

    <template #default>
      <p>This is the content</p>
    </template>

    <template #footer>
      <em>This is the footer</em>
    </template>
  </Card>
</template>

<!--子组件-->
<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <div v-if="$slots.default" class="card-content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.card {
  border: 1px solid black;
  padding: 0;
}

.card-header {
  background-color: skyblue;
  padding: 4px;
}

.card-content {
  padding: 4px;
}

.card-footer {
  background-color: lightgray;
  padding: 4px;
}
</style>
```

### 动态插槽

动态指令参数在 v-slot 上也是有效的，即可以定义下面这样的动态插槽名：

```html
<base-layout>
  <template v-slot:[dynamicSlotName]> ... </template>

  <!-- //缩写为 -->
  <template #[dynamicSlotName]> ... </template>
</base-layout>
```

### 作用域插槽

些场景下插槽的内容可能想要同时使用父组件域内和子组件域内的数据。要做到这一点，我们需要一种方法来让子组件在渲染时将一部分数据提供给插槽。

我们也确实有办法这么做！可以像对组件传递 props 那样，向一个插槽的出口上传递 attributes：

```vue
<!--父组件-->
<template>
  <!--通过子组件标签上的v-slot指令，直接接收子组件传过来的props对象-->
  <MyComponent v-slot="slotProps">
    {{ slotProps.text }} {{ slotProps.count }}
  </MyComponent>
</template>

<!--子组件-->
<template>
  <div>
    <slot :text="greetingMessage" :count="1"></slot>
  </div>
</template>
```

可以类比这里的函数签名，和函数的参数类似，我们也可以在 v-slot 中使用解构：

```vue
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

具名作用域插槽的工作方式也是类似的，插槽 props 可以作为 v-slot 指令的值被访问到：`v-slot:name="slotProps"`。当使用缩写时是这样：

```js
<MyComponent>
  <template #header="headerProps">
    {{ headerProps }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps }}
  </template>

  <template #footer="footerProps">
    {{ footerProps }}
  </template>
</MyComponent>
```

向具名插槽中传入 props：

```vue
<slot name="header" message="hello"></slot>
```

<Alert message="插槽上的 name 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽。因此最终 headerProps 的结果是 `{ message: 'hello' }`"></Alert>

<Alert message="如果你同时使用了具名插槽与默认插槽，则需要为默认插槽使用显式的 `<template>` 标签。尝试直接为组件添加 v-slot 指令将导致编译错误。这是为了避免因默认插槽的 props 的作用域而困惑。"></Alert>

```html
<!-- 子组件 -->
<div>
  <slot :message="hello"></slot>
  <slot name="footer" />
</div>

<!-- 父组件 -->
<MyComponent v-slot="{ message }">
  <p>{{ message }}</p>
  <template #footer>
    <!-- message 属于默认插槽，❌ 此处不可用 -->
    <p>{{ message }}</p>
  </template>
</MyComponent>
```

### 使用场景

- 组件复用：通过插槽定制组件内容（如按钮图标、卡片布局）
- 数据驱动 UI：作用域插槽实现子组件数据在父组件中渲染（如表格列自定义）
- 动态布局：具名插槽实现页面模块化（如头部、侧边栏动态填充）

通过插槽定制组件内容

```vue
<!--父组件-->
<script setup>
import FancyList from './FancyList.vue';
</script>

<template>
  <FancyList api-url="url" :per-page="10">
    <template #item="{ body, username, likes }">
      <div class="item">
        <p>{{ body }}</p>
        <p class="meta">by {{ username }} | {{ likes }} likes</p>
      </div>
    </template>
  </FancyList>
</template>

<!--子组件-->
<script setup>
import { ref } from 'vue';

const props = defineProps(['api-url', 'per-page']);

const items = ref([]);

// mock remote data fetching
setTimeout(() => {
  items.value = [
    { body: 'Scoped Slots Guide', username: 'Evan You', likes: 20 },
    { body: 'Vue Tutorial', username: 'Natalia Tepluhina', likes: 10 },
  ];
}, 1000);
</script>

<template>
  <ul>
    <li v-if="!items.length">Loading...</li>
    <li v-for="item in items">
      <slot name="item" v-bind="item" />
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 5px;
  background: linear-gradient(315deg, #42d392 25%, #647eff);
}
li {
  padding: 5px 20px;
  margin: 10px;
  background: #fff;
}
</style>
```

## useSlots

useSlots() 是 Vue 3 组合式 API 中的工具函数，用于访问组件的插槽内容。返回一个对象，包含父组件传递给当前组件的所有插槽（包括默认插槽和具名插槽），每个插槽对应一个返回 VNode 数组的函数。

### 基础语法

```javascript
import { useSlots } from 'vue';

// 在 setup 或 <script setup> 中使用
const slots = useSlots();
```

访问插槽内容：

- 默认插槽：slots.default?.()
- 具名插槽：slots.header?.()
- 作用域插槽：slots.item?.({ data: 123 })

模板中动态渲染

```vue
<template>
  <!-- 渲染默认插槽 -->
  <div v-if="slots.default">
    <slot />
  </div>

  <!-- 动态渲染具名插槽 -->
  <header v-if="slots.header">
    <slot name="header" />
  </header>
</template>
```

Render 函数中使用

```javascript
import { h } from 'vue';

// 直接调用插槽函数返回 VNode
return h('div', slots.header?.());
```

### 使用场景

1. 动态判断插槽是否存在：根据插槽是否传递内容决定是否渲染某部分 UI。
2. 高阶组件封装：将插槽透传给子组件，实现组件逻辑复用。
3. 操作插槽内容：对插槽内容进行包装或修改。
4. 动态插槽名称：根据数据动态渲染不同插槽。

```vue
<!-- 父组件 Parent.vue -->
<template>
  <CustomCard>
    <template #title>
      <h2 style="color: blue">自定义标题</h2>
    </template>
    这里是卡片内容，<strong>支持 HTML</strong>
  </CustomCard>
</template>

<script setup>
import CustomCard from './CustomCard.vue';
</script>

<!-- 子组件 CustomCard.vue -->
<template>
  <div class="card">
    <!-- 标题区域（仅在插槽存在时渲染） -->
    <div v-if="slots.title" class="card-header">
      <slot name="title" />
    </div>

    <!-- 内容区域 -->
    <div class="card-body">
      <slot>默认内容（当父组件未提供时显示）</slot>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue';
const slots = useSlots();

// 检查插槽是否存在
console.log('是否有标题插槽:', !!slots.title); // 输出 true
</script>

<style>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin: 10px;
}
.card-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 12px;
  padding-bottom: 8px;
}
.card-body {
  color: #666;
}
</style>
```

关键点解析

1. 使用 v-if="slots.title" 动态决定是否渲染标题区域
2. `<slot>` 默认内容作为回退显示
3. 通过 slots.title 访问具名插槽
4. 样式隔离确保组件独立性

### 注意事项

1. 插槽内容非响应式：直接访问的插槽内容是静态快照，不会随父组件更新自动变化

```javascript
// ❌ 错误！slots.default() 只在初始化时获取一次
const slotContent = slots.default?.();

// ✅ 正确：每次渲染时重新获取
render() {
  return h('div', slots.default?.());
}
```

2. 不要直接修改插槽：插槽内容应由父组件控制，子组件只负责渲染

```javascript
// ❌ 错误！禁止直接修改插槽
slots.header()[0].children = '修改内容';

// ✅ 正确：通过 props 或事件通知父组件修改
```

3. 作用域插槽的特殊性：作用域插槽需要通过函数参数传递数据

```vue
<!-- 父组件 -->
<ChildComponent>
  <template #item="props">{{ props.data }}</template>
</ChildComponent>

<!-- 子组件 -->
<script setup>
const slots = useSlots();
// 必须传递作用域参数
const itemNodes = slots.item?.({ data: 123 });
</script>
```

4. TypeScript 类型提示：为插槽添加类型声明：

```typescript
interface Slots {
  default?: () => VNode[];
  header?: (props: { title: string }) => VNode[];
}

const slots = useSlots() as Slots;
```

### 常见问题

1. 如何判断插槽是否存在？

```javascript
// 判断默认插槽
const hasDefaultSlot = !!slots.default;

// 判断具名插槽
const hasHeaderSlot = !!slots.header;
```

2. 如何动态渲染插槽？

```vue
<template>
  <component :is="dynamicComponent" v-for="item in list">
    <!-- 动态插槽名称 -->
    <template #[dynamicSlotName]>
      {{ item.content }}
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue';
const dynamicSlotName = computed(() => 'slot-' + props.type);
</script>
```

3. 如何处理作用域插槽？

```vue
<!-- 子组件 -->
<template>
  <ul>
    <li v-for="item in items">
      <!-- 传递作用域参数 -->
      <slot name="item" :item="item" />
    </li>
  </ul>
</template>

<!-- 父组件 -->
<template>
  <ChildComponent :items="dataList">
    <template #item="{ item }">
      <span class="highlight">{{ item.name }}</span>
    </template>
  </ChildComponent>
</template>
```

<BackTop></BackTop>