---
toc: content
title: 组件/mixin/plugin
order: -97
---

# Vue2

## 组件

### 非单文件组件

非单文件组件是指不通过 `.vue` 单文件格式定义的组件，而是直接在 JavaScript 代码中通过 `Vue.component()` 或组件选项对象创建的组件。简单意思为一个文件里包含 n 个组件的形式

特点：

- 将模板、逻辑和样式分散在 HTML 和 JS 中，而非集中在一个文件中。
- 适用于小型项目、快速原型开发或旧版项目维护。

Vue 中使用组件的三大步骤

#### 定义组件

1. 使用 Vue.extend(options)创建，其中 options 和 new Vue(options)时传入的 options 几乎一样，但也有点区别

- el 不要写，因为最终所有的组件都要经过一个 vm 的管理，由 vm 中的 el 才决定服务哪个容器
- data 必须写成函数，避免组件被复用时，数据存在引用关系

#### 注册组件

1. 局部注册：new Vue()的时候 options 传入 components 选项

2. 全局注册：Vue.component('组件名',组件)

#### 使用组件

编写组件标签

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>基本使用</title>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"
    ></script>
  </head>

  <body>
    <div id="root">
      <hello></hello>
      <school></school>
      <student></student>
    </div>

    <div id="root2">
      <hello></hello>
    </div>
  </body>

  <script type="text/javascript">
    //第一步：创建school组件
    const school = Vue.extend({
      template: `
    				<div class="demo">
    					<h2>学校名称：{{schoolName}}</h2>
    					<h2>学校地址：{{address}}</h2>
    					<button @click="showName">点我提示学校名</button>
    				</div>
    			`,
      data() {
        return {
          schoolName: '尚硅谷',
          address: '北京昌平',
        };
      },
      methods: {
        showName() {
          alert(this.schoolName);
        },
      },
    });

    //第一步：创建student组件
    const student = Vue.extend({
      template: `
    				<div>
    					<h2>学生姓名：{{studentName}}</h2>
    					<h2>学生年龄：{{age}}</h2>
    				</div>
    			`,
      data() {
        return {
          studentName: '张三',
          age: 18,
        };
      },
    });

    //第一步：创建hello组件
    const hello = Vue.extend({
      template: `
    				<div>
    					<h2>你好啊！{{name}}</h2>
    				</div>
    			`,
      data() {
        return {
          name: 'Tom',
        };
      },
    });

    //第二步：全局注册组件
    Vue.component('hello', hello);

    //创建vm
    new Vue({
      el: '#root',
      //第二步：注册组件（局部注册）
      components: {
        school,
        student,
      },
    });

    new Vue({
      el: '#root2',
    });
  </script>
</html>
```

一个简写方式：`const school = Vue.extend(options)`可简写为`const school = options`，因为父组件 components 引入的时候会自动创建

```html
<div id="root">
  <school></school>
</div>

<script type="text/javascript">
  //定义组件
  const school = {
    name: 'atguigu', // 组件给自己起个名字，用于在浏览器开发工具上显示
    template: `
				<div>
					<h3>学校名称：{{name}}</h3>	
					<h3>学校地址：{{address}}</h3>	
				</div>
			`,
    data() {
      return {
        name: '电子科技大学',
        address: '成都',
      };
    },
  };

  new Vue({
    el: '#root',
    components: {
      school,
    },
  });
</script>
```

#### 组件的嵌套

```html
<div id="root"></div>

<script type="text/javascript">
  Vue.config.productionTip = false;

  //定义student组件
  const student = Vue.extend({
    name: 'student',
    template: `
				<div>
					<h4>学生姓名：{{name}}</h4>	
					<h4>学生年龄：{{age}}</h4>	
  			</div>
			`,
    data() {
      return { name: '尚硅谷', age: 18 };
    },
  });

  //定义school组件
  const school = Vue.extend({
    name: 'school',
    template: `
				<div>
					<h3>学校名称：{{name}}</h3>	
					<h3>学校地址：{{address}}</h3>	
					<student></student>
 			  </div>
			`,
    data() {
      return { name: '尚硅谷', address: '北京' };
    },
    //注册组件（局部）
    components: { student },
  });

  //定义hello组件
  const hello = Vue.extend({
    template: `<h3>{{msg}}</h3>`,
    data() {
      return { msg: '学习！' };
    },
  });

  //定义app组件
  const app = Vue.extend({
    template: `
				<div>	
					<hello></hello>
					<school></school>
  			</div>
			`,
    components: { school, hello },
  });

  //创建vm
  new Vue({
    el: '#root',
    template: '<app></app>',
    //注册组件（局部）
    components: { app },
  });
</script>
```

#### VueComponent

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>VueComponent</title>
    <script
      type="text/javascript"
      src="https://cdn.jsdelivr.net/npm/vue@2.7.16/dist/vue.js"
    ></script>
  </head>

  <body>
    <div id="root">
      <school></school>
      <hello></hello>
    </div>
  </body>

  <script type="text/javascript">
    //定义school组件
    const school = Vue.extend({
      name: 'school',
      template: `
				<div>
					<h2>学校名称：{{name}}</h2>	
					<h2>学校地址：{{address}}</h2>	
					<button @click="showName">点我提示学校名</button>
				</div>
			`,
      data() {
        return {
          name: '尚硅谷',
          address: '北京',
        };
      },
      methods: {
        showName() {
          console.log('showName', this);
        },
      },
    });

    const test = Vue.extend({
      template: `<span>atguigu</span>`,
    });

    //定义hello组件
    const hello = Vue.extend({
      template: `
				<div>
					<h2>{{msg}}</h2>
					<test></test>	
				</div>
			`,
      data() {
        return {
          msg: '你好啊！',
        };
      },
      components: { test },
    });

    // console.log('@',school) => 控制台显示function VueComponent{} 构造函数
    // console.log('#',hello) => 同理

    //创建vm
    const vm = new Vue({
      el: '#root',
      components: { school, hello },
    });
  </script>
</html>
```

关于 VueComponent：

1. school 组件本质是一个名为 VueComponent 的构造函数，且不是程序员定义的，是 Vue.extend 生成的。
2. 我们只需要写`<school/>`或`<school></school>`，Vue 解析时会帮我们创建 school 组件的实例对象，
   即 Vue 帮我们执行的：`new VueComponent(options)`。
3. 特别注意：每次调用 Vue.extend，返回的都是一个全新的 VueComponent！！！！
4. 关于 this 指向：

   - 组件配置中：
     data 函数、methods 中的函数、watch 中的函数、computed 中的函数 它们的 this 均是【VueComponent 实例对象】。
   - new Vue(options)配置中：
     data 函数、methods 中的函数、watch 中的函数、computed 中的函数 它们的 this 均是【Vue 实例对象】。

5. VueComponent 的实例对象，以后简称 vc（也可称之为：组件实例对象）。

   Vue 的实例对象，以后简称 vm。

- 一个重要的内置关系：`VueComponent.prototype.__proto__ === Vue.prototype`
- 为什么要有这个关系：让组件实例对象（vc）可以访问到 Vue 原型上的属性、方法。

![](/images/vue2/image3.jpg)

### 单文件组件

Vue 的单文件组件 (即 `.vue` 文件) 是一种特殊的文件格式，使我们能够将一个 Vue 组件的模板、逻辑与样式封装在单个文件中

```vue
<!-- School.vue -->
<template>
  <div id="Demo">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
    <button @click="showName">点我提示学校名</button>
  </div>
</template>

<script>
export default {
  name: 'School',
  data() {
    return {
      name: 'UESTC',
      address: '成都',
    };
  },
  methods: {
    showName() {
      alert(this.name);
    },
  },
};
</script>

<style>
#Demo {
  background: orange;
}
</style>
```

```vue
<!--Student.vue-->

<template>
  <div>
    <h2>学生姓名：{{ name }}</h2>
    <h2>学生年龄：{{ age }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Student',
  data() {
    return {
      name: 'cess',
      age: 20,
    };
  },
};
</script>
```

```html
<!--App.vue-->

<template>
  <div>
    <School></School>
    <Student></Student>
  </div>
</template>

<script>
  import School from './School.vue';
  import Student from './Student.vue';

  export default {
    name: 'App',
    components: {
      School,
      Student,
    },
  };
</script>
```

```js
// main.js
import App from './App.vue';

new Vue({
  template: `<App></App>`,
  el: '#root',
  components: { App },
});
```

## mixin

Mixin 是一种分发 Vue 组件可复用功能的灵活方式。它允许将组件的选项（如 data、methods、生命周期钩子等）合并到多个组件中，从而减少代码冗余。

通过合理使用 Mixin，可以在 Vue2 中高效复用代码，但需警惕其潜在的维护性问题。在 Vue3 中，推荐使用 Composition API 作为更现代的替代方案。

### 定义 Mixin

1. 创建一个 Mixin 对象，结构与 Vue 组件选项一致：

```javascript
// mixins/loggerMixin.js
export const loggerMixin = {
  data() {
    return {
      logMessages: [],
    };
  },
  methods: {
    log(message) {
      this.logMessages.push(message);
      console.log(message);
    },
  },
  created() {
    this.log('Mixin 的 created 钩子触发');
  },
};
```

2. 使用 Mixin

在组件中通过 mixins 选项引入：

```javascript
import { loggerMixin } from '@/mixins/loggerMixin';

export default {
  mixins: [loggerMixin], // 引入 Mixin
  created() {
    this.log('组件的 created 钩子触发');
  },
};
```

### Mixin 的合并规则

1. Data 合并

规则：组件和 Mixin 的 data 同名属性会递归合并，组件优先级更高。

```javascript
// Mixin
data() {
  return { message: 'Mixin 的 Message' };
}

// 组件
data() {
  return { message: '组件的 Message' };
}
// 结果：message = '组件的 Message'
```

2.  Methods / Computed 合并

规则：同名方法或计算属性，组件覆盖 Mixin。

```javascript
// Mixin
methods: {
  greet() { console.log('Mixin 的 greet'); }
}

// 组件
methods: {
  greet() { console.log('组件的 greet'); }
}
// 结果：调用 greet() 输出 "组件的 greet"
```

3. 生命周期钩子合并

规则：同名钩子函数合并为数组，Mixin 钩子先执行。

```javascript
// Mixin
created() { console.log('Mixin created'); }

// 组件
created() { console.log('组件 created'); }
// 输出顺序：Mixin created → 组件 created

```

### 注意事项

1. 命名冲突

问题：Mixin 与组件或其它 Mixin 存在同名属性/方法时，可能导致意外覆盖。

解决：

- 使用明确的命名（如 mixinName_property）。
- 在文档中记录 Mixin 的属性和方法。

2. 全局 Mixin 慎用

问题：全局 Mixin（`Vue.mixin({...})`）会影响所有组件实例，可能导致性能问题或意外行为。

解决：仅在必要时使用，并确保逻辑通用且轻量。

3. 替代方案

组合式 API：Vue3 的 setup 函数和 Composition API 更灵活地管理逻辑复用。

高阶组件（HOC）：通过包裹组件实现逻辑复用（适用于 React 风格项目）。

## plugin 插件

插件用于 扩展 Vue 的全局功能

### 编写步骤

1. 插件必须暴露一个 install 方法，接收 Vue 构造函数和可选的 options 参数。

```js
// plugins/my-plugin.js
const MyPlugin = {
  install(Vue, options = {}) {
    // 1. 添加全局方法/属性
    Vue.myGlobalMethod = () => {
      console.log('全局方法被调用');
    };

    // 2. 添加全局指令
    Vue.directive('focus', {
      inserted: (el) => el.focus(),
    });

    // 3. 添加实例方法
    Vue.prototype.$showToast = (message) => {
      alert(message || options.defaultMessage || '默认提示');
    };

    // 4. 全局混入
    Vue.mixin({
      created() {
        console.log('插件注入的 created 钩子');
      },
    });
  },
};

export default MyPlugin;
```

2. 安装插件

通过 Vue.use() 安装插件，可传入配置选项。

```javascript
// main.js
import Vue from 'vue';
import MyPlugin from './plugins/my-plugin';

// 安装插件并传入配置
Vue.use(MyPlugin, {
  defaultMessage: '配置的默认提示',
});
```

### 使用场景

1. 全局 Toast 通知插件
   场景：在所有组件中通过 this.$toast 显示提示消息。

```javascript
// plugins/toast.js
const ToastPlugin = {
  install(Vue, options) {
    const toast = (message, type = 'info') => {
      // 实现 Toast 的 DOM 操作（示例简化）
      const div = document.createElement('div');
      div.className = `toast toast-${type}`;
      div.textContent = message;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2000);
    };

    // 添加实例方法
    Vue.prototype.$toast = toast;

    // 添加全局方法
    Vue.toast = toast;
  },
};
```

使用插件：

```javascript
// main.js
Vue.use(ToastPlugin);

// 组件中使用
export default {
  methods: {
    showSuccess() {
      this.$toast('操作成功！', 'success');
    },
  },
};
```

## 三者对比

| 特性     | 插件（Plugin）                   | Mixin                            | 组件             |
| -------- | -------------------------------- | -------------------------------- | ---------------- |
| 作用范围 | 全局                             | 组件内复用                       | 局部复用         |
| 适用场景 | 添加全局功能（指令、方法、混入） | 复用组件选项（data、methods 等） | 封装 UI 和逻辑   |
| 复杂度   | 高（需处理全局命名空间）         | 中（需处理命名冲突）             | 低               |
| 典型应用 | Vue Router、Vuex、第三方库集成   | 表单验证、日志记录               | 按钮、表格、弹窗 |
