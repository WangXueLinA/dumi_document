---
toc: content
title: BOM
---

# javascript

## BOM

BOM (Browser Object Model)，浏览器对象模型，提供了独立于内容与浏览器窗口进行交互的对象

其作用就是跟浏览器做一些交互效果,比如如何进行页面的后退，前进，刷新，浏览器的窗口发生变化，滚动条的滚动，以及获取客户的一些信息如：浏览器品牌版本，屏幕分辨率

浏览器的全部内容可以看成 DOM，整个浏览器可以看成 BOM。

### window

Bom 的核心对象是 window，它表示浏览器的一个实例
在浏览器中，window 对象有双重角色，即是浏览器窗口的一个接口，又是全局对象

1. 在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法

```js
var name = 'js每日一题';
function lookName() {
  alert(this.name);
}

console.log(window.name); //js每日一题
lookName(); //js每日一题
window.lookName(); //js每日一题
```

2. 查看浏览器窗口尺寸（或者叫可视区域，不包括工具栏和滚动条）
   ```js
   window.innerWidth;
   window.innerHeight;
   ```
3. 打开一个窗口

```js
window.open(URL, name, specs, replace);
```

说明：

- URL：表示要打开的页面地址。如果没有指定 URL，打开空白窗口
- name：指定 target 属性或窗口的名称
  - \_blank - URL 加载到一个新的窗口。这是默认
  - \_parent - URL 加载到父框架
  - \_self - URL 替换当前页面
  - \_top - URL 替换任何可加载的框架集
  - name - 窗口名称
- specs：设置窗口规格，可选。一个逗号分隔的项目列表

  - height=pixels 窗口的高度。最小值为 100
  - left=pixels 该窗口的左侧位置
  - location=yes|no|1|0 是否显示地址字段.默认值是 yes
  - menubar=yes|no|1|0 是否显示菜单栏.默认值是 yes
  - resizable=yes|no|1|0 是否可调整窗口大小.默认值是 yes
  - scrollbars=yes|no|1|0 是否显示滚动条.默认值是 yes
  - status=yes|no|1|0 是否要添加一个状态栏.默认值是 yes
  - titlebar=yes|no|1|0 是否显示标题栏.被忽略，除非调用 HTML 应用程序或一个值得信赖的对话框.默认值是 yes
  - toolbar=yes|no|1|0 是否显示浏览器工具栏.默认值是 yes
  - width=pixels 窗口的宽度.最小.值为 100

- replace：可选，用于替换浏览历史中的当前条目
  Optional.Specifies 规定了装载到窗口的 URL 是在窗口的浏览历史中创建一个新条目，还是替换浏览历史中的当前条目。支持下面的值：

  - true - URL 替换浏览历史中的当前条目。
  - false - URL 在浏览历史中创建新的条目。

### location

url 地址如下：

```js
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

location 属性描述如下：
|属性名 |例子 |说明|
|:---|:---|:---|
|hash| "#contents" |url 中#后面的字符，没有则返回空串|
|host |www.wrox.com:80 |服务器名称和端口号|
|hostname |www.wrox.com| 域名，不带端口号|
|href |http://www.wrox.com:80/WileyCDA/?q=javascript#contents |完整 url|
|pathname |"/WileyCDA/"| 服务器下面的文件路径
|port |80 |url 的端口号，没有则为空|
|protocol| http: |使用的协议|
|search |?q=javascript| url 的查询字符串，通常为？后面的内容|

### navigator

navigator 对象主要用来获取浏览器的属性，区分浏览器类型。属性较多，且兼容性比较复杂

navigator 对象包含有关浏览器的信息
navigator.appCodeName 返回浏览器的代码名
navigator.appName 返回浏览器的名称
navigator.appVersion 返回浏览器的平台和版本信息
navigator.cookieEnabled 返回指明浏览器中是否启用 cookie 的布尔值
navigator.platform 返回运行浏览器的操作系统平台
navigator.userAgent 返回由客户机发送服务器的 user-agent 头部的值

<ImagePreview src="/images/js/image8.jpg"></ImagePreview>

### screen

保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度

可用的屏幕宽度和高度完整的分辨率：

- screen.width
- screen.height

<ImagePreview src="/images/js/image9.jpg"></ImagePreview>

### history

history 对象主要用来操作浏览器 URL 的历史记录，可以通过参数向前，向后，或者向指定 URL 跳转
常用的属性如下：

- history.go()

接收一个整数数字或者字符串参数：向最近的一个记录中包含指定字符串的页面跳转，

```js
history.go('https://www.baidu.com/');
```

当参数为整数数字的时候，正数表示向前跳转指定的页面，负数为向后跳转指定的页面

```js
history.go(3); //向前跳转三个记录
history.go(-1); //向后跳转一个记录
```

- history.forward()：向前跳转一个页面
- history.back()：向后跳转一个页面
- history.length：获取历史记录数

<BackTop></BackTop>