---
toc: content
title: 原型/原型链
---

# JavaScript

## 原型与原型链

### 构造函数创建对象

```js
function Person() {}
var person = new Person();
person.name = 'xuelin';
console.log(person.name); // xuelin
```

### prototype

每个函数都有一个 prototype 属性，就是我们经常在各种例子中看到的那个 prototype

```js
function Person() {}
// 虽然写在注释里，但是你要注意：
// prototype是函数才会有的属性
Person.prototype.name = 'xuelin';

var person1 = new Person();
var person2 = new Person();

console.log(person1.name); // xuelin
console.log(person2.name); // xuelin
```

函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中的 person1 和 person2 的原型。

每一个 JavaScript 对象(null 除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

用一张图表示构造函数和实例原型之间的关系

<ImagePreview src="/images/js/image2.jpg"></ImagePreview>

### \_\__proto_\_\_

这是每一个 JavaScript 对象(除了 null )都具有的一个属性，叫\_\__proto_\_\_，这个属性会指向该对象的原型。

```js
function Person() {}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

所以此时的关系图如图

<ImagePreview src="/images/js/image3.jpg"></ImagePreview>

### constructor

每个原型都有一个 constructor 属性指向关联的构造函数

```js
function Person() {}
console.log(Person === Person.prototype.constructor); // true
```

所以此时的关系图如图

<ImagePreview src="/images/js/image4.jpg"></ImagePreview>

综上我们已经得出：

```js
function Person() {}

var person = new Person();

console.log(person.__proto__ == Person.prototype); // true
console.log(Person.prototype.constructor == Person); // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype); // true
```

实例对象的 constructor 属性指向构造函数

```js
function Person() {}
var person = new Person();
console.log(person.constructor === Person); // true
```

当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到 constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：

```js
person.constructor === Person.prototype.constructor;
```

所以此时的关系图如图

<ImagePreview src="/images/js/image7.jpg"></ImagePreview>

### 实例与原型

当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还查不到，就去找原型的原型，一直找到最顶层为止

```js
function Person() {}

Person.prototype.name = 'xuelin';

var person = new Person();

person.name = 'xuelin2';
console.log(person.name); // xuelin2

delete person.name;
console.log(person.name); // xuelin
```

在这个例子中，我们给实例对象 person 添加了 name 属性，当我们打印 person.name 的时候，结果自然为 xuelin2

但是当我们删除了 person 的 name 属性时，读取 person.name，从 person 对象中找不到 name 属性就会从 person 的原型也就是 `person.__proto__` ，也就是 Person.prototype 中查找，幸运的是我们找到了 name 属性，结果为 xuelin

### 原型的原型

在前面，我们已经讲了原型也是一个对象，既然是对象，我们就可以用最原始的方式创建它，那就是

```js
var obj = new Object();
obj.name = 'xuelin';
console.log(obj.name); // xuelin
```

其实原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 **proto** 指向构造函数的 prototype ，所以我们的关系图：

<ImagePreview src="/images/js/image5.jpg"></ImagePreview>

### 原型链

那 Object.prototype 的原型呢？

```js
console.log(Object.prototype.__proto__ === null); // true
```

所以 `Object.prototype.__proto__` 的值为 null 跟 Object.prototype 没有原型，其实表达了一个意思。

所以查找属性的时候查到 Object.prototype 就可以停止查找了。

<ImagePreview src="/images/js/image6.jpg"></ImagePreview>

<BackTop></BackTop>