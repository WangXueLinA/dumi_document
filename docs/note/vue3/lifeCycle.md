---
toc: content
title: 生命周期
order: -94
---

# Vue3

## 生命周期

<ImagePreview src="/images/vue2/image1.png"></ImagePreview>

| Vue2 钩子     | Vue3 对应钩子     | 使用场景                                                                                 | 注意事项                                                          |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| beforeCreate  | setup()           | 组件初始化前，无法访问 data 和 methods。初始化响应式数据、方法、计算属性等               | Vue3 中此阶段被 setup() 替代，直接使用 setup()，且无法使用 this。 |
| created       | setup()           | 组件实例创建后，可访问 data 和 methods，但未挂载 DOM。初始化响应式数据、方法、计算属性等 | Vue3 中将初始化逻辑放在 setup() 中，异步请求可在此阶段发起。      |
| beforeMount   | onBeforeMount     | 组件挂载到 DOM 前，最后一次操作数据的机会。                                              | Vue3 需显式导入 onBeforeMount 并在 setup() 中使用。               |
| mounted       | onMounted         | 组件挂载后，可操作 DOM 或发起依赖 DOM 的请求（如图表初始化）。                           | 避免在此阶段修改响应式数据，可能导致无限循环。                    |
| beforeUpdate  | onBeforeUpdate    | 数据变化后、DOM 更新前，用于获取更新前的状态。                                           | 避免在此阶段修改数据，可能引发额外渲染。                          |
| updated       | onUpdated         | 数据变化导致 DOM 更新后，可执行依赖新 DOM 的操作。                                       | 谨慎使用，频繁数据变化可能导致性能问题。                          |
| beforeDestroy | onBeforeUnmount   | 组件销毁前，用于清理定时器、取消事件监听等资源释放操作。                                 | Vue3 中名称改为 onBeforeUnmount，需注意命名变化。                 |
| destroyed     | onUnmounted       | 组件销毁后，用于最终清理工作。                                                           | Vue3 中名称改为 onUnmounted，与卸载相关的逻辑应在此完成。         |
| activated     | onActivated       | 被 `<keep-alive>` 缓存的组件激活时调用。                                                 | 需配合 `<keep-alive>` 使用，用于恢复组件状态。                    |
| deactivated   | onDeactivated     | 被 `<keep-alive>` 缓存的组件失活时调用。                                                 | 用于保存组件状态或暂停后台任务。                                  |
| errorCaptured | onErrorCaptured   | 捕获子组件传递的错误时调用，可用于错误上报。                                             | Vue3 中需显式导入，可返回 false 阻止错误继续传播。                |
| -             | onRenderTracked   | Vue3 新增：调试渲染依赖的响应式数据变化。                                                | 仅在开发模式下有效，用于追踪渲染过程中的依赖收集。                |
| -             | onRenderTriggered | Vue3 新增：调试响应式数据触发组件重新渲染时的具体变化。                                  | 开发工具，用于定位性能问题或意外渲染。                            |

<BackTop></BackTop>