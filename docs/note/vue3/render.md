---
toc: content
title: render函数
---

# Vue3

## render

在 Vue 3 中，Render 函数是一种提供了更大灵活性的高级功能。虽然 Vue 的模板系统已经足够强大，但在某些情况下，直接使用 JavaScript 编写渲染逻辑会更加方便。

Render 函数的工作原理是通过返回一个虚拟节点（VNode）来告诉 Vue 如何渲染界面。Vue 3 提供了 h 函数用于创建 VNode。

<ImagePreview src="/images/vue2/image4.png"></ImagePreview>

## 对比模板语法

| 问题类型        | 模板语法局限          | Render 函数解决方案                                   |
| --------------- | --------------------- | ----------------------------------------------------- |
| 动态结构生成    | v-if/v-for            | 组合复杂度指数级增长 直接使用 JavaScript 逻辑控制结构 |
| 性能敏感场景    | diff 算法无法精细优化 | 手动控制 VNode 生成与复用                             |
| 复杂组件模式    | 需要多层组件嵌套      | 高阶函数组合式开发                                    |
| 非 DOM 环境渲染 | 完全无法实现          | 对接任意渲染目标                                      |
| 动态模板需求    | 需要预编译            | 运行时动态生成                                        |
| 跨根节点布局    | 需要额外包裹元素      | Fragment 直接返回数组                                 |
| 类型安全要求    | 模板类型推导有限      | 完美配合 TypeScript 类型系统                          |

### 基本语法

```vue
<script>
import { h } from 'vue';

export default {
  setup() {
    return () =>
      h('div', { class: 'demo', onClick: () => console.log('clicked') }, [
        h('h1', '标题'),
        h('button', { type: 'button' }, '点击我'),
      ]);
  },
};
</script>
```

### 使用场景

1. 动态组件工厂：需要根据数据生成不确定的组件结构

```js
// 组件动态生成器
export default {
  setup() {
    const componentConfigs = ref([
      { type: 'input', label: '姓名' },
      { type: 'select', options: ['A', 'B'] },
    ]);

    const componentMap = {
      input: (config) => h('input', { class: 'form-control' }),
      select: (config) =>
        h(
          'select',
          config.options.map((opt) => h('option', opt)),
        ),
    };

    return () =>
      h(
        'form',
        componentConfigs.value.map((config) =>
          h('div', { class: 'form-group' }, [
            h('label', config.label),
            componentMap[config.type](config),
          ]),
        ),
      );
  },
};
```

2. 复杂逻辑的直观表达：处理嵌套数据结构时更清晰

```js
// 递归渲染树形组件
const TreeItem = {
  props: ['node'],
  setup(props) {
    return () =>
      h('li', [
        h('span', props.node.name),
        props.node.children &&
          h(
            'ul',
            props.node.children.map((child) => h(TreeItem, { node: child })),
          ),
      ]);
  },
};
```

3. 框架开发：创建高阶组件、抽象公用逻辑

```js
// 组件增强器 创建可复用逻辑包装器带
// 权限检查的高阶组件
const withAuth = (WrappedComponent) => ({
  props: WrappedComponent.props,
  setup(props) {
    const hasPermission = checkPermission(props.requiredRole);

    return () =>
      hasPermission.value
        ? h(WrappedComponent, props)
        : h('div', { class: 'no-permission' }, '无权访问');
  },
});

// 使用示例
const AdminButton = withAuth({
  props: ['requiredRole'],
  setup(props) {
    return () => h('button', '管理员操作');
  },
});
```

4. 性能关键路径：大数据量列表、虚拟滚动

```js
// 高效虚拟滚动列表
export default {
  setup() {
    const items = ref(/* 10000条数据 */);
    const visibleRange = ref([0, 50]);

    return () =>
      h(
        'div',
        { class: 'virtual-scroll' },
        items.value.slice(...visibleRange.value).map((item) =>
          h(
            'div',
            {
              key: item.id,
              class: 'row',
              style: { height: `${item.height}px` },
            },
            item.content,
          ),
        ),
      );
  },
};
```

5. 与 JavaScript 生态深度集成： 集成第三方渲染器（如 Canvas）

```js
// 对接 Canvas 渲染
export default {
  setup() {
    const canvasRef = ref(null);

    onMounted(() => {
      const ctx = canvasRef.value.getContext('2d');
      // 绘制逻辑...
    });

    return () =>
      h('canvas', {
        ref: canvasRef,
        width: 800,
        height: 600,
      });
  },
};
```

### 最佳实践

1. 优先使用模板：95%场景推荐使用模板语法

2. 类型安全：配合 TypeScript 使用类型断言

```typescript
h(resolveComponent('MyButton') as ComponentPublicInstance);
```

3. 性能优化：对静态内容使用缓存

```javascript
const staticContent = h('div', '静态内容');
return () => [staticContent, dynamicContent];
```

### 注意事项

1. 组件解析问题

```js
// ❌ 错误示例
h('ButtonPrimary'); // 无法直接使用组件名

// ✅ 正确方式
import { resolveComponent } from 'vue';
h(resolveComponent('ButtonPrimary'));
```

2. 事件监听器命名

```js
// ❌ 错误示例
h('button', { on-click: handleClick }) // Vue3不再支持短横线格式

// ✅ 正确方式
h('button', { onClick: handleClick })
```

3. 插槽使用变化

```js
// ❌ 错误示例
h('div', [this.$slots.default]) // Vue2方式

// ✅ 正确方式
setup(props, { slots }) {
  return () => h('div', slots.default())
}
```

4. Props 处理

```js
// 动态属性绑定
h('input', {
  value: modelValue,
  onInput: (e) => context.emit('update:modelValue', e.target.value),
});

// 替代Vue2的.sync
h(ChildComponent, {
  title: props.title,
  'onUpdate:title': (val) => emit('update:title', val),
});
```

<BackTop></BackTop>