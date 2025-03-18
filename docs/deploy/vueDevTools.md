---
toc: content
title: vue-devtools定位vue组件
---

# vue-devtools 定位 vue 组件

🔍 打开你自己（或者你同事）开发的页面，却短时间难以找到对应的源文件？

<ImagePreview src="/images/vue2/image12.jpg"></ImagePreview>

mac 电脑在 VSCode command + shift + p，Windows 则是 ctrl + shift + p。然后输入 shell，选择安装 code。

<ImagePreview src="/images/vue2/image13.jpg"></ImagePreview>

## 原理

利用 nodejs 中的 child_process，执行了类似 code path/to/file 命令，于是对应编辑器就打开了相应的文件，

<BackTop></BackTop>