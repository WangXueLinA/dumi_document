---
title: antv G6
---

# Antv G6 4.x 版本

## 简介

AntV G6 是蚂蚁金服全新一代数据可视化解决方案，致力于提供一套简单方便、专业可靠、无限可能的数据可视化最佳实践。G6 是一个图可视化引擎。它提供了图的绘制、布局、分析、交互、动画等图可视化的基础能力。G6 可以实现很多 d3 才能实现的可视化图表。

G6 是一个纯 JS 库，不与任何框架耦合，也就是说可以在任何前端框架中使用，如 React、Vue、Angular 等

官网：<https://g6.antv.antgroup.com/examples>

## 使用

安装

```js
npm install --save @antv/g6
```

创建一个 G6 的关系图需要下面几个步骤：

1.  创建关系图的容器；

需要在 HTML 中创建一个用于容纳 G6 绘制的图的容器。G6 在绘制时会在该容器下追加 canvas 标签，然后将图绘制在其中。

```js
<div ref={containerRef} />
```

2.  数据准备；

引入 G6 的数据源为 JSON 格式的对象。该对象中需要有节点（nodes）和边（edges）字段，分别用数组表示

```js
const data = {
  // 点集
  nodes: [
    {
      id: 'node1',
      label: 'circle1',
    },
    {
      id: 'node2',
      label: 'circle2',
    },
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};
```

3.  创建关系图；

创建关系图（实例化）时，至少需要为图设置容器、宽和高。

```js
const graph = new G6.Graph({
  container: containerRef.current, // String | HTMLElement 必须
  width: 800, // Number，必须，图的宽度
  height: 500, // Number，必须，图的高度
});
```

4.  配置数据源，渲染。

```js
graph.data(data); // 读取 data 中的数据源到图上
graph.render(); // 渲染图
```

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-jw7qw1?file=src%2FApp.js

## 概念

### Graph

在 G6 中，Graph 对象是图的载体，它包含了图上的所有元素（节点、边等），同时挂载了图的相关操作（如交互监听、元素操作、渲染等）。

Graph 对象的生命周期为：初始化 —> 加载数据 —> 渲染 —> 更新 —> 销毁。

### 图形分组 Group

图形分组 group 类似于  [SVG 中的  `<g>`  标签](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/g)：元素  `g`  是用来组合图形对象的容器。在 group  上添加变换（例如剪裁、旋转、放缩、平移等）会应用到其所有的子元素上。在 group  上添加属性（例如颜色、位置等）会被其所有的子元素继承。此外， group 可以多层嵌套使用，因此可以用来定义复杂的对象。图形分组一般会在[自定义节点](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/nodes/custom-node)、[自定义边](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/edges/custom-edge)时用到。

## 节点

### 内置节点

G6 的内置节点包括

- circle：圆形
- rect：矩形
- ellipse：椭圆
- diamond：菱形
- triangle：三角形
- star：星形
- image：图片
- modelRect：卡片
- donut：甜甜圈圆形（v4.2.5 起支持）

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-64peos?file=src%2FApp.js

### 节点配置方式

#### 实例化图时全局配置

在实例化 Graph 时候可以通过 defaultNode 配置节点，这里的配置是全局的配置，将会在所有节点上生效。

```js
const graph = new G6.Graph({
  container: 'mountNode',
  width: 800,
  height: 600,
  defaultNode: {
    type: 'circle', // 节点类型
  },
});
```

#### 在数据中动态配置

如果需要为不同节点进行不同的配置，可以将配置写入到节点数据中。

```js
const data = {
  nodes: [
    {
      id: 'node0',
      type: 'circle', // 节点类型
    },
  ],
  edges: [
    ... // 边
  ]
}
```

#### 使用 graph.node()

- 该方法必须**在 render 之前调用**，否则不起作用；
- 由于该方法优先级最高，将覆盖其他地方对节点的配置，这可能将造成一些其他配置不生效的疑惑；
- 该方法在增加元素、更新元素时会被调用，如果数据量大、每个节点上需要更新的内容多时，可能会有性能问题。

```js
graph.node((node) => {
  return {
    id: node.id,
    type: 'rect',
    style: {
      fill: 'blue',
    },
  };
});

graph.data(data);
graph.render();
```

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-s3tsbh?file=src%2FApp.js

优先级：使用 graph.node() 配置 > 数据中动态配置 > 实例化图时全局配

即有相同的配置项时，优先级高的方式将会覆盖优先级低的。

### 自定义节点

当内置节点不满足需求时，可以通过 G6.registerNode() 方法自定义节点。

```js
  G6.registerNode(
    'nodeName',
    {
      options: {
        style: {},
        stateStyles: {
          hover: {},
          selected: {},
        },
      },
      /**
       * 绘制节点和边，包括节点和边上的文本，返回图形的 `keyShape`
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 图形分组，节点中图形对象的容器
       * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
       */
      draw(cfg, group) {},

      /**
       * 绘制完成以后的操作，用户可继承现有的节点或边，在 `afterDraw()` 方法中扩展图形或添加动画
       * @param  {Object} cfg 节点的配置项
       * @param  {G.Group} group 图形分组，节点中图形对象的容器
       */
      afterDraw(cfg, group) {},

      /**
       * 更新节点或边，包括节点或边上的文本。
       * @override
       * @param  {Object} cfg 节点的配置项
       * @param  {Node} node 节点
       */
      update(cfg, node) {},

      /**
       * 更新完以后的操作，如扩展图形或添加动画。一般同 afterDraw 配合使用
       * @override
       * @param  {Object} cfg 节点的配置项
       * @param  {Node} node 节点
       */
      afterUpdate(cfg, node) {},

      /**
       *是否允许更新
       *@param type  元素类型，'node' 或 'edge'
      **/
      shouldUpdate(type){}

      /**
       * 用于响应外部对元素状态的改变。当外部调用
       graph.setItemState(item, state, value) 时，该函数作出相关响应。
       主要是交互状态，业务状态请在 draw() 方法中实现。
       单图形的节点仅考虑 'selected' 、'active' 状态，有其他状态需求的用户可以复写该方法。
       * @param  {String} name 状态名称
       * @param  {Object} value 状态值
       * @param  {Node} node 节点
       */
      setState(name, value, node) {},

      /**
       * 获取锚点（相关边的连入点）
       * @param  {Object} cfg 节点的配置项
       * @return {Array|null} 锚点（相关边的连入点）的数组,如果为 null，则没有控制点
       */
      getAnchorPoints(cfg) {},
    },

    // 继承内置节点类型的名字，例如基类 'single-node'，或 'circle', 'rect' 等
    // 当不指定该参数则代表不继承任何内置节点类型
    extendedNodeType,
  );
```

通过自定义节点或自定义边时在  `draw`  方法中使用  `group.addShape`  添加，G6 中支持以下的图形：

- [circle](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E5%9C%86%E5%9B%BE%E5%BD%A2-circle)：圆；
- [rect](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E7%9F%A9%E5%BD%A2%E5%9B%BE%E5%BD%A2-rect)：矩形；
- [ellipse](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E6%A4%AD%E5%9C%86%E5%9B%BE%E5%BD%A2-ellipse)：椭圆；
- [polygon](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E5%A4%9A%E8%BE%B9%E5%BD%A2%E5%9B%BE%E5%BD%A2-polygon)：多边形；
- [fan](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E6%89%87%E5%BD%A2%E5%9B%BE%E5%BD%A2-fan)：扇形；
- [image](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E5%9B%BE%E7%89%87%E5%9B%BE%E5%BD%A2-image)：图片；
- [marker](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E6%A0%87%E8%AE%B0%E5%9B%BE%E5%BD%A2-marker)：标记；
- [path](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E8%B7%AF%E5%BE%84-path)：路径；
- [text](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#%E6%96%87%E6%9C%AC-text)：文本；
- [dom(svg)](https://g6.antv.antgroup.com/manual/middle/elements/shape/shape-and-properties#dom-svg)：DOM（图渲染方式  `renderer`  为  `'svg'`  时可用）。

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-dy67wv?file=src%2FApp.js

### 使用 jsx 自定义节点

使用类 JSX 语法来定义 G6 节点时，支持使用以下的标签：

- `<group />`
- `<rect />`
- `<circle />`
- `<text />`
- `<path />`
- `<line />`
- `<points />`
- `<polygon />`
- `<polyline />`
- `<image />`

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-vqhvxw?file=src%2FApp.js

### 使用 React 定义节点

G6 4.2.0 版本推出了`@antv/g6-react-node`， 解决了自定义节点门槛高的问题。用户借助该包，可使用开发 React 组件的方式来自定义 G6 的节点。

```js
npm install @antv/g6-react-node

// yarn add @antv/g6-react-node
```

react 支持节点
https://dicegraph.github.io/g6-react-node/api/rect

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-k1svaa?file=src%2FApp.js

### 使用 DOM 自定义节点

SVG 除支持内置的所有节点/边类型以及自定义节点/边时使用与 Canvas 相同的图形外，还支持在自定义节点/边时使用  `dom`  图形，

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-fjdt3b?file=src%2FApp.js

### 节点的连接点 anchorPoint

节点的连接点 anchorPoint 指的是边连入节点的相对位置，即节点与其相关边的交点位置。

<ImagePreview src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d29288697ae47089c490ccb0a85b9f2~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1226&h=584&s=176288&e=png&b=fdfdfd"></ImagePreview>

节点中有了 anchorPoints 之后，相关边可以分别选择连入起始点、结束点的哪一个 anchorPoint。

边可以通过指定  `sourceAnchor`  和  `targetAnchor`  分别选择起始点、结束点的 anchorPoint。

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-lg8aq7?file=src%2FApp.js

## 边

### 内置边

G6 提供了 8 种内置边：

- `line`：直线
- `polyline`：折线
- `arc`：圆弧线；
- `quadratic`：二阶贝塞尔曲线；
- `cubic`：三阶贝塞尔曲线；
- `cubic-vertical`：垂直方向的三阶贝塞尔曲线，
- `cubic-horizontal`：水平方向的三阶贝塞尔曲线，
- `loop`：自环

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-cq5xtj?file=src%2FApp.js

### 边配置方式

#### 实例化图时全局配置

可以通过 `defaultEdge` 配置边，这里的配置是全局的配置，将会在所有边上生效。

```js
const graph = new G6.Graph({
  container: 'mountNode',
  width: 800,
  height: 600,
  defaultEdge: {
    type: 'line',
  },
});
```

#### 在数据中动态配置

如果需要使不同边有不同的配置，可以将配置写入到边数据中。

```js
const data = {
  nodes: [
    ... // 节点
  ],
  edges: [
  {
    source: 'node0',
    target: 'node1'
    type: 'polyline',
  },
  {
    source: 'node1',
    target: 'node2'
    type: 'cubic',
  },
  ]
}
```

#### 使用 graph.edge()

- 该方法必须**在 render 之前调用**，否则不起作用；
- 由于该方法优先级最高，将覆盖其他地方对边的配置，这可能将造成一些其他配置不生效的疑惑；
- 该方法在增加元素、更新元素时会被调用，如果数据量大、每条边上需要更新的内容多时，可能会有性能问题。

```js
graph.edge((edge) => {
  return {
    id: edge.id,
    type: 'polyline',
  };
});
```

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-htrqbt?file=src%2FApp.js

优先级：使用 graph.edge(edgeFn) 配置 > 数据中动态配置 > 实例化图时全局配置

即有相同的配置项时，优先级高的方式将会覆盖优先级低的。

### 自定义边

用户可以通过 `G6.registerEdge`注册一个新的边类型

demo 演示： https://stackblitz.com/edit/stackblitz-starters-nz3cac?file=src%2FApp.js

## Combo

此前，G6 已经存在一个节点分组 Group 功能，但它的机制无法支持一些较复杂的功能，图形分组 Group 与  [节点分组 Combo](https://g6.antv.antgroup.com/zh/docs/manual/middle/elements/combos/default-combo)  属于不同层次的概念。

group：针对图形层次的分组
Combo ： 是针对节点的分组，与数据结构中的层次、分组对应。

V3.5 推出了全新的节点分组 Combo 机制，能够支持所有常用功能。

### 内置 Combo

G6 的内置 Combo 包括 circle 和 rect 两种类型

<Alert message='使用 Combo 时，必须在示例化图时配置  `groupByTypes`  设置为  `false`，图中元素的视觉层级才能合理。'></Alert>

demo 演示： https://stackblitz.com/edit/stackblitz-starters-panqn8?file=src%2FApp.js

### Combo 配置方式

#### 实例化图时全局配置

可以通过  `defaultCombo`  配置 Combo，这里的配置是全局的配置，将会在所有边上生效。

```js
const graph = new G6.Graph({
  container: 'mountNode',
  width: 800,
  height: 600,
  // 必须将 groupByTypes 设置为 false，带有 combo 的图中元素的视觉层级才能合理
  groupByTypes: false,
  defaultCombo: {
    type: 'circle',
    // 其他配置
  },
});
```

#### 在数据中动态配置

如果需要使不同 Combo 有不同的配置，可以将配置写入到 Combo 数据中。

```js
const data = {
  nodes: [
    ... // 节点
  ]
  combos: [{
    id: 'combo0',
    size: 100,
    type: 'circle',
    ...    // 其他属性
    style: {
      ...  // 样式属性，每种 Combo 的详细样式属性参见各类型 Combo 文档
    }
  },{
    id: 'combo1',
    size: [50, 100],
    type: 'rect',
    ...    // 其他属性
    style: {
      ...  // 样式属性，每种 Combo 的详细样式属性参见各类型 Combo 文档
    }
  },
  // 其他 combo
  ]
}
```

#### 使用 graph.combos()

- 该方法必须**在 render 之前调用**，否则不起作用；
- 由于该方法优先级最高，将覆盖其他地方对 combo 的配置，这可能将造成一些其他配置不生效的疑惑；
- 该方法在增加元素、更新元素时会被调用，如果数据量大、每个 Combo 上需要更新的内容多时，可能会有性能问题。

```js
graph.combo((combo) => {
  return {
    id: combo.id,
    type: 'rect',
    style: {
      fill: 'blue',
    },
  };
});

graph.data(data);
graph.render();
```

### 自定义 Combo

用户可以通过  `G6.registerCombo`注册一个新的边类型

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-8wqd4y?file=src%2FApp.js

## 图布局 Layout

图布局是指图中节点的排布方式，根据图的数据结构不同，布局可以分为两类：一般图布局、树图布局。

### 配置一般图布局

通过`G6.Graph`注册 layout

```js
const graph = new G6.Graph({
  // ...其他配置
  layout: {
    type: 'force', // 定义好内置布局
  },
});
```

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-vgghpg?file=src%2FApp.js

### 配置树图布局

通过`G6.TreeGraph`注册 layout

```js
const graph = new G6.TreeGraph({
  // 定义布局
  layout: {
    type: 'dendrogram', // 布局类型
    direction: 'LR', // 自左至右布局，可选的有 H / V / LR / RL / TB / BT
    nodeSep: 50, // 节点之间间距
    rankSep: 100, // 每个层级之间的间距
  },
});
```

demo 演示： https://stackblitz.com/edit/stackblitz-starters-qqjmk1?file=src%2FApp.js

### 自定义布局 Layout

可以通过 `G6.registerLayout`注册一个新的布局方式

demo 演示：https://stackblitz.com/edit/stackblitz-starters-qerghm?file=src%2FApp.js

## 图的交互

### 交互行为 Behavior

Behavior 是 G6 提供的定义图上交互事件的机制。它与**交互模式 Mode**  搭配使用，

#### 内置 Behavior

官方文档：

<https://g6.antv.antgroup.com/manual/middle/states/default-behavior>

#### 自定义交互 Behavior

通过  `G6.registerBehavior`  自定义 Behavior。

demo 演示： https://stackblitz.com/edit/stackblitz-starters-ufkxvu?file=src%2FApp.js

### 交互管理 Mode

Mode 是 G6 交互行为的管理机制，一个 mode 是多种行为 Behavior 的组合，允许用户通过切换不同的模式进行交互行为的管理。

存在 default 和 edit 两种（交互模式）:

- default 模式中包含点击选中节点行为和拖拽画布行为;
- edit 模式中包含点击节点弹出编辑框行为和拖拽节点行为。

```js
const graph = new G6.Graph({
  // ...其他配置项
  modes: {
    default: [
      'drag-canvas', // 允许拖拽画布
      'zoom-canvas', // 放缩画布、
      'drag-node', // 拖拽节点
    ],
  },
});
```

demo 演示：
https://stackblitz.com/edit/stackblitz-starters-gc3c2w?file=src%2FApp.js

### 交互状态 State

G6 中的  `state`，指的是节点或边的状态，包括交互状态和业务状态两种。

**交互状态**

用户使用鼠标选中某个节点则该节点被选中，hover 到某条边则该边被高亮等。

G6 中默认处理的是交互状态。这种都是单值的情况，true 或者 false

- `hover`： 悬停状态
- `selected`： 选中状态
- `disabled`： 禁用状态
- `active` ： 激活状态（视觉高亮）

**业务状态**

指根据用户业务需求自定义的状态。业务状态与用户交互动作无关，但在 G6 中的处理方式同交互状态一致。
业务状态的状态量可能存在多个不同的值，如节点代表人，有“健康”、“疑似”、“确诊”、“死亡”四种状态；
并且存在状态间互斥，“死亡”与其他三种就是互斥的，不可能同时存在“健康”和“死亡”两种状态；

为了解决以上问题，我们将 G6 的状态管理分为以下几层：

- 定义状态：统一的定义方式；
- 设置状态：`setItemState`  方法；
- 更新状态：`updateItem`  支持更新状态；
- 取消状态：`clearItemStates`  方法。

#### 配置 state 样式

在 G6 中，有三种方式配置不同状态的样式：

- 在实例化 Graph 时，通过  `nodeStateStyles`  和  `edgeStateStyles`  对象定义；
- 在节点/边数据中，在  `stateStyles`  对象中定义状态；
- 在自定义节点/边时，在 options 配置项的  `stateStyles`  对象中定义状态。

#### 设置 state

使用  `graph.setItemState(item, stateName, stateValue)`  来使定义的状态生效

##### 实例化 Graph 时定义 state 样式

使用这种方式可以为图上的所有节点/边配置全局统一的 state 样式。

```js
const graph = new G6.Graph({
  container: 'mountNode',
  width: 800,
  height: 600,
  defaultNode: {
    type: 'diamond',
    style: {
      // 默认样式
      fill: 'blue',
      // ... 其他样式
    },
  },
  nodeStateStyles: {
    // ...节点状态样式
  },
  edgeStateStyles: {
    // ...边状态样式
  },
  defaultEdge: {
    // ...
  },
});
```

##### 在节点/边数据中定义 state 样式

使用这种方式可以为不同的节点/边分别配置不同的 state 样式。

```js
const data = {
  nodes: [
    {
      id: 'node2',
      styles: {
        // 默认样式
      },
      stateStyles: {
        //... 状态样式
      },
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      styles: {
        // 默认样式
      },
      stateStyles: {
        //...状态样式
      },
    },
  ],
};
```

##### 自定义节点和边时定义 state 样式

```js
G6.registerNode('customShape', {
  // 自定义节点时的配置
  options: {
    size: 60,
    style: {
      lineWidth: 1
    },
    stateStyles: {
      // ...状态样式
    }
  }
}
```

#### 子图形状态样式

如果单独设置子形状的状态样式时，如下面我们定义了节点中  `name`  属性值为  `'sub-element'`  的样式，当我们通过  `graph.setItemState(item, 'selected', true)`  设置指定 item 的状态时，子元素  `'sub-element'`的样式也会同步更新。

```js
const graph = new G6.Graph({
  container,
  width,
  height,
  nodeStateStyles: {
    selected: {
      'sub-element': {
        fill: 'green',
      },
    },
  },
  edgeStateStyles: {},
});
```

#### 调用的时机

该函数可以在监听函数  `graph.on`  中被调用，也可以在自定义 Behavior 中调用，或在其他任意地方用于响应交互/业务的变化。

**graph.on**

在回调函数中使定义的交互状态 hover 生效。

```js
graph.on('node:mouseenter', (evt) => {
  const { item } = evt;
  graph.setItemState(item, 'hover', true);
});

graph.on('node:mouseleave', (evt) => {
  const { item } = evt;
  graph.setItemState(item, 'hover', false);
});
```

**Behavior**

在自定义 Behavior 中使定义的交互状态 selected 生效。

```js
G6.registerBehavior('nodeClick', {
  getEvents() {
    return {
      'node:click': 'onClick',
    };
  },
  onClick(e) {
    e.preventDefault();
    const { item } = e;
    const graph = this.graph;
    graph.setItemState(item, 'selected', true);
  },
});
```

#### 更新状态样式配置

更新状态样式配置是指更改在配置 state 样式中设置的某状态下的样式配置。

```js
graph.updateItem(item, {
  // 修改默认样式
  style: {
    stroke: 'green',
    // 修改 name 为 'node-label' 的子图形的默认样式
    'node-label': {
      stroke: 'yellow',
    },
  },
  stateStyles: {
    // 修改 hover 状态下的样式
    hover: {
      opacity: 0.1,
      // 修改 name 为 'node-label' 的子图形 hover 状态下的样式
      'node-text': {
        stroke: 'blue',
      },
    },
  },
});
```

#### 取消状态

建议使用  `graph.clearItemStates`  来取消  `graph.setItemState`  设置的状态。`graph.clearItemStates`  支持一次取消单个或多个状态。

```js
graph.setItemState(item, 'bodyState', 'health');
graph.setItemState(item, 'selected', true);
// 取消单个状态
graph.clearItemStates(item, 'selected');
graph.clearItemStates(item, ['selected']);
// 取消多个状态
graph.clearItemStates(item, ['bodyState:health', 'selected', 'active']);
```

demo 演示： https://stackblitz.com/edit/stackblitz-starters-hcafsb?file=src%2FApp.js

## 监听和绑定事件

G6 提供了直接的单个事件、时机的监听方法，可以监听画布、节点、边、以及各函数被调用的时机等。如果要了解 G6 支持的所有事件，请参考 [Event API](https://g6.antv.antgroup.com/zh/docs/api/Event)。

**G6 上所有的事件都需要在 graph 上监听**。

## 动画

G6 中的动画分为两个层次：

- 全局动画：全局性的动画，图整体变化时的动画过渡；
- 元素（边和节点）动画：节点或边上的独立动画。

全局动画

```js
const graph = new G6.Graph({
  // ...图的其他配置项
  animate: true, // Boolean，切换布局时是否使用动画过度，默认为 false
  animateCfg: {
    duration: 500, // Number，一次动画的时长
    easing: 'linearEasing', // String，动画函数
  },
});
```

元素动画

由于 G6 的内置节点和边是没有动画的，需要实现节点和边上的动画需要通过`自定义节点`、`自定义边`时复写  `afterDraw`  实现。

demo 演示：https://stackblitz.com/edit/stackblitz-starters-7bbplu?file=src%2FApp.js

## 使用组件

<https://g6.antv.antgroup.com/manual/middle/plugins/plugins#menu>

demo 演示： https://stackblitz.com/edit/stackblitz-starters-pjqrjh?file=src%2FApp.js

# antv G6 5.0-beta 版本

## 数据格式

为了数据分层，防止数据污染，并更好地避免业务数据和渲染数据混杂的情况，和 v4 相比，v5 的数据结构有了比较大的变更，具体变更如下。G6 v5 提供了 v4 数据的转换处理器，可以在数据处理模块配置使用

```js
const graph = new Graph({
  transforms: [
    {
      type: 'transform-v4-data',
      activeLifecycle: ['read'],
    },
  ],
  // ... 其他配置
  data: v4data, // 一份 v4 格式的数据
});
```

### v4 数据结构

```js
type ItemModel = {
  id: string,
  type?: string, // 元素类型，e.g. 如是节点，则可能是 circle, rect 等注册过的节点类型名
  label?: string, // label 的文本
  color?: string, // keyShape 的颜色
  size?: number | number[], // keyShape 的大小
  visible?: boolean,
  style?: { [shapeAttr: string]: unkown }, // keyShape 的样式
  labelCfg?: {
    position?: string,
    offset: number,
    refX: number,
    refY: number,
    style?: { [shapeAttr: string]: unkown }, // label 的样式
    background?: { [shapeAttr: string]: unkown }, // label 背景的样式
  },
};

type NodeModel = ItemModel & {
  comboId?: string,
  x?: number,
  y?: number,
  anchorPoints?: number[][],
  icon?: {
    show?: boolean,
    img?: string,
    text?: string,
    width?: number,
    height?: number,
    offset?: number,
  },
  linkPoints?: {
    top?: boolean,
    right?: boolean,
    bottom?: boolean,
    left?: boolean,
    size?: number,
    [shapeAttr: string]: unkown,
  },
  // 根据节点类型不同，有不同的图形相关配置，
  // e.g. modelRect 的 preRect, image 的 clipCfg 等
};
```

### V5 数据结构

```js
type NodeModel = {
  id: string,
  data: {
    type?: string, // 元素类型，e.g. 可能是 circle-node, rect-node
    x?: number,
    y?: number,
    z?: number,
    parentId?: string, // 父 combo 的 id
    label?: string, // label 的文本
    anchorPoints?: number[][],
    badges?: {
      type: 'icon' | 'text',
      text: string,
      position: BadgePosition,
    }[],
    icon?: {
      type: 'icon' | 'text',
      text?: string,
      img?: string,
    },
    [key: string]: unknown, // 其他业务属性
  },
};
```

## 数据读取

### v4 配置

```js
const graph = new Graph({
  // ... 配置
});

graph.data(data);
graph.render();
// 或合并上面两行变为：graph.read(data);
```

### v5 配置

```js
const graph = new Graph({
  // ... 配置
  data: data,
});
// 或使用：graph.read(data);
```

## 视觉与动画规范

v5 中将所有节点/边/ combo 的图形进行规范化，每种类型的元素基本都有若干个规范的图形名称。包括自定义的元素，也应当遵循这样的规范。如果有额外的图形，统一放入 otherShapes 中。

- 节点：keyShape（主图形）、labelShape（文本图形）、haloShape（某些状态下出现的背景光晕）、labelBackgroundShape（文本背景图形）、iconShape（节点中心的 icon 图形）、badgeShapes（节点四周的徽标图形）、anchorShapes（代表锚点的圆点图形）：

- 边：keyShape（主图形）、labelShape（文本图形）、haloShape（某些状态下出现的背景光晕）、labelBackgroundShape（文本背景图形）：

demo 演示： <https://stackblitz.com/edit/stackblitz-starters-kva5rb?file=src%2FApp.js>

## 元素类型名

v4 中内置的节点类型有 circle、rect、ellipse、star、image 等。这些名称和图形的类型可能产生歧义。因此在 v5 中，将更名为 xx-node。例如 circle-node，rect-node，ellipse-node，star-node，image-node。  
同理，边也将更名为 line-edge、polyline-edge、cubci-edge 等。

## 样式配置

### v4 全局样式配置

v4 由于没有数据分层，详细的图形样式可以配置在数据中，也可以配置在 graph 的 defaultNode defaultEdge 配置项中， 在 graph.node()跟 graph.edge()又有性能问题。这些问题导致用户对数据的管理略有混乱。 业务属性和样式配置可能混杂在一起。另外，v4 graph 的节点/边样式配置是静态的、全局的，不能根据不同数据做出不同的映射。

```js
const graph = new Graph({
  defaultNode: {
    type: 'circle',
    style: {
      fill: '#f00',
      r: 20,
    },
  },
  defaultEdge: {
    type: 'poliline',
    style: {
      stroke: '#0f0',
      lineWidth: 2,
    },
  },
});
```

### v5 样式映射

在 v5 中我们更建议用户数据中仅保留必要的业务属性，以及重要的简单样式配置（例如文本内容、badges 内容等），把样式配置放在图的节点/边 mapper 中。Mapper 是 v5 将内部流转数据转换为渲染数据的映射器，由用户配置在 Graph JSON 配置中。当然，也有部分内置的 mapper 逻辑，用于将用户数据中的文本内容、badges 内容等转换到对应的图形属性上。

```js
const graph = new Graph({
  // 节点配置
  node: nodeInnerModel => {
    const { id, data } = nodeInnerModel;
    return {
      id,
      data: {
        ...data,
        keyShape: {
          fill: data.important ? '#f00' : '#ccc',
          r: 20
        },
        labelShape: {
          text: data.label,
          position: 'bottom'
        },
      }
    }
  },

  // 边配置同理
  edge: edgeInnerModel => {
    return {...}
  }
});
```

## 包体积减小

### v4 引入

v4 中所有功能都默认已经加入 G6，因此在 graph 配置时可以用字符串的方式指定，这导致了包体积庞大，比如

```js
import { Graph } from '@antv/g6';
const graph = new Graph({
  // ... 其他配置项
  modes: {
    default: ['drag-node', 'scroll-canvas'], // 交互名称
  },

  defaultNode: {
    type: 'circle', // 节点类型名称
  },

  defaultEdge: {
    type: 'rect', // 节点类型名称
  },

  layout: {
    type: 'radial',
  },
});
```

### v5 引入

G6 v5 仅将最常用的功能默认注册到了 Graph 上，其他功能需要从 @antv/g6 或其他包中引入并注册到 Graph 上后，方可配置到 Graph 上。同样地，自定义的能力也需要同样方式注册：

```js
import { Graph, extend, Extensions } from '@antv/g6';

// 外部引入的功能
import {
  ForceLayout as ForceLayoutWASM,
  supportsThreads,
  initThreads,
} from '@antv/layout-wasm';

const ExtGraph = extend(Graph, {
  behaviors: {
    'activate-relations': Extensions.ActivateRelations, // 内置的交互，未提前注册
    'some-custom-behavior': CustomBehaviorClass, // 自定义交互
  },

  nodes: {
    'modelRect-node': Extensions.ModelRectNode, // 内置的 modelRect 节点，未提前注册
  },

  edges: {
    'custom-edge': CustomEdge, // 自定义边
  },

  layouts: {
    'force-wasm': ForceLayoutWASM,
  },
});

const supported = await supportsThreads();

const threads = await initThreads(supported);

// 使用 extend 后的图进行实例化

const graph = new ExtGraph({
  // ... 其他配置项
  modes: {
    default: [
      'drag-node', // 默认注册的交互
      'activate-relations', // 刚刚引入并注册的内置交互
      'some-custom-behavior', // 自定义并注册的交互
    ],
  },

  defaultNode: {
    type: 'modelRect-node', // 刚刚引入并注册的内置节点类型
  },

  defaultEdge: {
    type: 'custom-edge', // 自定义并注册的边类型
  },

  layout: {
    type: 'force-wasm', // 刚刚从其他包引入并注册的布局算法
    threads,
    maxIteration: 200,
  },
});
```

## 树图和图的融合

### v4 创建树

v4 中由于树图特殊性，G6 扩展出了 TreeGraph

```js
const graph = new TreeGraph({
  // ...配置
});
```

### v5 新增树图相关

- 布局与 Graph 通用，Graph 可以指定根节点，使用最小生成树建立树结构后使用树图布局算法；
- 交互与 Graph 通用，Graph 也可以展开和收起“子树”了，即无回溯边的下游节点；
- 支持回溯边、环存在；
- 支持森林（多棵树）。

如果需要使用 TreeGraphData，只需要在配置 Graph 时给出一个数据类型 type 为 'treeData' 后给 value 传入 TreeGraphData 类型的数据，那么 G6 将会存储树图结构，并转换为普通图数据进行存储。

```js
const graph = new Graph({
  // ... 其他配置项
  data: {
    type: 'treeData', // type 可以是 'graphData'、'treeData'、'fetch'，其中 fetch 将在正式版支持
    value: data, // value 在 type 是 treeData 时，可以是 TreeGraphData 或 TreeGraphData[] 以支持森林的绘制
  },
});
```

## 事件与事件参数

v4 中 mousexx 事件，在 v5 中更改为 pointerxx 事件，能更好地兼容移动端事件，：

```js
// v4

graph.on('node:mousemove', (e) => {});

// v5

graph.on('node:pointermove', (e) => {});
```

## 性能飞跃 & 多渲染器 & 3D 大图

G6 支持了 WebGL 的 2D 和 3D 渲染，渲染性能得到极大提升。各个渲染器还可以在运行时切换。只需要在 Graph Shang 配置不同的 renderer [渲染器 DEMO](https://g6-next.antv.antgroup.com/zh/examples/feature/features/#mapView)。

```js
const graph = new Graph({
  // ...其他图配置

  renderer: 'canvas', // 'canvas', 'svg', 'webgl', 'webgl-3d'
});
```

## 主题配置

G6 v5 中 内置了亮色、暗色主题，也可自定义。

<https://g6-next.antv.antgroup.com/examples/feature/features/#themeSwitch>

## 支持文本配置轮廓

<https://g6-next.antv.antgroup.com/zh/examples/tool/hull/#hull>

## 折线支持自动避障：

<https://g6-next.antv.antgroup.com/examples/item/defaultEdges/#polyline3>

## 优缺点分析

**优点：**

1.  强大的可定制性：G6 提供丰富的图形表示和交互组件，可以通过自定义配置和样式来实现各种复杂的图表需求。
1.  全面的图表类型支持：G6 支持多种常见图表类型，如关系图、流程图、树图等，可满足不同领域的数据可视化需求。
1.  高性能：G6 在底层图渲染和交互方面做了优化，能够处理大规模数据的展示，并提供流畅的交互体验。

**缺点：**

1.  上手难度较高：G6 的学习曲线相对较陡峭，需要对图形语法和相关概念有一定的理解和掌握。
1.  文档相对不完善：相比其他成熟的图表库，G6 目前的文档相对较简单，部分功能和使用方法的描述可能不够详尽，需要进行更深入的了解与实践。

<BackTop></BackTop>