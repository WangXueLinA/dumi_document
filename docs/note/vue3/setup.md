---
toc: content
title: setup函数
order: -99
---

# Vue3

## setup

### 为何引入

1. 解决 Options API 的局限性

在 Vue2 的 Options API（data, methods, computed 等选项）中，当组件逻辑复杂时，相关代码会被拆分到不同选项中，导致逻辑碎片化。例如，一个功能相关的 data、method 和生命周期钩子可能分散在不同位置。

目标：setup 允许将同一功能的逻辑集中在一起，提升代码可读性和可维护性。

2. 更好的逻辑复用

Vue2 的 Mixins 容易导致命名冲突和来源不清晰。

解决方案：通过 setup + 自定义组合函数（如 useCounter()），可以更安全、灵活地复用逻辑。

3. 更好的 TypeScript 支持

Composition API 天然适合类型推导，setup 中定义的变量和函数可以轻松获得类型提示。

### 定义

setup 是一个函数，在组件实例创建之前执行，用于定义响应式数据、方法、生命周期钩子等

```js
export default {
  props: ['title'],
  setup(props, context) {
    // 1. 响应式数据
    const count = ref(0);

    // 2. 方法
    const increment = () => count.value++;

    // 3. 生命周期钩子
    onMounted(() => console.log('组件已挂载'));

    // 4. 返回模板使用的数据和方法
    return { count, increment };
  },
};
```

### 参数

setup 函数接收 两个参数：

1. props: 组件接收的 props 对象（响应式）

2. context: 上下文对象，包含以下属性：

   1. attrs: 非 props 的属性（未在 props 中声明的属性）

   2. slots: 插槽内容（等同于 this.$slots）

   3. emit: 触发自定义事件的函数（等同于 this.$emit）

#### props 参数

接收父组件传递的 props 数据。

响应式：当父组件传递的 props 变化时，props 会自动更新。

使用场景：需要在子组件中处理父组件传递的数据。

<Alert message='不要直接解构 props，否则会失去响应性。若需解构，使用 toRefs。'></Alert>

```js
// ❌ 错误：直接解构会失去响应性
const { title } = props;

// ✅ 正确：使用 toRefs 保持响应性
const { title } = toRefs(props);
console.log(title.value);
```

#### context：上下文对象

包含 attrs、slots 和 emit，用于访问非 props 属性、插槽和触发事件。

1. attrs： 包含父组件传递的非 props 属性（如 class、style 或未在 props 中声明的属性）

使用场景：

- 需要透传属性到子组件的根元素或其他元素。
- 处理动态属性（如自定义 HTML 属性）。

```html
<!-- 父组件 -->
<ChildComponent custom-attr="123" class="custom-class" />

<!-- 子组件 -->
<script>
  export default {
    setup(props, { attrs }) {
      console.log(attrs.class); // 输出 "custom-class"
      console.log(attrs.customAttr); // 输出 "123"
      return {};
    },
  };
</script>
```

2. slots：访问插槽内容（包括默认插槽和具名插槽）。

使用场景

- 需要动态渲染插槽内容。
- 在逻辑中判断插槽是否存在。

```html
<!-- 父组件 -->
<ChildComponent>
  <template #header>标题</template>
  默认内容
</ChildComponent>

<!-- 子组件 -->
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    setup(props, { slots }) {
      // 检查插槽是否存在
      const hasHeader = !!slots.header;
      // 渲染插槽内容
      return { hasHeader };
    },
  };
</script>
```

3. emit：触发自定义事件，通知父组件执行逻辑。

使用场景

- 子组件需要向父组件传递数据（如表单提交、按钮点击）。

```vue
<!-- 父组件 -->
<ChildComponent @submit="handleSubmit" />

<!-- 子组件 -->
<script>
export default {
  setup(props, { emit }) {
    const handleClick = () => {
      // 触发 submit 事件，传递数据
      emit('submit', { data: 'payload' });
    };
    return { handleClick };
  },
};
</script>
```

返回值：

- 返回一个对象，对象中的属性和方法可以在模板中直接使用。

```js
<template>
  <button @click="increment">{{ count }}</button>
</template>

export default {
  setup(props, context) {
    const count = ref(0);
    const increment = () => count.value++;

    return { count, increment };
  },
}
```

- 也可以返回一个渲染函数（如 JSX）。

```js
import { h } from 'vue';
setup() {
  return () => h('div', 'Hello World');
}
```

### 使用场景

1. 将同一功能的代码集中在一起

```js
function useUser() {
  const users = ref([]);
  const fetchUsers = async () => {
    users.value = await api.getUsers();
  };
  onMounted(fetchUsers);
  return { users, fetchUsers };
}

// 组件中使用
setup() {
  const { users, fetchUsers } = useUser();
  return { users, fetchUsers };
}
```

2. 逻辑复用（替代 Mixins）

```js
// useCounter.js
export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  return { count, increment };
}

// 组件A
setup() {
  const { count, increment } = useCounter(10);
  return { count, increment };
}

// 组件B
setup() {
  const { count, increment } = useCounter(20);
  return { count, increment };
}
```

3. 与 TypeScript 结合

```js
interface Props {
  title: string;
}

setup(props: Props) {
  const count = ref<number>(0);
  return { count };
}
```

### 注意事项

1. this 不可用：

setup 在组件实例创建前执行，this 为 undefined。

2. 响应式数据必须用 ref/reactive：

直接修改普通变量不会触发视图更新。

```js
// ❌ 错误：非响应式
let count = 0;
const increment = () => count++;

// ✅ 正确：使用 ref
const count = ref(0);
const increment = () => count.value++;
```

3. 避免直接解构 props：

使用 toRefs 或 toRef 保持响应性。

```javascript
const { title } = toRefs(props);
```

4. 异步处理：

setup 不能是一个 async 函数，本身不支持异步， 因为返回值不再是 return 的对象，而是 promise，模板看不到 return 对象中的属性。但可以在内部处理异步逻辑。(后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件配合)

```javascript
setup() {
  const data = ref(null);
  fetchData().then(res => data.value = res);
  return { data };
}
```

### `<script setup>`语法糖

核心特点:

- 自动暴露顶层绑定：所有顶层变量、函数、import 内容自动暴露给模板。

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
```

支持顶层 await：自动将组件转为异步依赖（需配合 `<Suspense>`）。

```vue
<script setup>
const data = await fetchData(); // 自动处理异步
</script>
```

编译器宏：

- defineProps / defineEmits：定义 props 和 emits，无需导入。

```vue
<!-- 使用 setup 函数 -->
<script>
export default {
  props: ['message'],
  emits: ['update'],
  setup(props, { emit }) {
    const handleClick = () => emit('update');
    return { handleClick };
  },
};
</script>

<!-- 使用 <script setup> -->
<script setup>
const props = defineProps(['message']);
const emit = defineEmits(['update']);
const handleClick = () => emit('update');
</script>
```

- defineExpose：显式暴露组件实例的属性和方法。

```vue
<!-- 使用 setup 函数 -->
<script>
export default {
  setup(_, { expose }) {
    const reset = () => {
      /* ... */
    };
    expose({ reset });
    return { reset };
  },
};
</script>

<!-- 使用 <script setup> -->
<script setup>
const reset = () => {
  /* ... */
};
defineExpose({ reset });
</script>
```

无法配置组件选项：如 name、inheritAttrs 等，需通过 `<script>` 块单独定义：

```vue
<script>
export default { name: 'MyComponent' };
</script>

<script setup>
// 逻辑代码
</script>
```

### 对比写法

原 setup 函数写法：

```vue
<template>
  <div>
    <p>{{ props.msg }}</p>
    <button @click="handleEmit">触发事件</button>
    <button @click="logAttrs">查看 attrs</button>
    <slot name="custom-slot"></slot>
  </div>
</template>

<script>
export default {
  props: ['msg'], // 显式声明 props‌:ml-citation{ref="2" data="citationList"}
  setup(props, context) {
    // 接收 props + context 参数‌:ml-citation{ref="1" data="citationList"}
    // context 包含四个属性：attrs/slots/emit/expose‌:ml-citation{ref="1,3" data="citationList"}
    const { attrs, slots, emit, expose } = context;

    const handleEmit = () => {
      emit('custom-event', '参数'); // 通过 context.emit 触发事件‌:ml-citation{ref="2" data="citationList"}
    };

    const logAttrs = () => {
      console.log('attrs:', attrs); // 访问未声明的 props 属性‌:ml-citation{ref="3" data="citationList"}
    };

    return { handleEmit, logAttrs }; // 必须手动返回模板所需方法‌:ml-citation{ref="2,5" data="citationList"}
  },
};
</script>
```

`<script setup>` 语法糖写法

```vue
<template>
  <div>
    <p>{{ msg }}</p>
    <button @click="handleEmit">触发事件</button>
    <button @click="logAttrs">查看 attrs</button>
    <slot name="custom-slot"></slot>
  </div>
</template>

<script setup>
// 通过编译器宏处理参数
import { useAttrs, useSlots } from 'vue';

const props = defineProps(['msg']); // 替代 setup 的 props 参数‌:ml-citation{ref="2,4" data="citationList"}
const emit = defineEmits(['custom-event']); // 替代 context.emit‌:ml-citation{ref="2,3" data="citationList"}
const attrs = useAttrs(); // 替代 context.attrs‌:ml-citation{ref="3" data="citationList"}
const slots = useSlots(); // 替代 context.slots‌:ml-citation{ref="3" data="citationList"}

const handleEmit = () => {
  emit('custom-event', '参数'); // 直接使用 emit 函数‌:ml-citation{ref="2" data="citationList"}
};

const logAttrs = () => {
  console.log('attrs:', attrs.value); // 通过响应式对象访问‌:ml-citation{ref="3" data="citationList"}
};
// 无需返回变量/方法（自动暴露顶层绑定）‌:ml-citation{ref="1,5" data="citationList"}
</script>
```

<BackTop></BackTop>