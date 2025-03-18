---
title: less
---

# less

官网：[http://lesscss.org/](http://lesscss.org/)

Less 诞生于 2009 年，受 Sass 的影响创建的一个开源项目。 它扩充了 CSS 语言，增加了诸如变量、混合（mixin）、函数等功能，让 CSS 更易维护、方便制作主题、扩充

Less 没有去掉任何 CSS 的功能，而是在现有的语法上，增添了许多额外的功能特性，所以学习 Less 是一件非常舒服的事情

## css 短板

CSS 作为一门标记性语言，可能 给初学者第一印象 就是简单易懂，毫无逻辑，不像编程该有的样子。在语法更新时，每当新属性提出，浏览器的兼容又会马上变成绊脚石，可以说 CSS 短板不容忽视。

问题的诞生往往伴随着技术的兴起， 在 Web 发展的这几年， 为了让 CSS 富有逻辑性，短板不那么严重，涌现出了 一些神奇的预处理语言。 它们让 CSS 彻底变成一门 可以使用 变量 、循环 、继承 、自定义方法等多种特性的标记语言，逻辑性得以大大增强。

## 语法

### 变量

以 `@` 开头 定义变量，并且使用时 直接 键入 `@`名称

```css
/* Less */
/* 变量后的值不要添加引号 */
@color: #999;
#wrap {
  color: @color;
}

/* 生成后的 CSS */
#wrap {
  color: #999;
}
```

变量是延迟加载的，可以不预先声明

```less
/* Less */
div {
  color: @black;
}
@black: #000000;

/* 生成的 CSS */
div {
  color: #000000;
}
```

#### 选择器变量

让 选择器 变成 动态

```less
/* Less */
@mySelector: #wrap;
@Wrap: wrap;
@{mySelector} {
  //变量名 必须使用大括号包裹
  color: #999;
  width: 50%;
}

.@{Wrap} {
  color: #ccc;
}
#@{Wrap} {
  color: #666;
}

/* 生成的 CSS */
#wrap {
  color: #999;
  width: 50%;
}
.wrap {
  color: #ccc;
}
#wrap {
  color: #666;
}
```

#### 属性变量

```css
/* Less */
@borderStyle: border-style;
@Soild: solid;
#wrap {
  @{borderStyle}: @Soild; //变量名 必须使用大括号包裹
}

/* 生成的 CSS */
#wrap {
  border-style: solid;
}
```

#### url 变量

```less
/* Less */
@images: '../img'; //需要加引号
body {
  background: url('@{images}/dog.png'); //变量名 必须使用大括号包裹
}

/* 生成的 CSS */
body {
  background: url('../img/dog.png');
}
```

#### 声明变量

有点类似于 下面的 混合方法

```bash
结构: @name: { 属性: 值 ;};
使用：@name();
```

```less
/* Less */
@background: {
  background: red;
};
#main {
  @background();
}
@Rules: {
  width: 200px;
  height: 200px;
  border: solid 1px red;
};
#con {
  @Rules();
}

/* 生成的 CSS */
#main {
  background: red;
}
#con {
  width: 200px;
  height: 200px;
  border: solid 1px red;
}
```

#### 变量运算

```less
/* Less */
@width: 300px;
@color: #222;
#wrap {
  width: @width - 20;
  height: @width - 20 * 5;
  margin: (@width - 20) * 5;
  color: @color * 2;
  background-color: @color + #111;
}

/* 生成的 CSS */
#wrap {
  width: 280px;
  height: 200px;
  margin: 1400px;
  color: #444;
  background-color: #333;
}
```

#### 变量作用域

一句话理解就是：就近原则

```less
/* Less */
@var: 0;
.class {
  @var: 1;
  .brass {
    @var: 2;
    three: @var;
    @var: 3;
  }
  one: @var; //类似js，无法访问.brass内部
}

/* 生成的 CSS */
.class {
  one: 1;
}
.class .brass {
  three: 3; //使用最后定义的 @var: 3
}
```

#### 用变量去定义变量

```less
/* Less */
@fnord: 'I am fnord.';
@var: 'fnord';
#wrap::after {
  content: @@var; //将@var替换为其值 content:@fnord;
}

/* 生成的 CSS */
#wrap::after {
  content: 'I am fnord.';
}
```

### 嵌套

```less
/* Less */
#header {
  &:after {
    content: 'Less is more!';
  }
  .title {
    font-weight: bold;
  }
  &_content {
    //理解方式：直接把 & 替换成 #header
    margin: 20px;
  }
}

/* 生成的 CSS */
#header::after {
  content: 'Less is more!';
}
#header .title {
  //嵌套了
  font-weight: bold;
}
#header_content {
  //没有嵌套！
  margin: 20px;
}
```

#### 改变选择器的顺序

- 将&放到当前选择器之后，会将当前选择器移到最前面
- 只需记住 “& 代表当前选择器的所有父选择器”

```less
/* Less */
ul {
  li {
    .color & {
      background: #fff;
    }
  }
}

/* 生成的 CSS */
.color ul li {
  background: #fff;
}
```

### 混合方法

方法犹如 声明的集合，使用时 直接键入名称即可。

```less
/* Less */
.card {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}
#wrap {
  .card; //等价于.card();
}

/* 生成的 CSS */
#wrap {
  background: #f6f6f6;
  -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
  box-shadow: 0 1px 2px rgba(151, 151, 151, 0.58);
}
```

为了避免 代码混淆，应写成 :

```less
.card() {
  //something...
}
#wrap {
  .card();
}
```

`.` 与`#` 皆可作为 方法前缀。
方法后写不写 `()` 看个人习惯。

#### 默认参数方法

- Less 可以使用默认参数，如果 没有传参数，那么将使用默认参数。
- `@arguments` 犹如 JS 中的 arguments 指代的是 全部参数。
- 传的参数中 必须带着单位

```less
/* Less */
.border(@a:10px,@b:50px,@c:30px,@color:#000) {
  border: solid 1px @color;
  box-shadow: @arguments; //指代的是 全部参数
}
#main {
  .border(0px,5px,30px,red); //必须带着单位
}
#wrap {
  .border(0px);
}
#content {
  .border; //等价于 .border()
}

/* 生成的 CSS */
#main {
  border: solid 1px red;
  box-shadow: 0px, 5px, 30px, red;
}
#wrap {
  border: solid 1px #000;
  box-shadow: 0px 50px 30px #000;
}
#content {
  border: solid 1px #000;
  box-shadow: 10px 50px 30px #000;
}
```

#### 方法的匹配模式

```less
/* Less */
.triangle(top,@width:20px,@color:#000) {
  border-color: transparent transparent @color transparent;
}
.triangle(right,@width:20px,@color:#000) {
  border-color: transparent @color transparent transparent;
}

.triangle(bottom,@width:20px,@color:#000) {
  border-color: @color transparent transparent transparent;
}
.triangle(left,@width:20px,@color:#000) {
  border-color: transparent transparent transparent @color;
}
.triangle(@_,@width:20px,@color:#000) {
  border-style: solid;
  border-width: @width;
}
#main {
  .triangle(left, 50px, #999);
}

/* 生成的 CSS */
#main {
  border-color: transparent transparent transparent #999;
  border-style: solid;
  border-width: 50px;
}
```

- 第一个参数 left 要会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样式覆盖替换。
- 如果匹配的参数 是变量，则将会匹配，如 `@_`

#### 方法的命名空间

```less
/* Less */
#card() {
  background: #723232;
  .d(@w:300px) {
    width: @w;

    #a(@h:300px) {
      height: @h; //可以使用上一层传进来的方法
    }
  }
}
#wrap {
  #card > .d > #a(100px); // 父元素不能加 括号
}
#main {
  #card .d();
}
#con {
  //不得单独使用命名空间的方法
  //.d() 如果前面没有引入命名空间 #card ，将会报错

  #card; // 等价于 #card();
  .d(20px); //必须先引入 #card
}

/* 生成的 CSS */
#wrap {
  height: 100px;
}
#main {
  width: 300px;
}
#con {
  width: 20px;
}
```

- 在 CSS 中> 选择器，选择的是 儿子元素，就是 必须与父元素 有直接血源的元素。
- 在引入命令空间时，如使用 > 选择器，父元素不能加 括号。
- 不得单独使用命名空间的方法 必须先引入命名空间，才能使用 其中方法。
- 子方法 可以使用上一层传进来的方法

#### 方法的条件筛选

Less 没有 if else，可是它有 when

```less
/* Less */
#card {
  // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
  .border(@width,@color,@style) when (@width>100px) and(@color=#999) {
    border: @style @color @width;
  }

  // not 运算符，相当于 非运算 !，条件为 不符合才会执行
  .background(@color) when not (@color>=#222) {
    background: @color;
  }

  // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
  .font(@size:20px) when (@size>50px) , (@size<100px) {
    font-size: @size;
  }
}
#main {
  #card > .border(200px,#999,solid);
  #card .background(#111);
  #card > .font(40px);
}

/* 生成后的 CSS */
#main {
  border: solid #999 200px;
  background: #111;
  font-size: 40px;
}
```

- 比较运算有： `>`、`>=`、`=`、`=<`、`<`。
- `=` 代表的是等于
- 除去关键字 true 以外的值都被视为 false：

#### 数量不定的参数

如果你希望你的方法接受数量不定的参数，你可以使用... ，犹如 ES6 的扩展运算符。

```less
/* Less */
.boxShadow(...) {
  box-shadow: @arguments;
}
.textShadow(@a, ...) {
  text-shadow: @arguments;
}
#main {
  .boxShadow(1px,4px,30px,red);
  .textShadow(1px,4px,30px,red);
}

/* 生成后的 CSS */
#main {
  box-shadow: 1px 4px 30px red;
  text-shadow: 1px 4px 30px red;
}
```

#### 方法使用 important！

```less
/* Less */
.border {
  border: solid 1px red;
  margin: 50px;
}
#main {
  .border() !important;
}

/* 生成后的 CSS */
#main {
  border: solid 1px red !important;
  margin: 50px !important;
}
```

#### 循环方法

Less 并没有提供 for 循环功能

```less
/* Less */
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}

/* 生成后的 CSS */
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

### 继承

#### extend 关键字的使用

```less
/* Less */
.animation {
  transition: all 0.3s ease-out;
  .hide {
    transform: scale(0);
  }
}
#main {
  &:extend(.animation);
}
#con {
  &:extend(.animation .hide);
}

/* 生成后的 CSS */
.animation,
#main {
  transition: all 0.3s ease-out;
}

.animation .hide,
#con {
  transform: scale(0);
}
```

#### all 全局搜索替换

```less
/* Less */
#main {
  width: 200px;
}
#main {
  &:after {
    content: 'Less is good!';
  }
}
#wrap:extend(#main all) {
}

/* 生成的 CSS */
#main,
#wrap {
  width: 200px;
}
#main:after,
#wrap:after {
  content: 'Less is good!';
}
```

#### 减少代码的重复性

从表面 看来，extend 与 方法 最大的差别，就是 extend 是同个选择器共用同一个声明，而 方法 是使用自己的声明，这无疑 增加了代码的重复性。

```less
/* Less */
.Method {
  width: 200px;
  &:after {
    content: 'Less is good!';
  }
}
#main {
  .Method;
}
#wrap {
  .Method;
}

/* 生成的 CSS */
#main {
  width: 200px;
  &:after {
    content: 'Less is good!';
  }
}
#wrap {
  width: 200px;
  &:after {
    content: 'Less is good!';
  }
}
```

### 函数

- isnumber

判断给定的值 是否 是一个数字。

```js
isnumber(#ff0);     // false
isnumber(blue);     // false
isnumber("string"); // false
isnumber(1234);     // true
isnumber(56px);     // true
isnumber(7.8%);     // true
isnumber(keyword);  // false
isnumber(url(...)); // false

```

- iscolor:判断给定的值 是否 是一个颜色。
- isurl: 判断给定的值 是否 是一个 url 。
- lighten:增加一定数值的颜色亮度。
- darken:降低一定数值的颜色亮度。
- fade: 给颜色设定一定数值的透明度。

### 其他

#### 引入 css,less 文件

使用@import

```less
//main.less
@wp: 960px;
.color {
  color: #fff;
}

//main.css
.color1 {
  color: #ff6600;
}

//当前less文件
@import 'main'; //可以不加后缀
@import 'main.css'; // 必须增加后缀

.content {
  width: @wp;
}

/* 生成的 CSS */
.color {
  color: #fff;
}
.color1 {
  color: #ff6600;
}
.content {
  width: 960px;
}
```

#### 避免编译

```less
/* Less */
#main {
  width: ~'calc(300px-30px)';
}

/* 生成后的 CSS */
#main {
  width: calc(300px-30px);
}
```

不然就是

```less
/* Less */
#main {
  width: calc(300px-30px);
}

/* 生成后的 CSS */
#main {
  width: calc(270px);
}
```

#### 使用 JS

因为 Less 是由 JS 编写，所以 Less 有一得天独厚的特性：代码中使用 Javascript

```less
/* Less */
@content:` "aaa".toUpperCase()`;
#randomColor {
  @randomColor: ~'rgb(`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`)';
}
#wrap {
  width: ~'`Math.round(Math.random() * 100)`px';
  &:after {
    content: @content;
  }
  height: ~'`window.innerHeight`px';
  alert: ~'`alert(1)`';
  #randomColor();
  background-color: @randomColor;
}
/* 生成后的 CSS */

// 弹出 1
#wrap {
  width: 随机值（0~100）px;
  height: 743px; //由电脑而异
  background: 随机颜色;
}
#wrap::after {
  content: 'AAA';
}
```

<BackTop></BackTop>