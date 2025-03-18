---
title: graphin
---

# Graphin

G6 4.2.0 版本带来了一个重要生态产品：Graphin 2.0。它深度整合 G6 图可视分析能力，为 React 用户带来了三个主要变化：开箱即用的功能，全新架构升级，集成解决方案。

官网： https://graphin.antv.vision/graphin/quick-start/introduction

安装

```js
yarn add @antv/graphin
```

## 基本使用

graphin 中`width`，跟`height` 不是必要的，width 默认宽度为 100%，height 默认最小高度 500px

demo 演示： https://stackblitz.com/edit/stackblitz-starters-mwyy4s?file=src%2FApp.js

## 节点

### G6 中节点

graphin 中依然可以沿用 G6 中的内置节点

demo 演示： https://stackblitz.com/edit/stackblitz-starters-a7wenx?file=src%2FApp.js

### Grapin 内置节点

Graphin 内置唯一一款节点类型`graphin-circle`.作为默认的节点类型，你不需要在数据中显式指定`type:"graphin-circle"`,
`graphin-circle`  由 5 部分图形组成，分别是容器**keyshape**，标签**label**，光晕**halo**，图标**icon**，徽标**badges** ，每一部分均可以通过数据驱动

demo 演示：https://stackblitz.com/edit/stackblitz-starters-uqcpzl?file=src%2FApp.js

graphin-circle 节点动画： https://stackblitz.com/edit/stackblitz-starters-n3zv56?file=src%2FApp.js

G6 中内置节点不支持动画，依然在自定义节点中手动增加动画

## 边

### G6 中边

graphin 中依然可以沿用 G6 中的内置边

demo 演示： https://stackblitz.com/edit/stackblitz-starters-7cf5zl?file=src%2FApp.js

### Grapin 内置边

Graphin 官网内置了 边类型`graphin-line`.作为默认的边类型，你不需要在数据中显式指定`type:"graphin-line"`。Graphin 对边的组成进行了规范化处理，`graphin-line`  由 3 部分图形组成，分别是路径**keyshape**,标签**label**,光晕**halo**，每一部分均可以通过数据驱动。针对业务中常用的标签背景，自环，多边，虚线等情况，也都有对应的数据设置

demo 演示： https://stackblitz.com/edit/stackblitz-starters-4x3jtl?file=src%2FApp.js

## 布局

Graphin 2.0 的布局全面拥抱 G6，详情请[参考](https://g6.antv.vision/zh/docs/api/graphLayout/guide)。但是 Graphin 也内置了 2 款布局，分别为`graphin-force`和`preset`布局

- `graphin-force`  是基于电荷弹簧模型的力导布局算法，在内部内置`tweak`算法，可以实现力导的增量布局

- `preset`  顾名思义是预设布局，当用户设置此布局，则 graphin 内部会按照用户给定数据 nodes 中的坐标信息(x,y)布局。

## 节点 State

跟 G6 一样`graph.setItemState`手动设置,
`graph.updateItem`  更新样式与状态

## 交互行为 Behaviors

Graphin 中的交互行为都是可组合的，可以通过

```js
import { Behaviors } from '@antv/graphin';
```

来按需引入。
可以在[节点交互](https://graphin.antv.vision/graphin/behaviors/node)  和  [画布交互](https://graphin.antv.vision/graphin/behaviors/canvas)  的文档中查看

demo 演示： https://stackblitz.com/edit/stackblitz-starters-h5ba6z?file=src%2FApp.js

## 自定义机制

- `Behavior`： Graphin.registerBehavior，
- `节点`： Graphin.reigsterNode
- `边`： Graphin.registerEdge
- `布局`： Graphin.registerLayout

用法跟 G6 一样

## 内置组件

Graphin 提供了 7 种分析组件：分别为右键菜单，提示框，小地图，工具栏，鱼眼放大镜，轮廓，图例。未来将提供 17+ 的分析组件

demo 演示：https://stackblitz.com/edit/stackblitz-starters-kqwvei?file=src%2FApp.js

<BackTop></BackTop>