---
title: 微信小程序开发
toc: content
---

# uni-app

## 开发前的准备

### 下载 hbuilder 编辑器

https://www.dcloud.io/hbuilderx.html

### 下载微信开发者工具

https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 申请微信小程序

微信公众平台：https://mp.weixin.qq.com/

进入微信公众平台-> 点击立即注册-> 点击小程序-> 点击前往注册

注册好后,扫码登陆平台,页面向下滚动,找到左边的开发,选择开发管理,右边页面选择开发设置,这里会有一个 AppID,作为绑定开发者工具用(注意不要暴露,使用在后文)

<ImagePreview src="/images/uniapp/image1.jpg"></ImagePreview>

## 新建项目

打开 hbuilder 编辑器选择 文件 -> 新建 -> 项目

<ImagePreview src="/images/uniapp/image2.jpg"></ImagePreview>

这里 uniapp 会提供很多初始化模板,可根据需求选择,此文以默认模板作为演示

- 填写项目名称
- 选择项目存放的路径
- vue 版本选择（此文以通俗易懂的 2.0 作为演示,3.0 大同小异）
- 默认不启用 uniCloud 和 git
- 点击创建

<ImagePreview src="/images/uniapp/image3.jpg"></ImagePreview>

### 试运行

可能会出现没有配置微信开发工具情况,此时需要配置微信开发者工具路径

<ImagePreview src="/images/uniapp/image4.jpg"></ImagePreview>

点击浏览 选择刚才安装微信开发者工具安装路径

<ImagePreview src="/images/uniapp/image5.jpg"></ImagePreview>

### 配置微信开发者工具

设置 -> 安全设置 -> 开启服务端口

<ImagePreview src="/images/uniapp/image6.jpg"></ImagePreview>
<ImagePreview src="/images/uniapp/image7.jpg"></ImagePreview>

### 运行

运行 -> 运行到小程序模拟器 -> 微信开发者工具

<ImagePreview src="/images/uniapp/image8.jpg"></ImagePreview>

### 运行成功

微信开发者工具会自动弹出来,可能没登录需要扫码登录微信开发者工具

<ImagePreview src="/images/uniapp/image9.jpg"></ImagePreview>

## 项目结构

<ImagePreview src="/images/uniapp/image10.jpg"></ImagePreview>

| 文件名        | 用途               |
| ------------- | ------------------ |
| pages         | 用于放置页面文件   |
| static        | 静态文件位置       |
| App.vue       | 主文件 同 vue      |
| main.js       | 同 vue             |
| manifest.json | 项目配置(下文详讲) |
| pages.json    | 页面配置(下文详讲) |
| uni.scss      | 全局样式文件       |

### manifest.json

此文主要用于开发微信小程序,其他的配置可以暂时不管,选择微信小程序配置

<ImagePreview src="/images/uniapp/image11.jpg"></ImagePreview>

| 配置                    | 作用                                    |
| ----------------------- | --------------------------------------- |
| AppID                   | 填写刚才在微信公共平台获取注册的 AppID  |
| ES6 转 ES5              | 可以勾选 兼容                           |
| 上传代码时样式自动补全  | 可以勾选 自动补全                       |
| 上传时自动压缩          | 勾选 压缩代码                           |
| 检查安全域名和 TLS 版本 | 不勾选 方便开发                         |
| 位置接口                | 此配置需要 在微信公众平台申请相应的接口 |
| unPush2.0               | 消息推送 需要申请                       |
| 开启云端一体安全网络    | 加强安全（暂不演示）                    |

### pages.json

此代码为伪代码,只为示例作用，方便查看属性配置使用 无法运行,需要自行配置需要的属性

<ImagePreview src="/images/uniapp/image12.jpg"></ImagePreview>

### pages 配置

| pages                        | 数组第一项表示启动项 相当于首页,每新增一个页面 要在 pages 数组新增一个对象                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| path                         | 文件路径                                                                                          |
| style                        | 页面样式 下面为 style 详细配置                                                                    |
| navigationBarTitleText       | 导航栏标题文字                                                                                    |
| navigationBarTextStyle       | 导航栏标题颜色，仅支持 black/white                                                                |
| navigationBarBackgroundColor | 导航栏背景颜色                                                                                    |
| backgroundColor              | tab 的背景色                                                                                      |
| navigationStyle              | 导航栏样式，仅支持 default/customm,开启 custom 后，所有窗口均无导航栏,如使用自定义导航栏 需要设置 |
| customenablePullDownRefresh  | 是否开启下拉刷新                                                                                  |
| onReachBottomDistance        | 页面上拉触底事件触发时距页面底部距离，单位为 px                                                   |

### globalStyle 全局配置

用于设置应用的状态栏、导航条、标题、窗口背景色等。

部分属性：

- navigationBar 开头的都是导航栏设置（小程序导航栏+手机导航栏）
- navigationBarBackgroundColor 导航栏背景颜色
- navigationBarTitleText 导航栏标题文字内容
- navigationBarTextStyle 导航栏标题颜色，仅支持 black / white
- enablePullDownRefresh 是否开启全局的下拉刷新。 （默认为 false）
- backgroundTextStyle 下拉 loading 的样式，仅支持 dark / light
- backgroundColor 设置下拉 loading 的背景颜色

<ImagePreview src="/images/uniapp/image20.jpg"></ImagePreview>

对应官方配置： https://uniapp.dcloud.net.cn/collocation/pages.html#globalstyle

onReachBottomDistance 这个配置适用于页面快到下面的时候，触发写一页等情况。同样也是上面的地址

### tabBar 配置

记得跟上面的 pages 属性一一对应路径

<ImagePreview src="/images/uniapp/image21.jpg"></ImagePreview>

对应官方文档：https://uniapp.dcloud.io/collocation/pages.html#tabbar

| tabBar           | 解析                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| color            | tab 文字默认颜色                                                                                          |
| selectedColor    | tab 选中时的颜色                                                                                          |
| borderStyle      | tab 上边框的颜色，仅支持 black/white                                                                      |
| backgroundColor  | tab 的背景色                                                                                              |
| position         | 位置 可选值 bottom、top                                                                                   |
| list             | 数组 以下为数组对象详解                                                                                   |
| pagePath         | 页面路径，必须在 pages 中先定义                                                                           |
| iconPath         | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px \* 81px，当 postion 为 top 时，此参数无效，不支持网络图片 |
| selectedIconPath | 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px \* 81px ，当 postion 为 top 时，此参数无效        |
| texttab          | 上按钮文字                                                                                                |

## 封装网络请求

### 配置环境变量

根目录下新增 common 文件夹 新建文件 operate.js

```js
export default {
  //接口
  api: function () {
    let version = wx.getAccountInfoSync().miniProgram.envVersion;
    switch (version) {
      case 'develop': //开发预览版
        return 'http://xxx.xxx.xxx.xxx:xxx';
      case 'trial': //体验版
        return 'http://xxx.xxx.xxx.xxx:xxx';
      case 'release': //正式版
        return 'http://xxx.xxx.xxx.xxx:xxx';
      default: //未知,默认调用正式版
        return 'http://xxx.xxx.xxx.xxx:xxx';
    }
  },
};
```

- 调用 wx.getAccountInfoSync().miniProgram.envVersion 获取微信环境
- develop-开发预览版 trial-体验版 release-正式版

### 封装请求

在 common 文件夹 新建文件 request.js

```js
import operate from './operate.js';
const http = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: operate.api() + options.url, // 接口地址：前缀+方法中传入的地址
      method: options.method || 'GET', // 请求方法：传入的方法或者默认是“GET”
      data: options.data || {}, // 传递参数：传入的参数或者默认传递空集合
      header: {
        Authorization: 'token', // 自定义请求头信息
      },
      success: (res) => {
        if (res.data.code !== 200) {
          // 自定请求失败的情况
          uni.showToast({
            title: res.data.msg,
            icon: 'none',
          });
        }
        resolve(res.data); //成功
      },
      // 这里的接口请求，如果出现问题就输出接口请求失败
      fail: (err) => {
        uni.showToast({
          title: '' + err.msg,
          icon: 'none',
        });
        reject(err);
      },
    });
  });
};
export default http;
```

- 判断环境 不同的 url
- data 需要给默认值 {}
- header 可以自定义 比如请求头的 token 根据项目配置获取方式,例如`uni.getStorageSync('Admin-Token')`
- success 请求成功的情况下 如果 code 和后端商量不等于 200 的情况返回什么 msg 是根据后端定义的错误提示字段
- 可以自行封装需要函数,如全局 Loading 效果之类

使用：

可统一新建 api 文件存放不同 页面的 api 请求

这里统一存放关于用户的请求 api/user.js

```js
import http from '../common/request.js';
export function getUserInfo() {
  return http({
    url: '/getUserInfo',
    method: 'post',
  });
}
```

单个页面使用： 直接导入方法即可

```js
import { getUserInfo } from '../../api/user.js';
```

## 引入 ui 框架

以 uview2.0 为例，uniapp uView2.0 插件市场：https://ext.dcloud.net.cn/plugin?id=1593

<ImagePreview src="/images/uniapp/image13.jpg"></ImagePreview>

此时 hbuilder 会弹框,选择项目点击确定

<ImagePreview src="/images/uniapp/image14.jpg"></ImagePreview>

uview 基于 sass 所以先下载 sass

```js
npm i sass -D


// 安装sass-loader
npm i sass-loader -D
```

配置 main.js

```js
import App from './App';
import Vue from 'vue';
import uView from '@/uni_modules/uview-ui';

Vue.config.productionTip = false;
App.mpType = 'app';
Vue.use(uView);

const app = new Vue({
  ...App,
});
app.$mount();
```

配置 uni.scss 全局 uview 主题文件

```js
@import '@/uni_modules/uview-ui/theme.scss';

```

配置 App.vue 引入 uView 基础样式

```html
<style lang="scss">
  /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
  @import '@/uni_modules/uview-ui/index.scss';
</style>
```

## 书写业务代码

。。。。。。。。

## 发布

### 压缩

小程序的代码包只能是 2MB,如果主包太大，就要考虑分包处理

运行时勾选 运行是否压缩代码 这样会节约很大空间

<ImagePreview src="/images/uniapp/image18.jpg"></ImagePreview>

### 上传

uniapp 编译后可以点击微信开发者工具的上传按钮

<ImagePreview src="/images/uniapp/image15.jpg"></ImagePreview>

打开微信公众平台 选择版本管理 右侧可以看到开发版本 ,如只有一个版本会默认开发版本,如需要发布正式版本点击提交审核就可以,审核周期第一次稍微长一点，后续修改代码就很快

<ImagePreview src="/images/uniapp/image16.jpg"></ImagePreview>

等待审核后就自动发布成功

### 注意事项

1. 正式服需要配置合法请求

入口：开发管理->开发设置

<ImagePreview src="/images/uniapp/image17.jpg"></ImagePreview>

所有相关请求都需要配置进去,包括使用的第三方接口如百度、阿里,否则正式服无法访问

## 常见问题

### 无法使用小程序功能

小程序引入微信 api 后，很多功能无法使用,例如获取位置信息,获取用户收获地址

小程序部分功能需要申请权限,开发管理->接口设置

按照对应的文档申请所需权限,根据微信文档添加在项目配置内即可

<ImagePreview src="/images/uniapp/image19.jpg"></ImagePreview>

### 派发任务

刚进企业派发小程序任务,如何进行开发?

- 先用 git 拉下项目
- 叫公司在微信公众平台把你的微信加入管理员
- 重新扫码微信开发者工具
- 如 appId 没有自动匹配就手动传入

<BackTop></BackTop>