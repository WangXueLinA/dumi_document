---
toc: content
title: npm/yarn
order: -99
---

# nodejs

## npm

```js
npm init // 初始化一个新的npm项目，创建package.json文件
npm install // 安装一个包或一组包，并且会在当前目录存放一个node_modules。
npm install <package-name> // 安装指定的包
npm install <package-name> –g  // 全局安装指定的包
npm update <package-name> // 更新指定的包。
npm uninstall <package-name> //卸载指定的包。
npm list -g  // 不加-g，列举当前目录下的安装包
npm publish // 发布自己开发的包到 npm 库中
npm info <package-name> // 某包详细信息
npm info <package-name> version // 获取某包最新版本
npm install <package-name>@1.0.1  // 安装某包指定版本
npm outdated   // 列出当前项目中需要更新的包
npm link // 将本地模块链接到全局的 node_modules 目录下

"dependencies": { "md5": "^2.1.0" }  // ^ 表示 如果 直接npm install 将会安装md5  2.*.* 最新版本

"dependencies": { "md5": "~2.1.0" }  // ~ 表示 如果 直接npm install 将会 安装md5 2.1.*  最新版本

"dependencies": { "md5": "*" }  //* 表示 如果 直接npm install 将会 安装 md5  最新版本
```

## yarn

```js
npm install -g yarn
```

对比 npm:
速度超快: Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
超级安全: 在执行代码之前，Yarn 会通过算法校验每个安装包的完整性。

```js

yarn init //开始新项目

yarn add [package] // 添加依赖包
yarn add [package]@[version]
yarn add [package] --dev

yarn upgrade [package]@[version] // 升级依赖包

yarn remove [package] // 移除依赖包

yarn install // 安装项目的全部依赖
```

## Npm install 原理

在执行 npm install 的时候发生了什么？

### 检查依赖配置文件

读取 package.json：这是项目的依赖清单，包含 dependencies（生产依赖）和 devDependencies（开发依赖）。例如：

```json
{
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "eslint": "~8.20.0"
  }
}
// ^18.2.0 表示允许安装 18.x.x（但大版本号不变）。
// ~8.20.0 表示允许安装 8.20.x（仅更新小版本）。
```

检查 package-lock.json

如果存在这个文件，npm 会优先按照它记录的精确版本和依赖树结构安装，确保每次安装结果一致。如果没有，则根据 package.json 解析版本

### 解析依赖关系

1. 构建依赖树：

npm 会分析所有直接依赖（如 react）和它们的子依赖（如 react 依赖的 loose-envify），形成一个完整的依赖树。

2. 处理版本冲突：

如果多个依赖需要不同版本的同一个包（如 A 需要 lodash@4.0.0，B 需要 lodash@5.0.0），npm 会尝试通过以下方式解决：

- 扁平化（Dedupe）：将某个版本提升到 node_modules 顶层（如 lodash@4.0.0）。
- 嵌套安装：将冲突版本安装在子依赖的 node_modules 中（如 B/node_modules/lodash@5.0.0）。

### 下载依赖包

检查本地缓存：
npm 会先检查本地缓存（通常在 ~/.npm 目录）。如果缓存中存在所需版本，直接复制到 node_modules，无需下载。

从 Registry 下载：
如果缓存中没有，则从 npm 官方源（或配置的镜像源）下载包的压缩文件（.tgz），并存入缓存。

### 解压并组织 node_modules

生成 node_modules 目录：

所有依赖会被解压到项目的 node_modules 目录。结构示例：

```bash
node_modules/
  react/            # 顶层依赖（扁平化）
  eslint/           # 开发依赖（默认不扁平化？）
  loose-envify/     # react 的子依赖
  some-pkg/
    node_modules/   # 可能存在嵌套的冲突依赖
      lodash@5.0.0/
```

扁平化原则：npm 会尽量将相同版本的依赖提升到顶层，减少重复（但不同版本可能嵌套）。

### 更新锁定文件

生成/更新 package-lock.json：

无论是否已有锁定文件，npm 都会根据实际安装的版本更新 package-lock.json，记录所有依赖的精确版本和依赖树结构。

这确保了团队协作或重新安装时，依赖版本完全一致。

### 执行生命周期脚本

运行预定义的脚本：

某些包在安装后需要执行额外操作（如编译原生代码）。npm 会按顺序触发以下脚本（如果包中定义了它们）：

- preinstall → 安装前执行。
- install → 安装时执行。
- postinstall → 安装后执行（常见于需要编译的包，如 node-sass）。

### 总结

- 确定性安装：通过 package-lock.json 锁定版本，确保不同环境安装结果一致。
- 缓存优化：优先使用本地缓存，减少网络下载时间。
- 扁平化依赖树：减少重复依赖，但版本冲突时会有嵌套。
- 安全性：安装时会验证包的完整性（通过 integrity 字段校验哈希值）。

### 示例流程

假设执行 npm install react：

1. 检查 package.json，发现需要 react@^18.2.0。
2. 查看 package-lock.json，确认具体版本（如 18.2.0）。
3. 从缓存或网络下载 react@18.2.0 及其子依赖。
4. 将 react 和可共享的子依赖提升到 node_modules 顶层。
5. 更新 package-lock.json，记录所有依赖的精确版本。
6. 如果有 postinstall 脚本（如构建原生代码），执行它。

## Npm run 原理

### 读取 package.json

目的：找到你想运行的脚本（比如 npm run start 中的 start）。

过程：

- npm 会先检查当前目录下的 package.json 文件。
- 在 package.json 的 scripts 字段中查找对应的脚本名称（例如 `"start": "node app.js"`）。

### 设置环境变量

目的：让脚本能访问正确的工具和配置。

过程：

- npm 会临时将 `node_modules/.bin` 目录添加到系统的 PATH 环境变量中。
- 这意味着你可以在脚本中直接使用本地安装的工具（比如 webpack、babel），而无需全局安装。
- 同时会设置一些特殊环境变量（例如 npm_lifecycle_event 表示当前运行的脚本名称）。

### 执行生命周期钩子

目的：自动运行关联的预处理或后处理脚本。

过程：

- 如果你运行的是 npm run start，npm 会先检查是否有 prestart 脚本，如果有，先执行 prestart。

- 然后执行 start。

- 最后检查是否有 poststart 脚本，如果有，再执行 poststart。

例如：

```json
"scripts": {
  "prestart": "echo '准备启动...'",
  "start": "node app.js",
  "poststart": "echo '启动完成！'"
}
```

### 创建子 Shell 执行命令

目的：隔离脚本执行环境，避免影响当前终端。

过程：

- npm 会启动一个新的子 Shell（比如 Bash 或 CMD）。
- 在这个子 Shell 中执行脚本定义的命令（例如 node app.js）。
- 子 Shell 的环境变量包含了 `node_modules/.bin`，所以可以直接运行本地工具。

### 传递参数

目的：允许向脚本动态传递参数。

例如：运行 `npm run test -- --watch`，`--watch` 会传递给 test 脚本。

原理：`--`后的内容会被 npm 截取并附加到脚本命令的末尾。比如 `"test": "jest"` 会变成 `jest --watch`。

### 错误处理

成功：脚本正常执行后，子 Shell 退出，控制权返回给终端。

失败：如果脚本中某条命令出错（比如非零退出码），npm 会终止后续命令，并打印错误信息。

<BackTop></BackTop>