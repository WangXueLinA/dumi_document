---
toc: content
order: -1
title: 云服务器搭建网站
---

# 如何搭建一个自己的网站

## 购买云服务器

以阿里云为例

<ImagePreview src="/images/web/image1.jpg"></ImagePreview>

## 重置服务器密码

<ImagePreview src="/images/web/image2.jpg"></ImagePreview>

## 远程连接到轻量应用服务器

<ImagePreview src="/images/web/image3.jpg"></ImagePreview>

如下图代表连接成功

<ImagePreview src="/images/web/image4.jpg"></ImagePreview>

## 查询宝塔面板登录地址、账号密码

执行宝塔查询命令：

```js
bt default
```

可以查询到当前宝塔面板的登录地址、账号和密码信息

<ImagePreview src="/images/web/image5.jpg"></ImagePreview>

## 防火墙开通宝塔面板所需端口号

点击实例 ID 进去

<ImagePreview src="/images/web/image6.jpg"></ImagePreview>

开通建站所需端口如下图

<ImagePreview src="/images/web/image7.jpg"></ImagePreview>

## 登录到宝塔面板管理后台

开通好端口号后，我们就可以在宝塔面板的登录地址中访问 http://120.27.198.199:8888 （这是我的外网地址），输入宝塔面板中的用户名 username 跟密码 password 进行登陆

按图中的一键安装即可

<ImagePreview src="/images/web/image8.jpg"></ImagePreview>

## 宝塔面板添加站点

这里我没有买域名，所有我的域名直接就写成我网站的地址

<ImagePreview src="/images/web/image9.jpg"></ImagePreview>

在浏览器中输入 http://120.27.198.199/ 发现站点创建成功

<ImagePreview src="/images/web/image10.jpg"></ImagePreview>

## 上传网站程序安装包到根目录

将 http 文件夹中内容删除，上传自己 build 打包好的项目后放置在 http 文件夹内

<ImagePreview src="/images/web/image11.jpg"></ImagePreview>

用导入成功后，再次查看网站，此时已经成功

<ImagePreview src="/images/web/image12.jpg"></ImagePreview>

<BackTop></BackTop>