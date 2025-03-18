---
title: 内置组件
toc: content
---

# uni-app

## 内置组件

### view

view： https://uniapp.dcloud.net.cn/component/view.html

它类似于传统 html 中的 div，用于包裹各种元素内容。

<Alert message='如果使用nvue则包裹文字应该使用`<text>`组件。'></Alert>

**属性说明**

| 属性名                 | 类型    | 默认值 | 说明                                                                                                                                    |
| :--------------------- | :------ | :----- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| hover-class            | String  | none   | 指定按下去的样式类。当 hover-class="none" 时，没有点击态效果                                                                            |
| hover-stop-propagation | Boolean | false  | 指定是否阻止本节点的祖先节点出现点击态，App、H5、支付宝小程序、百度小程序不支持（支付宝小程序、百度小程序文档中都有此属性，实测未支持） |
| hover-start-time       | Number  | 50     | 按住后多久出现点击态，单位毫秒                                                                                                          |
| hover-stay-time        | Number  | 400    | 手指松开后点击态保留时间，单位毫秒                                                                                                      |

```vue
<template>
  <view class="box2" hover-class="box2-active">
    <view
      class="box"
      hover-class="box-active"
      hover-stop-propagation
      :hover-start-time="2000"
      :hover-stay-time="2000"
      >我是一个大盒子</view
    >
  </view>
</template>

<script></script>

<style>
.box {
  width: 100px;
  height: 100px;
  background: #4cd964;
}
,
.box-active {
  width: 100px;
  height: 100px;
  background: #007aff;
}
,
.box2 {
  width: 300px;
  height: 300px;
  background: #d9a319;
}
,
.box2-active {
  width: 300px;
  height: 300px;
  background: #ff0a22;
}
</style>
```

**Tips**

- 小程序平台如果使用 `<div>` ，编译时会被转换为 `<view>`。
- App 平台 Vue2 项目在节点非常多时可以尝试使用 `<div>` 替换 `<view>` 以提升渲染性能。

### scroll-view

scroll-view：https://uniapp.dcloud.net.cn/component/scroll-view.html

可滚动视图区域。用于区域滚动。

<Alert message="在 webview 渲染的页面中，区域滚动的性能不及页面滚动"></Alert>

```vue
<template>
  <scroll-view class="container1" scroll-y>
    <view>1</view>
    <view>2</view>
    <view>3</view>
  </scroll-view>
</template>

<style>
.container1 {
  border: 1px solid red;
  /* 给scroll-view设置固定高度 */
  height: 120px;
  width: 100px;
}
.container1 view {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #fff;
}
.container1 view:nth-child(1) {
  background-color: #12aa9c;
}
.container1 view:nth-child(2) {
  background-color: #2775b6;
}
.container1 view:nth-child(3) {
  background-color: #ee3f4d;
}
</style>
```

### swiper

swiper ：https://uniapp.dcloud.net.cn/component/swiper.html

一般用于左右滑动或上下滑动，比如 banner 轮播图。

<Alert message='滑动切换和滚动的区别，滑动切换是一屏一屏的切换。swiper 下的每个 swiper-item 是一个滑动切换区域，不能停留在 2 个滑动区域之间。'></Alert>

```vue
<template>
  <!-- 轮播图区域 -->
  <!-- indicator-dots 显示面板指示点 -->
  <swiper class="swiper-container" indicator-dots>
    <!-- 第一项 -->
    <swiper-item>
      <view class="item">A</view>
    </swiper-item>
    <!-- 第二项 -->
    <swiper-item>
      <view class="item">B</view>
    </swiper-item>
    <!-- 第三项 -->
    <swiper-item>
      <view class="item">C</view>
    </swiper-item>
  </swiper>
</template>

<style>
.swiper-container {
  /* 轮播图容器的高度 */
  height: 150px;
}
.item {
  height: 100%;
  line-height: 150px;
  text-align: center;
}
swiper-item:nth-child(1) .item {
  background-color: lightgreen;
}
swiper-item:nth-child(2) .item {
  background-color: lightblue;
}
swiper-item:nth-child(3) .item {
  background-color: lightcoral;
}
</style>
```

## 基础内容

### icon

icon ：https://uniapp.dcloud.net.cn/component/icon.html

**Tips**

- 由于 icon 组件各端表现存在差异，可以通过使用 [字体图标](https://uniapp.dcloud.net.cn/tutorial/syntax-css.html#字体图标) 的方式来弥补各端差异。

**属性说明**

| 属性名 | 类型   | 默认值 | 说明                         |
| ------ | ------ | ------ | ---------------------------- |
| type   | String |        | icon 的类型                  |
| size   | Number | 23     | icon 的大小，单位 px         |
| color  | Color  |        | icon 的颜色，同 css 的 color |

<ImagePreview src="/images/uniapp/image22.jpg"></ImagePreview>

### text

text ：https://uniapp.dcloud.net.cn/component/text.html

文本组件。用于包裹文本内容。

**属性说明**

| 属性名      | 类型    | 默认值 | 说明         | 平台差异说明        |
| :---------- | :------ | :----- | :----------- | :------------------ |
| selectable  | Boolean | false  | 文本是否可选 | App、H5、快手小程序 |
| user-select | Boolean | false  | 文本是否可选 | 微信小程序          |
| space       | String  |        | 显示连续空格 | App、H5、微信小程序 |
| decode      | Boolean | false  | 是否解码     | App、H5、微信小程序 |

**space 值说明**

| 值   | 说明                   |
| :--- | :--------------------- |
| ensp | 中文字符空格一半大小   |
| emsp | 中文字符空格大小       |
| nbsp | 根据字体设置的空格大小 |

```html
<template>
  <view>
    <view>
      <text> 唱歌跳舞打篮球 </text>
    </view>
    <view>
      <!-- selectable文本可选 -->
      <text selectable> 唱歌跳舞打篮球 </text>
    </view>
    <view>
      <!-- space有多个值,如果不设置那么都会默认一个空格。 -->
      <text selectable space="ensp"> 唱歌 跳舞打篮球 </text>
    </view>
    <view>
      <!-- decode 可以解析的有 &nbsp; &lt; &gt; &amp; &apos; &ensp; &emsp;。 -->
      <text selectable> &nbsp; &lt; &gt; &amp; &apos; &ensp; &emsp; </text>
    </view>
  </view>
</template>
```

## 路由与页面跳转

### navigator

navigator：https://uniapp.dcloud.net.cn/component/navigator.html

页面跳转。该组件类似 HTML 中的`<a>`组件，但只能跳转本地页面。目标页面必须在 pages.json 中注册。

该组件的功能有 API 方式，另见：https://uniapp.dcloud.io/api/router?id=navigateto

**属性说明**

| 属性名    | 类型   | 默认值   | 说明                                                                                                         | 平台差异说明 |
| :-------- | :----- | :------- | :----------------------------------------------------------------------------------------------------------- | :----------- |
| url       | String |          | 应用内的跳转链接，值为相对路径或绝对路径，如："../first/first"，"/pages/first/first"，注意不能加 `.vue` 后缀 |              |
| open-type | String | navigate | 跳转方式                                                                                                     |              |

**open-type 有效值**

| 值           | 说明                                                                                                                                    | 平台差异说明                       |
| :----------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------- |
| navigate     | 对应 uni.navigateTo 的功能保留<br />当前页面，跳转到应用内的某个页面，使用`uni.navigateBack`可以返回到原页面。                          |                                    |
| redirect     | 对应 uni.redirectTo 的功能<br />关闭当前页面，跳转到应用内的某个页面。                                                                  |                                    |
| switchTab    | 对应 uni.switchTab 的功能<br />跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。<br />可以携带参数                                     |                                    |
| reLaunch     | 对应 uni.reLaunch 的功能<br />关闭所有页面，打开到应用内的某个页面。<br />如果跳转的页面路径是 tabBar 页面则不能带参数                  | 字节跳动小程序与飞书小程序不支持   |
| navigateBack | 对应 uni.navigateBack 的功能<br />关闭当前页面，返回上一页面或多级页面。可通过 `getCurrentPages()` 获取当前的页面栈，决定需要返回几层。 |                                    |
| exit         | 退出小程序，target="miniProgram"时生效                                                                                                  | 微信 2.1.0+、百度 2.5.2+、QQ1.4.7+ |

```html
<template>
  <view>
    navigator组件 导航跳转的学习
    <!-- 跳转普通页 -->
    <navigator url="/pages/list/list">跳转至信息页</navigator>
    <!-- 跳转tabbar页面，需要添加open-type="switchTab" -->
    <navigator url="/pages/index/index" open-type="switchTab"
      >跳转至主页</navigator
    >
    <!-- redirect跳转后，会关闭之前页面。也就是没有了" < " 回退了。   -->
    <navigator url="/pages/list/list" open-type="redirect"
      >跳转至信息页</navigator
    >
  </view>
</template>

<script>
  // navigate.vue页面接受参数
  export default {
    onLoad: function (option) {
      //option为object类型，会序列化上个页面传递的参数
      console.log(option.id); //打印出上个页面传递的参数。
      console.log(option.name); //打印出上个页面传递的参数。
    },
  };
</script>
```

url 有长度限制，太长的字符串会传递失败，可使用[窗体通信 ](https://uniapp.dcloud.io/tutorial/page.html#emit)、[全局变量](https://ask.dcloud.net.cn/article/35021)，或`encodeURIComponent`等多种方式解决，如下为`encodeURIComponent`示例。

```html
<navigator
  :url="'/pages/navigate/navigate?item='+ encodeURIComponent(JSON.stringify(item))"
></navigator>
```

```javascript
// navigate.vue页面接受参数
onLoad: function (option) {
	const item = JSON.parse(decodeURIComponent(option.item));
}
```

## 媒体组件

### image

image ：https://uniapp.dcloud.net.cn/component/image.html

图片。

| 属性名    | 类型    | 默认值        | 说明                                                   | 平台差异说明                                       |
| :-------- | :------ | :------------ | :----------------------------------------------------- | :------------------------------------------------- |
| src       | String  |               | 图片资源地址                                           |                                                    |
| mode      | String  | 'scaleToFill' | 图片裁剪、缩放的模式                                   |                                                    |
| lazy-load | Boolean | false         | 图片懒加载。只针对 page 与 scroll-view 下的 image 有效 | 微信小程序、百度小程序、字节跳动小程序、飞书小程序 |

**Tips**

- `<image>` 组件默认宽度 320px、高度 240px；`app-nvue平台，暂时默认为屏幕宽度、高度 240px；`
- `src` 仅支持相对路径、绝对路径，支持 base64 码；
- 页面结构复杂，css 样式太多的情况，使用 image 可能导致样式生效较慢，出现 “闪一下” 的情况，此时设置 `image{ will-change: transform }` ,可优化此问题。
- 自定义组件里面使用 `<image>`时，若 `src` 使用相对路径可能出现路径查找失败的情况，故建议使用绝对路径。
- svg 格式的图片在不同的平台支持情况不同。具体为：app-nvue 不支持 svg 格式的图片，小程序上只支持网络地址。

**mode 有效值：**

mode 有 14 种模式，其中 5 种是缩放模式，9 种是裁剪模式。

| 模式 | 值          | 说明                                                                                                                       |
| :--- | :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| 缩放 | scaleToFill | 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素                                                                |
| 缩放 | aspectFit   | 保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。                                       |
| 缩放 | aspectFill  | 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 |
| 缩放 | widthFix    | 宽度不变，高度自动变化，保持原图宽高比不变                                                                                 |
| 缩放 | heightFix   | 高度不变，宽度自动变化，保持原图宽高比不变 **App 和 H5 平台 HBuilderX 2.9.3+ 支持、微信小程序需要基础库 2.10.3**           |

<BackTop></BackTop>