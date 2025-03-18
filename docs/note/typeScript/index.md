---
title: TypeScript
---

# TypeScript

## 介绍

[一个用于 TypeScript 和 JavaScript 的在线编辑器](https://www.typescriptlang.org/zh/play)

[一个 ts 类型相关的刷题项目](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)

TypeScript 是 JavaScript 的类型的超集，支持 ES6 语法，支持面向对象编程的概念，如类、接口、继承、泛型等

超集，不得不说另外一个概念，子集，怎么理解这两个呢，举个例子，如果一个集合 A 里面的的所有元素集合 B 里面都存在，那么我们可以理解集合 B 是集合 A 的超集，集合 A 为集合 B 的子集

<ImagePreview src="/images/ts/image.png"></ImagePreview>

其实是一种静态类型检查的语言，提供了类型注解，在代码编译阶段就可以检查出数据类型的错误

同时扩展了 JavaScript 的语法，所以任何现有的 JavaScript 程序可以不加改变的在 TypeScript 下工作

为了保证兼容性，TypeScript 在编译阶段需要编译器编译成纯 JavaScript 来运行，是为大型应用之开发而设计的语言，如下：

ts 文件如下：

```js
const hello: string = 'Hello World!';
console.log(hello);
```

编译文件后：

```js
const hello = 'Hello World!';
console.log(hello);
```

## 特性

TypeScript 的特性主要有如下：

- **类型批注和编译时类型检查** ：在编译时批注变量类型
- **类型推断**：ts 中没有批注变量类型会自动推断变量的类型
- **类型擦除**：在编译过程中批注的内容和接口会在运行时利用工具擦除
- **接口**：ts 中用接口来定义对象类型
- **枚举**：用于取值被限定在一定范围内的场景
- **Mixin**：可以接受任意类型的值
- **泛型编程**：写代码时使用一些以后才指定的类型
- **名字空间**：名字只在该区域内有效，其他区域可重复使用该名字而不冲突
- **元组**：元组合并了不同类型的对象，相当于一个可以装不同类型数据的数组
- ...

#### 类型批注

通过类型批注提供在编译时启动类型检查的静态类型，这是可选的，而且可以忽略而使用 JavaScript 常规的动态类型

```js
function Add(left: number, right: number): number {
  return left + right;
}
```

对于基本类型的批注是 number、boolean 和 string，而弱或动态类型的结构则是 any 类型

#### 类型推断

当类型没有给出时，TypeScript 编译器利用类型推断来推断类型，如下：

```js
let str = 'string';
```

变量 str 被推断为字符串类型，这种推断发生在初始化变量和成员，设置默认参数值和决定函数返回值时

如果缺乏声明而不能推断出类型，那么它的类型被视作默认的动态 any 类型

#### 接口

接口简单来说就是用来描述对象的类型 数据的类型有 number、null、string 等数据格式，对象的类型就是用接口来描述的

```js
interface Person {
  name: string;
  age: number;
}

let tom: Person = {
  name: 'Tom',
  age: 25,
};
```

#### 为何选择 TypeScript

1.  TypeScript 增加了代码的可读性和可维护性
1.  新增了其他语言的语法，比如 Class（类）、Interface（接口）、Generics (泛型)、Enums （枚举）等。
1.  TypeScript 拥抱了 ES6 规范
1.  兼容很多第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供 TypeScript 读取。
1.  TypeScript 拥有活跃的社区

更值得一提的是，TypeScript 在开发时就能给出编译错误，而 JavaScript 错误则需要在运行时才能暴露。作为强类型语言，你可以明确知道数据的类型，代码可读性极强，几乎每个人都能理解。

#### 区别

- TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法
- TypeScript 可处理已有的 JavaScript 代码，并只对其中的 TypeScript 代码进行编译
- TypeScript 文件的后缀名 .ts （.ts，.tsx，.dts），JavaScript 文件是 .js
- 在编写 TypeScript 的文件的时候就会自动编译成 js 文件

更多的区别如下图所示：

<ImagePreview src="/images/ts/image1.png"></ImagePreview>

<!-- # 数据类型 -->

在开发阶段，可以为明确的变量定义为某种类型，这样 TypeScript 就能在编译阶段进行类型检查，当类型不合符预期结果的时候则会出现错误提示

和 javaScript 基本一致，也分成：

- 基本类型
- 引用类型

在基础类型上，TypeScript 增添了 void、any、enum 等原始类型

TypeScript 的数据类型主要有如下：

- boolean:（布尔类型）
- number:（数字类型）
- string:（字符串类型）
- array:（数组类型）
- tuple:（元组类型）
- enum:（枚举类型）
- any:（任意类型）
- null 和 undefined 类型
- void 类型
- never 类型
- object 对象类型

## 基本类型

### boolean（布尔）

```ts
let flag: boolean = true;

flag = 'str'; //报错错误写法，编译不通过
```

### number（数字）

数字类型和 javaScript 一样，TypeScript 的数值类型都是浮点数，可支持二进制、八进制、十进制和十六进制

```js
let num: number = 123;
// num = '456'; // 错误
num = 456; //正确
```

进制表示：

```js
let decLiteral: number = 6; // 十进制
let hexLiteral: number = 0xf00d; // 十六进制
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o744; // 八进制
```

### bigint（大整数）

bigint 类型包含所有的大整数。

```js
const x: bigint = 123n;
const y: bigint = 0xffffn;
```

<Alert message='bigint 与 number 类型不兼容。'></Alert>

```js
const x: bigint = 123; // 报错
const y: bigint = 3.14; // 报错
```

### string（字符串）

跟 javaScript 一样，可以使用双引号（" "）或单引号（' '）表示字符串，也可以使用模版字符串``进行包裹

```js
let str: string = 'js';
str = 'test';

let name: string = '小明';
let sentence: string = `Hello, my name is ${name}`;
```

### symbol

symbol 类型包含所有的 Symbol 值。

```js
const x: symbol = Symbol();
```

### array（数组）

```js
//es5
var arr = [1, '2323', false];

//第一种定义方法，数组中有字符串或者其他类型依然报错，编译错误
var arr: number[] = [1, 2, 3];
var arr: string[] = ['1', '2', '3'];

//第二种定义方法，数组中有字符串或者其他类型依然报错，编译错误
let arr: Array<number> = [11, 22, 23];
let arr: Array<string> = ['1', '2', '3'];

//第三种定义方法
var arr: any[] = ['123', true, 12];
```

### tuple（元组）

属于数组的一种（可以在数组中指定类型，不过必须按照自己定义的顺序传类型）

```js
let arr: [string, number, boolean] = ['1', 3.14, true];
```

赋值的类型、位置、个数需要和定义（生明）的类型、位置、个数一致

### enum（枚举）

enum 类型是对 JavaScript 标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字

主要用来定义标识符的，例如支付状态（pay_status）,0：未支付，1：支付，2：交易成功

```js
//枚举类型的格式
enum 枚举名{
标识符①[=整型常数],
标识符②[=整型常数],
  ...
标识符N[=整型常数],
};

enum Pay_status = {
  no_pay = 0,
  pay = 1,
  success = 2
}
var f:Pay_status = Pay_status.success
console.log(f)    //2


enum Color = {red, blue, orange}
var c: Color = Color.blue
console.log(c)   //输出1，因为没有赋值，所以默认取索引值
//如果blue赋值为5，orange默认赋值，orange输出的是6,这是规定
```

#### 数字枚举

当我们声明一个枚举类型是,虽然没有给它们赋值,但是它们的值其实是默认的数字类型,而且默认从 0 开始依次累加:

```js
enum Direction {
  Up,   // 值默认为 0
  Down, // 值默认为 1
  Left, // 值默认为 2
  Right // 值默认为 3
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
```

如果我们将第一个值进行赋值后，后面的值也会根据前一个值进行累加 1：

```js
enum Direction {
  Up = 10,
  Down,
  Left,
  Right
}

console.log(Direction.Up);     // 10
console.log(Direction.Down);   // 11
console.log(Direction.Left);   // 12
console.log(Direction.Right);  // 13
```

#### 字符串枚举

```js
// 枚举类型的值其实也可以是字符串类型：
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

console.log(Direction['Right']);    // Right
console.log(Direction.Up);           // Up
```

如果设定了一个变量为字符串之后，后续的字段也需要赋值字符串，否则报错：

```js
enum Direction {
  Up = 'UP',
  Down, // error TS1061: Enum member must have initializer
  Left, // error TS1061: Enum member must have initializer
  Right // error TS1061: Enum member must have initializer
}
```

#### 异构枚举

即将数字枚举和字符串枚举结合起来混合起来使用，如下：

```js
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

通常情况下我们很少会使用异构枚举

#### 本质

现在一个枚举的案例如下：

```js
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

通过编译后，javascript 如下：

```js
var Direction;
(function (Direction) {
  Direction[(Direction['Up'] = 0)] = 'Up';
  Direction[(Direction['Down'] = 1)] = 'Down';
  Direction[(Direction['Left'] = 2)] = 'Left';
  Direction[(Direction['Right'] = 3)] = 'Right';
})(Direction || (Direction = {}));
```

上述代码可以看到， Direction[Direction["Up"] = 0] = "Up"可以分成

- `Direction["Up"] = 0`
- `Direction[0] = "Up"`

所以定义枚举类型后，可以通过正反映射拿到对应的值，如下：

```js
enum Direction {
  Up,
  Down,
  Left,
  Right
}

console.log(Direction.Up === 0); // true
console.log(Direction[0]); // Up
```

并且多处定义的枚举是可以进行合并操作，如下：

```js
enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right'
}

enum Direction {
  Center = 1
}
```

编译后，js 代码如下：

```js
var Direction;
(function (Direction) {
  Direction['Up'] = 'Up';
  Direction['Down'] = 'Down';
  Direction['Left'] = 'Left';
  Direction['Right'] = 'Right';
})(Direction || (Direction = {}));
(function (Direction) {
  Direction[(Direction['Center'] = 1)] = 'Center';
})(Direction || (Direction = {}));
```

可以看到，Direction 对象属性回叠加

### any（任意）

可以指定任何类型的值，在编程阶段还不清楚类型的变量指定一个类型，不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查，这时候可以使用 any 类型

```js
var num: any = 123;
num = 'str';
console.log(num); //str,跟es5类型一样，随便改变类型值，

//用处：这样不加any会报错
var oBox: any = document.getElementById('id');
oBox.style.color = 'red';
```

### unknown

任何类型都可以是 any 类型，any 类型就相当于是免检标签，给了开发者很大的自由，TypeScript 允许 any 类型的值进行任何操作，对它一路绿灯

```js
let score: any = 87.5;
let num = Math.round(score); // ok
```

任何类型也都可以是 unknown 类型，但与 any 完全相反，unknown 类型就像是 TypeScript 给打上了一个重点检查的标签。在没有对它进行类型检查之前，unknow 类型的变量是不能进行任何操作的。

```js
let score: unknown = 87.5;
let num = Math.round(score); //error
```

<ImagePreview src="/images/ts/image2.png"></ImagePreview>

那如何使 unknown 类型能正常使用呢
让 TypeScript 编译器"看到"并且"相信"你的操作是合法安全的。

```js
let score: unknown = 87.5;

if (typeof score === 'number') {
  let num = Math.round(score); // ok
}
```

```js
// 断言
let score: unknown = 87.5;
let num = Math.round(score as number);

// 或者
let num = Math.Round(<number>score);
```

任意类型的值都是可以复制给 any 与 unknown 二者， any 会绕过类型检查，直接可用，而 unkonwn 则必须要在判断完它是什么类型之后才能继续用，any 就是个自行车辅助轮, 习惯了 TS 的强类型检查规则应该尽快扔掉使用类型更安全的 unkown。

### null 和 undefined

在 JavaScript 中 null 表示 "什么都没有"，是一个只有一个值的特殊类型，表示一个空对象引用，而 undefined 表示一个没有设置值的变量

默认情况下 null 和 undefined 是所有类型的子类型， 就是说你可以把 null 和 undefined 赋值给 number 类型的变量

```js
// null和undefined，是其他（never类型）数据类型的子类型

var num: number; //会输出undefined,但是代码会报错

var num: undefined; //这样就不会报错，正确

// 但是项目中不会这样使用

var num: number | undefined; //不会报错

//一个元素类型可能是number类型，可能是null ，可能是undefined
var num: number | null | undefined;
num = 1234;
```

但是 ts 配置了--strictNullChecks 标记，null 和 undefined 只能赋值给 void 和它们各自

### void

ts 中的 viod 表示没有任何类型，一般用于定义方法的时候方法没有返回值

```js
//es5的定义方法
function run() {
  console.log('run');
}
run();

//ts中的一个方法没有任何返回值可以这样来写
function run(): void {
  console.log('run');
}
run();
```

### never

never 是其他类型 （包括 null 和 undefined）的子类型，可以赋值给任何类型，代表从不会出现的值

但是没有类型是 never 的子类型，这意味着声明 never 的变量只能被 never 类型所赋值，基本用不到

never 类型一般用来指定那些总是会抛出异常、无限循环

```js
var a:undefined;
a = undefined；   // 正确，不会报错
a = 123;          // 不正确，报错


//错误写法，报错
var a:never;
a = 123;


//正确
var a:never;
a = () => {
 throw new Error("错误")
}()


// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}
```

## 函数

### 定义函数

```js
//函数声明法
function run(): string {
  return '123';
}
//错误写法,必须按照string进行返回
function run(): string {
  return 123;
}

//匿名声明法
var run = function run(): number {
  return 123;
};
run();

//ts中定义方法传参
function getInfo(name: string, age: number): string {
  return `${name}----${age}`;
}
alert(getInfo('zhangsan', 12));
// 匿名函数同样以此
```

### 可选参数

```js
//es5里面方法的实参和形参可以不一样，但是ts中必须一样，如果不一样就需要配置可选参数
function getInfo(name: string, age?: number): string {
  return `${name}----${age}`;
}
alert(getInfo('zhangsan'));

// 注意：可选参数必须配置到参数的最后面,虽然能执行，但会在vscode会报错，不严谨，所以是错误写法
function getInfo(name?: string, age: number): string {
  return `${name}----${age}`;
}
```

### 默认参数

```js
//在es5中没法设置 默认参数，但是在es6和ts中都可以设置默认参数
function getInfo(name: string, age: number = 20): string {
  return `${name}----${age}`;
}
getInfo('zhangsan'); //zhangsan----20
getInfo('zhangsan, 30'); //zhangsan----30
```

### 剩余参数

```js
//三点运算符，接受新参传过来的值
function  sum(...result:number[]) : number {
  var sum = 0;
  for (let i = 0; i < result.length; i++) {
      sum + result[i];
  }
  return sum;
}
sum(1, ,2)
```

### 函数的重载

```js
//java中方法的重载，重载指的是两个或者两个以上的同名函数，但是他们的参数不一样，这时候就会出现函数的重载情况
//ts中的重载，通过为同一个函数提供多个函数类型定义来实现多种功能的目的
//ts为了兼容es5以及es6，重载的写法和java中有区别
//es5中出现同名的函数或者方法，下面的函数或者方法会替换掉上面的方法
//ts中的重载
function getInfo(name:string):string;
function getInfo(age:number):number;
function getInfo(str:any):any {
  if (typeof str ==="string") {
      return '我叫' + str;
  } else {
      return '我的年龄' + str;
  }
}
alert(getInfo('张三'))   //我叫张三
alert(getInfo(20))        //我的年龄20
alert(getInfo(true))      //错误的写法，会报错
```

## 接口（interface）

接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的**类**去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法

简单来讲，一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法

TypeScript 的核心功能之一就是对类型做检测，虽然这种检测方式是“鸭式辨型法”，而接口的作用就是为为这些类型命名和为你的代码或第三方代码定义一个约定

### 定义

```js
interface Interface_name {}
```

例如有一个函数，这个函数接受一个 User 对象，然后返回这个 User 对象的 name 属性:

```js
const getUserName = (user) => user.name;
```

可以看到，参数需要有一个 user 的 name 属性，可以通过接口描述 user 参数的结构

```js
interface User {
  name: string
  age: number
}

const getUserName = (user: User) => user.name
```

这些属性并不一定全部实现，上述传入的对象必须拥有 name 和 age 属性，否则 TypeScript 在编译阶段会报错，如下图：

<ImagePreview src="/images/ts/image3.png"></ImagePreview>

### 可选属性

如果不想要 age 属性的话，这时候可以采用**可选属性**，如下表示：

```js
interface User {
  name: string
  age?: number
}
```

这时候 age 属性则可以是 number 类型或者 undefined 类型

### 只读

有些时候，我们想要一个属性变成只读属性，在 TypeScript 只需要使用 readonly 声明，如下：

```js
interface User {
  name: string
  age?: number
  readonly isMale: boolean
}
```

当我们修改属性的时候，就会出现警告，如下所示：

<ImagePreview src="/images/ts/image4.png"></ImagePreview>

### 函数

这是属性中有一个函数，可以如下表示：

```js
interface User {
  name: string
  age?: number
  readonly isMale: boolean
  say: (words: string) => string
}
```

如果传递的对象不仅仅是上述的属性，这时候可以使用：

- 交叉推断

```js
interface User {
  name: string
  age: number
}

const getUserName = (user: User & { color: string}) => user.name
getUserName({color: 'yellow'})
```

### 索引签名

给接口添加字符串**索引签名**

```js
interface User {
  name: string
  age: number
  [k: string]: any;
}


let user: User ={
  name: '小红',
  age: 18,
  address: '辽宁'  // 不报错
}
```

### 继承

<ImagePreview src="/images/ts/image5.png"></ImagePreview>

也可以继承多个，父类通过逗号隔开，如下：

```js
interface Father {
  color: string
}

interface Mother {
  height: number
}

interface Son extends Father,Mother{
  name: string
  age: number
}

const son: Son = {
  name: '小红',
  color: 'red',
  height: 18,
  age: 20
}
```

## 类（Class）

类（Class）是面向对象程序设计（OOP，Object-Oriented Programming）实现信息封装的基础

类是一种用户定义的引用数据类型，也称类型

传统的面向对象语言基本都是基于类的，JavaScript 基于原型的方式让开发者多了很多理解成本

在 ES6 之后，JavaScript 拥有了 class 关键字，虽然本质依然是构造函数，但是使用起来已经方便了许多

但是 JavaScript 的 class 依然有一些特性还没有加入，比如修饰符和抽象类

TypeScript 的 class 支持面向对象的所有特性，比如 类、接口等

### 定义

定义类的关键字为 class，后面紧跟类名，类可以包含以下几个模块（类的数据成员）：

- **字段** ： 字段是类里面声明的变量。字段表示对象的有关数据。
- **构造函数**： 类实例化时调用，可以为类的对象分配内存。
- **方法**： 方法为对象要执行的操作

```js
class Car {
  // 字段
  engine: string;

  // 构造函数
  constructor(engine: string) {
    this.engine = engine;
  }

  // 方法，实例化类的时候触发的方法
  disp(): void {
    console.log('发动机为 :   ' + this.engine);
  }
}
```

### 继承

类的继承使用过 extends 的关键字

```js
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

Dog 是一个 派生类，它派生自 Animal 基类，派生类通常被称作子类，基类通常被称作 超类

Dog 类继承了 Animal 类，因此实例 dog 也能够使用 Animal 类 move 方法

同样，类继承后，子类可以对父类的方法重新定义，这个过程称之为方法的重写，通过 super 关键字是对父类的直接引用，该关键字可以引用父类的属性和方法，如下：

```js
class PrinterClass {
  doPrint(): void {
    console.log('父类的 doPrint() 方法。');
  }
}

class StringPrinter extends PrinterClass {
  doPrint(): void {
    super.doPrint(); // 调用父类的函数
    console.log('子类的 doPrint()方法。');
  }
}
```

### 修饰符

可以看到，上述的形式跟 ES6 十分的相似，Typescript 在此基础上添加了三种修饰符：

- 公共 public：可以自由的访问类程序里定义的成员
- 私有 private：只能够在该类的内部进行访问
- 受保护 protect：除了在该类的内部可以访问，还可以在子类中仍然可以访问

### 私有修饰符

只能够在该类的内部进行访问，实例对象并不能够访问

<ImagePreview src="/images/ts/image6.png"></ImagePreview>

并且继承该类的子类并不能访问，如下图所示：

<ImagePreview src="/images/ts/image7.png"></ImagePreview>

### 受保护修饰符

跟私有修饰符很相似，实例对象同样不能访问受保护的属性，如下：

<ImagePreview src="/images/ts/image8.png"></ImagePreview>

有一点不同的是 protected 成员在子类中仍然可以访问

<ImagePreview src="/images/ts/image9.png"></ImagePreview>

除了上述修饰符之外，还有只读**修饰符**

#### 只读修饰符

通过 readonly 关键字进行声明，只读属性必须在声明时或构造函数里被初始化，如下：

<ImagePreview src="/images/ts/image10.png"></ImagePreview>

除了实例属性之外，同样存在静态属性

### 静态属性

这些属性存在于类本身上面而不是类的实例上，通过 static 进行定义，访问这些属性需要通过 类型.静态属性 的这种形式访问，如下所示：

```js
class Square {
  static width = '100px';
}

console.log(Square.width); // 100px
```

上述的类都能发现一个特点就是，都能够被实例化，在 Typescript 中，还存在一种抽象类

### 抽象类

抽象类做为其它派生类的基类使用，它们一般不会直接被实例化，不同于接口，抽象类可以包含成员的实现细节

abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法，如下所示：

```js
abstract class Animal {
  abstract makeSound(): void;
  move(): void {
      console.log('roaming the earch...');
  }
}
```

这种类并不能被实例化，通常需要我们创建子类去继承，如下：

```js
class Cat extends Animal {
  makeSound() {
    console.log('miao miao');
  }
}

const cat = new Cat();

cat.makeSound(); // miao miao
cat.move(); // roaming the earch...
```

### 应用场景

除了日常借助类的特性完成日常业务代码，还可以将类（class）也可以作为接口，尤其在 React 工程中是很常用的，如下：

```js
export default class Carousel extends React.Component<Props, State> {}
```

由于组件需要传入 props 的类型 Props ，同时有需要设置默认 props 即 defaultProps，这时候更加适合使用 class 作为接口

先声明一个类，这个类包含组件 props 所需的类型和初始值：

```js
// props的类型
export default class Props {
  public children: Array<React.ReactElement<any>> | React.ReactElement<any> | never[] = []
  public speed: number = 500
  public height: number = 160
  public animation: string = 'easeInOutQuad'
  public isAuto: boolean = true
  public autoPlayInterval: number = 4500
  public afterChange: () => {}
  public beforeChange: () => {}
  public selesctedColor: string
  public showDots: boolean = true
}
```

当我们需要传入 props 类型的时候直接将 Props 作为接口传入，此时 Props 的作用就是接口，而当需要我们设置 defaultProps 初始值的时候，我们只需要:

public static defaultProps = new Props()

Props 的实例就是 defaultProps 的初始值，这就是 class 作为接口的实际应用，我们用一个 class 起到了接口和设置初始值两个作用，方便统一管理，减少了代码量

## 泛型（T）

泛型程序设计（generic programming）是程序设计语言的一种风格或范式

泛型允许我们在强类型程序设计语言中编写代码时使用一些以后才指定的类型，在实例化时作为参数指明这些类型在 Typescript 中，定义函数，接口或者类的时候，不预先定义好具体的类型，而在使用的时候在指定类型的一种特性

<ImagePreview src="/images/ts/image11.png"></ImagePreview>

<ImagePreview src="/images/ts/image12.png"></ImagePreview>

假设我们用一个函数，它可接受一个 number 参数并返回一个 number 参数，如下写法：

```js
function returnItem(para: number): number {
  return para;
}
```

如果我们打算接受一个 string 类型，然后再返回 string 类型，则如下写法：

```js
function returnItem(para: string): string {
  return para;
}
```

上述两种编写方式，存在一个最明显的问题在于，代码重复度比较高

虽然可以使用 any 类型去替代，但这也并不是很好的方案，因为我们的目的是接收什么类型的参数返回什么类型的参数，即在运行时传入参数我们才能确定类型

这种情况就可以使用泛型，如下所示：

```js
function returnItem<T>(para: T): T {
  return para;
}
```

可以看到，泛型给予开发者创造灵活、可重用代码的能力

泛型通过<>的形式进行表述，可以声明：

- 函数
- 接口
- 类

### 函数声明

声明函数的形式如下：

```js
function returnItem<T>(para: T): T {
  return para;
}
```

定义泛型的时候，可以一次定义**多个类型参数**，比如我们可以同时定义泛型 T 和 泛型 U：

```js
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

### 接口声明

声明接口的形式如下：

```js
interface ReturnItemFn<T> {
  (para: T): T;
}
```

那么当我们想传入一个 number 作为参数的时候，就可以这样声明函数:

```js
const returnItem: ReturnItemFn<number> = (para) => para;
```

### 类声明

使用泛型声明类的时候，既可以作用于类本身，也可以作用与类的成员函数

下面简单实现一个元素同类型的栈结构，如下所示：

```js
class Stack<T> {
  private arr: T[] = []

  public push(item: T) {
      this.arr.push(item)
  }

  public pop() {
      this.arr.pop()
  }
}
```

使用方式如下：

`const stack = new Stacn<number>()`

如果上述只能传递 string 和 number 类型，这时候就可以使用 `<T extends xx>` 的方式猜实现**约束泛型**，如下所示：

<ImagePreview src="/images/ts/image13.png"></ImagePreview>

除了上述的形式，泛型更高级的使用如下：

例如要设计一个函数，这个函数接受两个参数，一个参数为对象，另一个参数为对象上的属性，我们通过这两个参数返回这个属性的值

这时候就设计到泛型的索引类型和约束类型共同实现

### 索引类型、约束类型

索引类型 keyof T 把传入的对象的属性类型取出生成一个联合类型，这里的泛型 U 被约束在这个联合类型中，如下所示：

```js
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
return obj[key] // ok
}
```

上述为什么需要使用泛型约束，而不是直接定义第一个参数为 object 类型，是因为默认情况 object 指的是{}，而我们接收的对象是各种各样的，一个泛型来表示传入的对象类型，比如 T extends object

使用如下图所示：

<ImagePreview src="/images/ts/image14.png"></ImagePreview>

### 多类型约束

例如如下需要实现两个接口的类型约束：

```js
interface FirstInterface {
  doSomething(): number;
}

interface SecondInterface {
  doSomethingElse(): string;
}
```

可以创建一个接口继承上述两个接口，如下：

```js
interface ChildInterface extends FirstInterface, SecondInterface {}
```

正确使用如下：

```js
class Demo<T extends ChildInterface> {
private genericProperty: T

constructor(genericProperty: T) {
  this.genericProperty = genericProperty
}
useT() {
  this.genericProperty.doSomething()
  this.genericProperty.doSomethingElse()
}
}
```

通过泛型约束就可以达到多类型约束的目的

## 高级类型

除了 string、number、boolean 这种基础类型外，在 TypeScript 类型声明中还存在一些高级的类型应用

这些高级类型，是 TypeScript 为了保证语言的灵活性，所使用的一些语言特性。这些特性有助于我们应对复杂多变的开发场景

常见的高级类型有如下：

- 交叉类型
- 联合类型
- 类型别名
- 类型索引
- 类型约束
- 映射类型
- 条件类型

### &（交叉类型）

通过 & 将多个类型合并为一个类型，包含了所需的所有类型的特性，本质上是一种并的操作,

语法如下：

`T & U`

适用于对象合并场景，如下将声明一个函数，将两个对象合并成一个对象并返回：

```js
type PartialPointX = { x: number };
type Point = PartialPointX & { y: number };

let point: Point = {
  x: 1,
  y: 1,
};
```

在上面代码中我们先定义了 PartialPointX 类型，接着使用 & 运算符创建一个新的 Point 类型，表示一个含有 x 和 y 坐标的点，然后定义了一个 Point 类型的变量并初始化。

### |（联合类型）

联合类型的语法规则和逻辑 “或” 的符号一致，表示其类型为连接的多个类型中的任意一个，本质上是一个交的关系

语法如下：

`T | U`

例如 number | string | boolean 的类型只能是这三个的一种，不能共存

如下所示：

```js
function formatCommandline(command: string[] | string) {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }
}
```

### as（类型断言）

有时候你会遇到这样的情况，你会比 TypeScript 更了解某个值的详细信息。通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过类型断言这种方式可以告诉编译器，“相信我，我知道自己在干什么”。类型断言好比其他语言里的类型转换，但是不进行特殊的数据检查和解构。它没有运行时的影响，只是在编译阶段起作用。

<ImagePreview src="/images/ts/image15.png"></ImagePreview>

这时候我们就可以利用断言来明确指定的类型

```js
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
```

### ！, ？（非空断言）

在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符 ! 可以用于断言操作对象是非 null 和非 undefined 类型。具体而言，x! 将从 x 值域中排除 null 和 undefined 。

<ImagePreview src="/images/ts/image16.png"></ImagePreview>

### !（确定赋值断言）

允许在实例属性和变量声明后面放置一个 ! 号，从而告诉 TypeScript 该属性会被明确地赋值。

<ImagePreview src="/images/ts/image17.png"></ImagePreview>

这时候我们就可以用！来进行断言

```js
let x!: number;
b();
console.log(2 * x); // 不报错
function b() {
  x = 10;
}
```

### type（类型别名）

类型别名会给一个类型起个新名字，类型别名有时和接口很像，但是可以作用于原始值、联合类型、元组以及其它任何你需要手写的类型

可以使用 `type SomeName = someValidTypeAnnotation` 的语法来创建类型别名：

```js
type some = boolean | string;

const b: some = true; // ok
const c: some = 'hello'; // ok
const d: some = 123; // 不能将类型“123”分配给类型“some”
```

此外类型别名可以是泛型:

`type Container<T> = { value: T };`

也可以使用类型别名来在属性里引用自己：

```js
type Tree<T> = {
  value: T,
  left: Tree<T>,
  right: Tree<T>,
};
```

可以看到，类型别名和接口使用十分相似，都可以描述一个对象或者函数

两者最大的区别在于，interface 只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛

### keyof（类型索引）

keyof 类似于 Object.keys ，用于获取一个接口中 Key 的联合类型。

```js
interface Person {
  name: string;
  age: number;
  gender: string;
}
type P = keyof Person; // "name" | "age" | "gender"
// 等效于

type P = "name" | "age" | "gender"
```

### 访问对象形式

```js
type Person = { age: number, name: string, alive: boolean };
type Age = Person['age'];
// type Age = number

type I1 = Person['age' | 'name'];
// type I1 = string | number
```

### is

is 关键字用于类型保护，它用于在运行时检查一个值是否符合某个类型

```js
function isString(value: any): value is string {
  return typeof value === "string";
}

function logIfString(value: any) {
  if (isString(value)) {
    console.log(value);
  }
}

```

在这个例子中，我们定义了一个 isString 函数来检查一个值是否为字符串类型，如果是字符串类型，它会返回 true。然后我们在 logIfString 函数中使用 isString 函数来检查传入的参数是否为字符串类型，如果是，我们就打印这个字符串。

### typeof

typeof 的主要用途是在类型上下文中获取变量或者属性的类型

```js
interface Person {
  name: string;
  age: number;
}
const sem: Person = { name: 'semlinker', age: 30 };
type Sem = typeof sem; // type Sem = Person
```

此外，typeof 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型，比如：

```js
function toArray(x: number): Array<number> {
  return [x];
}
type Func = typeof toArray; // -> (x: number) => number[]
```

项目中一般常用的场景如 react 函数式组件：

```js
import Table from './components/table';
const ref = useRef < ComponentRef < typeof Table >> null;

type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === 'string') {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === 'number') {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```

### extends（类型约束）

通过关键字 extend 进行约束，不同于在 class 后使用 extends 的继承作用，泛型内使用的主要作用是对泛型加以约束

```js
type BaseType = string | number | boolean

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}
```

类型约束通常和类型索引一起使用，例如我们有一个方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用 extends 和 keyof 进行约束。

```js
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')
```

### in（映射类型）

in 用于取联合类型的值。主要用于数组和对象的构造。

但切记不要用于 interface，否则会出错

<ImagePreview src="/images/ts/image18.png"></ImagePreview>

通过 in 关键字做类型的映射，遍历已有接口的 key 或者是遍历联合类型，如下例子：

```js
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string
  b: string
}

type ReadOnlyObj = Readonly<Obj>
```

上述的结构，可以分成这些步骤：

- keyof T：通过类型索引 keyof 的得到联合类型 'a' | 'b'
- P in keyof T 等同于 p in 'a' | 'b'，相当于执行了一次 forEach 的逻辑，遍历 'a' | 'b'

所以最终 ReadOnlyObj 的接口为下述：

```js
interface ReadOnlyObj {
  readonly a: string;
  readonly b: string;
}
```

### extends...？：（条件类型）

条件运算符 extends...?:可以根据当前类型是否符合某种条件，返回不同的类型。

`T extends U ? X : Y`

上面的意思就是，如果 T 是 U 的子集，就是类型 X，否则为类型 Y

```js
type T = 1 extends number ? true : false; // true
```

上面示例中，1 是 number 的子类型，所以返回 true。

### Omit（排除）

是 TypeScript 3.5 版本推出的特性，以一个类型为基础支持剔除某些属性，然后返回一个新类型

语法：

```js
//  T 是 type也就是类型的简写， K 是 key 的简写，所以这里的意思就是忽略该类型的key属性
Omit <T, K>
// 若是忽略过个的话
Omit<T, K | M | N>
```

例如：

```js
type Person = {
  name: string,
  age: string,
  location: string,
};

type PersonWithoutLocation = Omit<Person, 'location'>;

// 相当于
type PersonWithoutLocation = {
  name: string,
  age: string,
};
```

### Pick（选取）

从类型定义的属性中，选取指定一组属性，返回一个新的类型定义

主要是从一个已知的类型中，取出子集，作为一个新的类型返回。

```js
interface Person {
  name: string;
  age: number;
  id: number;
}

// 选取Person中name跟id
type Woman = Pick<Person, 'name' | 'id'>;

// 此时 Woman 等效于 Female
interface Female {
  name: string;
  id: number;
}
```

### Exclude<T,U> (剔除)

从 T 中剔除可以赋值给 U 的类型 (返回 T 中除了 U 的类型)

```js
示例一：
type res = Exclude<"a"|"c"|"d","c"> ;

// type res = "a"|"d"

示例二：
type Itype =
| { name: string }
| { name: string; age: number }
| 'a'
| 'c'
| { id: number };

type res = Exclude<Itype, { name: string } | 'c'>;

// type res = { id: number } | "a"
```

### Extract<T,U> (提取)

提取 T 中可以赋值给 U 的类型（提取 T 与 U 的交集）

```js
type res = Extract<'a' | 'b' | 'c', 'b' | 'c'>;
//type res = "b"|"c"
```

### Required （全转必选）

```js
type IUser = {
  name?: string,
  id?: number,
};

const user: Required<IUser> = {
  name: 'mk',
};
```

<ImagePreview src="/images/ts/image22.jpg"></ImagePreview>

### Partial（全转可选）

```js
type IUser = {
  name:string
  password:string
  id:number
}

const user:Partial<IUser> = {} ; //属性类型为可选，所以不写也不会报错
```

### Readony（全转只读）

```js
type IUser = {
  name: string,
};

let userRd: Readonly<IUser> = { name: '12345' };
userRd.name = 'xioahong'; // 报错
```

<ImagePreview src="/images/ts/image23.jpg"></ImagePreview>

### Record (key=>value)

它用于创建一个具有特定键值对的新类型。Record 接受两个类型参数：一个是键的类型，另一个是值的类型。它将第一个类型（键）映射为第二个类型（值），生成一个新的对象类型，其中每个键的类型对应于指定的值类型

Record 的基本语法如下：

```ts
Record<Keys, Type>;
```

- Keys 是一个联合类型，表示你希望在结果类型中拥有的所有键。
- Type 是你希望这些键所具有的值的类型。

例如：

```js
type Api = Record<'get' | 'post', { url: string, type: string }>;
```

<ImagePreview src="/images/ts/image24.jpg"></ImagePreview>

### inter (推导泛型参数)

infer 关键字用来定义泛型里面推断出来的类型参数，而不是外部传入的类型参数

<Alert>

infer 语法的限制如下：

- infer 只能在条件类型的 extends 子句中使用
- infer 得到的类型只能在 true 语句中使用, 即 X 中使用

</Alert>

```js
// 推断函数的参数类型和返回值类型。
type ReturnPromise<T> = T extends (...args: infer A) => infer R
? (...args: A) => Promise<R>
: T;
```

上面示例中，如果 T 是函数，就返回这个函数的 Promise 版本，否则原样返回。infer A 表示该函数的参数类型为 A，infer R 表示该函数的返回值类型为 R。

如果不使用 infer，就不得不把 `ReturnPromise<T>`写成 `ReturnPromise<T, A, R>`，这样就很麻烦。

```js
// 提取对象指定属性的例子。

type MyType<T> = T extends {
  a: infer M;
  b: infer N;
} ? [M, N]
: never;

type T = MyType<{ a: string; b: number }>;
// type T = [string, number]

```

上面示例中，infer 提取了参数对象的属性 a 和属性 b 的类型。

### Parameters(函数参数类型)

`Parameters<T>`从函数类型 T 里面提取参数类型，组成一个元组返回。

```js
type T1 = Parameters<() => string>; // []

type T2 = Parameters<(s: string) => void>; // [s:string]

type T3 = Parameters<<T>(arg: T) => T>; // [arg: unknown]

type T4 = Parameters<(x: { a: number, b: string }) => void>; // [x: { a: number, b: string }]

type T5 = Parameters<(a: number, b: number) => number>; // [a:number, b:number]
```

### ReturnType(函数返回值类型)

`ReturnType<T>`提取函数类型 T 的返回值类型，作为一个新类型返回。

```js
type T1 = ReturnType<() => string>; // string

type T2 = ReturnType<
  () => {
    a: string,
    b: number,
  },
>; // { a: string; b: number }

type T3 = ReturnType<(s: string) => void>; // void

type T4 = ReturnType<() => () => any[]>; // () => any[]

type T5 = ReturnType<typeof Math.random>; // number

type T6 = ReturnType<typeof Array.isArray>; // boolean

type T1 = ReturnType<any>; // any

type T2 = ReturnType<never>; // never
```

如果参数类型是泛型函数，返回值取决于泛型类型。如果泛型不带有限制条件，就会返回 unknown。

```js
type T1 = ReturnType<<T>() => T>; // unknown

type T2 = ReturnType<<T extends U, U extends number[]>() => T>; // number[]
```

如果类型不是函数，会报错。

```js
type T1 = ReturnType<boolean>; // 报错

type T2 = ReturnType<Function>; // 报错
```

## 装饰器（decorators）

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上

是一种在不改变原类和使用继承的情况下，动态地扩展对象功能

同样的，本质也不是什么高大上的结构，就是一个普通的函数，@expression 的形式其实是 Object.defineProperty 的语法糖

expression 求值后必须也是一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入

由于 Typescript 是一个实验性特性，若要使用，需要在 tsconfig.json 文件启动，如下：

```js
{
  "compilerOptions": {
      "target": "ES5",
      "experimentalDecorators": true
  }
}
```

Typescript 装饰器的使用和 javascript 基本一致

类的装饰器可以装饰：

- 类
- 方法/属性
- 参数
- 访问器

### 类装饰

例如声明一个函数 addAge 去给 Class 的属性 age 添加年龄.

```js
function addAge(constructor: Function) {
constructor.prototype.age = 18;
}

@addAge
class Person{
  name: string;
  age!: number;
  constructor() {
    this.name = 'huihui';
  }
}

let person = new Person();

console.log(person.age); // 18
```

上述代码，实际等同于以下形式：

```js
Person = addAge(function Person() { ... });
```

上述可以看到，当装饰器作为修饰类的时候，会把构造器传递进去。 constructor.prototype.age 就是在每一个实例化对象上面添加一个 age 属性

### 方法/属性装饰

同样，装饰器可以用于修饰类的方法，这时候装饰器函数接收的参数变成了：

- target：对象的原型
- propertyKey：方法的名称
- descriptor：方法的属性描述符

可以看到，这三个属性实际就是 Object.defineProperty 的三个参数，如果是类的属性，则没有传递第三个参数

如下例子：

```js
// 声明装饰器修饰方法/属性
function method(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target);
  console.log('prop ' + propertyKey);
  console.log('desc ' + JSON.stringify(descriptor) + '\n\n');
  descriptor.writable = false;
}

function property(target: any, propertyKey: string) {
  console.log('target', target);
  console.log('propertyKey', propertyKey);
}

class Person {
  @property
  name: string;
  constructor() {
    this.name = 'huihui';
  }

  @method
  say() {
    return 'instance method';
  }

  @method
  static run() {
    return 'static method';
  }
}

const xmz = new Person();

// 修改实例方法say
xmz.say = function () {
  return 'edit';
};
```

输出如下图所示：

<ImagePreview src="/images/ts/image20.png"></ImagePreview>

### 参数装饰

接收 3 个参数，分别是：

- target ：当前对象的原型
- propertyKey ：参数的名称
- index：参数数组中的位置

```js
function logParameter(target: Object, propertyName: string, index: number) {
  console.log(target);
  console.log(propertyName);
  console.log(index);
}

class Employee {
  greet(@logParameter message: string): string {
    return `hello ${message}`;
  }
}
const emp = new Employee();
emp.greet('hello');
```

输入如下图：

<ImagePreview src="/images/ts/image19.png"></ImagePreview>

### 访问器装饰

使用起来方式与方法装饰一致，如下：

```js
function modification(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(target);
  console.log('prop ' + propertyKey);
  console.log('desc ' + JSON.stringify(descriptor) + '\n\n');
}

class Person {
  _name: string;
  constructor() {
    this._name = 'huihui';
  }

  @modification
  get name() {
    return this._name;
  }
}
```

### 装饰器工厂

如果想要传递参数，使装饰器变成类似工厂函数，只需要在装饰器函数内部再函数一个函数即可，如下：

```js
function addAge(age: number) {
  return function(constructor: Function) {
    constructor.prototype.age = age
  }
}

@addAge(10)
class Person{
  name: string;
  age!: number;
  constructor() {
    this.name = 'huihui';
  }
}

let person = new Person();
```

### 执行顺序

当多个装饰器应用于一个声明上，将由上至下依次对装饰器表达式求值，求值的结果会被当作函数，由下至上依次调用，例如如下：

```js
function f() {
  console.log("f(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("f(): called");
  }
}

function g() {
  console.log("g(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
      console.log("g(): called");
  }
}

class C {
  @f()
  @g()
  method() {}
}

// 输出
f(): evaluated
g(): evaluated
g(): called
f(): called
```

## 命名空间与模块

TypeScript 与 ECMAScript 2015 一样，任何包含顶级 import 或者 export 的文件都被当成一个模块

相反地，如果一个文件不带有顶级的 import 或者 export 声明，那么它的内容被视为全局可见的

例如我们在在一个 TypeScript 工程下建立一个文件 1.ts，声明一个变量 a，如下：

`const a = 1`

然后在另一个文件同样声明一个变量 a，这时候会出现错误信息

<ImagePreview src="/images/ts/image21.png"></ImagePreview>

提示重复声明 a 变量，但是所处的空间是全局的

如果需要解决这个问题，则通过 import 或者 export 引入模块系统即可，如下：

```js
const a = 10;

export default a;
```

在 Typescript 中，export 关键字可以导出变量或者类型，用法与 es6 模块一致，如下：

```js
export const a = 1;
export type Person = {
  name: String,
};
```

通过 import 引入模块，如下：

```js
import { a, Person } from './export';
```

### 命名空间

命名空间一个最明确的目的就是解决重名问题

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的

这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中

TypeScript 中命名空间使用 namespace 来定义，语法格式如下：

```js
namespace SomeNameSpaceName {
 export interface ISomeInterfaceName {      }
 export class SomeClassName {      }
}
```

以上定义了一个命名空间 SomeNameSpaceName，如果我们需要在外部可以调用 SomeNameSpaceName 中的类和接口，则需要在类和接口添加 export 关键字

使用方式如下：

`SomeNameSpaceName.SomeClassName`

命名空间本质上是一个对象，作用是将一系列相关的全局变量组织到一个对象的属性，如下：

```js
namespace Letter {
export let a = 1;
export let b = 2;
export let c = 3;
// ...
export let z = 26;
}
```

编译成 js 如下：

```js
var Letter;
(function (Letter) {
  Letter.a = 1;
  Letter.b = 2;
  Letter.c = 3;
  // ...
  Letter.z = 26;
})(Letter || (Letter = {}));
```

### 区别

- 命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象，使用起来十分容易。但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中
- 像命名空间一样，模块可以包含代码和声明。 不同的是模块可以声明它的依赖
- 在正常的 TS 项目开发过程中并不建议用命名空间，但通常在通过 d.ts 文件标记 js 库类型的时候使用命名空间，主要作用是给编译器编写代码的时候参考使用

## type 和 interface 的区别

### 相同点

#### 都可以定义一个对象或函数

**type**

```js
type Person = {
  name: string,
  age: number,
};
type addType = (num1: number, num2: number) => number;
```

**interface**

```js
interface Person {
  name: string;
  age: number;
}
interface addType {
  (num1: number, num2: number): number;
}
```

#### 都允许继承

interface 使用 extends 实现继承， type 使用交叉类型实现继承

**interface 继承 interface**

```js
interface Person {
  name: string;
}

interface Student extends Person {
  grade: number;
}
```

**type 继承 type**

```js
type Person = {
  name: string
}

type Student = Person & { grade: number  }    用交叉类型
```

**interface 继承 type**

```js
type Person = {
  name: string,
};

interface Student extends Person {
  grade: number;
}
```

**type 继承 interface**

```js
interface Person {
  name: string;
}

type Student = Person & { grade: number }; // 用交叉类型
```

### 不同点

type 可以声明基本类型、联合类型、交叉类型、元组， interface 只能声明对象类型

```js
type Name = string; // 基本类型

type arrItem = number | string; // 联合类型

type Person = {
  name: Name,
};
type Student = Person & { grade: number }; // 交叉类型
type Teacher = Person & { major: string };

type StudentAndTeacherList = [Student, Teacher]; // 元组类型

const list: StudentAndTeacherList = [
  { name: 'lin', grade: 100 },
  { name: 'liu', major: 'Chinese' },
];
```

interface 可以合并重复声明，type 不行

```js
interface Person {
  name: string;
}

interface Person {
  // 重复声明 interface，就合并了
  age: number;
}

const person: Person = {
  name: 'lin',
  age: 18,
};
```

重复声明 type ，就报错了

```js
type Person = {
  name: string,
};

type Person = {
  // 报错：Duplicate identifier 'Person'
  age: number,
};
```

赋值给 Record 类型时候，interface 可能会报错，type 不会报错

```js
type Obj = {
  name: string,
};

interface Obj2 {
  name: string;
}

const a: Obj = { name: 'xiaoming' };
const b: Obj2 = { name: 'xiaohong' };

// 把interface的值赋值给Record时候，需要明确interface里的属性
// 因为interface它会进行声明合并，所以明确不了里面的值
// 解决方案：增加索引签名
// interface Obj2 {
//    name: string
//    [key: string]: string
// }

let c: Record<string, string> = a;
let d: Record<string, string> = b; //报错： Type 'Obj2' is not assignable to type 'Record<string, string>'.Index signature for type 'string' is missing in type 'Obj2'
```

<BackTop></BackTop>