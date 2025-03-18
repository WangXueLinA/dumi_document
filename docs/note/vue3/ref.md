---
toc: content
title: ref/reactive等
order: -98
---

# Vue3

vue3 中为什么引入 ref 函数，有什么用，如何使用以及使用场景，注意的点，详细举例简单的完整的 vue 代码说明下

## ref

ref 是 Composition API 的核心响应式 API 之一，用于创建响应式数据。

### 为何引入

为什么我们需要使用带有 .value 的 ref，而不是普通的变量？

当你在模板中使用了一个 ref，然后改变了这个 ref 的值时，Vue 会自动检测到这个变化，并且相应地更新 DOM。这是通过一个基于 Proxy 实现的，但 Proxy 无法直接代理原始值（如 number, string）。当一个组件首次渲染时，Vue 会追踪在渲染过程中使用的每一个 ref。然后，当一个 ref 被修改时，它会触发追踪它的组件的一次重新渲染。

在标准的 JavaScript 中，检测普通变量的访问或修改是行不通的。然而，我们可以通过 getter 和 setter 方法来拦截对象属性的 get 和 set 操作。

该 .value 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。从概念上讲，你可以将 ref 看作是一个像这样的对象：

```js
// 伪代码，不是真正的实现
const ref = {
  _value: 0,
  get value() {
    track();
    return this._value;
  },
  set value(newValue) {
    this._value = newValue;
    trigger();
  },
};
```

另一个 ref 的好处是，与普通变量不同，你可以将 ref 传递给函数，同时保留对最新值和响应式连接的访问。

ref 的用途

- 创建响应式数据：支持基本类型和对象。
- 在组合式 API 中传递响应式数据：保持数据的响应性。
- 明确数据变化的追踪：通过 .value 修改值，代码意图更清晰。

### 基本用法

1. 基本类型：用 ref() 包装，通过 .value 访问。
2. 模板中使用：自动解包，无需 .value。
3. 对象类型：修改属性需通过 .value（如 obj.value.key）。

```vue
<template>
  <button @click="increment">Count: {{ count }}</button>
  <p>User: {{ user.name }}, Age: {{ user.age }}</p>
  <button @click="updateUser">Update User</button>
</template>

<script setup>
import { ref } from 'vue';

// 基本类型
const count = ref(0);

// 对象类型
const user = ref({ name: 'Alice', age: 30 });

function increment() {
  count.value++; // JS 中需 .value
}

function updateUser() {
  user.value.name = 'Bob'; // 修改对象属性
  // user.value = { name: 'Charlie' }; // 替换整个对象
}
</script>
```

### 使用场景

1. 基本类型响应式：如计数器、表单输入。

```vue
<script setup>
import { ref } from 'vue';

// 场景1：基本类型响应式
const count = ref(0);

const increment = () => {
  count.value++; // 操作基本类型值
};
</script>

<template>
  <button @click="increment">点击计数：{{ count }}</button>
</template>
```

2. 组合式函数返回值：封装可复用的逻辑。

```vue
<!-- 组合式函数文件：useFetch.js -->
<script setup>
import { ref } from 'vue';

// 场景2：组合式函数封装
export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err));

  return { data, error };
}
</script>

<!-- 组件中使用 -->
<script setup>
import { useFetch } from './useFetch';

// 使用组合式函数
const { data, error } = useFetch('https://api.example.com/data');
</script>

<template>
  <div v-if="error">错误：{{ error }}</div>
  <div v-else-if="data">数据：{{ data }}</div>
  <div v-else>加载中...</div>
</template>
```

3. 需要替换整个对象：如从 API 获取新数据时。

```vue
<script setup>
import { ref } from 'vue';

// 场景3：替换整个对象
const user = ref({
  name: 'Alice',
  age: 25,
});

// 模拟 API 请求
const fetchNewUser = () => {
  setTimeout(() => {
    // 完全替换对象
    user.value = {
      name: 'Bob',
      age: 30,
    };
  }, 1000);
};
</script>

<template>
  <div>
    <p>姓名：{{ user.name }}</p>
    <p>年龄：{{ user.age }}</p>
    <button @click="fetchNewUser">获取新用户</button>
  </div>
</template>
```

4. 模板引用 DOM 元素：通过 ref 绑定 DOM。

```vue
<script setup>
import { ref } from 'vue';

// 场景4：DOM 元素引用
const inputRef = ref(null); // 创建 DOM 引用

const focusInput = () => {
  inputRef.value.focus(); // 操作 DOM
  inputRef.value.style.border = '2px solid red'; // 修改样式
};
</script>

<template>
  <input ref="inputRef" placeholder="点击按钮聚焦" />
  <button @click="focusInput">聚焦输入框</button>
</template>
```

### 注意事项

- 必须使用 .value：在 JS 中操作 ref 数据时。
- 模板自动解包：直接使用 {{ count }}，无需 .value。
- 避免解构响应式对象：解构普通变量会失去响应性，需用 toRefs。

ref 与 reactive 选择：

- 基本类型用 ref。
- 复杂对象若需整体替换，用 ref；否则用 reactive。

## reactive

### 为何引入

Vue3 的响应式系统基于 Proxy，可以监听对象深层属性的变化（包括数组、嵌套对象等），弥补了 Vue2 中 Object.defineProperty 的局限性。与 ref 不同，reactive 直接操作对象本身，无需通过 .value 访问值，更适合管理复杂的状态对象或集合。

### 基本用法

```vue
<script setup>
import { reactive } from 'vue';

// 定义响应式对象
const state = reactive({
  count: 0,
  user: { name: 'Alice' },
  list: [1, 2, 3],
});

function increment() {
  state.count++;
  state.user.name = 'Bob';
  state.list.push(4);
}
</script>

<template>
  <div>
    <p>Count: {{ state.count }}</p>
    <p>User: {{ state.user.name }}</p>
    <p>List: {{ state.list }}</p>
    <button @click="increment">Update</button>
  </div>
</template>
```

### 使用场景

1. 复杂对象或嵌套数据

```vue
<script setup>
import { reactive } from 'vue';

const form = reactive({
  username: '',
  address: {
    city: 'Beijing',
    street: '',
  },
  hobbies: ['Reading'],
});
</script>
```

2. 管理表单

```vue
<script setup>
import { reactive } from 'vue';

const form = reactive({
  email: '',
  password: '',
});
</script>

<template>
  <input v-model="form.email" />
  <input v-model="form.password" />
</template>
```

### 注意事项

1. 不能直接解构响应式对象

```vue
<script setup>
import { reactive, toRefs } from 'vue';

const state = reactive({ count: 0 });

// ❌ 错误：解构会失去响应性
const { count } = state;

// ✅ 正确：使用 toRefs 保持响应性
const { count } = toRefs(state);
</script>
```

2. 仅支持对象类型

```javascript
// ❌ 错误：无法处理原始值
const num = reactive(10);

// ✅ 正确：原始值用 ref
const num = ref(10);
```

3. 不能替换整个对象：由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失

```js
let state = reactive({ count: 0 });

// 上面的 ({ count: 0 }) 引用将不再被追踪
// (响应性连接已丢失！)
state = reactive({ count: 1 });
```

4. 当 ref 作为深层响应式对象（通过 reactive 创建）的属性时，访问或修改该属性会自动解包，无需使用.value。

```js
const count = ref(0);
const state = reactive({ count });

console.log(state.count); // 0（自动解包, 而不是state.count.value）
state.count = 1; // 直接赋值，相当于修改count.value
console.log(count.value); // 1
```

替换 Ref：若将新的 ref 赋值给已有 ref 属性，原 ref 会被替换，失去关联。

```javascript
const otherCount = ref(2);
state.count = otherCount; // 替换原count为otherCount
console.log(state.count); // 2
console.log(count.value); // 1（原ref不再关联）
```

深层嵌套解包：即使 ref 嵌套在深层对象中，仍会自动解包。

```javascript
const innerRef = ref(5);
const obj = reactive({ a: { b: innerRef } });
console.log(obj.a.b); // 5（自动解包）
```

## ref 对比 reactive

| 特性       | reactive                | ref                                |
| ---------- | ----------------------- | ---------------------------------- |
| 数据类型   | 只接受对象/数组         | 接受任何类型（原始值、对象、函数） |
| 访问方式   | 直接访问属性（obj.key） | 通过 .value 访问（ref.value）      |
| 模板中使用 | 直接使用                | 自动解包（模板中无需 .value）      |
| 深层响应性 | 默认支持                | 需要包裹对象（内部调用 reactive）  |
| 适用场景   | 复杂对象/嵌套数据       | 简单值、需要灵活性的场景           |

## customRef

customRef 是 Vue 3 中的一个函数，用于创建一个自定义的 ref

### 基本语法

```js
import { customRef } from 'vue';

const myCustomRef = customRef((track, trigger) => {
  return {
    get() {
      // 在这里进行依赖追踪
      track();
      // 返回 ref 的值
      return value;
    },
    set(newValue) {
      // 在这里更新 ref 的值
      value = newValue;
      // 触发依赖更新
      trigger();
    },
  };
});
```

### 使用场景

- 需要自定义 getter 和 setter 的逻辑：当你需要在获取或设置值时执行一些自定义逻辑时，可以使用 customRef。
- 需要手动控制依赖追踪和触发更新：当你需要手动控制何时追踪依赖和何时触发更新时，customRef 是一个很好的选择。
- 需要封装复杂的逻辑：当你需要封装一些复杂的逻辑，并且希望这些逻辑在 Vue 的响应式系统中正常工作，customRef 可以帮助你实现这一点。

1. 自定义延迟更新的 ref：它在设置新值时会延迟 1 秒才更新视图。这在某些需要防抖的场景中非常有用。

```vue
<template>
  <div>
    <input v-model="text" placeholder="Type something..." />
    <p>{{ delayedText }}</p>
  </div>
</template>

<script>
import { customRef } from 'vue';

export default {
  setup() {
    // 创建一个自定义的 ref，延迟更新
    const delayedText = customRef((track, trigger) => {
      let timeout;
      let value = '';

      return {
        get() {
          track();
          return value;
        },
        set(newValue) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            value = newValue;
            trigger();
          }, 1000); // 延迟 1 秒更新
        },
      };
    });

    return {
      delayedText,
    };
  },
};
</script>
```

2. 自定义格式化的 ref：它在获取值时会自动将数字格式化为千位分隔符的形式（如 1,000,000），而在设置值时会自动去除这些分隔符。

```vue
<template>
  <div>
    <input v-model="formattedNumber" placeholder="Enter a number" />
    <p>Formatted Number: {{ formattedNumber }}</p>
  </div>
</template>

<script>
import { customRef } from 'vue';

export default {
  setup() {
    // 创建一个自定义的 ref，自动格式化数字
    const formattedNumber = customRef((track, trigger) => {
      let value = '';

      return {
        get() {
          track();
          return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        set(newValue) {
          value = newValue.replace(/,/g, '');
          trigger();
        },
      };
    });

    return {
      formattedNumber,
    };
  },
};
</script>
```

3. 自定义异步获取数据的 ref： 当点击按钮时，会触发 fetchData 函数，该函数会从 API 获取数据并更新 data 的值。

```vue
<template>
  <div>
    <p>Data: {{ data }}</p>
    <button @click="fetchData">Fetch Data</button>
  </div>
</template>

<script>
import { customRef } from 'vue';

export default {
  setup() {
    // 创建一个自定义的 ref，用于异步获取数据
    const data = customRef((track, trigger) => {
      let value = null;

      return {
        get() {
          track();
          return value;
        },
        set(newValue) {
          value = newValue;
          trigger();
        },
      };
    });

    const fetchData = async () => {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos/1',
      );
      const json = await response.json();
      data.value = json;
    };

    return {
      data,
      fetchData,
    };
  },
};
</script>
```

### 注意事项和坑

- 手动调用 track 和 trigger：在 customRef 中，你需要手动调用 track 和 trigger 来追踪依赖和触发更新。如果忘记调用这些函数，可能会导致响应式系统无法正常工作。
- 避免无限循环：在 set 方法中，如果你不小心触发了 trigger，可能会导致无限循环。因此，在更新值时需要小心。
- 性能问题：由于 customRef 允许你自定义逻辑，如果逻辑过于复杂，可能会影响性能。因此，在使用时要确保逻辑尽可能简洁。

## useTemplateRef

Vue 3.5 新增的 useTemplateRef() 是一个用于优化模板引用（Template Refs）的 API，旨在解决传统 ref 在 DOM 操作和组件引用中的一些痛点。

### 基本使用

- 参数：字符串键（如 "inputRef"），需与模板中的 ref 属性值完全匹配。

- 返回值：通过 inputEl.value 访问 DOM 元素或子组件实例。

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue';

const inputRef = useTemplateRef('input');

onMounted(() => {
  inputRef.value.focus();
});
</script>

<template>
  <input ref="input" />
</template>
```

在 3.5 之前的版本尚未引入 useTemplateRef()，我们需要声明一个与模板里 ref attribute 匹配的引用：

```vue
<script setup>
import { ref, onMounted } from 'vue';

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null);

onMounted(() => {
  input.value.focus();
});
</script>

<template>
  <input ref="input" />
</template>
```

如果不使用 `<script setup>`，需确保从 setup() 返回 ref：

```js
export default {
  setup() {
    const input = ref(null);
    // ...
    return {
      input,
    };
  },
};
```

### 使用场景

1. 简化 Hooks 封装

在自定义 Hooks 中，无需导出 ref 变量，避免组件中显式引入未使用的变量：

```javascript
// Hooks 文件
export function useInput(key) {
  const inputEl = useTemplateRef(key);
  const setValue = () => inputEl.value?.focus();
  return { setValue }; // 仅暴露方法，隐藏 ref 变量
}
```

2. 动态绑定：支持动态切换 ref 绑定的目标

```vue
<template>
  <div>
    <!-- 两个输入框始终显示 -->
    <input :ref="key1" placeholder="输入框A" />
    <input :ref="key2" placeholder="输入框B" />

    <!-- 切换要操作的输入框 -->
    <button @click="switchTarget">切换目标</button>
    <button @click="focusCurrent">聚焦当前目标</button>
  </div>
</template>

<script setup>
import { useTemplateRef, ref } from 'vue';

// 定义两个固定的引用键
const key1 = 'inputA';
const key2 = 'inputB';

// 创建两个模板引用
const refA = useTemplateRef(key1);
const refB = useTemplateRef(key2);

// 当前操作目标
const currentTarget = ref(key1);

// 切换目标
const switchTarget = () => {
  currentTarget.value = currentTarget.value === key1 ? key2 : key1;
};

// 聚焦当前目标
const focusCurrent = () => {
  const targetEl = currentTarget.value === key1 ? refA.value : refB.value;
  targetEl?.focus();
};
</script>
```

### 与 ref 对比

| 特性       | 传统 ref                     | useTemplateRef()           |
| ---------- | ---------------------------- | -------------------------- |
| 绑定方式   | 隐式通过变量名匹配字符串 ref | 显式通过字符串键匹配       |
| Hooks 封装 | 需导出 ref 变量              | 可隐藏 ref，仅暴露逻辑方法 |
| 动态切换   | 需手动管理多个 ref           | 通过动态键名简化切换逻辑   |
| 代码可读性 | 变量名与模板字符串易混淆     | 键名一致，意图更清晰       |

<BackTop></BackTop>