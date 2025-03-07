---
title: Pinia
---

# Pinia

## 官网

https://pinia.web3doc.top/

## 为什么用

1. ‌ 简化开发流程 ‌

- ‌ 无冗余代码 ‌：移除 Vuex 中繁琐的 mutations，直接通过 actions 同步或异步修改状态，代码更简洁 ‌。
- ‌ 类型安全 ‌：原生支持 TypeScript，提供自动补全和强类型推断，减少潜在错误 ‌。
- ‌ 扁平化结构 ‌：无需嵌套模块，通过组合式 API 灵活管理状态，支持循环依赖和跨 Store 复用逻辑 ‌。

2. ‌ 高效调试与维护 ‌

- ‌Devtools 集成 ‌：支持时间旅行调试、状态变更追踪，以及热更新（无需刷新页面即可修改 Store）‌。
- ‌ 响应式状态管理 ‌：状态变更自动触发视图更新，配合插件（如数据持久化插件）扩展性强 ‌。

3. ‌ 跨框架与场景兼容 ‌

- ‌ 支持 Vue 2 和 Vue 3‌：无需强制使用组合式 API，兼容旧项目升级 ‌。
- ‌ 服务端渲染（SSR）优化 ‌：避免直接使用 reactive 可能引发的 SSR 安全漏洞，提供更稳定的状态共享方案 。

4. ‌ 生态与性能优势 ‌

- ‌ 轻量且高效 ‌：体积更小，默认动态加载 Store，减少初始化开销 ‌。
- ‌ 社区与官方推荐 ‌：作为 Vuex 的官方迭代替代品，整合了 Vuex 的设计理念，未来兼容性更有保障 ‌35。

## Pinia 与 Vuex 对比分析

### ‌ 模块设计与架构 ‌

1. ‌ 模块化复杂度 ‌

- Vuex 包含 state、mutations、actions、getters、modules 五个核心模块，需严格遵循同步（mutations）和异步（actions）分离的规则 ‌。
- Pinia 仅保留 state、actions、getters，移除 mutations，允许直接在 actions 中处理同步或异步逻辑，简化流程 ‌。

2. ‌ 架构模式 ‌

- Vuex 采用全局单例 Store，状态集中管理，适合复杂项目但可能导致模块臃肿 ‌。
- Pinia 支持模块化分离，每个 Store 独立管理自身状态，通过组合式 API 灵活组织代码，降低耦合 ‌。

### ‌API 复杂度与开发体验 ‌

1. ‌ 代码简洁性 ‌

- Vuex 需手动声明 mutations 和 actions，代码冗余较多（如修改状态需 commit 触发 mutations）。
- Pinia 直接通过 actions 修改状态，支持解构 Store 变量，语法更贴近 Vue 3 组合式 API，开发效率更高 ‌。

2. TypeScript 支持 ‌

- Vuex 需额外配置才能实现类型推断，且类型支持较弱 ‌。
- Pinia 原生支持 TypeScript，自动推导状态类型，减少类型声明工作量 ‌。

### 性能与体积 ‌

1. ‌ 体积对比 ‌

- Vuex 体积较大（约 10KB），适合对稳定性要求高的场景 ‌。
- Pinia 体积更小（约 1KB），默认按需加载 Store，减少初始化资源消耗 ‌。

2. ‌ 数据处理效率 ‌

Pinia 使用 ES6 Proxy 优化响应式更新，性能略优于 Vuex 的 Object.defineProperty‌。

### 适用场景与版本兼容性 ‌

1. ‌ 项目规模 ‌

- Vuex 适合大型复杂项目，依赖其严格的流程规范保障可维护性 ‌。
- Pinia 更轻量灵活，适合中小型项目或追求开发效率的团队 ‌。

2. ‌ 框架兼容性 ‌

- Vuex 支持 Vue 2 和 Vue 3（需 Vuex 4.x），但官方已停止迭代。
- Pinia 专为 Vue 3 设计，无缝集成 Composition API，是 Vue 官方推荐替代方案。

## 安装

:::code-group

```bash [npm]
npm install pinia
```

```bash [yarn]
yarn add pinia
```

:::

## 创建

```js
// 创建一个 pinia（根存储）并将其传递给应用程序：

import { createApp } from 'vue';
import { createPinia } from 'pinia';
​
const pinia = createPinia();
const app = createApp(App);
app.use(pinia).mount('#app');

```

## Store

数据都放在 store 里面。当然你也可以把它理解为一个公共组件，只不过该公共组件只存放数据，这些数据我们其它所有的组件都能够访问且可以修改。

![](/images/vuex/image2.jpg)

它有三个概念，state、getters 和 actions，我们可以将它们等价于组件中的“数据”、“计算属性”和“方法”。

我们需要使用 pinia 提供的 defineStore()方法来创建一个 store，该 store 用来存放我们需要全局使用的数据。我们可以在项目中创建 store 目录存储我们定义的各种 store：

```js
// src/store/formInfo.js
import { defineStore } from 'pinia';
​
// 第一个参数是应用程序中 store 的唯一 id
const useFormInfoStore = defineStore('formInfo', {
  // 其他配置项，后面逐一说明
})
​
export default useFormInfoStore;

```

defineStore 接收两个参数：

- name：一个字符串，必传项，该 store 的唯一 id。
- options：一个对象，store 的配置项，比如配置 store 内的数据，修改数据的方法等等。

### 使用 store

我们可以在任意组件中引入定义的 store 来进行使用

```html
<script setup>
  // 引入定义
  import useFormInfoStore from '@/store/formInfo';
  // 调用方法，返回store实例
  const formInfoStore = useFormInfoStore();
</script>
```

store 被实例化后，你就可以直接在 store 上访问 state、getters 和 actions 中定义的任何属性。

### 解构 store

store 是一个用 reactive 包裹的对象，这意味着不需要在 getter 之后写.value，但是，就像 setup 中的 props 一样，我们不能对其进行解构，如果我们想要提取 store 中的属性同时保持其响应式的话，我们需要使用 pinia 提供的 storeToRefs()函数，它将为响应式属性创建 refs。

```html
<script setup>
  import { storeToRefs } from 'pinia';
  // 引入定义
  import useFormInfoStore from '@/store/formInfo';
  // 调用方法，返回store实例
  const formInfoStore = useFormInfoStore();
  ​
  const { name, age } = formInfoStore; // ❌ 此时解构出来的name和age不具有响应式
  ​
  const { name, age } = storeToRefs(formInfoStore); // ✅ 此时解构出来的name和age是响应式引用
</script>
```

## State

store 是用来存储全局状态数据的仓库，那自然而然需要有地方能够保存这些数据，它们就保存在 state 里面。defineStore 传入的第二个参数 options 配置项里面，就包括 state 属性。

### 定义 state

```js
// src/store/formInfo.js
import { defineStore } from 'pinia';
​
const useFormInfoStore = defineStore('formInfo', {
   // 推荐使用 完整类型推断的箭头函数
   state: () => {
      return {
        // 所有这些属性都将自动推断其类型
        name: 'Hello World',
        age: 18,
        isStudent: false
      }
   }
  
   // 还有一种定义state的方式
   // state: () => ({
   //    name: 'Hello World',
   //    age: 18,
   //    isStudent: false
   // })
})
​
export default useFormInfoStore;

```

### 访问 state

默认情况下，您可以通过 store 实例来直接读取和写入状态:

```html
<template>
  <div>{{ formInfoStore.name }}</div>
</template>

<script lang="ts" setup>
  import useFormInfoStore from '@/store/formInfo';
  const formInfoStore = useFormInfoStore();
  console.log(formInfoStore.name); // 'Hello World'
</script>
```

也可以结合 computed 获取。

```html
<template>
  <div>{{ name }}</div>
</template>

<script lang="ts" setup>
  import useFormInfoStore from '@/store/formInfo';
  const formInfoStore = useFormInfoStore();
  const name = computed(() => formInfoStore.name);
</script>
```

state 也可以使用解构，但使用解构会使其失去响应式，这时候可以用 pinia 的 storeToRefs。

```html
<template>
  <div>{{ name }}</div>
</template>

<script lang="ts" setup>
  import useFormInfoStore from '@/store/formInfo';
  import { storeToRefs } from 'pinia';

  const formInfoStore = useFormInfoStore();
  const { name } = storeToRefs(formInfoStore);
</script>
```

### 操作 state

pinia 还提供了几个常见场景的方法供我们使用来操作 state：$reset、$patch、$state、$subscribe：

```html
<script setup>
  import useFormInfoStore from '@/store/formInfo';
  const formInfoStore = useFormInfoStore();
  ​
  console.log(formInfoStore.name); // 'Hello World'
  // 直接修改state中的属性
  formInfoStore.age++;  // 19 一般不建议这么做
  ​
  // 1.$reset 重置状态，将状态重置成为初始值
  formInfoStore.$reset();
  console.log(formInfoStore.age); // 18
    
  // 2.$patch 支持对state对象的部分批量修改
  formInfoStore.$patch({
      name: 'hello Vue',
      age: 198
  });
    
  // 3.$state 通过将其 $state 属性设置为新对象来替换 Store 的整个状态
  formInfoStore.$state = {
    name: 'hello Vue3',
    age: 100,
    gender: '男'
  }
  ​
  // 4.$subscribe 订阅store中的状态变化
  formInfoStore.$subscribe((mutation, state) => {
    // 监听回调处理
  }, {
    detached: true  // 💡如果在组件的setup中进行订阅，当组件被卸载时，订阅会被删除，通过detached:true可以让订阅保留
  })
</script>
```

还可以通过 actions 去修改 state，action 里可以直接通过 this 访问

```js
export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: '张三'
    }
  },
  actions: {
    updateName(name) {
      this.name = name
    }
  }
})

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
userStore.updateName('李四')
</script>

```

## Getters

pinia 中的 getters 可以完全等同于 Store 状态的计算属性，通常在 defineStore 中的 getters 属性中定义。同时支持组合多个 getter，此时通过 this 访问其他 getter。

```js
import { defineStore } from 'pinia';
​
const useFormInfoStore = defineStore('formInfo', {
    state: () => {
        return {
            name: 'Hello World',
            age: 18,
            isStudent: false,
            gender: '男'
        };
    },
    getters: {
        // 仅依赖state，通过箭头函数方式
        isMan: (state) => {
            return state.gender === '男';
        },
        isWoman() {
            // 通过this访问其他getter，此时不可以用箭头函数
            return !this.isMan;
        }
    }
});
​
export default useFormInfoStore;
```

在使用时，我们可以直接在 store 实例上面访问 getter:

```html
<template>
  <div>The person is Man: {{ formInfoStore.isMan }} or is Woman: {{ formInfoStore.isWoman }}</div>
</tempalte>
​
<script setup>
import useFormInfoStore from '@/store/formInfo';
const formInfoStore = useFormInfoStore();
</script>
```

通常 getter 是不支持额外传参的，但是我们可以从 getter 返回一个函数的方式来接收参数

```js
import { defineStore } from 'pinia';
​
const useFormInfoStore = defineStore('formInfo', {
    state: () => {
        return {
            name: 'Hello World',
            age: 18,
            isStudent: false,
            gender: '男'
        };
    },
    getters: {
        isLargeBySpecialAge: (state) => {
          return (age) => {
             return state.age > age
          }
        }
    }
});
​
export default useFormInfoStore;
```

在组件中使用时即可传入对应参数，注意，在这种方式时，getter 不再具有缓存性

```html
<template>
  <div>The person is larger than 18 years old? {{ formInfoStore.isLargeBySpecialAge(18) }}</div>
</tempalte>
​
<script setup>
import useFormInfoStore from '@/store/formInfo';
const formInfoStore = useFormInfoStore();
</script>
```

## Actions

actions 相当于组件中的 methods，它们定义在 defineStore 中的 actions 属性内，常用于定义业务逻辑使用。action 可以是异步的，可以在其中 await 任何 API 调用甚至其他操作

```js
import { defineStore } from 'pinia';
​
const useFormInfoStore = defineStore('formInfo', {
    state: () => {
        return {
            name: 'Hello World',
            age: 18,
            isStudent: false,
            gender: '男'
        };
    },
    getters: {
        isMan: (state) => {
            return state.gender === '男';
        },
        isWoman() {
            return !this.isMan;
        }
    },
    actions: {
        incrementAge() {
            this.age++;
        },
        async registerUser() {
            try {
                const res = await api.post({
                    name: this.name,
                    age: this.age,
                    isStudent: this.isStudent,
                    gender: this.gender
                });
                showTips('用户注册成功～');
            } catch (e) {
                showError('用户注册失败！');
            }
        }
    }
});
​
export default useFormInfoStore;
```

使用起来也非常方便

### $onAction()

可以使用 store.$onAction() 订阅 action 及其结果。传递给它的回调在 action 之前执行。 after 处理 Promise 并允许您在 action 完成后执行函数，onError 允许您在处理中抛出错误。

```js
const unsubscribe = formInfoStore.$onAction(
  ({
    name, // action 的名字
    store, // store 实例
    args, // 调用这个 action 的参数
    after, // 在这个 action 执行完毕之后，执行这个函数
    onError, // 在这个 action 抛出异常的时候，执行这个函数
  }) => {
    // 记录开始的时间变量
    const startTime = Date.now()
    // 这将在 `store` 上的操作执行之前触发
    console.log(`Start "${name}" with params [${args.join(', ')}].`)
​
    // 如果 action 成功并且完全运行后，after 将触发。
    // 它将等待任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })
​
    // 如果 action 抛出或返回 Promise.reject ，onError 将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)
​
// 手动移除订阅
unsubscribe()
```

和$subscribe 类似，在组件中使用时，组件卸载，订阅也会被删除，如果希望保留的话，需要传入 true 作为第二个参数。

```html
<script setup>
  import useFormInfoStore from '@/store/formInfo';
  const formInfoStore = useFormInfoStore(); ​
  formInfoStore.$onAction(callback, true);
</script>
```

### action 间相互调用

action 间的相互调用，直接用 this 访问即可。

```javascript
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd);
      this.setData(data); // 调用另一个 action 的方法
      return data;
    },
    setData(data) {
      console.log(data);
    },
  },
});
```

在 action 里调用其他 store 里的 action 也比较简单，引入对应的 store 后即可访问其内部的方法了。

```javascript
import { useAppStore } from './app';
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd);
      const appStore = useAppStore();
      appStore.setData(data); // 调用 app store 里的 action 方法
      return data;
    },
  },
});
```

```javascript
// src/store/app.ts
export const useAppStore = defineStore({
  id: 'app',
  actions: {
    setData(data) {
      console.log(data);
    },
  },
});
```

## 数据持久化

插件 pinia-plugin-persist 可以辅助实现数据持久化功能。

### 安装

```js
npm i pinia-plugin-persist --save
```

### 使用

```js
// src/store/index.ts

import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

const store = createPinia();
store.use(piniaPluginPersist);

export default store;
```

接着在对应的 store 里开启 persist 即可。

```javascript
export const useUserStore = defineStore({
  id: 'user',

  state: () => {
    return {
      name: '张三',
    };
  },

  // 开启数据缓存
  persist: {
    enabled: true,
  },
});
```

数据默认存在 sessionStorage 里，并且会以 store 的 id 作为 key。

### 自定义 key

你也可以在 strategies 里自定义 key 值，并将存放位置由 sessionStorage 改为 localStorage。

```javascript
persist: {
  enabled: true,
  strategies: [
    {
      key: 'my_user',
      storage: localStorage,
    }
  ]
}
```

### 持久化部分 state

默认所有 state 都会进行缓存，你可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。

```javascript
state: () => {
  return {
    name: '张三',
    age: 18,
    gender: '男'
  }
},

persist: {
  enabled: true,
  strategies: [
    {
      storage: localStorage,
      paths: ['name', 'age']
    }
  ]
}
```

上面我们只持久化 name 和 age，并将其改为 localStorage, 而 gender 不会被持久化，如果其状态发生更改，页面刷新时将会丢失，重新回到初始状态，而 name 和 age 则不会。
