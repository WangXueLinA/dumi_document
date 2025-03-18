---
toc: content
title: 指令
order: -99
---

# Vue2

## 指令

指令是带有 v- 前缀的特殊 attribute。指令 attribute 的值预期是单个 JavaScript 表达式 。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

## v-bind

单向绑定：适合于展示数据和一些不需要用户交互修改的数据状态，数据只能从 data 流向页面

v-bind 在布尔型这种场景下的行为略有不同：

```html
<button :disabled="isDisabled">Button</button>
```

当 isDisabled 为真值或一个空字符串 (即 `<button disabled="">`) 时，元素会包含这个 disabled attribute。而当其为其他假值时 attribute 将被忽略。

| isDisabled 值  |    页面渲染结果     |
| :------------: | :-----------------: |
|      true      | `<button disabled>` |
|     false      |     `<button>`      |
| ""（空字符串） | `<button disabled>` |
| null/undefined |     `<button>`      |

### 动态绑定 HTML 属性

```html
<input type="text" v-bind:value="name" />
<!--  v-bind:value 可以简写为 :value  -->
<input type="text" :value="name" />
```

### class 样式绑定

1. 对象语法

动态切换多个 class，键为 class 名，值为布尔值控制是否生效。

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<script>
  new Vue({
    data: {
      isActive: true, // true生效
      hasError: false, // false不生效
    },
  });

  // 结果：<div class="active"></div>
</script>
```

2. 数组语法

组合多个静态/动态 class，支持混合字符串、对象、计算属性。

```html
<div :class="[baseClass, { highlight: isHighlight }, dynamicClass]"></div>

<script>
  new Vue({
    data: {
      baseClass: 'base-style', // 静态 class
      isHighlight: true, // 动态对象
      dynamicClass: 'text-center', // 动态字符串
    },
  });

  // 结果:  <div class="base-style highlight text-center"></div>
</script>
```

3. 计算属性

处理复杂 class 逻辑，返回对象或数组。

```html
<div :class="classObject"></div>

<script>
  new Vue({
    data: {
      isActive: true,
      errorType: 'critical',
    },
    computed: {
      classObject() {
        return {
          active: this.isActive,
          [`text-${this.errorType}`]: true, // 动态 class 名
        };
      },
    },
  });

  // 结果: <div class="active text-critical"></div>
</script>
```

4. 组件穿透

父组件传递 class，子组件通过 `$attrs.class` 接收。

```vue
<!-- 父组件 -->
<ChildComponent :class="custom-class" />

<!-- 子组件模板 -->
<div :class="['child-base', $attrs.class]"></div>
```

结果： `<div class="child-base custom-class"></div>`

```html
<!-- ❌ 错误：直接拼接动态 class 名 -->
<div :class="'text-' + errorType"></div>

<!-- ✅ 正确：使用对象语法或计算属性 -->
<div :class="['text-' + errorType]"></div>
```

### style 样式绑定

1. 对象语法

动态设置行内样式，键为 CSS 属性（驼峰或短横线），值为样式值。

```html
<div :style="{ color: textColor, 'font-size': fontSize + 'px' }"></div>

<script>
  new Vue({
    data: {
      textColor: '#ff0000', // 红色
      fontSize: 16, // 字体大小 16px
    },
  });

  // 结果: <div style="color: rgb(255, 0, 0); font-size: 16px;"></div>
</script>
```

2. 数组语法

合并多个样式对象，实现样式复用。

```html
<div :style="[baseStyles, dynamicStyles]"></div>

<script>
  new Vue({
    data: {
      baseStyles: { padding: '10px', border: '1px solid #ccc' },
      dynamicStyles: { backgroundColor: isDark ? '#333' : '#fff' },
    },
  });
  // 结果: <div style="padding: 10px; border: 1px solid rgb(204, 204, 204); background-color: rgb(51, 51, 51);"></div>
</script>
```

3. 自动前缀

Vue 自动为需要浏览器前缀的 CSS 属性添加前缀。

```html
<div :style="{ transform: 'rotate(' + angle + 'deg)' }"></div>

<script>
  new Vue({
    data: {
      angle: 45,
    },
  });

  // 结果： <div style="transform: rotate(45deg); -webkit-transform: rotate(45deg);"></div>
</script>
```

4. 组件穿透

父组件传递 style，子组件通过 `$attrs.style` 接收。

```vue
<!-- 父组件 -->
<ChildComponent :style="{ color: 'red' }" />

<!-- 子组件模板 -->
<div :style="[{ padding: '10px' }, $attrs.style]"></div>
```

结果：`<div style="padding: 10px; color: red;"></div>`

```html
<!-- ❌ 错误：未添加单位 -->
<div :style="{ width: widthVal }"></div>

<!-- ✅ 正确：显式添加单位 -->
<div :style="{ width: widthVal + 'px' }"></div>
```

5. scoped 样式

scoped 是 Vue.js 单文件组件中 `<style>` 标签的一个属性，用于 ‌ 限制样式仅作用于当前组件 ‌，避免全局样式污染。

<Alert message="Vue 3 已废弃 scoped，推荐使用 CSS Modules 或 CSS-in-JS 方案替代，但 Vue 2 中仍广泛使用。"></Alert>

```vue
<template>
  <div class="demo-container">
    <p class="text">局部样式文字</p>
  </div>
</template>

<style scoped>
/* 样式仅对当前组件生效 */
.demo-container {
  padding: 20px;
}
.text {
  color: red;
}

/* 深度穿透写法（修改子组件样式） */
/deep/ .child-class {
  font-size: 16px;
}
/* 或 */
::v-deep .child-class {
  font-size: 16px;
}
</style>
```

### 总结

| 场景                | 写法示例                                     | 说明                   |
| ------------------- | -------------------------------------------- | ---------------------- |
| 绑定 HTML 属性      | `:href="url"`                                | 动态链接、资源路径等   |
| 动态 CSS 类         | `:class="{ active: isActive }"`              | 条件切换样式类         |
| 动态内联样式        | `:style="{ color: textColor }"`              | 实时更新元素样式       |
| 传递 Props 到子组件 | `<Child :title="pageTitle" />`               | 父子组件数据传递       |
| 动态属性名          | `:["data-" + type]="value"`                  | 根据数据动态决定属性名 |
| 批量绑定对象属性    | `v-bind="{ id: 'box', class: 'container' }"` | 简化多属性绑定         |

## v-model

表单元素双向绑定

1. 文本输入框（input）

```html
<input type="text" v-model="message" placeholder="输入内容" />
```

2. 多行文本框（textarea）

```html
<textarea v-model="description"></textarea>
```

3. 复选框（checkbox）

单个复选框（绑定布尔值）

```html
<input type="checkbox" v-model="isAgree" /> 同意协议
```

多个复选框（绑定数组）

```html
<input type="checkbox" value="A" v-model="selectedItems" />
<input type="checkbox" value="B" v-model="selectedItems" />

<!-- selectedItems: ['A', 'B'] -->
```

4. 单选按钮（radio）

```html
<input type="radio" value="男" v-model="gender" /> 男
<input type="radio" value="女" v-model="gender" /> 女

<!-- gender: '男'/'女' -->
```

5. 下拉框（select）

单选（单值）：

```html
<select v-model="selectedCity">
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>
```

多选（绑定数组）：

```html
<select v-model="selectedCities" multiple>
  <option value="beijing">北京</option>
  <option value="shanghai">上海</option>
</select>

<!-- selectedCities: ["beijing", "shanghai"] -->
```

### 修饰符

通过修饰符对输入值进行处理。

1. .lazy

将 input 事件转为 change 事件（失焦或回车时收集数据）：

```html
<input v-model.lazy="message" />
```

2. .number

自动将输入值转为数值类型：

```html
<input type="number" v-model.number="age" />
```

3. .trim

自动去除输入值首尾空格：

```html
<input v-model.trim="username" />
```

### 多个 model 绑定

在 Vue 2.3+ 中，可通过 `.sync` 修饰符实现多个双向绑定，

```vue
<!-- 父组件 -->
<ChildComponent :value1.sync="data1" :value2.sync="data2" />

<!-- 子组件 -->
<script>
export default {
  props: ['value1', 'value2'],
  methods: {
    updateData1(newVal) {
      this.$emit('update:value1', newVal);
    },
    updateData2(newVal) {
      this.$emit('update:value2', newVal);
    },
  },
};
</script>
```

### 原理

v-model 本质上是语法糖，v-model 默认会解析成名为 value 的 prop 和名为 input 的事件。这种语法糖的方式是典型的双向绑定

## v-if

作用：根据条件销毁或创建元素，适合切换频率低的场景。

特点：

- 惰性渲染（初始条件为 false 时元素不会渲染）
- 切换时触发组件生命周期钩子（created/destroyed）

```html
<div v-if="isVisible">v-if 控制的内容</div>

<script>
  new Vue({
    data: {
      isVisible: true,
    },
  });
</script>
```

### v-else 与 v-else-if

作用：实现多分支条件逻辑，必须紧跟在 v-if 或 v-else-if 后。

<Alert message='中间不能插入其他元素。'></Alert>

```html
<div v-if="type === 'A'">类型 A</div>
<div v-else-if="type === 'B'">类型 B</div>
<div v-else>其他类型</div>

<script>
  new Vue({
    data: {
      type: 'A',
    },
  });
</script>
```

### 注意事项

避免 v-if 和 v-for 共用

问题：v-for 优先级高于 v-if，导致循环中的每个元素都会执行条件判断。

解决方案：改用计算属性过滤数据。

```html
<!-- ❌ 错误写法 -->
<ul>
  <li v-for="item in list" v-if="item.isActive">{{ item.name }}</li>
</ul>

<!-- ✅ 正确写法 -->
<ul>
  <li v-for="item in activeList">{{ item.name }}</li>
</ul>

<script>
  new Vue({
    data: {
      list: [
        { name: 1, isActive: true },
        { name: 2, isActive: false },
      ],
    },
    computed: {
      activeList() {
        return this.list.filter((item) => item.isActive);
      },
    },
  });
</script>
```

v-if 导致子组件生命周期重复触发

场景：父组件条件渲染子组件时，频繁切换会导致子组件反复挂载/销毁。

优化方案：使用 `<keep-alive>` 缓存组件状态。

```html
<keep-alive>
  <child-component v-if="showChild"></child-component>
</keep-alive>
```

## v-show

写法：v-show="表达式"

适用于：切换频率较高的场景。

特点：

- 不展示的 DOM 元素未被移除，仅仅是使用样式隐藏掉
- 使用 v-if 的时，元素可能无法获取到，而使用 v-show 一定可以获取到。

```html
<div v-show="isVisible">v-show 控制的内容</div>
```

### 注意事项

v-show 不支持 `<template>`元素

限制：v-show 不能用于 `<template>` 标签，因为其需要操作具体元素的 display 属性。

替代方案：改用 v-if 或包裹在 `<div>` 中。

```html
<!-- ❌ 错误写法 -->
<template v-show="isVisible">内容</template>

<!-- ✅ 正确写法 -->
<div v-show="isVisible">内容</div>
```

v-show 无法隐藏初始渲染的闪烁

场景：v-show 初始为 false 时，元素会短暂显示后隐藏。

解决方案：结合 v-cloak 防止未编译模板闪现。

```html
<style>
  [v-cloak] {
    display: none;
  }
</style>

<div v-show="isVisible" v-cloak>内容</div>
```

### v-if 对比 v-show

| 特性         | v-if                         | v-show                   |
| ------------ | ---------------------------- | ------------------------ |
| 渲染机制     | 条件为真时渲染元素           | 始终渲染，仅切换 display |
| 切换开销     | 高（销毁/重建 DOM）          | 低（仅修改 CSS）         |
| 初始渲染开销 | 低（条件为假时不渲染）       | 高（无论条件都渲染）     |
| 适用场景     | 条件不频繁切换（如权限控制） | 频繁切换（如选项卡）     |

## v-on

通过 Vue 提供的事件绑定指令和方法，你可以轻松地监听 DOM 事件，并执行相应的 JavaScript 代码来响应这些事件。

1. 使用 v-on:xxx 或 @xxx 绑定事件，其中 xxx 是事件名

2. 事件的回调需要配置在 methods 对象中，最终会在 vm 上

3. methods 中配置的函数，都是被 Vue 所管理的函数，this 的指向是 vm 或 组件实例对象

4. `@click='demo'`和`@click='demo($event)'`效果一样，但后者可以传参数

5. `$event`是一个特殊的变量，主要用于内联事件处理器中传递原生的 DOM 事件对象。它允许你在调用方法时访问到这个事件对象，从而能够执行一些与事件相关的操作，比如阻止默认行为、停止事件冒泡或获取事件的详细信息等。

```html
<div id="root">
  <button @click="showInfo1">点我提示信息1（不传参）</button>

  <!-- 主动传事件本身 -->
  <button @click="showInfo2(66, $event)">点我提示信息2（传参）</button>
</div>

<script>
  const vm = new Vue({
    el: '#root',
    methods: {
      // 如果vue模板没有写event，会自动传 event 给函数
      showInfo1(event) {
        // console.log(this) //此处的this是vm
        console.log(event.target.innerText);
      },

      showInfo2(number, event) {
        event.preventDefault(); // 如果这是一个链接或表单提交，这将阻止其默认行为
        console.log(number, event.target.innerText);
      },
    },
  });
</script>
```

### 修饰符

- prevent（常用）：阻止默认事件
- stop（常用）：阻止事件冒泡
- once（常用）：事件只触发一次
- capture（不常用）：使用事件的捕获模式；
- self（不常用）：只有 event.target 是当前操作的元素时才触发事件；
- passive（不常用）： addEventListener 中的 passive 选项提供了 .passive 修饰符，事件的默认行为立即执行，无需等待事件回调执行完毕；

修饰符可以串联，<span style='color:red'>顺序很重要</span>；相应的代码会以同样的顺序产生

```html
<div id="root">
  <!-- 阻止默认事件（常用） -->
  <a href="http://www.baidu.com" @click.prevent="showInfo">点我提示信息</a>

  <!-- 阻止事件冒泡（常用） -->
  <button @click.stop="showInfo">点我提示信息</button>

  <!-- 修饰符可以连续写 -->
  <a href="http://www.atguigu.com" @click.prevent.stop="showInfo"
    >点我提示信息</a
  >

  <!-- 事件只触发一次（常用） -->
  <button @click.once="showInfo">点我提示信息</button>
</div>
```

### 动态事件名

根据条件动态绑定不同的事件名

```html
<ChildComponent @[dynamicEventName]="handleDynamicEvent" />

<script>
  export default {
    data() {
      return { dynamicEventName: 'custom-event' };
    },
    methods: {
      handleDynamicEvent(data) {
        console.log('动态事件:', data);
      },
    },
  };
</script>
```

### 绑定多个事件

场景：需要同时监听多个事件或动态绑定多个事件。

```html
<ChildComponent v-on="{ 'event1': handler1, 'event2': handler2 }" />

<script>
  export default {
    methods: {
      handler1(data) {
        /* 处理事件1 */
      },
      handler2(data) {
        /* 处理事件2 */
      },
    },
  };
</script>
```

### 键盘事件

键盘事件语法糖：@keydown，@keyup

1. 常用的按键别名：

- 回车 => enter
- 删除 => delete (捕获“删除”和“退格”键)
- 退出 => esc
- 空格 => space
- 换行 => tab (特殊，必须配合 keydown 去使用)
- 上 => up
- 下 => down
- 左 => left
- 右 => right

```html
<input type="text" placeholder="按下回车提示输入" @keydown.enter="showInfo" />
```

2. Vue 未提供别名的按键，可以使用按键原始的 key 值去绑定，但注意要转为 kebab-case（短横线命名）

3. 系统修饰键（用法特殊）：ctrl、alt、shift、meta

   - 配合 keyup 使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发。
   - 配合 keydown 使用：正常触发事件。

```html
<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
```

4. 也可以使用 keyCode 去指定具体的按键（不推荐）

5. Vue.config.keyCodes.自定义键名 = 键码，可以去定制按键别名

## v-for

1. 遍历数组

场景：渲染动态列表（如表格、商品列表）。

```html
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index + 1 }}. {{ item.name }}
  </li>
</ul>

<script>
  new Vue({
    data: {
      items: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
      ],
    },
  });

  // 结果 1. Apple
  //     2. Banana
</script>
```

2. 遍历对象

场景：渲染对象属性（如用户信息展示）。

```html
<div v-for="(value, key) in user" :key="key">{{ key }}: {{ value }}</div>

<script>
  new Vue({
    data: {
      user: { name: 'John', age: 30 },
    },
  });

  // name: John
  // age: 30
</script>
```

3. 遍历数字范围

场景：生成固定数量的元素（如星级评分）。

```html
<span v-for="n in 5" :key="n">⭐</span>
```

结果：⭐⭐⭐⭐⭐

### 注意事项

1. 必须绑定 key

作用：帮助 Vue 高效更新虚拟 DOM，避免渲染错误。

```html
<!-- ❌ 错误 -->
<li v-for="item in items">{{ item.name }}</li>

<!-- ✅ 正确 -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

2. 避免 v-if 和 v-for 共用

问题：v-for 优先级高于 v-if，导致循环中的每个元素都会执行条件判断。

解决方案：改用计算属性过滤数据。

```html
<!-- ❌ 错误写法 -->
<ul>
  <li v-for="item in list" v-if="item.isActive">{{ item.name }}</li>
</ul>

<!-- ✅ 正确写法 -->
<ul>
  <li v-for="item in activeList">{{ item.name }}</li>
</ul>

<script>
  new Vue({
    data: {
      list: [
        { name: 1, isActive: true },
        { name: 2, isActive: false },
      ],
    },
    computed: {
      activeList() {
        return this.list.filter((item) => item.isActive);
      },
    },
  });
</script>
```

3. 避免在模板中嵌套复杂表达式

```html
<!-- ❌ 性能差 -->
<div v-for="item in list.filter(x => x.active)">{{ item.name }}</div>

<!-- ✅ 优化后 -->
<div v-for="item in filteredList">{{ item.name }}</div>

<script>
  new Vue({
    data: {
      list: [
        { active: true, name: '1' },
        { active: false, name: '2' },
      ],
    },
    computed: {
      filteredList() {
        return this.list.filter((x) => x.active);
      },
    },
  });
</script>
```

4. 组件循环传递 Props

```vue
<!-- ❌ 错误：未传递数据 -->
<ChildComponent v-for="item in items" :key="item.id" />

<!-- ✅ 正确 -->
<ChildComponent v-for="item in items" :key="item.id" :item="item" />
```

## vue2 中数组检测

在 Vue2 中，数组的更新检测基于 JavaScript 的限制（Object.defineProperty 的响应式缺陷），开发者需要明确哪些操作会触发视图更新，哪些不会。

### 能自动检测

Vue2 能自动检测的数组操作，对以下 数组变异方法 进行了拦截重写，调用这些方法会触发视图更新

| 方法      | 作用               | 示例                               |
| --------- | ------------------ | ---------------------------------- |
| push()    | 末尾添加元素       | arr.push(newItem)                  |
| pop()     | 移除最后一个元素   | arr.pop()                          |
| shift()   | 移除第一个元素     | arr.shift()                        |
| unshift() | 开头添加元素       | arr.unshift(newItem)               |
| splice()  | 添加/删除/替换元素 | arr.splice(start, count, ...items) |
| sort()    | 排序               | arr.sort()                         |
| reverse() | 反转顺序           | arr.reverse()                      |

### 无法检测

Vue2 无法检测 的数组操作，以下操作 不会触发视图更新

| 操作类型             | 示例                                | 问题原因                         |
| -------------------- | ----------------------------------- | -------------------------------- |
| 直接通过索引修改元素 | this.items[0] = newItem Vue         | 无法追踪索引变化                 |
| 修改数组长度         | this.items.length = 0               | 同上                             |
| 非变异方法返回新数组 | this.items = this.items.filter(...) | 需重新赋值才能触发更新（见下文） |

### 强制触发数组

1. 使用 Vue.set 或 vm.$set

<Alert message='Vue.set 或 vm.$set 不能给 vm 或 vm 的根数据对象 添加属性'></Alert>

```js
// ✅ 正确：通过 Vue.set 修改元素
Vue.set(this.items, index, newItem);
// 或
this.$set(this.items, index, newItem);
```

1. 重新赋值整个数组

适用于非变异方法（如 filter、concat、slice）：

```js
// ✅ 正确：重新赋值触发更新
this.items = this.items.filter((item) => item.isActive);
```

### 验证效果

```html
<div id="app">
  <h3>商品列表（更新失效示例）</h3>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ item.name }} - 价格：{{ item.price }}元
      <button @click="updatePriceError(index)">错误修改价格</button>
      <button @click="clearItemsError">错误清空列表</button>
    </li>
  </ul>

  <h3>解决方案演示</h3>
  <button @click="updatePriceCorrect(0)">正确修改价格</button>
  <button @click="clearItemsCorrect">正确清空列表</button>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      items: [
        { name: '苹果', price: 5 },
        { name: '香蕉', price: 3 },
      ],
    },
    methods: {
      // ❌ 错误示例

      // 1. 直接通过索引修改数组元素
      updatePriceError(index) {
        this.items[index].price += 1; // 视图不会更新！
      },

      // 2. 直接修改数组长度
      clearItemsError() {
        this.items.length = 0; // 视图不会更新！
      },

      // ✅ 正确解决方案

      // 1. 使用 Vue.set 或数组变异方法
      updatePriceCorrect(index) {
        // 方法一：使用 Vue.set
        Vue.set(this.items[index], 'price', this.items[index].price + 1);

        // 方法二：创建新对象（推荐）
        // this.items.splice(index, 1, {
        //   ...this.items[index],
        //   price: this.items[index].price + 1
        // });
      },

      // 2. 正确清空数组
      clearItemsCorrect() {
        this.items = []; // 重新赋值（推荐）

        // 或使用变异方法
        // this.items.splice(0, this.items.length);
      },
    },
  });
</script>
```

## v-text

作用：更新元素的 textContent（替代 `{{ }}`）。

场景：避免模板插值闪烁问题

```html
<span v-text="message"></span>
```

### 常见问题

覆盖元素原有内容

```html
<!-- ❌ 错误：span 内的默认内容会被覆盖 -->
<span v-text="message">默认内容</span>
```

## v-html

作用将数据解析为 HTML 渲染（替代 innerHTML）。v-html 可以识别 html 结构。

场景：渲染富文本内容（需确保内容安全）

```html
<div v-html="rawHtml"></div>
```

### 常见问题（坑）

XSS 攻击风险

绝对避免渲染用户输入的未过滤内容：

```javascript
// ❌ 危险：用户输入可能包含恶意脚本
data() {
  return { rawHtml: userInput }
}
```

### v-pre

作用： 跳过元素及其子元素的编译（显示原始模板语法）。

场景：展示 Vue 模板代码示例

```html
<div v-pre>{{ 这里的内容不会被编译 }}</div>
```

### 常见问题（坑）

误用于动态内容

```html
<!-- ❌ 错误：绑定失效 -->
<div v-pre>{{ message }}</div>
```

## v-cloak

作用：隐藏未编译的 Mustache 标签直到实例准备完毕。

场景：防止页面加载时显示 {{ }} 模板语法

```html
<style>
  [v-cloak] {
    display: none;
  }
</style>
<div v-cloak>{{ message }}</div>
```

## v-once

作用：只渲染元素和组件一次（后续数据变化不更新）。

场景：优化静态内容的渲染性能

```html
复制
<div v-once>{{ staticContent }}</div>
```

### 常见问题（坑）

误用于动态数据

```html
<!-- ❌ 错误：数据变化后不再更新 -->
<div v-once>{{ dynamicData }}</div>
```

## v-slot

作用：定义插槽内容（具名插槽/作用域插槽）。

场景：复杂插槽内容分发

组件封装时传递作用域数据

```html
<!-- 父组件 -->
<template v-slot:header="slotProps">
  <h1>{{ slotProps.title }}</h1>
</template>

<!-- 简写 -->
<template #header="{ title }">
  <h1>{{ title }}</h1>
</template>
```

### 常见问题（坑）

作用域变量未正确传递

```html
<!-- ❌ 错误：未在子组件插槽绑定数据 -->
<template #default></template>

<!-- ✅ 正确 -->
<template #default="slotProps"></template>
```

## 自定义指令

Vue 也允许注册自定义指令

### 全局注册

通过 Vue.directive() 注册全局指令，所有组件可用。

```javascript
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  },
});
```

### 局部注册

在组件选项中通过 directives 注册，仅当前组件可用。

```javascript
export default {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
```

### 使用方法

定义：指令定义时不加 v-，但使用时要加 v-

命名规范：指令名如果是多个单词，要使用 kebab-case 命名方式，不要用 camelCase 命名 。

职责单一：一个指令只解决一个问题（如聚焦、权限控制）。

复用性：将通用逻辑封装为全局指令。

性能优化：避免在指令中频繁操作 DOM 或绑定高开销事件。

### 生命周期

| 钩子名称         | 触发时机                           | 典型用途                   |
| ---------------- | ---------------------------------- | -------------------------- |
| bind(常用)       | 指令第一次绑定到元素时             | 初始化设置、事件监听       |
| inserted(常用)   | 元素插入父节点后（DOM 存在）       | 操作 DOM（如聚焦输入框）   |
| update(常用)     | 组件更新时（值变化但子组件未更新） | 根据新值更新行为           |
| componentUpdated | 组件及子组件更新后                 | 依赖子组件更新的操作       |
| unbind           | 指令与元素解绑时                   | 清理工作（如移除事件监听） |

指令钩子函数会被传入以下参数：

- el：指令所绑定的元素，可以用来直接操作 DOM。
- binding：一个对象，包含以下 property：
  - name：指令名，不包括 v- 前缀。
  - value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

### 使用场景

1. 自动聚焦输入框

场景：页面加载时自动聚焦到指定输入框。

```javascript
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
});

// 使用
<input v-focus>
```

2. 按钮权限控制

场景：根据用户角色动态显示/隐藏按钮。

```javascript
Vue.directive('permission', {
  inserted: function (el, binding) {
    const roles = ['admin', 'editor'];
    if (!roles.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  },
});

// 使用
<button v-permission="admin">删除</button>;
```

3.  输入框内容格式化

场景：自动格式化金额输入（如添加千位分隔符）。

```javascript
Vue.directive('money', {
  bind(el, binding) {
    el.addEventListener('input', (e) => {
      const value = e.target.value.replace(/,/g, '');
      e.target.value = new Intl.NumberFormat().format(value);
    });
  }
});

// 使用
<input v-money>
```

4. 复杂参数传递

问题：需要传递对象或动态参数。

解决：通过指令值或修饰符传递。

```javascript
// 使用对象传递参数
Vue.directive('tooltip', {
  bind(el, binding) {
    const { text, position } = binding.value;
    // 初始化 tooltip
  },
});

// 使用
<div v-tooltip="{ text: '提示内容', position: 'top' }"></div>;
```

<BackTop></BackTop>