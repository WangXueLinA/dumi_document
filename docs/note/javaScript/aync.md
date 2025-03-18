---
toc: content
title: 异步解决方案
---

# javascript

## 异步解决方案

回顾之前展开异步解决的方案：

- 回调函数
- Promise 对象
- generator 函数
- async/await

这里通过文件读取案例，将几种解决异步的方案进行一个比较：

### 回调函数

所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，再调用这个函数

```js
fs.readFile('/etc/fstab', function (err, data) {
  if (err) throw err;
  console.log(data);
  fs.readFile('/etc/shells', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
});
```

readFile 函数的第三个参数，就是回调函数，等到操作系统返回了/etc/passwd 这个文件以后，回调函数才会执行

### Promise

Promise 就是为了解决回调地狱而产生的，将回调函数的嵌套，改成链式调用

```js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

readFile('/etc/fstab')
  .then((data) => {
    console.log(data);
    return readFile('/etc/shells');
  })
  .then((data) => {
    console.log(data);
  });
```

这种链式操作形式，使异步任务的两段执行更清楚了，但是也存在了很明显的问题，代码变得冗杂了，语义化并不强

### generator

yield 表达式可以暂停函数执行，next 方法用于恢复函数执行，这使得 Generator 函数非常适合将异步任务同步化

```js
const co = require('co'); // 引入co 库，会自动执行next 方法
co(function* () {
  try {
    const f1 = yield readFile('/etc/fstab');
    console.log(f1.toString());

    const f2 = yield readFile('/etc/shells');
    console.log(f2.toString());
  } catch (e) {
    console.log(e);
  }
});
```

### async/await

将上面 Generator 函数改成 async/await 形式，更为简洁，语义化更强了

```js
async function () {

  try{
    const f1 = await readFile('/etc/fstab');
    console.log(f1.toString());

    const f2 = await readFile('/etc/shells');
    console.log(f2.toString());
  } catch (e) {
    message.error(e);
  }

};
```

### 区别

通过上述代码进行分析，将 promise、Generator、async/await 进行比较：

- promise 和 async/await 是专门用于处理异步操作的
- Generator 并不是为异步而设计出来的，它还有其他功能（对象迭代、控制输出、部署 Interator 接口...）
- promise 编写代码相比 Generator、async 更为复杂化，且可读性也稍差
- Generator、async 需要与 promise 对象搭配处理异步情况
- async 实质是 Generator 的语法糖，相当于会自动执行 Generator 函数
- async 使用上更为简洁，将异步代码以同步的形式进行编写，是处理异步编程的最终方案

### 使用场景

Generator 是异步解决的一种方案，最大特点则是将异步操作同步化表达出来

```js
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next();

// 卸载UI
loader.next();
```

包括 redux-saga 中间件也充分利用了 Generator 特性

```js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import Api from '...';

function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({ type: 'USER_FETCH_SUCCEEDED', user: user });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}

function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

function* mySaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}

export default mySaga;
```

还能利用 Generator 函数，在对象上实现 Iterator 接口

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

<BackTop></BackTop>