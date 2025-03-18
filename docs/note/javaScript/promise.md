---
toc: content
title: promise
---

# javascript

## Promise

抽象表达：是 js 中进行异步编程的新解决方案（旧的为纯回调函数）

具体表达：

从语法上来说，Promise 是一个内置构造函数
从功能上来说，Promise 的实例对象用来封装一个异步操作并可以获取其成功/失败的值

1.  Promise 不是回调，是一个内置的构造函数，是程序员自己 new 调用的
2.  new Promise 的时候，要传入一个回调函数，他是同步的回调，会立即在主线程上执行，它被称为 executor 函数
3.  每个 Promise 实例都有 3 种状态，分别为：初始化（pending）、成功（fulfilled）、失败（rejected）
4.  每个 Promise 实例在刚被 new 出来的那一刻，状态都是初始化（pending）
5.  executor 函数会接收到 2 个参数，他们都是函数，分别用形参 resolve、rejecet 接收

6.  1.  调用 resolve，会让 Promise 实例状态变为：成功（fulfilled），同时可以指定成功的 vaule
    1.  调用 reject，会让 Promise 实例状态变为：失败（rejected），同时可以指定失败的 reason

```js
// 创建一个新的promist对象
const promise = new Promise((resolve, reject) => {
  // executor执行器函数
  //这里执行同步代码

  // 执行异步操作任务
  setTimeout(() => {
    const time = Date.now(); // 如果当前时间是偶数，代表成功，否则代表失败
    if (time % 2 === 0) {
      resolve('成功的数据， time=' + time);
    } else {
      reject('失败的数据， time=' + time);
    }
  }, 1000);
});

p.then(
  (value) => {
    // 接受成功的vaule数据
    console.log('成功的回调', value);
  },
  (reason) => {
    // 接受失败的reason数据
    console.log('失败的回调', reason);
  },
);
```

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject

- resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”
- reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”

基本编码流程

1.  创建 Promise 的实例对象（pending 状态），传入 executor 函数
2.  在 executor 中启动异步任务（定时器、ajax 请求）
3.  根据异步任务的结果，做不同处理

4.  1.  如果异步任务成功，我们调用 resolve(value)，让 Promise 实例对象状态变为成功（fulfilled），同时指定成功的 value
    2.  如果异步任务失败，我们调用 reject(reason)，让 Promise 实例对象状态变为失败（rejected），同时指定失败的 reason

5.  通过 then 方法为 Promise 的实例指定成功、失败的回调函数，来获取成功的 value、失败的 reason。

<Alert message='then 方法所指定的：成功的回调，失败的回调，都是异步的回调'></Alert>

关于状态的注意点

**三个状态**

1.  pending：未确定 -----初始状态
2.  fulfilled：成功的-------调用 resolve()后的状态
3.  rejected：失败的------调用 rejected()后的状态

**两种状态的改变**

1.  pending ==> fulfilled
2.  pending ==> rejected
3.  状态只能改变一次
4.  一个 promise 可以指定多个 then 的成功/失败的回调函数

### 特点

- 对象的状态不受外界影响，只有异步操作的结果，可以决定当前是哪一种状态
- 一旦状态改变（从 pending 变为 fulfilled 和从 pending 变为 rejected），就不会再变，任何时候都可以得到这个结果

### 流程

认真阅读下图，我们能够轻松了解 promise 整个流程

<ImagePreview src="/images/es6/image1.png"></ImagePreview>

### 回调函数弊端

在以往我们如果处理多层异步操作，我们往往会像下面那样编写我们的代码

```js
// 获取奶茶的方法
function getTea (fn) {
  // 模拟异步取数据
  setTimeout(() => {
    fn('奶茶做出来了')
  }, 500)
}

// 获取火锅的方法
// 这里形参为回调函数的形式 ，结果回来时调用函数，才可以抛出输出的结果
function getHotpot (fn) {
  // 模拟异步取数据
  setTimeout(() => {
    fn('火锅做出来了')
  }, 500)
}

// 需求是我先喝奶茶，后吃火锅。。。。。

// 调用获取奶茶的方法
getTea(function (data) => {
 console.log(data)
  // 调用获取火锅的方法
  getHotpot(function (data) => {
   console.log(data)
    get1(function (data) => {
     console.log(data)
      get2(function (data) => {
       // .........
       console.log(data)
      })
    })
  })
})
```

纯回调函数在传递回调函数和异步操作之前必须定义好回调函数，然后在异步函数拿到数据后再调用回调函数拿到数据，但 promise 把异步和回调拆开，可以先拿到异步任务执行的结果，在决定拿到结果之后怎么处理

第二条成功的数据是以第一条数据为前提，第三条成功的数据是以第二条数据为前提，

回调地狱缺点，不便于阅读，不便于做异常处理

```js
doSomething(function (result) {
  doSomethingElse(
    result,
    function (newResult) {
      doThirdThing(
        newResult,
        function (finalResult) {
          console.log('得到最终结果: ' + finalResult);
        },
        failureCallback,
      );
    },
    failureCallback,
  );
}, failureCallback);
```

阅读上面代码，是不是很难受，上述形成了经典的回调地狱

现在通过 Promise 的改写上面的代码

```js
doSomething()
  .then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log('得到最终结果: ' + finalResult);
  })
  .catch(failureCallback);
```

可以感受到 promise 解决异步操作的优点：

- 链式操作减低了编码难度
- 代码可读性明显增强
- 错误处理都在 catch 里进行处理，自己不要提前定义好回调函数来接受错误

但是回调地狱的最终解决方案还 async/await,因为 Promise.then 跟 catch 里还是利用回调函数来接受数据

```js
async function request() {
  try {
    const result = await doSomething();
    const newResult = await doSomethingElse(result);
    const finalResult = await doThirdThing(newResult);
    console.log('得到最终结果: ' + finalResult);
  } catch (err) {
    failureCallback(err);
  }
}
```

### Promise 关键几个问题

#### 如何改变 Promise 实例状态

1.  执行 resolve(value)：如果当请是 pending 就会变为 fulfilled
1.  执行 rejecte(reason)：如果当前是 pending 就会变为 rejected
1.  执行器函数(executor)抛出异常：如果当前是 pending 就会变为 rejected

```js
let p = new Promise((resolve, reject) => {
  //resolve('Promise状态会被标记为resolved')
  // reject('Promise状态会被标记为rejected')
  throw new Error('Promise状态会被标记为rejected');
  // console.log(a)  Promise状态会被标记为rejected
});

p.then(
  (value) => {
    console.log('value', value);
  },
  (reason) => {
    console.log('reason', reason);
  },
);

// 只会输入value为100，因为状态只为改变一次，成功了就不能失败
let p = new Promise((resolve, reject) => {
  resolve(100);
  // 只要指定成功/失败状态，之后再指定成功/失败不会执行
  resolve(1); // 不会执行
});

p.then(
  (value) => {
    console.log('value', value);
  },
  (reason) => {
    console.log('reason', reason);
  },
);
```

#### 改变实例状态与指定回调函数谁先执行

1.  都有可能，正常情况下是先指定的回调再改变状态，但也可以先改变状态再指定回调

```js
// 1. 常规: 先指定回调函数, 后改变的状态
const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1); // 后改变的状态(同时指定数据), 异步执行回调函数
  }, 1000);
});

p.then(
  // 先指定回调函数, 保存当前指定的回调函数
  (value) => {
    console.log('value', value);
  },
  (reason) => {
    console.log('reason', reason);
  },
);
```

2.  如何先改状态在指定回调

    1.  在执行器中直接调用 resolve()/reject()

    ```js
    const p = new Promise((resolve, reject) => {
      resolve(1); // 先改变的状态(同时指定数据)
    });

    p.then(
      // 后指定回调函数, 异步执行回调函数
      (value) => {
        console.log('value2', value);
      },
      (reason) => {
        console.log('reason2', reason);
      },
    );
    ```

    2.  延迟一会在调用 then

    ```js
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1); // 先改变的状态(同时指定数据), 异步执行回调函数
      }, 1000);
    });

    setTimeout(() => {
      p.then(
        (value) => {
          console.log('value3', value);
        },
        (reason) => {
          console.log('reason3', reason);
        },
      );
    }, 3000);
    ```

3.  Promise 实例什么时候才能得到数据

    1.  如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据
    2.  如果先改变状态，那当指定回调时，回调函数就会调用，得到数据

#### then 的链式调用

Promise 实例的 then()返回的是一个【新 Promise 实例】，它的值跟状态由什么决定?

1.  简单表达: 由 then()指定的回调函数执行的结果决定
2.  详细表达:

    1.  如果 then 所指定的回调返回的是非 Promise 的任意值，【新 promise 实例】状态为成功（fulfilled）, value 为返回的值

    ```js
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });

    // 输出value1, 1，但是作为一个回调函数,没有return返回值，所以之后then为undefined
    const x = p.then(
      (value) => {
        console.log('value1', value);
      },
      (reason) => {
        console.log('reason1', reason);
      },
    );

    x.then(
      (value) => {
        console.log('value2', value);
      }, // 输出value2, undefined
      (reason) => {
        console.log('reason2', reason);
      },
    );
    ```

    2.  如果 then 所指定的回调返回的是另一个新 Promise 实例 p, 【新 promise 实例】的状态，值与 p 一致

    ```js
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 1000);
    });

    const x = p.then(
      (value) => {
        console.log('value1', value); // 输出value1, 1
        return Promise.resolve(2);
        // return Promise.reject(-2)
      },
      (reason) => {
        console.log('reason1', reason);
      },
    );

    x.then(
      (value) => {
        console.log('value2', value);
      }, // 输出value2, 2
      (reason) => {
        console.log('reason2', reason);
      },
      // 上一个then返回rejected状态值为-2,此时就x接收到就是失败状态值为-2
      // reason => { console.log('reason2', reason) }
    );

    // reject状态时
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(-1);
      }, 1000);
    });

    // 作为一个回调函数,没有return返回值，所以之后then为undefined
    // 因为undefined为非Promise值，所以会走x的成功回调，值为undefined
    const x = p.then(
      (value) => {
        console.log('value1', value);
      },
      (reason) => {
        console.log('reason1', reason);
      }, // 输出reason1, -1
    );

    x.then(
      (value) => {
        console.log('value2', value);
      }, // 输出value2, undefined
      (reason) => {
        console.log('reason2', reason);
      },
    );
    ```

    3.  如果 then 所指定的回调抛出异常, 【新 promise 实例】变为 rejected, reason 为抛出的异常

    ```js
    new Promise((resolve, reject) => {
      resolve(1);
    })
      .then(
        (value) => {
          console.log('value1', value); // 输出value, 1
          throw 5;
        },
        (reason) => {
          console.log('reason1', reason);
        },
      )
      .then(
        (value) => {
          console.log('value2', value);
        },
        (reason) => {
          console.log('reason2', reason);
        }, // 输出reason2, 5
      );
    ```

#### promise 如何串连多个操作任务

1.  promise 的 then()返回一个新的 promise, 可以开成 then()的链式调用
2.  通过 then 的链式调用串连多个同步/异步任务

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('执行任务1(异步)');
    resolve(1);
  }, 1000);
})
  .then((value) => {
    console.log('任务1的结果: ', value); // value=1
    console.log('执行任务2(同步)');
    return 2;
  })
  .then((value) => {
    console.log('任务2的结果:', value); // value=2

    return new Promise((resolve, reject) => {
      // 启动任务3(异步)
      setTimeout(() => {
        console.log('执行任务3(异步))');
        resolve(3);
      }, 1000);
    });
  })
  .then((value) => {
    console.log('任务3的结果: ', value); // value=3
  });
```

#### 中断 promise 链

场景：假如我一个请求失败了，我之后的操作都不往下进行，你没有在 reject 中做任何处理，之后每个 then 都会调用成功（fulfilled）的回调

当使用 promise 的 then 链式调用时, 在中间中断, 不再调用后面的回调函数

办法: 在回调函数中返回一个 pending 状态的 promise 对象

```js
new Promise((resolve, reject) => {
  reject(1);
})
  .then(
    (value) => {
      console.log(value);
    },
    (reason) => {
      return new Promise(() => {}); // 返回一个pending的promise  中断promise链 之后then不会走
    },
  )
  .then(
    (value) => {
      console.log('value1', value);
    },
    (reason) => {
      return new Promise(() => {}); // 返回一个pending的promise  中断promise链 之后then不会走
    },
  );
```

#### 错误穿透

当使用 promise 的 then 链式调用时，可以在最后用 catch 指定一个失败的回调，前面任何操作出了错误，都会传到最后失败的回调中处理

<Alert message='如果不存在 then 的链式调用，就不需要考虑 then 的错误穿透了'></Alert>

```js
new Promise((resolve, reject) => {
  reject(1);
})
  .then(
    (value) => {
      console.log(value);
    },
    // 要是不写失败的回调函数，其实底层会自己加上这一段代码
    // reason => { throw reason }
  )
  .then(
    (value) => {
      console.log('value1', value);
    },
    // 要是不写失败的回调函数，其实底层会自己加上这一段代码
    // reason => { throw reason }
  )
  .catch((reason) => {
    console.log('失败了', reason);
  });
```

### Promise.prototype.then

方法: (onResolved, onRejected) => {}

onResolved 函数: 成功的回调函数 (value) => {}

onRejected 函数: 失败的回调函数 (reason) => {}

说明: 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调

返回一个新的 promise 对象

then 是实例状态发生改变时的回调函数，第一个参数是 resolved 状态的回调函数，第二个参数是 rejected 状态的回调函数

then 方法返回的是一个新的 Promise 实例，也就是 promise 能链式书写的原因

```js
new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功的回调');
    reject('失败的回调'); // 会面这个不会有效果，因为只会改变一次状态，为成功就不会走失败
  }, 1000);
})
  .then(() => {
    // 成功的
  })
  .catch(() => {
    // 失败
  });
```

### Promise.prototype.catch

方法: (onRejected) => {}

onRejected 函数: 失败的回调函数 (reason) => {}

catch()方法是.then(null, onRejected)或.then(undefined, onRejected)的语法糖，用于指定发生错误时的回调函数

```js
getJSON('/posts.json')
  .then(function (posts) {
    // ...
  })
  .catch(function (error) {
    // 处理 getJSON 和 前一个回调函数运行时发生的错误
    console.log('发生错误！', error);
  });
```

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止

```js
getJSON('/post/1.json')
  .then(function (post) {
    return getJSON(post.commentURL);
  })
  .then(function (comments) {
    // some code
  })
  .catch(function (error) {
    // 处理前面三个Promise产生的错误
  });
```

一般来说，使用 catch 方法代替 then()第二个参数

Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应

```js
const someAsyncThing = function () {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};
```

浏览器运行到这一行，会打印出错误提示 `ReferenceError: x is not defined`，但是不会退出进程

catch()方法之中，还能再抛出错误，通过后面 catch 方法捕获到

**catch 中的 return 值**

当在 catch 方法中使用 return 时，返回的值将成为 Promise 的解决（resolved）值。这意味着即使 catch 是因为错误而被调用的，catch 之后的链式调用仍然会按照成功的情况继续执行。

```js
new Promise((resolve, reject) => {
  reject(new Error('Something went wrong'));
})
  .catch((error) => {
    console.error('Error caught:', error.message); // 输出: Error caught: Something went wrong
    return 'Recovered value'; // 返回一个值
  })
  .then((value) => {
    console.log('This will be called with:', value);
    // 输出: This will be called with: Recovered value
  });
```

尽管 Promise 被拒绝了，但是 catch 方法中的 return 值使得链式调用继续往下执行，并将 return 的值传递给了下一个 .then 方法。

**错误处理与传播**

如果你希望在 catch 中处理错误后继续传播错误，可以显式地抛出错误或返回一个被拒绝的 Promise。

```js
new Promise((resolve, reject) => {
  reject(new Error('Something went wrong'));
})
  .catch((error) => {
    console.error('Error caught:', error.message); // 输出: Error caught: Something went wrong
    throw error; // 抛出错误
  })
  .catch((error) => {
    console.error('Error re-thrown:', error.message); // 输出: Error re-thrown: Something went wrong
  });
```

或者

```js
new Promise((resolve, reject) => {
  reject(new Error('Something went wrong'));
})
  .catch((error) => {
    console.error('Error caught:', error.message); // 输出: Error caught: Something went wrong
    return Promise.reject(error); // 返回一个被拒绝的 Promise
  })
  .catch((error) => {
    console.error('Error re-thrown:', error.message); // 输出: Error re-thrown: Something went wrong
  });
```

### Promist.prototype.finally

finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作

```js
promise
  .then(result => {···})
  .catch(error => {···})
  .finally(() => {···});
```

### Promise.resolve

方法: (value) => {}

value: 成功的数据或 promise 对象

说明: 用于快速返回一个状态为 fulfilled 或 rejected 的 Promise 实例对象

<Alert message='value 的值可能是非 promise 值或者为 Promise 值'></Alert>

```js
// 此时就想直接得到成功的值为100，不涉及到异步请求
// 这种写法在new Promise是为pending状态会瞬间为fulfilled状态
const p = new Promise((resolve, reject) => {
  resolve(100);
});
p.then(
  (value) => {
    console.log('成功了', value);
  },
  (reason) => {
    console.log('失败了', reason);
  },
);

// 这种写法不会有pending的状态，直接就是fulfilled的状态了
const p = Promise.resolve(100);
p.then(
  (value) => {
    console.log('成功了', value);
  },
  (reason) => {
    console.log('失败了', reason);
  },
);
```

<Alert message="Promise.resolve 可以接受非 promise 值，结果就为成功的返回值，若接受为 promise 值，则返回 promise 的成功或者失败的值"></Alert>

```js
const p0 = Promise.resolve(200);
const p = Promise.resolve(p0);
p.then(
  (value) => {
    console.log('成功了', value);
  }, // 输出成功了，200
  (reason) => {
    console.log('失败了', reason);
  },
);

const p0 = Promise.reject(-200);
const p = Promise.resolve(p0);
p.then(
  (value) => {
    console.log('成功了', value);
  },
  (reason) => {
    console.log('失败了', reason);
  }, // 输出失败了，-200
);
```

### Promise.reject

方法: (reason) => {}

reason: 失败的原因

说明: 用于快速返回一个状态必为 rejected 的 Promise 实例对象

```js
const p = Promise.reject(-100);
p.then(
  (value) => {
    console.log('成功了', value);
  },
  (reason) => {
    console.log('失败了', reason);
  }, // 输出失败了，-100
);
```

**<span style="color:red;">小坑</span>**

```js
// 这样意思就是输出为失败了，值为一个成功的promise值为100
const p0 = Promise.resolve(200);
const p = Promise.reject(p0);
p.then(
  (value) => {
    console.log('成功了', value);
  },
  (reason) => {
    console.log('失败了', reason);
  }, // 输出失败了，{<fulfilled>:100}
);
```

### Promise.all

方法: (promises) => {}

promises: 包含 n 个 promise 的数组

说明: 返回一个新的 promise, 只有所有的 promise 都成功才成功, 只要有一个失败了就直接失败

Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.all([p1, p2, p3]);
```

接受一个数组（迭代对象）作为参数，数组成员都应为 Promise 实例

实例 p 的状态由 p1、p2、p3 决定，分为两种：

- 只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数
- 只要 p1、p2、p3 之中有一个被 rejected，p 的状态就变成 rejected，此时第一个被 reject 的实例的返回值，会传递给 p 的回调函数

<Alert message="如果作为参数的 Promise 实例，自己定义了 catch 方法，那么它一旦被 rejected，并不会触发 Promise.all()的 catch 方法"></Alert>

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
  .then((result) => result)
  .catch((e) => e);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
  .then((result) => result)
  .catch((e) => e);

Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
// 输出["hello", Error: 报错了]
```

如果 p2 没有自己的 catch 方法，就会调用 Promise.all()的 catch 方法

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
}).then((result) => result);

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
}).then((result) => result);

Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((e) => console.log(e));
// Error: 报错了
```

### Promise.race

方法: (promises) => {}

promises: 包含 n 个 promise 的数组

说明: 返回一个新的 promise, 第一个完成的 promise 的结果状态就是最终的结果状态

Promise.race()方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.race([p1, p2, p3]);
```

只要 p1、p2、p3 之中有一个实例率先改变状态，p 的状态就跟着改变

率先改变的 Promise 实例的返回值则传递给 p 的回调函数

```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000);
  }),
]);

p.then(console.log).catch(console.error);
```

### Promise.allSettled

Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例

只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束

```js
const promises = [fetch('/api-1'), fetch('/api-2'), fetch('/api-3')];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

### Promise.withResolvers

ECMAScript 2024 新的版本带来的全新的特性，
一个新方法来创建一个 promise，直接返回 resolve 和 reject 的回调。使用 Promise.withResolvers ，我们可以创建直接在其执行函数之外 resolve 和 reject

```js
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => resolve('Resolved after 2 seconds'), 2000);

promise.then((value) => console.log(value));
```

<BackTop></BackTop>