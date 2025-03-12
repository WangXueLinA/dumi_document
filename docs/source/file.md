---
toc: content
title: 文件上传
---

# 文件上传

项目源码：https://github.com/WangXueLinA/file-upload

## 核心点

### File

在前端通过 `<input type="file">` 或拖放操作获取的 file 对象是 浏览器原生提供的 File 对象，它继承自 Blob 对象。

#### File 对象的结构

| 属性         | 类型   | 说明                                                   |
| ------------ | ------ | ------------------------------------------------------ |
| name         | string | 文件名（如 "example.jpg"）                             |
| size         | number | 文件大小（单位：字节）                                 |
| type         | string | MIME 类型（如 "image/jpeg"），若无法识别则返回空字符串 |
| lastModified | number | 文件最后修改时间的时间戳（毫秒）                       |

```js
File {
  name: "photo.jpg",
  size: 102400,      // 100 KB
  type: "image/jpeg",
  lastModified: 1625123456789,
  // 继承自 Blob 的方法（如 slice()）
}
```

File 对象的本质，继承自 Blob：File 对象是 Blob 的子类，拥有 Blob 的所有能力（如 slice() 分片）。

二进制数据容器：文件内容以二进制形式存储，可通过 FileReader 或 Blob 方法读取。

#### 获取 File 对象

通过 `<input type="file">` 获取

```html
<input type="file" id="fileInput" />

<script>
  document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0]; // File 对象
    console.log(file);
  });
</script>
```

#### 使用 FileReader 读取为不同格式

```js
const file = document.querySelector('input[type=file]').files[0];
const reader = new FileReader();

// 读取为 Data URL（适合预览）
reader.readAsDataURL(file);
reader.onload = () => {
  console.log(reader.result); // "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
};

// 读取为文本（适合文本文件）
reader.readAsText(file);
reader.onload = () => {
  console.log(reader.result); // 文本内容
};

// 读取为 ArrayBuffer（适合处理二进制）
reader.readAsArrayBuffer(file);
reader.onload = () => {
  const buffer = reader.result;
  // 处理二进制数据...
};
```

#### 使用 URL.createObjectURL() 生成临时 URL（适合预览）

```js
const url = URL.createObjectURL(file);
imgElement.src = url; // 直接用于图片/视频预览
// 使用后记得释放内存
URL.revokeObjectURL(url);
```

### new FormData

使用 new FormData() 来上传文件的核心原因是为了 正确处理 multipart/form-data 格式的 HTTP 请求，

传统表单的局限性：

如果直接用普通的 HTML `<form>` 上传文件，虽然可以通过 `<input type="file">` 选择文件并提交，但这种方式会 导致页面刷新，无法实现异步上传（AJAX）。

如果不使用 FormData，需要手动拼接请求体：

```javascript
const boundary = '----WebKitFormBoundaryABC123';
const body = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="file"; filename="example.jpg"',
  'Content-Type: image/jpeg',
  '',
  fileBinaryData,
  `--${boundary}--`,
].join('\r\n');

fetch('/upload', {
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
  },
  body,
});
```

FormData 的作用可以自动构造 multipart/form-data 格式

FormData 是浏览器原生提供的 API，专门用于构建符合 multipart/form-data 编码格式的数据。
它会自动生成正确的 请求头（如 Content-Type: multipart/form-data; boundary=...）和 请求体（将文件和其他表单字段分割为多个部分）。

```js
const formData = new FormData();
formData.append('file', fileInput.files[0]); // 添加文件
formData.append('userId', '123'); // 添加普通字段
```

## 单文件上传

<video width="500" height="350" controls>
    <source src="/mp4/single-file.mp4" type="video/mp4">
</video>

### 前端代码

```html
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <title>单文件上传示例</title>
    <!-- 引入axios库，用于发送HTTP请求 -->
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
  </head>
  <body>
    <h3>单文件上传示例</h3>
    <input id="uploadFile" type="file" accept="image/*" />
    <button id="submit" onclick="uploadFile()">上传文件</button>
    <script>
      const uploadFileEle = document.querySelector('#uploadFile');

      // 创建一个axios实例，用于发送HTTP请求
      const request = axios.create({
        baseURL: 'http://localhost:3000/upload', // 设置基础URL
        timeout: 60000,
      });

      // 上传文件的异步函数
      async function uploadFile() {
        // 如果没有选择文件，则返回
        if (!uploadFileEle.files.length) return;
        // 获取第一个选择的文件
        const file = uploadFileEle.files[0];
        // 调用upload函数上传文件
        upload({
          url: '/single', // 上传的URL路径
          file, // 要上传的文件
        });
      }

      // 上传文件的函数
      function upload({ url, file, fieldName = 'file' }) {
        let formData = new FormData(); // 创建一个FormData对象
        formData.set(fieldName, file); // 将文件添加到FormData对象中
        request.post(url, formData, {
          // 监听上传进度
          onUploadProgress: function (progressEvent) {
            // 计算上传的百分比
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            // 打印上传进度
            console.log(percentCompleted);
          },
        });
      }
    </script>
  </body>
</html>
```

### 后端代码

```js
const path = require('path'); // 引入Node.js的path模块，用于处理和转换文件路径。
const Koa = require('koa'); // 引入Koa框架，用于创建服务器应用。
const cors = require('@koa/cors'); // 引入koa-cors中间件，用于处理跨域请求。
const serve = require('koa-static'); // 引入koa-static中间件，用于提供静态文件服务。
const multer = require('@koa/multer'); // 引入koa-multer中间件，用于处理文件上传。
const Router = require('@koa/router'); // 引入koa-router，用于处理路由。

const app = new Koa(); // 创建一个Koa应用实例。
const router = new Router(); // 创建一个Router实例。
const PORT = 3000; // 定义服务器监听的端口号。
const RESOURCE_URL = `http://localhost:${PORT}`; // 定义资源URL的基础路径。
const UPLOAD_DIR = path.join(__dirname, '/public/upload'); // 定义文件上传的存储目录。

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // 设置文件的存储目录
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 设置文件名
    cb(null, `${file.originalname}`);
  },
});

const multerUpload = multer({ storage }); // 使用定义的存储配置创建一个multer实例。

router.get('/', async (ctx) => {
  // 定义根路径的GET请求处理函数
  ctx.body = '文件上传服务';
});

router.post(
  '/upload/single',
  async (ctx, next) => {
    try {
      await next(); // 等待文件上传完成
      ctx.body = {
        code: 1,
        msg: '文件上传成功',
        url: `${RESOURCE_URL}/${ctx.file.originalname}`, // 返回文件的访问URL
      };
    } catch (error) {
      console.dir(error); // 输出错误信息
      ctx.body = {
        code: 0,
        msg: '文件上传失败',
      };
    }
  },
  multerUpload.single('file'), // 使用multer处理单文件上传，文件字段名为“file”
);

// 注册中间件
app.use(cors()); // 允许跨域请求
app.use(serve(UPLOAD_DIR)); // 提供静态文件服务
app.use(router.routes()).use(router.allowedMethods()); // 使用路由和允许的方法

app.listen(PORT, () => {
  // 启动服务器并监听指定端口
  console.log(`应用已经启动：http://localhost:${PORT}/`);
});
```

## 多文件上传

<video width="500" height="350" controls>
    <source src="/mp4/mul-file.mp4" type="video/mp4">
</video>

### 前端代码

```html
<!DOCTYPE html>
<html lang="zh-cn">
  <head>
    <meta charset="UTF-8" />
    <title>多文件上传示例</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
  </head>
  <body>
    <h3>多文件上传示例</h3>
    <input id="uploadFile" type="file" accept="image/*" multiple />
    <button id="submit" onclick="uploadFile()">上传文件</button>
    <script>
      const uploadFileEle = document.querySelector('#uploadFile');

      const request = axios.create({
        baseURL: 'http://localhost:3000/upload',
        timeout: 60000,
      });

      async function uploadFile() {
        if (!uploadFileEle.files.length) return;
        // <!-- 如果没有选择文件，则返回 -->
        const files = Array.from(uploadFileEle.files);
        // <!-- 将选择的文件转换为数组 -->
        upload({
          url: '/multiple',
          files,
        });
      }

      function upload({ url, files, fieldName = 'file' }) {
        let formData = new FormData();
        // <!-- 创建一个FormData对象 -->
        files.forEach((file) => {
          formData.append(fieldName, file);
          // <!-- 将每个文件添加到FormData对象中 -->
        });
        request.post(url, formData, {
          // 监听上传进度
          onUploadProgress: function (progressEvent) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            console.log(percentCompleted);
          },
        });
      }
    </script>
  </body>
</html>
```

### 后端代码

```js
const path = require('path'); // 引入Node.js的path模块，用于处理和转换文件路径。
const Koa = require('koa'); // 引入Koa框架，用于创建服务器应用。
const cors = require('@koa/cors'); // 引入koa-cors中间件，用于处理跨域请求。
const serve = require('koa-static'); // 引入koa-static中间件，用于提供静态文件服务。
const multer = require('@koa/multer'); // 引入koa-multer中间件，用于处理文件上传。
const Router = require('@koa/router'); // 引入koa-router，用于处理路由。

const app = new Koa(); // 创建一个Koa应用实例。

const router = new Router(); // 创建一个Router实例。

const PORT = 3000; // 定义服务器监听的端口号。

const RESOURCE_URL = `http://localhost:${PORT}`; // 定义资源URL的基础路径。

const UPLOAD_DIR = path.join(__dirname, '/public/upload'); // 定义文件上传的存储目录。

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    // 设置文件的存储目录
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 设置文件名
    cb(null, `${file.originalname}`);
  },
});

const multerUpload = multer({ storage });
// 使用定义的存储配置创建一个multer实例。

router.get('/', async (ctx) => {
  // 定义根路径的GET请求处理函数
  ctx.body = '文件上传服务';
});

router.post(
  '/upload/multiple',
  async (ctx, next) => {
    try {
      await next(); // 等待文件上传完成
      urls = ctx.files.file.map(
        (file) => `${RESOURCE_URL}/${file.originalname}`,
      );
      ctx.body = {
        code: 1,
        msg: '文件上传成功',
        urls, // 返回文件的访问URL列表
      };
    } catch (error) {
      ctx.body = {
        code: 0,
        msg: '文件上传失败',
      };
    }
  },
  multerUpload.fields([
    {
      name: 'file',
    },
  ]),
  // 使用multer处理多文件上传，文件字段名为“file”
);

// 注册中间件
app.use(cors());
// 允许跨域请求

// 提供静态文件服务
app.use(serve(UPLOAD_DIR));

// 使用路由和允许的方法
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
  // 启动服务器并监听指定端口
  console.log(`应用已经启动：http://localhost:${PORT}/`);
});
```

## 大文件上传

### 前端功能流程图解

文件选择：用户通过`<input type="file">`选择文件

MD5 计算：

- 将文件分块读取（2MB/块）
- 使用 SparkMD5 逐块计算哈希值
- 最终合并生成完整文件 MD5

秒传检查：

- 发送文件 MD5 和文件名到服务端
- 服务端返回已存在的分块 ID 列表

分块上传：

- 根据配置的块大小（1MB）切割文件
- 使用 asyncPool 控制并发（最大 3 个并行请求）
- 跳过已上传的分块（通过 chunkIds 判断）

合并请求：所有分块上传完成后，请求服务端合并文件

进度提示：

- 秒传情况直接提示完成
- 分块上传完成后提示合并结果

### 前端代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>大文件并发上传示例</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
    <!-- MD5计算库 -->
    <script src="https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.0/spark-md5.min.js"></script>
  </head>
  <body>
    <h3>大文件并发上传示例</h3>
    <input type="file" id="uploadFile" />
    <button id="submit" onclick="uploadFile()">上传文件</button>

    <script>
      // 获取DOM元素
      const uploadFileEle = document.querySelector('#uploadFile');

      // 创建axios实例配置
      const request = axios.create({
        baseURL: 'http://localhost:3000/upload', // 后端接口基础地址
        timeout: 10000, // 请求超时时间
      });

      /**
       * 计算文件的MD5哈希值（用于文件唯一标识）
       * @param {File} file - 需要计算的文件对象
       * @returns {Promise<string>} MD5哈希值的Promise
       */
      function calcFileMD5(file) {
        return new Promise((resolve, reject) => {
          // 分块配置
          const chunkSize = 2097152; // 2MB/块
          const chunks = Math.ceil(file.size / chunkSize); // 计算总分块数
          let currentChunk = 0; // 当前处理的分块索引

          // 初始化MD5计算器
          const spark = new SparkMD5.ArrayBuffer();
          const fileReader = new FileReader(); // 用于读取文件内容

          // 文件读取成功回调
          fileReader.onload = (e) => {
            spark.append(e.target.result); // 将分块数据加入MD5计算
            currentChunk++;

            if (currentChunk < chunks) {
              loadNext(); // 继续读取下一分块
            } else {
              resolve(spark.end()); // 所有分块处理完成，返回最终MD5
            }
          };

          // 错误处理
          fileReader.onerror = (e) => {
            reject(fileReader.error);
            reader.abort();
          };

          // 加载下一个分块
          function loadNext() {
            const start = currentChunk * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            fileReader.readAsArrayBuffer(file.slice(start, end));
          }

          loadNext(); // 开始处理第一个分块
        });
      }

      /**
       * 检查文件是否已存在服务器
       * @param {string} url - 检查接口地址
       * @param {string} name - 文件名
       * @param {string} md5 - 文件MD5
       * @returns {Promise<Object>} 包含文件状态信息的Promise
       */
      function checkFileExist(url, name, md5) {
        return request
          .get(url, {
            params: { name, md5 }, // 查询参数
          })
          .then((response) => response.data);
      }

      /**
       * 异步任务并发控制器
       * @param {number} poolLimit - 最大并发数
       * @param {Array} array - 任务数组
       * @param {Function} iteratorFn - 迭代处理函数
       * @returns {Promise<Array>} 所有任务完成的Promise
       */
      async function asyncPool(poolLimit, array, iteratorFn) {
        const ret = []; // 存储所有任务的Promise
        const executing = []; // 存储正在执行的任务

        for (const item of array) {
          // 创建任务Promise
          const p = Promise.resolve().then(() => iteratorFn(item, array));
          ret.push(p);

          // 并发控制逻辑
          if (poolLimit <= array.length) {
            // 任务完成后从执行队列移除
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);

            // 当执行队列满时，等待任意任务完成
            if (executing.length >= poolLimit) {
              await Promise.race(executing);
            }
          }
        }
        return Promise.all(ret); // 等待所有任务完成
      }

      /**
       * 主上传函数
       */
      async function uploadFile() {
        if (!uploadFileEle.files.length) return;

        // 获取文件对象
        const file = uploadFileEle.files[0];

        // 计算文件MD5
        const fileMd5 = await calcFileMD5(file);

        // 检查文件状态
        const fileStatus = await checkFileExist('/exists', file.name, fileMd5);

        if (fileStatus.data?.isExists) {
          alert('文件已上传[秒传]');
          return;
        }

        // 执行分块上传
        await upload({
          url: '/single',
          file, // 文件对象
          fileMd5, // 文件指纹
          fileSize: file.size, // 文件大小
          chunkSize: 1048576, // 1MB/块
          chunkIds: fileStatus.data.chunkIds, // 已上传的分块ID
          poolLimit: 3, // 最大并发数
        });

        // 合并分块
        await concatFiles('/concatFiles', file.name, fileMd5);
      }

      /**
       * 分块上传控制器
       * @param {Object} config - 上传配置
       */
      function upload(config) {
        // 计算总分块数
        const chunks = Math.ceil(config.fileSize / config.chunkSize);

        // 创建分块索引数组（如10个分块生成[0,1,2...9]）
        const chunkIndexes = [...new Array(chunks).keys()];

        // 使用异步池控制并发
        return asyncPool(config.poolLimit, chunkIndexes, (i) => {
          // 跳过已上传分块
          if (config.chunkIds.includes(i.toString())) {
            return Promise.resolve();
          }

          // 计算分块范围
          const start = i * config.chunkSize;
          const end = Math.min(start + config.chunkSize, config.fileSize);

          // 获取分块数据
          const chunk = config.file.slice(start, end);

          // 上传单个分块
          return uploadChunk({
            url: config.url,
            chunk,
            chunkIndex: i,
            fileMd5: config.fileMd5,
            fileName: config.file.name,
          });
        });
      }

      /**
       * 单个分块上传
       */
      function uploadChunk(params) {
        const formData = new FormData();
        // 构造表单数据
        formData.append(
          'file',
          params.chunk,
          `${params.fileMd5}-${params.chunkIndex}`,
        ); // 第三个参数指定文件名
        formData.append('name', params.fileName);
        formData.append('timestamp', Date.now()); // 添加时间戳

        return request.post(params.url, formData); // 发送POST请求
      }

      /**
       * 请求合并文件分块
       */
      function concatFiles(url, name, md5) {
        return request.get(url, {
          params: { name, md5 },
        });
      }
    </script>
  </body>
</html>
```

### 后端功能流程详解

1. 初始化阶段

- 创建临时目录和上传目录（首次运行时自动创建）
- 配置 multer 存储引擎实现分块存储
- 设置跨域支持和静态文件服务

2. 前端上传流程

- 前端先发送/upload/exists 请求，检查文件是否已存在
- 如果不存在，获取已上传的分块列表
- 前端根据返回的分块列表，上传缺失的分块到/upload/single
- 全部分块上传完成后，请求/upload/concatFiles 进行合并

3. 分块存储逻辑

- 文件名格式：`${fileMd5}-${chunkIndex}（如：abc123-1）`
- 根据 fileMd5 创建临时目录存储分块
- 分块按纯数字命名（便于合并时排序）

4. 文件合并逻辑

- 按数字顺序读取所有分块
- 使用流式写入确保大文件合并性能
- 合并完成后自动清理分块文件

5. 安全与容错

- 忽略系统临时文件（.DS_Store）
- 使用 Promise 进行异步流程控制
- 自动创建不存在的目录结构

### 后端代码

```js
// 引入核心模块
const fs = require('fs');
const path = require('path');
const util = require('util');
const Koa = require('koa'); // Koa框架
const cors = require('@koa/cors'); // 跨域支持
const multer = require('@koa/multer'); // 文件上传处理
const Router = require('@koa/router'); // 路由管理
const serve = require('koa-static'); // 静态文件服务
const fse = require('fs-extra'); // 增强的文件系统操作
const readdir = util.promisify(fs.readdir); // 将回调方法转为Promise
const unlink = util.promisify(fs.unlink);

// 初始化Koa应用和路由
const app = new Koa();
const router = new Router();

// 目录配置
const TMP_DIR = path.join(__dirname, 'tmp'); // 分块临时存储目录
const UPLOAD_DIR = path.join(__dirname, '/public/upload'); // 最终文件存储目录
const IGNORES = ['.DS_Store']; // 需要忽略的临时文件

/* 第一步：配置Multer存储引擎 */
const storage = multer.diskStorage({
  // 自定义存储路径：根据文件MD5创建临时目录
  destination: async function (req, file, cb) {
    let fileMd5 = file.originalname.split('-')[0]; // 从文件名提取MD5
    const fileDir = path.join(TMP_DIR, fileMd5);
    await fse.ensureDir(fileDir); // 确保目录存在
    cb(null, fileDir);
  },
  // 自定义文件名：使用分块索引作为文件名
  filename: function (req, file, cb) {
    let chunkIndex = file.originalname.split('-')[1];
    cb(null, `${chunkIndex}`); // 存储为纯数字文件名
  },
});

const multerUpload = multer({ storage });

/* 第二步：定义路由处理逻辑 */

// 根路由：基础测试接口
router.get('/', async (ctx) => {
  ctx.body = '大文件并发上传';
});

// 文件存在性检查接口
router.get('/upload/exists', async (ctx) => {
  const { name: fileName, md5: fileMd5 } = ctx.query;

  // 检查完整文件是否已存在
  const filePath = path.join(UPLOAD_DIR, fileName);
  const isExists = await fse.pathExists(filePath);

  if (isExists) {
    // 已存在时直接返回文件URL
    ctx.body = {
      status: 'success',
      data: {
        isExists: true,
        url: `http://localhost:3000/${fileName}`,
      },
    };
  } else {
    // 不存在时检查已上传的分块
    let chunkIds = [];
    const chunksPath = path.join(TMP_DIR, fileMd5);
    const hasChunksPath = await fse.pathExists(chunksPath);

    if (hasChunksPath) {
      let files = await readdir(chunksPath);
      chunkIds = files.filter((file) => !IGNORES.includes(file));
    }

    ctx.body = {
      status: 'success',
      data: {
        isExists: false,
        chunkIds, // 返回已上传的分块编号列表
      },
    };
  }
});

// 分块上传接口（单文件）
router.post(
  '/upload/single',
  multerUpload.single('file'), // 使用multer处理文件上传
  async (ctx) => {
    ctx.body = {
      code: 1,
      data: ctx.file, // 返回上传文件信息
    };
  },
);

// 文件合并接口
router.get('/upload/concatFiles', async (ctx) => {
  const { name: fileName, md5: fileMd5 } = ctx.query;

  // 执行分块合并操作
  await concatFiles(
    path.join(TMP_DIR, fileMd5), // 分块目录
    path.join(UPLOAD_DIR, fileName), // 目标文件路径
  );

  ctx.body = {
    status: 'success',
    data: {
      url: `http://localhost:3000/${fileName}`, // 返回完整文件访问URL
    },
  };
});

/* 第三步：分块合并函数 */
async function concatFiles(sourceDir, targetPath) {
  const readFile = (file, ws) =>
    new Promise((resolve, reject) => {
      // 创建可读流并写入目标文件
      fs.createReadStream(file)
        .on('data', (data) => ws.write(data)) // 分块写入
        .on('end', resolve) // 当前分块写入完成
        .on('error', reject);
    });

  // 获取所有分块文件并排序
  const files = await readdir(sourceDir);
  const sortedFiles = files
    .filter((file) => !IGNORES.includes(file))
    .sort((a, b) => a - b); // 按数字顺序排序

  // 创建可写流
  const writeStream = fs.createWriteStream(targetPath);

  // 按顺序合并所有分块
  for (const file of sortedFiles) {
    const filePath = path.join(sourceDir, file);
    await readFile(filePath, writeStream); // 写入当前分块
    await unlink(filePath); // 删除已合并分块
  }

  writeStream.end(); // 关闭流
}

/* 第四步：注册中间件 */
app.use(cors()); // 跨域支持
app.use(serve(UPLOAD_DIR)); // 静态文件托管
app.use(router.routes()).use(router.allowedMethods()); // 路由注册

// 启动服务
app.listen(3000, () => {
  console.log('app starting at port 3000');
});
```
