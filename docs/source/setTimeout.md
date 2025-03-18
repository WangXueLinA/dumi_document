---
toc: content
title: setTimeout实现setInterval
group: 源码
---

# setTimeout 实现 setInterval

setInterval 会按照指定的时间间隔周期性地执行某个函数，而 setTimeout 则是在指定的时间之后执行一次函数。如果想要使用 setTimeout 来模拟 setInterval 的效果，可以通过在一个函数中递归调用 setTimeout 实现。这样可以在每次延迟执行结束后再次调用自身，从而达到类似 setInterval 的循环执行效果。

```js
function setIntervalWithTimeout(fn, delay) {
  function execute() {
    // 先执行传入的函数
    fn();
    // 然后再次调用setTimeout，形成循环
    setTimeout(execute, delay);
  }

  // 初始化第一次执行
  setTimeout(execute, delay);
}

// 使用示例
function sayHello() {
  console.log('Hello!');
}

// 每隔1000毫秒执行一次sayHello
setIntervalWithTimeout(sayHello, 1000);
```

setIntervalWithTimeout 函数接收两个参数：一个是需要周期性执行的函数 fn，另一个是执行间隔时间 delay（以毫秒为单位）。这个函数内部定义了一个 execute 函数，它首先执行传入的函数 fn，然后通过 setTimeout 在给定的延迟时间 delay 后再次调用自己，形成了一个循环执行的效果。

<Alert message="使用这种方法时，如果想停止循环执行，需要额外的逻辑来清除定时器，这与直接使用 clearInterval 清除由 setInterval 创建的定时器不同。要实现 clearInterval 的功能，你可以在 setIntervalWithTimeout 函数中返回一个可以用来清除定时器的函数。"></Alert>

```js
function setIntervalWithTimeout(fn, delay) {
  let timerId;

  function execute() {
    fn();
    timerId = setTimeout(execute, delay);
  }

  // 初始化第一次执行
  timerId = setTimeout(execute, delay);

  // 返回一个函数用于停止定时执行
  return function clearIntervalCustom() {
    clearTimeout(timerId);
  };
}

// 使用示例
const stopExecution = setIntervalWithTimeout(() => console.log('Tick'), 1000);

// 在适当的时候调用stopExecution来停止执行
// stopExecution();
```

<BackTop></BackTop>