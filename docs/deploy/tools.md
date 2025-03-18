---
toc: content
title: 线上调试vue
---

# 调试线上 vue 组件

线上环境我们如何开启 vue devtools

```js
// 控制台复制
var Vue, walker, node;
walker = document.createTreeWalker(document.body, 1);
while ((node = walker.nextNode())) {
  if (node.__vue__) {
    Vue = node.__vue__.$options._base;
    if (!Vue.config.devtools) {
      Vue.config.devtools = true;
      if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue);
        console.log('==> vue devtools now is enabled');
      }
    }
    break;
  }
}
```

显示 `vue devtools now is enabled`证明我们已经成功开启了 `vue devtools`

适配 vue3

```js
const el = document.querySelector('#app');
const vm = el.__vue_app__;

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.push({
  app: vm,
  version: vm.version,
  types: {
    Comment: Symbol('Comment'),
    Fragment: Symbol('Fragment'),
    Static: Symbol('Static'),
    Text: Symbol('Text'),
  },
});
if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', vm);
  console.log('==> vue devtools now is enabled');
}
```

<BackTop></BackTop>