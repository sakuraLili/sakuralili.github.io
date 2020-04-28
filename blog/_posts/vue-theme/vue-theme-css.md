---
title: Vue + CSS变量 动态换肤
date: 2020-04-28
tags:
  - Vue
  - CSS
author: lili
location: shenzhen
---

## CSS 变量简介

以双短划线开头来声明一个CSS变量：

```css
element {
  --main-bg-color: brown;
}
```

使用 var()函数来取值：

```css
element {
  background-color: var(--main-bg-color);
}
```

css 变量通常是定义在 :root 伪类上
> :root选择器用匹配文档的根元素。
>
> 在HTML中根元素始终是HTML元素。

## 开始

变量定义在:root伪类下，然后给` html `根标签设置一个` data-theme `属性，不同的配色方案data-theme不同。

1. 定义配置颜色

```css
[data-theme="light"]:root {
  --main-color: #1E1E20;
  --main-background: #fff;
  --main-border-color: #E6E6E6;
}

[data-theme="dark"]:root {
  --main-color: #fff;
  --main-background: #1E1E20;
  --main-border-color: #4a4a4a;
}
```

2. 在` Vue `组件中使用：

```vue
<style lang="css" scoped>
@import "./styles/theme.css";

.css-container {
  font-size: 18px;
  color: var(--main-color);
  background-color: var(--main-background);
}
</style>
```

3. 动态切换主题：

```vue
<template>
  <div class="css-container">
    <p>Vue + CSS变量 动态换肤</p>
    <button @click="() => changeTheme('light')">浅色主题</button>
    <button @click="() => changeTheme('dark')">深色主题</button>
  </div>
</template>

<script>
export default {
  methods: {
    changeTheme(type) {
      document.documentElement.setAttribute("data-theme", type)
    }
  }
}
</script>
```

## 兼容性

IE浏览器以及一些旧版浏览器不支持CSS变量，因此，需要使用[css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill)

1. 安装

```sh
npm install css-vars-ponyfill
```
