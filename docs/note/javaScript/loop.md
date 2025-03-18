---
toc: content
title: 浏览器事件循环
---

# javascript

## 浏览器事件循环

### 单线程与异步基础

JavaScript 是单线程的，意味着同一时间只能执行一个任务。为了避免耗时操作（如网络请求、定时器等）阻塞主线程，浏览器提供了异步 API（如 setTimeout, Promise, fetch 等），通过事件循环机制处理异步回调。

### 事件循环流程

事件循环按以下步骤循环执行：

1. 执行全局同步代码：

同步任务依次进入调用栈并执行，遇到异步 API 则注册回调到对应队列。

2. 处理微任务队列：

当调用栈清空后，事件循环会依次执行微任务队列中的所有任务，直到队列为空。微任务执行过程中新添加的微任务会在此阶段一并处理。

3. 执行宏任务：

从宏任务队列中取出一个任务执行。执行完毕后，立即回到步骤 2 处理微任务。

4. UI 渲染（如有需要）：

浏览器可能在此阶段更新 UI，但具体时机由浏览器优化决定。

5. 循环：
   重复上述步骤，形成事件循环。

### 执行顺序示例

```javascript
console.log('1'); // 同步任务

setTimeout(() => console.log('2'), 0); // 宏任务

Promise.resolve().then(() => console.log('3')); // 微任务

console.log('4'); // 同步任务
```

输出顺序：1 → 4 → 3 → 2

解释：

1. 同步任务 1 和 4 先执行。
2. 检查微任务队列，执行 Promise.then，输出 3。
3. 处理宏任务队列，执行 setTimeout 回调，输出 2。

### 复杂场景分析

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise 1'));
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
  Promise.resolve().then(() => console.log('Promise 2'));
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 3');
  Promise.resolve().then(() => console.log('Promise 4'));
});

console.log('End');
```

输出顺序：

Start → End → Promise 3 → Promise 4 → Timeout 1 → Promise 1 → Timeout 2 → Promise 2

步骤分解：

1. 同步代码输出 Start 和 End。
2. 执行微任务队列中的 Promise 3 和嵌套的 Promise 4。
3. 执行第一个宏任务 Timeout 1，输出后处理其微任务 Promise 1。
4. 执行第二个宏任务 Timeout 2，输出后处理其微任务 Promise 2。

### 注意

- 微任务优先：每个宏任务执行后必须清空微任务队列。
- 微任务递归：在微任务中递归添加微任务会导致无限循环，阻塞主线程。
- 宏任务按队列顺序执行：同类型宏任务按先进先出执行，不同类型可能由浏览器优先级决定（如 UI 事件优先于网络请求）。
- 避免阻塞：长时间同步任务会阻塞事件循环，导致页面卡顿。
- 渲染时机：UI 渲染通常在一次事件循环结束后进行，但可通过 requestAnimationFrame 在渲染前执行动画更新。
- 任务拆分：耗时任务应拆分为小块，通过 setTimeout 或 setImmediate（Node.js）分批次执行，避免阻塞。

### 总结

1. js 遇到异步并不会一直等待返回结果，而是将这个事件挂起，继续执行执行栈中的任务，当一个异步事件返回结果后，js 将这个事件加入与当前执行栈不同的另外一个队列中，我们称为事件队列，被放入事件队列不会立刻执行回调，而是等待当前执行栈中的所有任务都执行完毕之后，主线程处于闲置状态时，主线程会查看事件队列中是否有任务，如果有，那么主线程会从中取出排在第一位的事件，并把事件对应的回调放在执行栈中，然后执行其中的同步代码，如此反复，就成了一个无限循环
2. 宏任务：script(整体代码), setTimeout, setInterval, requestAnimationFrame, I/O, UI rendering
3. 微任务：promise 的回调如 then 和 catch，process.nextTick, Object.observe, MutationObserver
4. 第一次事件循环中，JavaScript 引擎会把整个 script 代码当成一个宏任务执行，执行完成之后，再检测本次循环中是否寻在微任务，存在的话就依次从微任务的任务队列中读取执行完所有的微任务，再读取宏任务的任务队列中的任务执行，再执行所有的微任务，如此循环。JS 的执行顺序就是每次事件循环中的宏任务-微任务。

<BackTop></BackTop>