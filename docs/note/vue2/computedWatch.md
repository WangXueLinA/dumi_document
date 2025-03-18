---
toc: content
title: computed/watch
order: -98
---

# Vue2

## computed(计算属性)

### 基本概念

计算属性 (computed) 是 Vue2 中一种基于响应式依赖进行缓存的属性，它的值会根据依赖的数据动态计算，并自动缓存结果。只有当依赖的响应式数据发生变化时，计算属性才会重新计算，否则直接返回缓存值。这一特性使其在性能敏感的场景下表现优异。

### 核心特性

1. 缓存机制：
   计算属性仅在依赖的响应式数据变化时重新计算，否则直接返回上一次的结果。
   对比 methods：方法每次调用都会重新执行，无缓存。

2. 响应式依赖追踪：
   Vue2 通过 Object.defineProperty 对数据对象（data、props 等）进行劫持，将每个属性转换为 getter/setter，并在 getter 中收集依赖（即“谁用了我”），在 setter 中触发更新（即“通知使用者我变了”）。

3. 声明式逻辑：
   将复杂逻辑从模板中抽离，使代码更清晰，便于维护。

### 原理

底层借助了 Objcet.defineproperty 方法提供的 getter 和 setter。

### 定义

- 计算属性最终会出现在 vm 上，直接读取使用即可。
- 如果计算属性要被修改，那必须写 set 函数去响应修改，且 set 中要引起计算时依赖的数据发生改变。

1. 函数形式（仅 getter）

```html
<div id="root">
  姓：<input type="text" v-model="firstName" />

  名：<input type="text" v-model="lastName" />

  全名：<span>{{fullName}}</span>
</div>
<script>
  const vm = new Vue({
    el: '#root',
    data: {
      firstName: '张',
      lastName: '三',
    },
    computed: {
      fullName() {
        return this.firstName + '-' + this.lastName;
      },
    },
  });
</script>
```

2. 对象形式（支持 getter/setter）

```html
<div id="root">
  姓：<input type="text" v-model="firstName" />

  名：<input type="text" v-model="lastName" />

  全名：<span>{{fullName}}</span>
</div>

<script type="text/javascript">
  const vm = new Vue({
    el: '#root',
    data: {
      firstName: '张',
      lastName: '三',
    },
    computed: {
      fullName: {
        //get作用: 当有人读取fullName时，get就会被调用，且返回值就作为fullName的值
        //get什么时候调用？1.初次读取fullName时。2.所依赖的数据发生变化时。
        get() {
          console.log('get被调用了');
          return this.firstName + '-' + this.lastName;
        },
        //set什么时候调用? 当fullName被修改时。
        set(value) {
          const arr = value.split('-');
          this.firstName = arr[0];
          this.lastName = arr[1];
        },
      },
    },
  });
</script>
```

### 应用场景

computed 属性非常适合用于那些依赖于其他数据并需要动态计算的场景。它们不仅使代码更加简洁和易于维护，还能通过缓存机制提高性能，特别是在涉及大量计算或者依赖关系复杂的情况下尤为有用。

```html
<div id="root">
  姓名：<input type="text" v-model="name" />
  <div>{{fullName}}</div>
</div>

<script>
  const vm = new Vue({
    el: '#root',
    data: {
      name: '小红',
    },
    computed: {
      fullName() {
        return this.name;
      },
    },
  });
</script>
```

### 坑

1. 依赖非响应式数据

若依赖的数据不是响应式的（如未在 data 中声明），计算属性不会更新。

```js
computed: {
  currentTime() {
    return Date.now(); // Date.now() 不是响应式的
  }
}
```

```html
<div id="root">
  姓名：<input type="text" v-model="name" />
  <div>{{fullName}}</div>
  <button @click="onClick">点击{{count}}</button>
</div>
<script>
  const vm = new Vue({
    el: '#root',
    data: {
      name: '小红',
      count: 1,
    },
    methods: {
      onClick() {
        this.count++;
      },
    },
    computed: {
      fullName() {
        return this.name;
      },
    },
  });

  // 依赖的响应式数据发生变化时，计算属性才会重新计算，否则直接返回缓存值
  console.log(vm.fullName); // => '小红'
  vm.name = '小明';
  console.log(vm.fullName); // => '小明'
  vm.count = 3;
  console.log(vm.fullName); // => '小明'
</script>
```

2. 修改计算属性依赖的数据

在计算属性内部修改依赖数据会导致无限循环：

```js
computed: {
  example() {
    this.counter++; // 错误：修改依赖的数据
    return this.counter * 2;
  }
}
```

3. 异步操作或副作用

计算属性应保持纯函数，避免异步操作或副作用（如 DOM 操作、API 请求）：

```js
computed: {
  // 错误：计算属性不应包含异步操作
  asyncData() {
    fetchData().then(data => this.result = data); // 副作用
  }
}
```

## watch(侦听器)

### 基本概念

Vue2 的 watch 用于监听响应式数据的变化，并在数据变化时执行自定义逻辑（如异步操作、复杂计算或副作用）。与 computed 不同，watch 不缓存结果，且适用于需要主动响应数据变化的场景。

### 核心特性

- 主动响应变化：当被监听的数据变化时，触发回调函数。
- 支持异步操作：可在回调中执行异步任务（如 API 请求）。
- 细粒度控制：可监听对象、数组的深层变化，或手动控制监听行为。
- 无缓存：每次数据变化都会执行回调。

### 原理

底层借助了 Objcet.defineproperty 方法提供的 getter 和 setter。

### 定义

1. 对象形式（推荐）:new Vue 时传入 watch 配置

```html
<div id="app">
  <input v-model="message" placeholder="输入一些文字" />
  <p>当前的消息是: {{ message }}</p>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      message: '',
    },
    watch: {
      // 监听message数据
      message(newVal, oldVal) {
        this.message = newVal;
        console.log('message从 "' + oldVal + '" 变更为 "' + newVal + '"');
      },
    },
  });
</script>
```

2. 函数形式（动态监听）:通过 vm.$watch 监视

```html
<div id="app">
  <input v-model="message" placeholder="输入一些文字" />
  <p>当前的消息是: {{ message }}</p>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      message: '',
    },
  });

  vm.$watch(
    'message', // 监听message数据
    {
      //handler什么时候调用？当message发生改变时。
      handler(newVal, oldVal) {
        this.message = newVal;
        console.log('message从 "' + oldVal + '" 变更为 "' + newVal + '"');
      },
    },
  );
</script>
```

### 应用场景

如： 异步操作，监听输入框值变化，触发搜索请求（防抖优化）：

```html
<div id="app">
  <input type="text" v-model="searchQuery" placeholder="输入搜索内容" />
  <div>搜索结果：{{ results }}</div>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      searchQuery: '', // 输入框内容
      results: [], // 搜索结果
      debounceTimer: null, // 防抖定时器
    },
    watch: {
      // 监听输入框内容变化
      searchQuery(newVal) {
        // 1️⃣ 清除之前的定时器
        clearTimeout(this.debounceTimer);

        // 2️⃣ 设置新的定时器（300ms后执行）
        this.debounceTimer = setTimeout(() => {
          this.fetchResults(newVal);
        }, 300);
      },
    },
    methods: {
      // 模拟搜索请求
      fetchResults(query) {
        console.log('正在搜索:', query);
        // 模拟API返回结果（这里用固定值演示）
        this.results = query ? [`结果1: ${query}`] : [];
      },
    },
  });
</script>
```

### 深度监视

在 Vue 中的 watch 默认不监测对象内部值的改变（一层）。

```html
<div id="root">
  <h3>a的值是:{{numbers.a}}</h3>
  <button @click="numbers.a++">点我让a+1</button>
</div>

<script>
  const vm = new Vue({
    el: '#root',
    data: {
      numbers: {
        a: 1,
      },
    },
    watch: {
      numbers(newValue, oldValue) {
        console.log('控制台监测不到log的输出', newValue, oldValue);
      },
    },
  });
</script>
```

配置 `deep:true` 可以监视对象内部值所有属性的变化,这时候要改写 numbers 的写法，还得增加 `handler` 监视函数，之前不需要配置任何形式时，直接就可以写函数形式，

<Alert message="监听数组的变更不需要这么做。"></Alert>

```html
<div id="root">
  <h3>a的值是:{{numbers.a}}</h3>
  <button @click="numbers.a++">点我让a+1</button>
</div>

<script>
  const vm = new Vue({
    el: '#root',
    data: {
      numbers: {
        a: 1,
      },
    },
    watch: {
      numbers: {
        deep: true,
        handler(newValue, oldValue) {
          console.log('监测到numbers改变了', newValue, oldValue);
        },
      },
    },
  });
</script>
```

如果只监视深层数据的某个时，可以不写`deep:true`，只写监视的那个属性

````html
```html
<div id="root">
  <h3>a的值是:{{numbers.a}}</h3>
  <button @click="numbers.a++">点我让a+1</button>
</div>

<script>
  const vm = new Vue({
    el: '#root',
    data: {
      numbers: {
        a: 1,
        b: 'style',
      },
    },
    watch: {
      //监视多级结构中某个属性的变化
      'numbers.a': {
        handler() {
          console.log('a被改变了');
        },
      },
    },
  });
</script>
````

另外一个配置项 immediate 参数使用的场景是页面初始化时需要根据初始参数加载数据，如表单组件加载时需要立即校验初始值：

```js
watch: {
  formData: {
    handler() {
      this.validateForm(); // 初始化时立即校验
    },
    deep: true,
    immediate: true
  }
}
```

|     场景     | 无 immediate  |    有 immediate     |
| :----------: | :-----------: | :-----------------: |
|   初始化时   | ❌ 不执行回调 | ✅ 立即执行一次回调 |
| 后续数据变化 |  ✅ 正常触发  |     ✅ 正常触发     |

明确是否需要 handler

需要配置选项（deep、immediate） → 对象形式 + handler

不需要配置选项 → 直接使用函数形式

### 坑

1. 未及时销毁监听器

问题：动态创建的监听器（this.$watch）未手动销毁，导致内存泄漏。

解决：保存返回的取消函数并在组件销毁时调用：

```js
created() {
  this.unwatch = this.$watch('data', () => { /* ... */ });
},
beforeDestroy() {
  this.unwatch(); // 取消监听
}
```

## 对比 methods/compute/watch

|   特性   |      computed      |      methods      |         watch          |
| :------: | :----------------: | :---------------: | :--------------------: |
| 执行时机 | 依赖变化时自动计算 |    调用时执行     |   监听数据变化时执行   |
|   缓存   |    ✔️ 自动缓存     |     ❌ 无缓存     |       ❌ 无缓存        |
| 异步支持 |     ❌ 仅同步      |      ✔️ 支持      |        ✔️ 支持         |
| 代码组织 |       声明式       |      命令式       |         命令式         |
|  返回值  |  必须返回计算结果  |   可以无返回值    | 无返回值（执行副作用） |
| 适用场景 |   依赖多数据计算   | 需参数/无缓存需求 |   监听变化执行副作用   |

<BackTop></BackTop>