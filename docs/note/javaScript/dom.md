---
toc: content
title: DOM
---

# javascript

## DOM

### 节点查询 API

用于获取页面中的元素或节点。

1. document.getElementById(id)

作用：通过元素的 id 属性获取单个元素。

```html
<div id="app">Hello</div>
<script>
  const app = document.getElementById('app');
  app.textContent = 'Modified by ID'; // 修改内容
</script>
```

2. document.querySelector(selector)

作用：通过 CSS 选择器获取第一个匹配的元素。

```javascript
const firstButton = document.querySelector('button'); // 获取第一个按钮
const userInput = document.querySelector('#username'); // 获取 id="username" 的元素
```

3. document.querySelectorAll(selector)

作用：返回所有匹配 CSS 选择器的元素集合（NodeList）。

```javascript
const listItems = document.querySelectorAll('ul li'); // 获取所有列表项
listItems.forEach((item) => (item.style.color = 'red'));
```

4. element.getElementsByClassName(className)

作用：通过类名获取元素集合。

```javascript
const boxes = document.getElementsByClassName('box'); // 所有类名为 box 的元素
```

### 节点操作 API

用于创建、添加、删除或替换元素。

1. document.createElement(tagName)

作用：创建一个新的元素节点。

```javascript
const newDiv = document.createElement('div');
newDiv.textContent = '新创建的 div';
```

2. parent.appendChild(child)

作用：将子节点添加到父节点的末尾。

```javascript
const list = document.getElementById('list');
const newItem = document.createElement('li');
newItem.textContent = 'Item';
list.appendChild(newItem); // 添加到列表末尾
```

3. parent.insertBefore(newNode, referenceNode)

作用：在指定子节点前插入新节点。

```javascript
const list = document.getElementById('list');
const newItem = document.createElement('li');
const firstItem = list.firstElementChild;
list.insertBefore(newItem, firstItem); // 插入到第一个子节点前
```

4. element.remove()

作用：直接删除当前元素。

```javascript
const box = document.getElementById('box');
box.remove(); // 删除元素
```

### 内容与属性操作 API

用于修改元素内容、属性或数据。

1. element.textContent 和 element.innerHTML

作用：

- textContent：获取或设置元素的文本内容（不解析 HTML）。
- innerHTML：获取或设置元素的 HTML 内容（解析 HTML）。

```javascript
const div = document.querySelector('div');
div.textContent = '<strong>文本</strong>'; // 显示为纯文本
div.innerHTML = '<strong>加粗文本</strong>'; // 显示为 HTML
```

2. element.setAttribute(name, value)

作用：设置元素的属性。

```javascript
const img = document.querySelector('img');
img.setAttribute('src', 'new-image.jpg'); // 修改图片路径
img.setAttribute('alt', '新图片描述');
```

3. element.getAttribute(name)

作用：获取元素的属性值。

```javascript
const link = document.querySelector('a');
const url = link.getAttribute('href'); // 获取链接地址
```

4. element.classList

作用：操作元素的类名（添加、删除、切换）。

```javascript
const box = document.getElementById('box');
box.classList.add('active'); // 添加类
box.classList.remove('hidden'); // 移除类
box.classList.toggle('dark'); // 切换类
```

### 样式操作 API

1. element.style.property

作用：直接修改元素的 CSS 样式（行内样式）。

```javascript
const box = document.getElementById('box');
box.style.backgroundColor = 'blue'; // 修改背景色
box.style.width = '200px';
```

### 事件处理 API

1. element.addEventListener(event, handler)

作用：为元素绑定事件监听器。

```javascript
const button = document.querySelector('button');
button.addEventListener('click', function () {
  alert('按钮被点击！');
});
```

2. element.removeEventListener(event, handler)

作用：移除事件监听器。

```javascript
function handleClick() {
  /* ... */
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // 移除监听
```

### 节点关系 API

1. element.parentNode

作用：获取父节点。

```javascript
const child = document.querySelector('li');
const parent = child.parentNode; // 获取父元素 ul
```

2. element.children

作用：获取所有子元素（不包括文本节点）。

```javascript
const list = document.querySelector('ul');
const firstChild = list.children[0]; // 第一个子元素
```

3. element.nextElementSibling / element.previousElementSibling

作用：获取相邻的下一个或上一个兄弟元素。

```javascript
const firstItem = document.querySelector('li');
const secondItem = firstItem.nextElementSibling; // 下一个 li
```

### 高级操作 API

1. document.createDocumentFragment()

作用：创建文档片段（优化多次 DOM 操作性能）。

```javascript
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  fragment.appendChild(li);
}
document.getElementById('list').appendChild(fragment); // 一次性插入
```

2. element.closest(selector)

作用：向上查找最近的匹配选择器的祖先元素。

```javascript
const child = document.querySelector('span');
const parentDiv = child.closest('div'); // 最近的父级 div
```

### 表单操作 API

1. formElement.reset()

作用：重置表单内容。

```javascript
document.getElementById('myForm').reset(); // 清空表单输入
```

2. inputElement.value

作用：获取或设置表单输入值。

```javascript
const input = document.querySelector("input[type='text']");
input.value = '默认值'; // 设置输入框内容
```

<BackTop></BackTop>