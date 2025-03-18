---
toc: content
title: props/emit
order: -99
---

# Vue3

## props

### setup 函数

```js
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['message'], // 需要单独声明 props 选项
  setup(props) {
    // 访问 props
    console.log(props.message);
  },
});
```

### script setup

```vue
<script setup>
// 定义 props
const props = defineProps({
  message: String,
});

// 访问 props
console.log(props.message);
</script>
```

### 解构

```js
const { foo } = defineProps(['foo']);

watchEffect(() => {
  // 在 3.5 之前只运行一次
  // 在 3.5+ 中在 "foo" prop 变化时重新执行
  console.log(foo);
});
```

在 3.4 及以下版本，foo 是一个实际的常量，永远不会改变。在 3.5 及以上版本，当在同一个 `<script setup>` 代码块中访问由 defineProps 解构的变量时，Vue 编译器会自动在前面添加 props.。因此，上面的代码等同于以下代码：

```js
const props = defineProps(['foo']);

watchEffect(() => {
  // `foo` 由编译器转换为 `props.foo`
  console.log(props.foo);
});
```

3.5+ 也可以使用默认值语法声明 props 默认值。这在使用基于类型的 props 声明时特别有用。

```ts
const { foo = 'hello' } = defineProps<{ foo?: string }>();
```

当我们将解构的 prop 传递到函数中时，可以优化写法

```js
const { foo } = defineProps(['foo']);

watch(() => foo /* ... */);
```

### 单向数据流

```js
const props = defineProps(['foo']);

// ❌ 警告！prop 是只读的！
props.foo = 'bar';
```

1. 导致你想要更改一个 prop 的需求通常来源于以下两种场景：

prop 被用于传入初始值；而子组件想在之后将其作为一个局部数据属性。在这种情况下，最好是新定义一个局部数据属性，从 props 上获取初始值即可：

```js
const props = defineProps(['initialCounter']);

// 计数器只是将 props.initialCounter 作为初始值
// 像下面这样做就使 prop 和后续更新无关了
const counter = ref(props.initialCounter);
```

2. 需要对传入的 prop 值做进一步的转换。在这种情况中，最好是基于该 prop 值定义一个计算属性：

```js
const props = defineProps(['size']);

// 该 prop 变更时计算属性也会自动更新
const normalizedSize = computed(() => props.size.trim().toLowerCase());
```

### Prop 校验

Vue 组件可以更细致地声明对传入的 props 的校验要求。如果传入的值不满足类型要求，Vue 会在浏览器控制台中抛出警告来提醒使用者。这在开发给其他开发者使用的组件时非常有用。可以向 defineProps() 宏提供一个带有 props 校验选项的对象

```ts
interface Props {
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true,
  },
  // 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true,
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100,
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' };
    },
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value);
    },
  },
  // 函数类型的默认值
  propH: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function';
    },
  },
}

defineProps<Props>();
```

## Emits

### setup 函数

```js
export default {
  emits: ['submit', 'inFocus'], // 需要显式声明 emits
  setup(props, { emit }) {
    const handleClick = () => {
      emit('submit', 'payload'); // 通过 emit 函数触发
    };
    return { handleClick };
  },
};
```

### script setup

```vue
<script setup>
// 定义 emits
const emit = defineEmits(['submit', 'inFocus']);

const handleClick = () => {
  emit('submit', 'payload'); // 直接使用 emit
};
</script>
```

### 触发与监听事件

在组件的模板表达式中，可以直接使用 $emit 方法触发自定义事件 (例如：在 v-on 的处理函数中)：

```vue
<!-- 子组件 MyComponent.vue -->
<template>
  <!-- 直接在模板中触发事件 -->
  <button @click="$emit('someEvent', 'payload')">Click Me</button>
</template>

<!-- 父组件可以通过 v-on (缩写为 @) 来监听事件-->
<template>
  <MyComponent @some-event="handleEvent" />
</template>

<script setup>
const handleEvent = (payload) => {
  console.log('Received:', payload); // 输出 'Received: payload'
};
</script>
```

### 事件校验

为事件添加校验，那么事件可以被赋值为一个函数，接受的参数就是抛出事件时传入 emit 的内容，返回一个布尔值来表明事件是否合法。

```vue
<script setup>
const emit = defineEmits({
  // 没有校验
  click: null,

  // 校验 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true;
    } else {
      console.warn('Invalid submit event payload!');
      return false;
    }
  },
});

function submitForm(email, password) {
  emit('submit', { email, password });
}
</script>
s
```

## defineComponent

为了让 TypeScript 正确地推导出组件选项内的类型，我们需要通过 defineComponent() 这个全局 API 来定义组件

```js
import { defineComponent } from 'vue';

export default defineComponent({
  // 启用了类型推导
  props: {
    message: String,
  },
  setup(props) {
    props.message; // 类型：string | undefined
  },
});
```

## defineProps

```vue
<script setup lang="ts">
interface Props {
  message: string;
  count?: number;
}

const props = defineProps<Props>(['message']);
</script>
```

## defineEmits

```vue
<script setup lang="ts">
interface Emits {
  (e: 'submit', payload: string): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>(['submit', 'cancel']);
</script>
```

## withDefaults

主要用于为组件的 props 提供类型安全的默认值，尤其是在使用 `<script setup>` 语法结合 TypeScript 时。

```vue
<script setup lang="ts">
import { withDefaults } from 'vue';

// 定义 Props 类型
interface Props {
  title?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  title: '默认标题',
  size: 'medium',
  disabled: false,
});
</script>
```

使用场景

1. 可选 Props 需要默认值

当父组件没有传递某个 prop 时，使用 withDefaults 提供的默认值。

2. TypeScript 类型安全

确保默认值与 TypeScript 类型定义一致，避免类型错误。

<BackTop></BackTop>