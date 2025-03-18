---
toc: content
title: 错误类型
---

# javascript

## 错误（Error）和错误处理

js 中常见的错误类型

### Error

所有错误的父类型

### ReferenceError

引用的变量不错在

<ImagePreview src="/images/js/image14.jpg"></ImagePreview>

### TypeError

数据类型不正确的错误

<ImagePreview src="/images/js/image15.jpg"></ImagePreview>

### RangeError

数据值不在其所允许的范围内

意思就是递归函数有次数限制，超过调用的次数

<ImagePreview src="/images/js/image16.jpg"></ImagePreview>

### SyntaxError

语法错误

<ImagePreview src="/images/js/image17.jpg"></ImagePreview>

### try catch

捕获错误

```js
// try中放可能出现错误的代码，一旦出现错误立即停止try中的代码，调用catch，并携带错误信息
try {
  const a = null;
  a.say();
} catch (err) {
  message.error(err.message);
}

console.log('catch捕获错误后不影响之后代码执行');
```

### throw error

抛出错误：

```js
function a() {
  if (Date.now() % 2 === 1) {
    console.log('当前时间为奇数，可以执行任务');
  } else {
    // 如果时间为偶数抛出异常，由调用者来处理，自己决定抛出什么样的异常信息
    throw new Error('当前时间为偶数无法执行任务');
  }
}

// 捕获处理异常
try {
  a();
} catch (err) {
  message.error(err.message);
  message.error(err.stack);
}
```

3,错误对象

message 属性：错误的相关信息

stack 属性：函数调用栈记录信息

<BackTop></BackTop>