---
toc: content
title: filter(过滤器)
order: -96
---

# Vue2

## filter(过滤器)

过滤器不支持 Vue3

过滤器用于 格式化文本，通常用于插值表达式（{{ }}）或 v-bind 表达式中。

核心功能：将原始数据转换为更友好的显示格式（如日期格式化、货币符号添加等）。

## 全局过滤器

通过 Vue.filter 定义全局过滤器，可在所有组件中使用：

```js
// 定义全局过滤器
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// 使用过滤器
<p>{{ message | capitalize }}</p>
```

## 局部过滤器

在组件选项中定义过滤器，仅当前组件可用

```js
new Vue({
  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
});
```

### 链式调用

多个过滤器可以串联使用，顺序是从左到右依次执行

```html
<p>{{ message | filterA | filterB }}</p>
```

等价于：

```js
filterB(filterA(message));
```

## 适用场景

| 场景         | 示例代码                                |
| ------------ | --------------------------------------- |
| 文本格式化   | 首字母大写、截断文本、大小写转换        |
| 日期格式化   | 将时间戳转为 YYYY-MM-DD 格式            |
| 货币格式化   | 添加货币符号、千位分隔符                |
| 数据单位转换 | 字节转为 KB/MB/GB、温度单位转换         |
| 状态映射     | 将布尔值转为“是/否”、状态码转为文字描述 |

### 文本格式化

```javascript

// 全局过滤器：首字母大写
Vue.filter('capitalize', function(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
});

// 使用
<p>{{ 'hello world' | capitalize }}</p>

```

结果：Hello world

### 日期格式化

```javascript

// 全局过滤器：日期格式化
Vue.filter('formatDate', function(value) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
});

// 使用
<p>{{ 1633072800000 | formatDate }}</p>

```

结果：2021-10-01

### 货币格式化

```javascript

// 全局过滤器：货币格式化
Vue.filter('currency', function(value, symbol = '$') {
  if (isNaN(value)) return '';
  return `${symbol}${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
});

// 使用
<p>{{ 1234.56 | currency('￥') }}</p>
```

结果：￥ 1,234.56

### 状态映射

```javascript

// 全局过滤器：状态映射
Vue.filter('statusText', function(value) {
  const statusMap = { 0: '未开始', 1: '进行中', 2: '已完成' };
  return statusMap[value] || '未知状态';
});

// 使用
<p>{{ 1 | statusText }}</p>

```

结果：进行中

## 注意事项

### 过滤器不支持 Vue3

问题：Vue3 已移除过滤器功能，推荐使用 计算属性 或 方法 替代。

迁移方案：

```javascript
// Vue2 过滤器
{
  {
    message | capitalize;
  }
}

// Vue3 替代方案
{
  {
    capitalize(message);
  }
}
```

### 无法访问组件实例

问题：过滤器中无法使用 this 访问组件数据或方法。

解决方案：将需要的数据作为参数传递：

```javascript
Vue.filter('format', function (value, prefix) {
  return `${prefix}${value}`;
});
```

### 性能问题

问题：频繁使用过滤器可能导致性能问题（每次渲染都会调用）。

优化方案：对静态数据使用计算属性缓存结果：

```javascript

computed: {
  formattedMessage() {
    return this.capitalize(this.message);
  }
}
```

### 默认值处理

问题：过滤器应处理 null、undefined 或空字符串等异常值。

```javascript
Vue.filter('capitalize', function (value) {
  if (!value) return ''; // 处理空值
  return value.charAt(0).toUpperCase() + value.slice(1);
});
```

<BackTop></BackTop>