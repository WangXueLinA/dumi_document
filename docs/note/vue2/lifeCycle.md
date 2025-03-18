---
toc: content
title: 生命周期
order: -95
---

# Vue2

## 生命周期

Vue 生命周期总共可以分为 8 个阶段：创建前后, 载入前后,更新前后,销毁前销毁后，以及一些特殊场景的生命周期

| 生命周期钩子                         | 触发时机                     | 主要用途                      | 常见使用场景                    | 注意事项                          |
| ------------------------------------ | ---------------------------- | ----------------------------- | ------------------------------- | --------------------------------- |
| beforeCreate                         | 实例初始化后，数据观测前     | 初始化非响应式变量            | 几乎不使用                      | 无法访问 data 和 methods          |
| created                              | 实例创建完成，数据观测就绪   | 数据初始化、API 请求          | 发起异步请求、初始化非 DOM 逻辑 | 不要操作 DOM                      |
| beforeMount 挂载开始前（首次渲染前） | 最后一次数据修改             | 调整数据影响初始渲染          | 仍无法操作 DOM                  |
| mounted                              | 实例挂载到 DOM 后            | 操作 DOM、初始化第三方库      | 初始化 ECharts、绑定 DOM 事件   | 使用 $nextTick 确保子组件渲染完成 |
| beforeUpdate                         | 数据变化后，DOM 更新前       | 获取更新前的 DOM 状态         | 记录滚动位置                    | 避免修改数据，防止循环更新        |
| updated                              | 数据变化导致的 DOM           | 更新后 执行依赖新 DOM 的操作  | 恢复滚动位置、更新图表          | 避免修改数据，防止循环更新        |
| beforeDestroy 实例销毁前             | 清理资源（定时器、事件监听） | 清除定时器、解绑事件          | 必须手动清理副作用              |
| destroyed                            | 实例销毁后                   | 最终清理（非 Vue 管理的资源） | 极少使用                        | 所有子实例已销毁                  |
| activated                            | 被缓存的组件激活时           | 恢复组件状态                  | 重新加载数据、恢复播放          | 仅限 `<keep-alive>` 组件          |
| deactivated                          | 被缓存的组件停用时           | 暂停组件任务                  | 暂停视频播放、保存临时状态      | 仅限`<keep-alive>` 组件           |

<ImagePreview src="/images/vue2/image2.jpg"></ImagePreview>

### beforeCreate -> created

- 初始化 vue 实例，进行数据观测

### created

- 完成数据观测，属性与方法的运算，watch、event 事件回调的配置
- 可调用 methods 中的方法，访问和修改 data 数据触发响应式渲染 dom，可通过 computed 和 watch 完成数据计算
- 此时 vm.$el 并没有被创建

### created -> beforeMount

- 判断是否存在 el 选项，若不存在则停止编译，直到调用 vm.$mount(el)才会继续编译
- 优先级：render > template > outerHTML
- vm.el 获取到的是挂载 DOM 的

### beforeMount

- 在此阶段可获取到 vm.el
- 此阶段 vm.el 虽已完成 DOM 初始化，但并未挂载在 el 选项上

### beforeMount -> mounted

- 此阶段 vm.el 完成挂载，vm.$el 生成的 DOM 替换了 el 选项所对应的 DOM

### mounted

- vm.el 已完成 DOM 的挂载与渲染，此刻打印 vm.$el，发现之前的挂载点及内容已被替换成新的 DOM

### beforeUpdate

- 更新的数据必须是被渲染在模板上的（el、template、render 之一）
- 此时 view 层还未更新
- 若在 beforeUpdate 中再次修改数据，不会再次触发更新方法

### updated

- 完成 view 层的更新
- 若在 updated 中再次修改数据，会再次触发更新方法（beforeUpdate、updated）

### beforeDestroy

- 实例被销毁前调用，此时实例属性与方法仍可访问

### destroyed

- 完全销毁一个实例。可清理它与其它实例的连接，解绑它的全部指令及事件监听器
- 并不能清除 DOM，仅仅销毁实例

<BackTop></BackTop>