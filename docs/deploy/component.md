---
toc: content
title: 搭建业务组件库
---

# lerna + dumi2 + vite 多包管理

## 前言

随着公司前端项目越来越多，出现了很多可复用的业务组件和逻辑，为了提升开发效率和方便维护，避免每次都要在项目之间复制粘贴相同的逻辑，我们可以把可复用的组件和逻辑封装成 npm 包，通过 npm 包的形式来引入，但又由于是公司内部的业务，所以一般不希望发布到全球公共的[www.npmjs.com](https://www.npmjs.com) 仓库中，此时就需要搭建属于我们自己的私有 npm 仓库。

## 为什么要搭建业务组件库

1. 代码复用：通过将不同的功能模块或 UI 元素抽象为独立的组件，可以减少重复代码，提高代码的可重用性。比如，一个按钮、表单、列表等通用组件可以在多个页面和场景下复用。

2. 维护性和可扩展性：拆分后的组件具有更好的内聚性和低耦合度，使得各个组件职责单一，易于理解和维护。当需求变化时，只需要对相关组件进行修改，不会影响到整个应用的其他部分。

3. 团队协作与分工：在多人协作开发大型项目时，按照业务逻辑或界面功能拆分组件有助于团队成员分工合作，每个成员专注于自己负责的组件开发，提高工作效率。

4. 测试便利：小而独立的组件更容易编写单元测试，保证每个组件的功能正确无误，进而提升整个应用的质量和稳定性。

## 初始化 dumi

官网地址： https://d.umijs.org/

创建 myapp 目录

```js。
mkdir myapp && cd myapp
```

创建模版

```js
npx create-dumi

//  选择一个模板
 ? Pick template type › - Use arrow-keys. Return to submit.
    Static Site  // 用于构建网站
 ❯  React Library // 用于构建组件库，有组件例子
    Theme Package  // 主题包开发脚手架，用于开发主题包

// 选择依赖
? Pick NPM client › - Use arrow-keys. Return to submit.
    npm
    cnpm
    tnpm
❯   yarn
    pnpm

// 安装依赖后启动项目
 yarn start
```

显示如下图说明创建成功

<ImagePreview src="/images/component/image1.jpg"></ImagePreview>

## 介绍 lerna

Lerna 是一个用于管理具有多个包（packages）的 JavaScript 或 TypeScript 项目的工具，特别适合于那些将大型代码库拆分成多个独立版本化包的场景。

它有以下优势：

- 集中式代码管理：将所有相关包放在一个单一的仓库（monorepo）中，便于统一代码风格、规范，简化代码管理和版本控制，减少因分散在多个仓库而导致的维护难题。

- 依赖与调试效率提升：

  - 减少依赖冗余：由于所有包共享一个 node_modules 目录，避免了重复安装相同依赖造成的存储空间浪费。
  - 简化调试流程：通过内部链接（linking）机制，可以直接调试项目中的依赖包，无需通过 npm link 这样的外部命令，提高了开发效率。

- 版本控制自动化：

  - 支持批量更新和发布多个包的版本，减少手动管理版本带来的错误和工作量。
  - 支持不同模式下的版本管理，无论是所有包同步更新还是按需独立更新版本，都能灵活应对。

- 提高协作效率：

  - 单一仓库简化了团队成员间的协作流程，减少了跨仓库权限管理和代码审查的复杂度。
  - 有利于代码复用和共享，公共组件和逻辑可以更容易地在项目内各包之间共享。

## 初始化 lerna

全局安装 lerna 依赖

```js
npm i -g lerna
```

初始化 lerna 项目

```js
lerna init
```

执行完我们看到我们项目中多了 lerna.json 文件以及 packages 文件夹

Lerna 期望你的包都放在 packages/ 目录下。每个子目录被视为一个独立的 NPM 包，拥有自己的 package.json 文件。

<ImagePreview src="/images/component/image2.jpg"></ImagePreview>

## 初始化 vite

为了每个业务组件的代码风格以及文件结构类似，我们可以创建一个模版 template 组件，在执行自定义创建组件命令时，会基于 template 模版来进行创建

vite 官网： https://vitejs.cn/

搭建 Vite 项目

```js
// 创建template项目
npm create vite@latest template
```

选择一个框架

```js
? Select a framework: › - Use arrow-keys. Return to submit.
    Vanilla
    Vue
❯   React
    Preact
    Lit
    Svelte
    Solid
    Qwik
    Others


? Select a variant: › - Use arrow-keys. Return to submit.
❯   TypeScript
    TypeScript + SWC
    JavaScript
    JavaScript + SWC
```

此时我们看到我们的项目多出来 temmplate 文件夹，证明成功

<ImagePreview src="/images/component/image3.jpg"></ImagePreview>

## template 模版配置

为了执行自定义创建组件命令，我们可以在 template 文件夹中配置一些模版语法，执行命令时候，会根据配置的语法进行替换

<ImagePreview src="/images/component/image4.jpg"></ImagePreview>

## 编写定制化 create 脚本

我们的最终目的是执行 `npm run create` 命令，根据命令填写组件名称，组件描述，维护人等配置信息，然后生成以 template 模版为基础的业务组件。

我们可以在 package.json 中添加 ` "workspaces": ["packages/*"]` , scripts 添加`"create": "node scripts/create.js"`命令去执行 sripts/create.js 脚本

## 执行 npm run create

说明模版组件生成成功

<ImagePreview src="/images/component/image5.jpg"></ImagePreview>

## 注册 npm 账号

代码 push 到远程后，我们想要发布到 npm 仓库，就必须要有一个账号，去[npm](https://www.npmjs.com/)官网注册一个账号，注意记住用户名、密码和邮箱，发布的时候可能会用到。

## 设置 npm 源

本地的 npm 镜像源采用的是淘宝镜像源或者其它的，如果想要发布 npm 包，我们得把 npm 源切换为官方得源，命令如下：

```js
npm config set registry=https://registry.npmjs.org

```

我们可以安装 nrm 命令行工具，可以看到我们本地的各种本地镜像源

```js
npm install -g nrm
```

执行命令

```js
nrm ls
```

就可以看到我们本地的各种命令的镜像源

```js
* npm ---------- https://registry.npmjs.org/
  yarn --------- https://registry.yarnpkg.com/
  tencent ------ https://mirrors.cloud.tencent.com/npm/
  cnpm --------- https://r.cnpmjs.org/
  taobao ------- https://registry.npmmirror.com/
  npmMirror ---- https://skimdb.npmjs.com/registry/
```

## 添加 npm 用户

打开我们的要上传的目录文件，添加 npm 用户，执行命令：

```js
npm adduser
```

这里会让你填写用户名等等，如果之前设置过即可跳过此步。这里的密码是隐藏的，你输入时候他就显示空白，你输入密码正确就行，然后回车

<ImagePreview src="/images/component/image6.jpg"></ImagePreview>

## 添加 npm 中组织

因为我们创建的组件是私有的，是带前缀`@`符的，所以需要先在 npm 中添加组织，否则会报错，或者添加不进去。这个`@`私包使您可以创建与其他用户或组织创建的包同名的包，而不会发生冲突。因为我们组件为`@xuelin`，所以我们需要在 npm 官网的组织中添加`xuelin`。

<ImagePreview src="/images/component/image7.jpg"></ImagePreview>

<ImagePreview src="/images/component/image8.jpg"></ImagePreview>

## 发布 npm 包

执行你脚本的发布命令

<ImagePreview src="/images/component/image9.jpg"></ImagePreview>

然后就可以在 npm 网中可以看到你的包发布成功了

<ImagePreview src="/images/component/image10.jpg"></ImagePreview>

<BackTop></BackTop>
