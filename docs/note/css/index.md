---
title: css
---

# css

## 盒子居中

### flex 布局

demo: https://stackblitz.com/edit/stackblitz-starters-wikqaz?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    display: flex; //flex代码三件套
    justify-content: center;
    align-items: center;
  }
  .inner {
    width: 40px;
    height: 50px;
    background-color: lightblue;
  }
</style>

<div class="wrap">
  <div class="inner"></div>
</div>
```

### absolute + transform

demo: https://stackblitz.com/edit/stackblitz-starters-k2m3eg?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    position: relative;
  }
  .inner {
    background-color: lightblue;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>

<div class="wrap">
  <span class="inner">绝对定位+transform</span>
</div>
```

### absolute + 负 margin

该方法也适用于子元素是行内元素、行内块元素、块元素，唯一的要求是子元素的 高度 和 宽度 已知的情况。

demo: https://stackblitz.com/edit/stackblitz-starters-hy5orq?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    position: relative;
  }
  .inner {
    background-color: lightblue;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -40px;
    height: 80px;
    width: 100px;
  }
</style>
<div class="wrap">
  <span class="inner"></span>
</div>
```

### absolute + calc

该方法也适用于子元素是行内元素、行内块元素、块元素，唯一的要求是子元素的 高度 和 宽度 已知的情况

demo: https://stackblitz.com/edit/stackblitz-starters-d6k1nd?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    position: relative;
  }
  .inner {
    background-color: lightblue;
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 50px);
    height: 80px;
    width: 100px;
  }
</style>
<div class="wrap">
  <span class="inner"></span>
</div>
```

### absolute + margin:auto

该方法也适用于子元素是行内元素、行内块元素、块元素，唯一的要求是子元素要有 高度 和 宽度 。不然，子元素会完全填充父元素

demo: https://stackblitz.com/edit/stackblitz-starters-rbxypy?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    position: relative;
  }
  .inner {
    background-color: lightblue;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 80px;
    width: 100px;
    margin: auto;
    text-align: center;
  }
</style>
<div class="wrap">
  <span class="inner">absolute + margin:auto</span>
</div>
```

### 借助 display:table-cell

demo: https://stackblitz.com/edit/stackblitz-starters-3uujgc?file=index.html

```html
<style>
  .wrap {
    width: 400px;
    height: 300px;
    background-color: lightcoral;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .inner {
    background-color: lightblue;
    margin: 0 auto;
    height: 110px;
    width: 100px;
  }
</style>
<div class="wrap">
  <div class="inner"></div>
</div>
```

### grid

grid 的兼容性较差，所以没有流行使用

demo: https://stackblitz.com/edit/stackblitz-starters-lbur9h?file=index.html

```html
<style>
  .wrap {
    display: grid;
    justify-items: center;
    align-items: center;
    width: 400px;
    height: 300px;
    background-color: lightcoral;
  }
  .inner {
    background-color: lightblue;
    height: 110px;
    width: 100px;
  }
</style>
<div class="wrap">
  <div class="inner"></div>
</div>
```

### BFC + margin

如果父子元素的高度和宽度都是固定的话，可以直接利用 margin-top 和 margin-left 对子元素进行定位，从而实现居中。同时，利用 position: absolute; 让子元素成为一个 BFC，从而解决父子元素 margin collapsing 的问题

demo: https://stackblitz.com/edit/stackblitz-starters-yhbsxu?file=index.html

```html
<style>
  .container {
    background-color: silver;
    width: 400px;
    height: 500px;
  }
  .content {
    width: 200px;
    height: 300px;
    background-color: red;
    margin-top: 100px;
    margin-left: 100px;
    position: absolute;
  }
</style>
<body>
  <div class="container">
    <div class="content"></div>
  </div>
</body>
```

## flex

### flex-grow

子容器在父容器的“主轴”上还有多少空间可以“瓜分”，这个可以被“瓜分”的空间就叫做剩余空间。

flex-grow 为 0 : https://stackblitz.com/edit/stackblitz-starters-syrbj2?file=index.html

<ImagePreview src="/images/css/image7.jpg"></ImagePreview>

父容器的主轴还有这么多剩余空间，子容器有什么办法将这些剩余空间瓜分来实现弹性的效果呢？

flex-grow 定义子容器的瓜分剩余空间的比例，默认为 0，即如果存在剩余空间，也不会去瓜分。

flex-grow 为 1 : https://stackblitz.com/edit/stackblitz-starters-zks1xd?file=index.html

<ImagePreview src="/images/css/image8.jpg"></ImagePreview>

计算方式如下：

- 剩余空间：x
- 假设有三个 flex item 元素，flex-grow 的值分别为 a, b, c
- 每个元素可以分配的剩余空间为：a/(a+b+c) _ x，b/(a+b+c) _ x，c/(a+b+c) \* x

以 A 为例子进行说明：当时父盒子剩余空间的为 150， A 占比剩余空间：`1/(1+2+3) = 1/6`，那么 A “瓜分”到的 `150\*1/6=25`，实际宽度为 `100+25=125`。

### flex-shrink

我们知道了子容器设置了 flex-grow 有可能会被拉伸。那么什么情况下子容器被压缩呢？考虑一种情况：如果子容器宽度超过父容器宽度，即使是设置了 flex-grow，但是由于没有剩余空间，就分配不到剩余空间了。这时候有两个办法：换行和压缩。由于 flex 默认不换行，那么压缩的话，怎么压缩呢，压缩多少？此时就需要用到 flex-shrink 属性了。

flex 元素的收缩规则，默认值是 1

计算方式：

- 三个 flex item 元素的 width: w1, w2, w3
- 三个 flex item 元素的 flex-shrink：a, b, c
- 计算总压缩权重：
- sum = a _ w1 + b _ w2 + c \_ w3
- 计算每个元素压缩率：
- S1 = a _ w1 / sum，S2 =b _ w2 / sum，S3 =c \_ w3 / sum
- 计算每个元素宽度：width - 压缩率 \* 溢出空间

子容器宽度总和为 650，溢出空间为 150
总压缩：300 _ 1 + 150 _ 2 + 200 * 3 = 1200
A 的压缩率：300*1 / 1200 = 0.25
A 的压缩值：150 \* 0.25 = 37.5
A 的实际宽度：300 - 37.5 = 262.5

<ImagePreview src="/images/css/image10.jpg"></ImagePreview>

flex-shrink 为 0 时:

<ImagePreview src="/images/css/image9.jpg"></ImagePreview>

### flex-basis

flex-basis 即用于定义了在分配多余空间之前，弹性元素在主轴方向上所占的初始大小。这个初始大小可以是具体的像素值、百分比或者是关键词 auto

flex-basis: 0%意味着在分配额外空间之前，元素不占用任何固定的空间，完全依赖于 flex-grow 来分配空间

flex-basis: https://stackblitz.com/edit/stackblitz-starters-d31xfm?file=index.html

<ImagePreview src="/images/css/image11.jpg"></ImagePreview>

可以看出几个属性的优先级关系：

`max-width/min-width > flex-basis > width > box`

## 相对定位，绝对定位

- relative： 占位不脱标，相对于自身在原文档流中位置，不改变元素大小
- absoulte: 脱标不占位，参照上级或者上上级有无定位，没有则根据 body 元素定位，改变元素大小，不设置宽高，依赖内容决定

## display 的 block、inline 和 inline-block 的区别

- block：会独占一行，多个元素会另起一行，可以设置 width、
  height、margin 和 padding 属性；
- inline：元素不会独占一行，设置 width、height 属性无效。
  但可以设置水平方向的 margin 和 padding 属性，不能设置垂直方向
  的 padding 和 margin；
- inline-block：将对象设置为 inline 对象，但对象的内容作为
  block 对象呈现，之后的内联对象会被排列在同一行内

## link 和@import 的区别

两者都是外部引用 CSS 的方式，它们的区别如下：

- link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；
- @import 属于 CSS 范畴，只能加载 CSS。

  link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完
  全载入以后加载。

  link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低
  版本的浏览器不支持。

  link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持

## CSS 布局单位

常用的布局单位包括像素（px），百分比（%），em，rem，vw/vh。

- 像素（px）是页面布局的基础，一个像素表示终端（电脑、手
  机、平板等）屏幕所能显示的最小的区域，像素分为两种类型：CSS 像素和物理像素。
  - CSS 像素：为 web 开发者提供，在 CSS 中使用的一个抽象单位；
  - 物理像素：只与设备的硬件密度有关，任何设备的物理像素都是固定
    的。
- 百分比（%），当浏览器的宽度或者高度发生变化时，通过百分
  比单位可以使得浏览器中的组件的宽和高随着浏览器的变化而变化，
  从而实现响应式的效果。一般认为子元素的百分比相对于直接父元素。
- em 和 rem 相对于 px 更具灵活性，它们都是相对长度单位，它们之间的区别：em 相对于父元素，rem 相对于根元素。
  - em： 文本相对长度单位。相对于当前对象内文本的字体尺寸。如果
    当前行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体
    尺寸(默认 16px)。(相对父元素的字体大小倍数)。
  - rem： rem 是 CSS3 新增的一个相对单位，相对于根元素（html 元素）
    的 font-size 的倍数。作用：利用 rem 可以实现简单的响应式布局，
    可以利用 html 元素中字体的大小与屏幕间的比值来设置 font-size
    的值，以此实现当屏幕分辨率变化时让元素也随之变化。
- vw/vh 是与视图窗口有关的单位，vw 表示相对于视图窗口的宽
  度，vh 表示相对于视图窗口高度，除了 vw 和 vh 外，还有 vmin 和 vmax
  两个相关的单位。

- vw：相对于视窗的宽度，视窗宽度是 100vw
- vh：相对于视窗的高度，视窗高度是 100vh；

vw/vh 和百分比很类似，两者的区别：

- 百分比（%）：大部分相对于祖先元素，也有相对于自身的情况比如
  (border-radius、translate 等)
- vw/vm：相对于视窗的尺寸

## BFC 的理解，如何创建 BFC

先来看两个相关的概念：
Box: Box 是 CSS 布局的对象和基本单位，⼀个⻚⾯是由很多个 Box
组成的，这个 Box 就是我们所说的盒模型。

Formatting context：块级上下⽂格式化，它是⻚⾯中的⼀块渲染区
域，并且有⼀套渲染规则，它决定了其⼦元素将如何定位，以及和其
他元素的关系和相互作⽤。

块格式化上下文（Block Formatting Context，BFC）是 Web 页面的
可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是
浮动元素与其他元素的交互限定区域。

通俗来讲：BFC 是一个独立的布局环境，可以理解为一个容器，在这
个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物
品。如果一个元素符合触发 BFC 的条件，则 BFC 中的元素布局不受外
部影响。

创建 BFC 的条件：

- 根元素：body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position (absolute、fixed)；
- display 值为：inline-block、table-cell、table-caption、flex 等；
- overflow 值为：hidden、auto、scroll；

BFC 的特点：

- 垂直方向上，自上而下排列，和文档流的排列方式一致。
- 在 BFC 中上下相邻的两个容器的 margin 会重叠
- 计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素
- 每个元素的左 margin 值和容器的左 border 相接触

BFC 的作用

- 解决 margin 的重叠问题：由于 BFC 是一个独立的区域，内部的元素
  和外部的元素互不影响，将两个元素变为两个 BFC，就解决了 margin
  重叠的问题。
- 解决高度塌陷的问题：在对子元素设置浮动后，父元素会发生高度塌
  陷，也就是父元素的高度变为 0。解决这个问题，只需要把父元素变
  成一个 BFC。常用的办法是给父元素设置 overflow:hidden。
  创建自适应两栏布局：可以用来创建自适应两栏布局：左边的宽度固
  定，右边的宽度自适应。

## BFC

### 定义

BFC 是一个独立的渲染区域，内部元素的布局不会影响外部元素，同时外部元素的布局也不会影响内部。这意味着，在一个 BFC 中，浮动元素、清除浮动、边距塌陷等问题都会被限制在这个上下文中解决，而不影响其他部分的布局。

### 触发 BFC 的方式

以下情况会自动创建一个新的 BFC：

- 根元素（HTML 文档的元素）。
- float 属性不为 none 的元素。
- position 属性为 absolute 或 fixed 的元素。
- display 属性为 inline-block、table-cell、table-caption、flow-root、或者 flex、grid 的元素。
- overflow 属性不为 visible 的元素（hidden、auto、scroll）。

### 特点

- 浮动隔离：在 BFC 内部，浮动元素会被包含在这个上下文中，不会溢出影响到外部的元素。
- 阻止外边距折叠：相邻两个 BFC 之间的垂直外边距不会折叠，而是以较大的外边距为准。
- 包含浮动：BFC 可以包含其内部浮动元素，使得父元素能够根据其浮动子元素自动扩展高度，实现清除内部浮动的效果。
- 独立的行框上下文：BFC 中的元素与外部元素互不影响，行内盒会在该上下文中单独排列。

### 应用场景

- 清除浮动：利用 BFC 可以自然地包含浮动元素，避免父容器高度塌陷。

<ImagePreview src="/images/css/image1.jpg"></ImagePreview>

解决方案： 为父容器创建 BFC

<ImagePreview src="/images/css/image2.jpg"></ImagePreview>

- 防止外边距折叠：当需要相邻元素的外边距保持独立时，可以将它们放在不同的 BFC 中。

<ImagePreview src="/images/css/image3.jpg"></ImagePreview>

解决方案： 可以将其中一个元素设置成 BFC 区域，使它两个独立的容器互不影响

<ImagePreview src="/images/css/image4.jpg"></ImagePreview>

还有一个解决方案就是给一个元素设置为`display: inline-block` ，无需像上面多套一层父元素

- 防止浮动重叠：利用 BFC 区域不会与浮动容器发生重叠

<ImagePreview src="/images/css/image5.jpg"></ImagePreview>

解决方案：要自适应两栏效果，使右边盒子成为 BFC 区域

<ImagePreview src="/images/css/image6.jpg"></ImagePreview>

### 注意事项

- 一个元素不能同时属于两个 BFC，每个元素只能属于一个最近的 BFC。
- BFC 是 CSS 视觉渲染的一部分，它的存在主要是为了解决布局中由于浮动等特性引起的问题，提高布局的灵活性和可预测性。

## 浏览器的渲染机制

1. 浏览器发出一个请求，向服务器请求一个页面
2. 服务器返回响应，响应的内容是字符串（html 文档）
3. 浏览器对字符串进行解析

   **解析 HTML，构建 DOM 树：**

   当浏览器接收到服务器返回的 HTML 文档后，首先由 HTML 解析器（也称作 HTML 解析器）读取文档内容，将 HTML 代码解析成一系列的 DOM（Document Object Model）节点，这些节点以树状结构（DOM 树）的形式存在，代表了文档的结构。

   **解析 CSS，构建 CSSOM 树：**

   同时，CSS 解析器会解析外部 CSS 文件和内联样式，将 CSS 规则转换成 CSSOM（CSS Object Model）树。CSSOM 树表示了 CSS 规则的层次关系和优先级。

   **合并 DOM 树和 CSSOM 树，生成 Render Tree（渲染树）：**

   接下来，浏览器会将 DOM 树和 CSSOM 树合并，形成 Render Tree。在这个过程中，不可见的元素（如 display:none）和与渲染无关的元素（如 head 中的元素）不会被加入到 Render Tree 中。Render Tree 包含了可见元素的布局信息和样式信息

   **布局：**

   在生成 Render Tree 之后，浏览器开始计算每个节点在屏幕上的确切位置和大小，这一过程称为布局或重排。浏览器需要遍历 Render Tree 的每一个节点，根据其 CSS 属性计算其坐标、宽度、高度等几何信息。这是一个相对耗时的过程，尤其是在有大量元素或复杂布局的情况下

   **绘制：**

   最后，浏览器会使用 GPU（图形处理器）调用绘制操作，将布局好的各个节点绘制到屏幕上。这一阶段，浏览器会将 Render Tree 的每个节点转换成实际像素，这一步骤也称为光栅化（Rasterization）。绘制过程可以被进一步细分，部分浏览器会先将不同的渲染层（Layer）绘制到单独的内存区域（称为图层），然后通过合成操作将这些图层合并显示到屏幕上，以提高效率

## 浏览器的重排跟重绘

### 重排

重排，也称为回流，发生在以下几种情况中：

1. 页面首次加载：浏览器首次构建渲染树时，需要计算所有元素的几何位置和尺寸。
2. DOM 结构变化：添加、删除或修改 DOM 元素，比如插入一个新节点或删除一个现有节点，会导致其父元素及其后续元素的布局重新计算。
3. 元素尺寸变化：修改元素的宽度、高度、内外边距、边框宽度等，可能会影响其自身及周围元素的位置。
4. 样式更改：应用会影响布局的 CSS 属性，如 display、position、float 或 flex 属性的改变。
5. 计算样式请求：当 JavaScript 访问某些特定的样式信息（如 offsetWidth、getComputedStyle()）时，浏览器需要先完成布局计算以提供准确的值。
6. 窗口尺寸变化：用户调整浏览器窗口大小时，整个页面的布局需要重新计算。

### 重绘

重绘发生于页面元素的视觉外观需要更新，但不涉及布局变化时：

1. 颜色更改：修改元素的背景色、文字颜色等不会影响布局的样式属性。
2. 背景图片变化：改变元素的背景图片，只要它不影响元素的尺寸和位置。
3. 文本样式变化：调整字体样式（如大小、家族、粗细）但不导致尺寸变化。
4. 边框样式变化：改变不会影响布局的边框样式，如边框颜色或虚实线样式。
5. 伪类状态变化：如:hover、:active 状态的切换，可能导致元素视觉外观的变化。

<Alert>

- 重排通常会导致重绘：因为布局变化后，受影响的元素需要重新绘制。
- 性能影响：重排和重绘都是资源密集型操作，特别是重排，因为它需要重新计算布局。频繁或不必要的重排重绘会显著降低页面性能，增加 CPU 使用率，甚至造成页面卡顿。
- 优化策略：为了优化性能，开发者应尽量减少触发重排和重绘的操作，可以通过 CSS 动画代替 JavaScript 动画、合并样式修改、使用 `transform` 和 `opacity`（它们不会触发重排）进行动画、以及合理使用 `requestAnimationFrame` 等方法来实现。

</Alert>

<BackTop></BackTop>