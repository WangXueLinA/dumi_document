---
toc: content
title: commonJS
order: -98
---

# nodejs

## commonJS

CommonJS：是 Node.js 使用的模块化规范。也就是说，Node.js 就是基于 CommonJS 这种模块化规范来编写的。

CommonJS 规范规定：每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口对象。加载某个模块，其实是加载该模块的 module.exports 对象。

在 CommonJS 中，每个文件都可以当作一个模块：

- 在服务器端：模块的加载是运行时同步加载的。
- 在浏览器端: 模块需要提前编译打包处理。首先，既然同步的，很容易引起阻塞；其次，浏览器不认识 require 语法，因此，需要提前编译打包。

### 模块的暴露和引入

#### 方式一： exports

exports 对象用来导出当前模块的公共方法或属性。别的模块通过 require 函数调用当前模块时，得到的就是当前模块的 exports 对象。

```js
// 相当于是：给 exports 对象添加属性
const name = 'qianguyihao';

const foo = function (value) {
  return value * 2;
};

exports.name = name;
exports.foo = foo;
```

#### 方式二： module.exports

```js
// 方式1
module.exports = {
  name: '我是 module1',
  foo() {
    console.log(this.name);
  },
};

// 我们不能再继续写 module.exports = value2。因为重新赋值，会把 exports 对象 之前的赋值覆盖掉。

// 方式2
const age = 28;
module.exports.age = age;
```

exports 和 module.exports 的区别
最重要的区别：

- 使用 exports 时，只能单个设置属性 exports.a = a;
- 使用 module.exports 时，既单个设置属性 module.exports.a，也可以整个赋值 module.exports = obj。

其他要点：

- Node 中每个模块的最后，都会执行 return: module.exports。
- Node 中每个模块都会把 module.exports 指向的对象赋值给一个变量 exports，也就是说 exports = module.exports。
- module.exports = XXX，表示当前模块导出一个单一成员，结果就是 XXX。
- 如果需要导出多个成员，则必须使用 exports.add = XXX; exports.foo = XXX。或者使用 module.exports.add = XXX; module.export.foo = XXX。

### 引入模块的方式：require

require 函数用来在一个模块中引入另外一个模块。传入模块名，返回模块导出对象。

语法格式：

```js
// const module1 = require('模块名');
// require的是文件路径。文件路径既可以用绝对路径，也可以用相对路径。后缀名.js可以省略。

const module1 = require('./main.js');
const module2 = require('./main');
const module3 = require('Demo/src/main.js');
```

<BackTop></BackTop>