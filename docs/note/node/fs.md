---
toc: content
title: fs
order: -97
---

# nodejs

## fs

## 文件读取

### fs.readFileSync 同步

参数如下：

1. 第一个参数为读取文件的路径或文件描述符
2. 第二个参数为 options，默认值为 null，其中有 encoding（编码，默认为 null）和 flag（标识位，默认为 r），也可直接传入 encoding
   结果为返回文件的内容

```js
const fs = require('fs');

let buf = fs.readFileSync('1.txt');
let data = fs.readFileSync('1.txt', 'utf8');

console.log(buf); // <Buffer 48 65 6c 6c 6f>
console.log(data); // Hello
```

### fs.readFile 异步

readFile 与 readFileSync 的前两个参数相同，最后一个参数为回调函数，函数内有两个参数 err（错误）和 data（数据），该方法没有返回值，回调函数在读取文件成功后执行

```js
const fs = require('fs');

fs.readFile('1.txt', 'utf8', (err, data) => {
  if (!err) {
    console.log(data); // Hello
  }
});
```

## 文件写入

### writeFileSync 同步

有三个参数：

1. 第一个参数为写入文件的路径或文件描述符
2. 第二个参数为写入的数据，类型为 String 或 Buffer
3. 第三个参数为 options，默认值为 null，其中有 encoding（编码，默认为 utf8）、 flag（标识位，默认为 w）和 mode（权限位，默认为 0o666），也可直接传入 encoding

```js
const fs = require('fs');

fs.writeFileSync('2.txt', 'Hello world');
let data = fs.readFileSync('2.txt', 'utf8');

console.log(data); // Hello world
```

### writeFile 异步

writeFile 与 writeFileSync 的前三个参数相同，最后一个参数为回调函数，函数内有一个参数 err（错误），回调函数在文件写入数据成功后执行

```js
const fs = require('fs');

fs.writeFile('2.txt', 'Hello world', (err) => {
  if (!err) {
    fs.readFile('2.txt', 'utf8', (err, data) => {
      console.log(data); // Hello world
    });
  }
});
```

## 文件追加写入

### appendFileSync 同步

参数如下：

1. 第一个参数为写入文件的路径或文件描述符
2. 第二个参数为写入的数据，类型为 String 或 Buffer
3. 第三个参数为 options，默认值为 null，其中有 encoding（编码，默认为 utf8）、 flag（标识位，默认为 a）和 mode（权限位，默认为 0o666），也可直接传入 encoding

```js
const fs = require('fs');

fs.appendFileSync('3.txt', ' world');
let data = fs.readFileSync('3.txt', 'utf8');
```

### appendFile 异步

写入方法 appendFile 与 appendFileSync 的前三个参数相同，最后一个参数为回调函数，函数内有一个参数 err（错误），回调函数在文件追加写入数据成功后执行

```js
const fs = require('fs');

fs.appendFile('3.txt', ' world', (err) => {
  if (!err) {
    fs.readFile('3.txt', 'utf8', (err, data) => {
      console.log(data); // Hello world
    });
  }
});
```

## 文件拷贝

### copyFileSync 同步

```js
const fs = require('fs');

fs.copyFileSync('3.txt', '4.txt');
let data = fs.readFileSync('4.txt', 'utf8');

console.log(data); // Hello world
```

### copyFile 异步

```js
const fs = require('fs');

fs.copyFile('3.txt', '4.txt', () => {
  fs.readFile('4.txt', 'utf8', (err, data) => {
    console.log(data); // Hello world
  });
});
```

## 创建目录

### mkdirSync 同步

参数为一个目录的路径，没有返回值，在创建目录的过程中，必须保证传入的路径前面的文件目录都存在，否则会抛出异常

```js
// 假设已经有了 a 文件夹和 a 下的 b 文件夹

fs.mkdirSync('a/b/c');
```

### mkdir 异步

```js
fs.mkdir('a/b/c', (err) => {
  if (!err) console.log('创建成功');
});
```

<BackTop></BackTop>