---
title: Vuex
---

# Vuex

## 官网

https://vuex.vuejs.org/zh/guide/

## 介绍

专门在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 Vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信

## 工作原理

1. 单向数据流架构

```bash
   View → Actions → Mutations → State → View
         (dispatch)  (commit)    (render)
```

- State：单一状态树，存储所有应用级状态
- Mutations：唯一修改 State 的方法（同步操作）
- Actions：处理异步操作，提交 Mutations
- Getters：State 的计算属性，用于派生状态
- Modules：将 Store 分割成模块（大型项目必备）

2. 核心设计理念

- 单一数据源：所有组件共享同一个 Store
- 状态不可直接修改：必须通过提交 Mutation 改变
- 异步操作分离：异步逻辑封装在 Actions 中
- 可追踪的状态变化：配合 Vue DevTools 实现时间旅行调试

<ImagePreview src="/images/vuex/image1.jpg"></ImagePreview>

## 基本使用

1. 安装

```bash
npm install vuex@3  # Vue 2 项目使用 vuex@3， Vue 3 项目使用 vuex@4

```

2. 创建 Store

```js
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    INCREMENT(state, payload) {
      state.count += payload.amount;
    },
  },
  actions: {
    incrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit('INCREMENT', payload);
      }, 1000);
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});
```

3. 注入 Vue 实例

```js
// main.js
import store from './store';

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
```

## State - 状态容器

Vuex 的核心就是仓库 store，这个 store 实例会被注入到所有子组件里面，里面的 state 属性保存着我们的状态，比如我们定义一个状态 count：

### 基本语法

```javascript
export default new Vuex.Store({
  state: {
    count: 10,
  },
});
```

因为根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到。通过计算属性，我们就可以在模板里面使用模板语法来调用 count

```js
<template>
  <div>
    <p>{{ count }}</p>
  </div>
</template>;

export default {
  data() {},
  computed: {
    count() {
      return this.$store.state.count;
    },
  },
};
```

vuex4.x 可以通过调用 useStore 函数，来在 setup 钩子函数中访问 store。这与在组件中使用选项式 API 访问 `this.$store` 是等效的。

```js
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),
    };
  },
};
```

### mapState

通过 vuex 提供的 mapState 简化状态映射，适用于需要获取多个状态的场景

<Alert message="使用了 mapState 方法后，computed 的写法有点区别，比如默认情况你的 computed 属性是这样写的"></Alert>

```js
export default {
  data() {
    return {
      msg: 'hello ',
    };
  },
  computed: {
    msg() {
      return this.msg + 'world!';
    },
  },
};
```

那么你使用了 mapState 后需要这样写 computed，把 msg()放入 mapState，不然会报错。

```js
import { mapState } from 'vuex';

export default {
  data() {
    return {
      msg: 'hello ',
      localCount: 20,
    };
  },
  computed: mapState({
    msg() {
      // 最初的
      return this.msg + 'world!';
    },
    // 使用mapState从store中引入state
    count(state) {
      return state.count;
    },
    mixCount(state) {
      // 结合store和组件状态进行计算
      return state.count + this.localCount;
    },
  }),
};
```

展开运算符`...`，那么 computed 属性不需要改造，按正常写法写

```js
import { mapState } from 'vuex';

<template>
  <div>
    <p>当前计数：{{ count }}</p>
    <p>加载状态：{{ isLoading ? '加载中...' : '空闲' }}</p>
  </div>
</template>

export default {
  computed: {
    // 映射this.count 和 this.isLoading
    ...mapState(['count', 'isLoading']),
  },
  methods: {
    showCount() {
      // 通过 this 访问映射后的计算属性
      console.log('当前计数:', this.count)
      console.log('加载状态:', this.isLoading)
    }
  },
 };
```

对象写法（别名映射）：当需要为状态属性 重命名 或 访问嵌套属性 时使用：

```javascript

...mapState({
  // 重命名
  currentCount: 'count',

  // 访问嵌套属性（假设 state.user 是一个对象）
  userName: state => state.user.name,

  // 结合组件内部数据（使用普通函数）
  combinedData(state) {
    return state.data + this.localData
  }
})

// 组件中访问：this.currentCount / this.userName / this.combinedData

```

当使用 Vuex 模块化 (`namespaced: true`) 时，需明确模块路径：

1. 常规模块映射

```javascript
// 假设存在名为 'user' 的模块
...mapState('user', {
  userName: 'name', // this.userName → store.state.user.name
  userAge: 'age'
})

// 或数组简写
...mapState('user', ['name', 'age'])
```

2. 使用 `createNamespacedHelpers` 工厂函数

```javascript
import { createNamespacedHelpers } from 'vuex';

// 绑定到指定命名空间模块
const { mapState } = createNamespacedHelpers('user');

export default {
  computed: {
    ...mapState(['name', 'email']), // 自动指向 user 模块
  },
};
```

## Getters - 派生状态

核心作用：

- 状态派生: 从 State 中计算派生数据（如过滤列表、汇总数据）
- 复用逻辑: 多个组件共享相同计算逻辑
- 缓存优化: 计算结果会被缓存，只有依赖的 State 变化时才会重新计算
- 解耦组件: 将复杂的数据处理逻辑从组件中剥离，保持组件简洁

### 基本语法

在 store 中使用

```js
export default new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '学习 Vuex', done: true },
      { id: 2, text: '写项目', done: false },
    ],
  },
  getters: {
    // 一般化getter 获取已完成 todos
    doneTodos: (state) => {
      return state.todos.filter((todo) => todo.done);
    },
    // 第二个参数使用其他定义的 Getter
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    },
    // 带参数的 Getter（返回函数）  根据条件筛选 todos
    getTodoById: (state) => (id) => {
      return state.todos.find((todo) => todo.id === id);
    },
  },
});
```

在组件中使用

```vue
<template>
  <div>
    <p>任务1内容：{{ todo1.text }}</p>
    <p>完成{{ doneTodosCount }}个任务</p>
  </div>
</template>

<script>
export default {
  computed: {
    doneTodosCount() {
      // 直接访问
      return this.$store.getters.doneTodosCount;
    },
    todo1() {
      // 带参数调用
      return this.$store.getters.getTodoById(1);
    },
  },
};
</script>
```

vuex4.x 可以通过调用 useStore 函数，来在 setup 钩子函数中访问 store。这与在组件中使用选项式 API 访问 `this.$store` 是等效的。

```js
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    return {
      // 在 computed 函数中访问 getter
      doneTodosCount: computed(() => store.getters.doneTodosCount),
    };
  },
};
```

### mapGetters

mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性，当我们想在组件里面引入多个 getter 时，可以使用 mapGetter

```js
import { mapGetters } from 'vuex';

export default {
  computed: {
    // 数组形式（同名映射）
    ...mapGetters(['doneTodos', 'doneTodosCount']),

    // 对象形式（重命名）
    ...mapGetters({
      todosDone: 'doneTodos',
      todosCount: 'doneTodosCount',
    }),

    // 带参数的 Getter 需要手动处理
    getTodo() {
      return this.$store.getters.getTodoById(2);
    },
  },
};
```

Vuex 模块化 (`namespaced: true`)时写法

```js
// 假设存在名为 'user' 的模块
import { mapGetters, createNamespacedHelpers } from 'vuex';

export default {
  computed: {
    // 指定模块路径
    ...mapGetters('user', ['userProfile']),

    // 或使用 createNamespacedHelpers
    ...createNamespacedHelpers('user').mapGetters(['userProfile']),
  },
};
```

## Mutation - 同步操作

当我们需要修改 store 里面的状态时，我们不是在组件里面直接去修改它们，而是通过 mutation 里面的方法来进行修改，这样有利于追踪状态的改变。

Mutation 是 Vuex 中<span style='color: red'>唯一允许同步修改状态（State）</span>的机制。它的核心作用包括：

- 确保状态变更的可追踪性：所有状态变更都通过 Mutation，DevTools 可以记录快照，便于调试。
- 强制同步更新：Mutation 必须是同步函数，避免竞态条件，确保状态的变更是可预测的。
- 集中管理状态变更逻辑：所有修改 State 的代码集中在 Store 中，提高可维护性。

### 基本语法

在 Vuex Store 的 mutations 对象中定义方法，接收 state 和可选的 payload

```js
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    // 基本形式（无参数）
    increment(state) {
      state.count++;
    },
    // 带参数（payload）
    incrementBy(state, n) {
      state.count += n;
    },
    // 对象风格提交
    incrementByObject(state, payload) {
      state.count += payload.amount;
    },
  },
});
```

组件中使用 Mutation

```js
export default {
  methods: {
    // 直接使用 commit
    handleClick() {
      this.$store.commit('increment');
      this.$store.commit('incrementBy', 10);
    },

    // 对象风格提交（包含 type 属性）
    handleClick() {
      this.$store.commit({
        type: 'incrementByObject',
        amount: 20,
      });
    },
  },
};
```

vuex4.x 可以通过调用 useStore 函数，来在 setup 钩子函数中访问 store

```js
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    return {
      // 使用 mutation
      increment: () => store.commit('increment'),
    };
  },
};
```

### mapMutations

将 Mutation 映射到组件的 methods 中，简化调用：

```js
import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations(['increment', 'incrementBy']),
    // 调用：this.increment() 或 this.incrementBy(10)

    ...mapMutations({
      add: 'increment', // 将 this.add() 映射为 this.$store.commit('increment')
      addBy: 'incrementBy', // 将 this.addBy(n) 映射为 this.$store.commit('incrementBy', n)
    }),
  },
};
```

### 需遵守 Vue 响应规则

这个主要是说你再开发过程中需要向 state 里面添加额外数据时，需要遵循响应准则。 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

<Alert>

- 最好提前在你的 store 中初始化好所有所需属性。
- 当需要在对象上添加新属性时，你应该使用 `Vue.set(obj, 'newProp', 123)`, 或者以新对象替换老对象。例如，利用 对象展开运算符

</Alert>

```js
// 我打算再这儿添加新的属性到state
addNewState(state, payload) {
  // 这是一种写法 ✅ 这种写法用新对象替换老对象
  // Vue.set(state, 'newProp', '添加一个新值！');

  // state= {...state, newProp: '添加一个新值！'} // ❌ 这个玩意儿不管用了，用下面的replaceState()方法
  this.replaceState({...state, newProp: '添加一个新值！'})
}

```

## Actions - 异步操作

Action 是 Vuex 中处理异步操作和复杂逻辑的机制，它的核心作用包括：

- 处理异步任务（如 API 请求、定时器）。
- 组合多个 Mutation（在一次操作中提交多个 Mutation）。
- 封装业务逻辑（例如数据预处理、条件判断）。
- 遵循「状态变更必须通过 Mutation」的规则（Action 通过 commit 触发 Mutation）。

与 Mutation 的关键区别：

- Mutation：必须同步执行，直接修改 State。
- Action：可以异步操作，通过 commit 间接修改 State。

### 基本语法

在 Vuex Store 的 actions 对象中定义方法，接收 context 对象（`{ commit, dispatch }`）结构和可选的 payload

```js
const store = new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    // 基本形式（无参数）
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    },

    // 带参数（payload）
    incrementByAsync({ commit }, n) {
      setTimeout(() => {
        commit('increment', n);
      }, 1000);
    },

    // 组合多个 Mutation 或 Action
    fetchDataAndUpdate({ commit, dispatch }) {
      return fetch('/api/data')
        .then((res) => res.json())
        .then((data) => {
          commit('setData', data);
          dispatch('logAction', 'Data fetched');
        });
    },

    // 对象风格提交
    updateWithObject({ commit }, payload) {
      commit('increment', payload.amount);
    },
  },
});
```

在组件中使用 Action

通过 `this.$store.dispatch` 触发 Action

```javascript
export default {
  methods: {
    // 参数单独传递
    handleClick() {
      this.$store.dispatch('incrementAsync');
      this.$store.dispatch('incrementByAsync', 10); // 传递参数
    },

    // 对象风格提交（包含 type 属性）
    handleUpdateClick() {
      this.$store.dispatch({
        type: 'updateWithObject',
        amount: 20,
      });
    },
  },
};
```

vuex4.x 可以通过调用 useStore 函数，来在 setup 钩子函数中访问 store

```js
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    return {
      incrementAsync: () => store.dispatch('incrementAsync'),
    };
  },
};
```

### mapActions

将 Action 映射到组件的 methods 中，简化调用

```js
import { mapActions } from 'vuex';

export default {
  methods: {
    // 方式1：数组形式（同名映射）
    ...mapActions(['incrementAsync', 'incrementByAsync']),
    // 调用：this.incrementAsync() 或 this.incrementByAsync(10)

    // 方式2：对象形式（别名映射）
    ...mapActions({
      // 将 this.asyncAdd() 映射为 this.$store.dispatch('incrementAsync')
      asyncAdd: 'incrementAsync',
      // 将 this.asyncAddBy(n) 映射为 this.$store.dispatch('incrementByAsync', n)
      asyncAddBy: 'incrementByAsync',
    }),
  },
};
```

## Module

Module 是 Vuex 中组织大型应用状态树的核心机制，它的核心作用包括：

- 代码拆分：将复杂的状态逻辑按功能拆分为独立模块，避免单一 Store 文件臃肿。
- 命名空间隔离：解决不同模块间的 State/Mutation/Action 命名冲突问题。
- 复用性：可复用通用模块（如用户模块、商品模块）。
- 团队协作：不同开发者可独立维护不同模块。

### 基本语法

每个模块是一个包含 state、mutations、actions、getters 的独立对象

```js
// userModule.js
const userModule = {
  namespaced: true, // 🔴 开启命名空间（关键！）
  state: () => ({
    name: 'Guest',
    token: '',
  }),
  mutations: {
    SET_USER(state, payload) {
      state.name = payload.name;
      state.token = payload.token;
    },
  },
  actions: {
    login({ commit }, credentials) {
      return api.login(credentials).then((user) => {
        commit('SET_USER', user); // 调用本模块的 Mutation
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
};
```

模块可以嵌套其他子模块：

```javascript
const store = new Vuex.Store({
  modules: {
    auth: userModule,
    product: {
      namespaced: true,
      modules: {
        list: productListModule, // 嵌套模块
        detail: productDetailModule,
      },
    },
  },
});
```

在组件中使用 Module

关键规则：

- 未开启命名空间：所有模块的 Mutation/Action 会注册到全局，直接通过根 Store 调用（不推荐）。

- 开启命名空间（`namespaced: true`）：必须通过路径访问（如 `'moduleName/actionName'`）。

1. 访问 Module 的 State

```js
// 直接访问（❌ 不推荐）
export default {
computed: {
  userName() {
    return this.$store.state.user.name; // 路径对应模块名
  }
}
}


// 使用 mapState 辅助函数（✅ 推荐）
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('user', ['name', 'token']), // 第一个参数为模块路径
    ...mapState({
      productList: state => state.product.list.items // 嵌套模块访问
    })
  }
}

// 使用 mapMutations/mapActions 辅助函数
import { mapMutations, mapActions } from 'vuex';

export default {
  methods: {
    ...mapMutations('user', ['SET_USER']), // 映射为 this.SET_USER()
    ...mapActions('user', ['login']),

    // 对象别名模式
    ...mapActions('user', {
      userLogin: 'login' // 将 this.userLogin() 映射为 this.$store.dispatch('user/login')
    })
  }
}


```

2. 调用 Module 的 Mutation/Action

```js
// 直接调用（未开启命名空间 - ❌ 不推荐）
this.$store.commit('SET_USER', payload);

// 开启命名空间后必须带路径
this.$store.commit('user/SET_USER', payload);
```

3. 使用 Module 的 Getter

```javascript
// 直接访问
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters['user/isLoggedIn']; // 路径语法
    }
  }
}


// 使用 mapGetters 辅助函数
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    ...mapGetters('product/list', ['totalItems']) // 嵌套模块
  }
}

```

### 注册方式

1. 静态注册（常用）

```js
import userModule from './modules/user';

new Vuex.Store({
  modules: {
    user: userModule,
  },
});
```

2. require.context 动态注册，每次新增 modules 下的文件夹不用手动引入

```javascript
// store/index.js
const store = new Vuex.Store({});

// 动态注册模块
const modulesContext = require.context(
  './modules', // 模块目录路径
  true, // 递归查找子目录
  /\.js$/, // 匹配模块文件规则
);

modulesContext.keys().forEach((filePath) => {
  const moduleName = filePath
    .replace(/^\.\//, '') // 移除相对路径前缀
    .replace(/\.js$/, '') // 移除文件扩展名
    .replace(/\//g, '_'); // 转换嵌套路径为命名空间（如：user/profile → user_profile）

  const moduleContent = modulesContext(filePath).default;

  store.registerModule(moduleName, moduleContent);
});

export default store;

// 移除dynamicModule模块
store.unregisterModule('dynamicModule');
```

注入 Vue 实例中

```js
import store from './store';
import Vuex from 'vuex';

Vue.use(Vuex);

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
```

<BackTop></BackTop>