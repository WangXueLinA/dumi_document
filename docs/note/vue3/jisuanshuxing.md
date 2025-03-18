---
toc: content
title: computed/watch
order: -98
---

# Vue3

## computed

与 Vue2.0 中 computed 配置功能一致

### 基础用法

‌Vue2（选项式 API）

```js
export default {
  data() {
    return { firstName: 'John', lastName: 'Doe' };
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
};
```

Vue3（组合式 API）

```vue
<script setup>
import { ref, computed } from 'vue';
const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### 支持 get 和 set

```js
// Vue2 示例（set用法）
computed: {
  fullName: {
    get() { return `${this.firstName} ${this.lastName}` },
    set(val) { [this.firstName, this.lastName] = val.split(' ') }
  }
}

// Vue3 示例（set用法）
const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (val) => [firstName.value, lastName.value] = val.split(' ')
});

```

### 多计算属性 ‌‌

Vue3（组合式 API 优势）‌

```vue
<script setup>
import { ref, computed } from 'vue';

const age = ref(25);
const newAge = computed(() => age.value + 2);
const isAdult = computed(() => age.value >= 18);
</script>
```

### 获取上一个值 ​

仅 3.4+ 支持

如果需要，可以通过访问计算属性的 getter 的第一个参数来获取计算属性返回的上一个值：

```vue
<script setup>
import { ref, computed } from 'vue';

const count = ref(2);

// 这个计算属性在 count 的值小于或等于 3 时，将返回 count 的值。
// 当 count 的值大于等于 4 时，将会返回满足我们条件的最后一个值
// 直到 count 的值再次小于或等于 3 为止。
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value;
  }

  return previous;
});
</script>
```

## watch

计算属性允许我们声明性地计算衍生值。然而在有些情况下，我们需要在状态变化时执行一些“副作用”：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态。

### 基础用法

Vue2

```js
export default {
  data() {
    return { count: 0 };
  },
  watch: {
    // 直接监听数据属性
    count(newVal, oldVal) {
      console.log(`计数器变化：${oldVal} → ${newVal}`);
    },
  },
};
```

vue3

```js
import { ref, watch } from 'vue';

const count = ref(0);
// 显式导入并使用 watch
watch(count, (newVal, oldVal) => {
  console.log(`计数器变化：${oldVal} → ${newVal}`);
});
```

### 监听数据源类型

watch 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组

```vue
<script setup>
const x = ref(0);
const y = ref(0);

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`);
});

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`);
  },
);

// 多源监听能力, 支持数组形式监听多个源
watch([x, () => y.value], ([newX, newY], [oldX, oldY]) => {
  console.log(`X变化：${oldX}→${newX}，Y变化：${oldY}→${newY}`);
});
</script>
```

### 深度监听行为

```vue
<script setup>
const state = reactive({
  user: {
    name: 'Alice',
    age: 25,
  },
});

// 监听嵌套对象属性（需要深度监听）
watch(
  () => state.user,
  (newUser) => {
    console.log('用户信息变化:', newUser);
  },
  { deep: true }, // 开启深度监听
);
</script>
```

注意事项：

- 当监听对象类型的属性时，需要添加 deep: true 才能监听到嵌套属性的变化
- 如果不需要深度监听，可以省略 deep 选项
- 直接监听整个 reactive 对象时(如 state)，vue3 会默认启用深度监听（默认 deep: true，但会产生性能开销）
- 在 Vue 3.5+ 中，deep 选项还可以是一个数字，表示最大遍历深度——即 Vue 应该遍历对象嵌套属性的级数。

### 立即执行控制

watch 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。

我们可以通过传入 immediate: true 选项来强制侦听器的回调立即执行

```javascript
watch(
  source,
  (newValue, oldValue) => {
    // 立即执行，且当 `source` 改变时再次执行
  },
  { immediate: true },
);
```

### 一次性侦听器 ​

仅支持 3.4 及以上版本

每当被侦听源发生变化时，侦听器的回调就会执行。如果希望回调只在源变化时触发一次，请使用 once: true 选项。

```js
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true },
);
```

### 停止监听机制

Vue3 通过返回值停止， 完全终止整个监听行为，常用于组件卸载、手动关闭监听时

```javascript
const stop = watch(source, callback);
stop(); // 调用停止监听
```

Vue2 通过 $watch 返回值停止

```javascript

created() {
  this.unwatch = this.$watch('source', callback)
},
methods: {
  stop() {
    this.unwatch() // 调用停止监听
  }
}
```

### 副作用清除

清理上一次监听回调产生的副作用, 常用于取消未完成的请求、清除定时器等临时资源

onCleanup 函数还作为第三个参数传递给侦听器回调

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  });
});
```

### 监听复杂表达式

Vue3 支持直接监听 getter 函数

```vue
<script setup>
import { ref, reactive, watch, computed } from 'vue';

// 场景1：监听多个响应式值的组合
const user = reactive({
  firstName: '张',
  lastName: '三',
  age: 25,
});

watch(
  () => `${user.firstName} ${user.lastName} (${user.age})`,
  (newFullInfo) => {
    console.log('用户信息更新:', newFullInfo);
  },
);

// 场景2：监听嵌套对象中的特定路径
const company = reactive({
  info: {
    name: 'ABC科技',
    department: {
      engineering: {
        members: 20,
      },
    },
  },
});

watch(
  () => company.info.department.engineering.members,
  (newCount, oldCount) => {
    console.log(`技术部人数变化: ${oldCount} → ${newCount}`);
  },
);

// 场景3：带条件的监听（依赖外部状态）
const searchKeyword = ref('');
const showAdvanced = ref(false);

watch(
  () => ({
    keyword: searchKeyword.value,
    isAdvanced: showAdvanced.value,
  }),
  ({ keyword, isAdvanced }) => {
    if (isAdvanced && keyword.length > 3) {
      console.log('触发高级搜索:', keyword);
      // 这里可以执行搜索操作
    }
  },
);

// 场景4：监听数组的特定变化
const numbers = ref([1, 2, 3]);

watch(
  () => [...numbers.value], // 创建副本以检测数组内容变化
  (newArr, oldArr) => {
    console.log('数组变化:', oldArr, '→', newArr);
  },
  { deep: true },
);

// 场景5：优化性能的监听方式（结合computed）
const complexData = reactive({
  a: 10,
  b: 20,
  c: 30,
});

const optimizedComputed = computed(() => {
  // 复杂的计算逻辑
  return complexData.a * 2 + complexData.b / 5 - complexData.c;
});

watch(optimizedComputed, (newVal) => {
  console.log('优化后的计算结果:', newVal);
});

// 修改测试
function triggerChanges() {
  // 修改用户信息
  user.lastName = '四';
  user.age = 26;

  // 修改嵌套对象
  company.info.department.engineering.members++;

  // 触发搜索条件
  searchKeyword.value = 'vue3';
  showAdvanced.value = true;

  // 修改数组
  numbers.value.push(4);

  // 修改优化数据
  complexData.a = 20;
}
</script>

<template>
  <button @click="triggerChanges">触发所有修改</button>
</template>
```

Vue2 需要借助计算属性

```javascript

computed: {
  total() { return this.x + this.y }
},
watch: {
  total(newVal) { /*...*/ }
}
```

### 注意事项

1. 直接监听 reactive 对象的属性值

```js
const obj = reactive({ count: 0 });

// ❌ 错误，直接监听属性值会失去响应性
// obj.count 是一个基础类型的值（number 类型），不是响应式引用
// 此时 watch 接收到的第一个参数是静态值 0（相当于 watch(0, callback)）
// 当 obj.count 变化时，无法触发监听回调
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`);
});

// ✅ 正确，提供一个getter函数，返回要监听的值
watch(
  () => obj.count,
  (newVal, oldVal) => {
    console.log(`Count 变化: ${oldVal} → ${newVal}`);
  },
);
```

| 写法                        | 响应性  | 触发条件             | 适用场景               |
| --------------------------- | ------- | -------------------- | ---------------------- |
| watch(obj.count, ...)       | ❌ 失效 | 永远不会触发         | 错误写法               |
| watch(() => obj.count, ...) | ✅ 有效 | 属性值变化时触发     | 监听 reactive 对象属性 |
| watch(obj, ...)             | ✅ 有效 | 对象任意属性变化触发 | 监听整个对象           |

## watchEffect

立即运行一个函数，会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

### 基础用法

1. 基本语法

```javascript
import { watchEffect, ref } from 'vue';

const count = ref(0);

// 自动追踪依赖
watchEffect(() => {
  console.log(`当前计数: ${count.value}`);
});
```

2. 自动依赖收集示例

```javascript
const user = reactive({
  name: 'Alice',
  age: 25,
  isVip: false,
});

watchEffect(() => {
  // 自动追踪 user.name 和 user.age
  const discount = user.isVip ? 0.8 : 1;
  console.log(`用户 ${user.name} 的折后年龄: ${user.age * discount}`);
});
```

### 停止监听

完全终止整个 watchEffect 的响应式监听，常用于组件卸载、手动关闭监听时

```javascript
// 手动停止
const stop = watchEffect(() => {
  /*...*/
});

// ...当该侦听器不再需要时 触发清理
stop();

// 自动停止（推荐）
onUnmounted(stop);
```

### 副作用清除

清理上一次副作用产生的临时资源，常用于清除定时器、取消未完成的异步操作

watchEffect 作用函数的第一个参数

```js
// 清理定时器
watchEffect((onCleanup) => {
  const timer = setInterval(() => {
    /*...*/
  }, 1000);
  onCleanup(() => clearInterval(timer));
});
```

### 使用场景

1. 自动请求数据

```javascript
const userId = ref(1);
const userData = ref(null);

watchEffect(async () => {
  // 自动追踪 userId.value
  const response = await fetch(`/api/users/${userId.value}`);
  userData.value = await response.json();
});
```

2. DOM 操作

```javascript
import { ref, watchEffect } from 'vue';

const elementRef = ref(null);

watchEffect(() => {
  if (elementRef.value) {
    // 自动追踪 elementRef.value 变化
    elementRef.value.style.backgroundColor = 'lightblue';
  }
});
```

3. 组合多个依赖

```javascript
const searchTerm = ref('');
const filterType = ref('name');
const pageSize = ref(10);

watchEffect(() => {
  // 自动追踪三个 ref 值
  const params = new URLSearchParams({
    q: searchTerm.value,
    filter: filterType.value,
    limit: pageSize.value,
  });
  console.log('请求参数:', params.toString());
});
```

### 注意事项

1. 初始立即执行

```javascript
// 会立即执行一次
watchEffect(() => {
  console.log('立即执行:', count.value); // 初始值会被打印
});
```

2. 避免无限循环

```javascript
// ❌ 危险示例：会创建无限循环
const counter = ref(0);
watchEffect(() => {
  counter.value++; // 修改依赖项会触发重新执行
});

// ✅ 正确方式：通过条件控制
watchEffect(() => {
  if (counter.value < 10) {
    counter.value++;
  }
});
```

3. 引用类型处理

```javascript
const list = ref([1, 2, 3]);

watchEffect(() => {
  // 不会检测数组内容变化！
  console.log('数组长度:', list.value.length);
});

// ✅ 正确方式：使用深拷贝触发追踪
watchEffect(() => {
  console.log('数组内容:', [...list.value]);
});
```

4. 异步操作处理

```javascript
watchEffect(async () => {
  // ❌ 错误示例：无法正确清理异步副作用
  const data = await fetchData();
  // ...
});

// ✅ 正确方式：使用 onCleanup
watchEffect((onCleanup) => {
  let isCanceled = false;

  fetchData().then((data) => {
    if (!isCanceled) {
      // 处理数据
    }
  });

  onCleanup(() => {
    isCanceled = true;
  });
});
```

### 对比 watch

1. 依赖收集方式对比

```javascript
// watch 需要显式声明依赖
watch([count, searchTerm], ([newCount, newTerm]) => {
  /* ... */
});

// watchEffect 自动收集
watchEffect(() => {
  console.log(count.value, searchTerm.value);
});
```

2. 回调参数差异

```javascript
// watch 可获得新旧值
watch(count, (newVal, oldVal) => {
  /* ... */
});

// watchEffect 没有参数（无法直接获取旧值）
watchEffect(() => {
  console.log('当前值:', count.value);
});
```

3. 立即执行行为

```javascript
// watch 默认不立即执行
watch(count, () => {});

// watchEffect 默认立即执行
watchEffect(() => {});
```

4. 停止监听方式

```javascript
// 两者停止方式相同
const stopWatch = watch(...)
stopWatch()

const stopEffect = watchEffect(...)
stopEffect()
```

5. 清理副作用

```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  });
});

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  });
});
```

Vue 3.5+ 中支持使用 onWatcherCleanup() API 来注册一个清理函数，当侦听器失效并准备重新运行时会被调用，并且必须在 watchEffect 效果函数或 watch 回调函数的同步执行期间调用：你不能在异步函数的 await 语句之后调用它。

```js
import { watch, onWatcherCleanup } from 'vue';

watch(id, (newId) => {
  const controller = new AbortController();

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // 回调逻辑
  });

  onWatcherCleanup(() => {
    // 终止过期请求
    controller.abort();
  });
});
```

| 场景                   | watch 适用性 | watchEffect 适用性 |
| ---------------------- | ------------ | ------------------ |
| 需要新旧值对比         | ✅           | ❌                 |
| 惰性执行（首次不执行） | ✅           | ❌                 |
| 自动依赖收集           | ❌           | ✅                 |
| 组合多个依赖           | ❌           | ✅                 |
| 清理副作用             | ✅           | ✅                 |

### 最佳实践

使用 watch 当：

- 需要比较新旧值
- 需要惰性执行
- 依赖项明确且固定

使用 watchEffect 当：

- 依赖项动态变化
- 需要立即执行
- 处理副作用逻辑

## watchPostEffect

核心用途：在 Vue 完成 DOM 更新后触发，需要访问更新后的 DOM 或确保副作用在渲染后执行

### 基本语法

```js
import { watchPostEffect } from 'vue';

watchEffect(callback, {
  flush: 'post',
});

// watchEffect的{ flush: 'post' }别名
watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
});

// watch 也有 { flush: 'post' }
watch(source, callback, {
  flush: 'post',
});
```

### 使用场景

1. 在数据变化后需要操作更新后的 DOM 元素

```vue
<template>
  <div>
    <p ref="msgElement">{{ message }}</p>
    <button @click="message += '!'">添加感叹号</button>
  </div>
</template>

<script setup>
import { ref, watchPostEffect } from 'vue';

const message = ref('Hello');
const msgElement = ref(null);

// 使用 post 选项获取更新后的 DOM
watchPostEffect(() => {
  if (msgElement.value) {
    console.log('当前元素高度:', msgElement.value.offsetHeight);
  }
});
</script>
```

现象对比：

- ❌ 默认 flush: 'pre' 时，获取的是更新前的 DOM 尺寸
- ✅ 使用 flush: 'post' 时，能获取更新后的正确尺寸

## watchSyncEffect

核心用途：响应式数据变化时， 同步立即触发， 需要即时反馈的简单状态同步

### 基本语法

```js
import { watchSyncEffect } from 'vue';

watchEffect(callback, {
  flush: 'sync',
});

// watchEffect的{ flush: 'sync' }别名
watchSyncEffect(() => {
  /* 在 Vue 更新后执行 */
});

// watch 也有 { flush: 'sync' }
watch(source, callback, {
  flush: 'sync',
});
```

### 使用场景

1. 需要立即响应数据变化（如表单实时验证）

```vue
<template>
  <input v-model="inputText" />
  <p class="error" v-if="error">{{ error }}</p>
</template>

<script setup>
import { ref, watchSyncEffect } from 'vue';

const inputText = ref('');
const error = ref('');

// 同步验证输入
watchSyncEffect(() => {
  error.value = inputText.value.includes('@') ? '' : '必须包含 @ 符号';
});
</script>
```

特点：

- 输入时会 实时同步更新 错误提示
- 但如果验证逻辑复杂，频繁触发可能影响性能

<Alert message="同步侦听器不会进行批处理，每当检测到响应式数据发生变化时就会触发。可以使用它来监视简单的布尔值，但应避免在可能多次同步修改的数据源 (如数组) 上使用。"></Alert>

## 执行顺序比较

```js
const data = ref(0);

watchSyncEffect(() => {
  console.log('Sync 触发:', data.value);
});

watchEffect(() => {
  console.log('默认模式触发:', data.value);
});

watchPostEffect(() => {
  console.log('Post 触发:', data.value);
});

data.value = 1;

/* 输出顺序：
1. Sync 触发: 1
2. 默认模式触发: 1
3. Post 触发: 1
*/
```

| 选项       | 触发时机         | 典型场景               | 注意事项                   |
| ---------- | ---------------- | ---------------------- | -------------------------- |
| pre (默认) | 组件 更新前 执行 | 大多数常规场景         | 无法访问更新后的 DOM       |
| post       | 组件 更新后 执行 | DOM 操作/布局计算      | 使用 watchPostEffect 简化  |
| sync       | 同步 响应变化    | 需要即时反馈的简单逻辑 | 避免在频繁变化的数据源使用 |

<BackTop></BackTop>