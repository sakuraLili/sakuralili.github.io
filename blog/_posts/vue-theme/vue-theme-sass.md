---
title: Vue + Sass 动态换肤
date: 2020-04-28
tags:
  - Vue
  - CSS
author: lili
location: shenzhen
---

根据不同的配色方案，在前端实现动态切换系统主题颜色。

大概的思路就是给` html `根标签设置一个` data-theme `属性，然后通过` js `切换` data-theme `的属性值，

## 创建项目

```sh
npm install -g @vue/cli
vue create vue-theme
```

## 安装` Sass `依赖

```sh
npm install -D sass-loader sass
```

## 开始

1. 新建一个` _theme.scss `文件，在里面配置不同的颜色方案，不同的配色方案，颜色变量要一一对应。

```scss

$themes: (
  light: (
    // 字体颜色
    main_color: #1E1E20,

    // 背景颜色
    main_background: #fff,

    // 边框颜色
    main_border_color: #E6E6E6,
  ),

  dark: (
    main_color: #fff,

    main_background: #1E1E20,

    main_border_color: #4a4a4a,
  )
);
```

> 注意，` scss `文件名建议用下划线开头，如` _themes.scss `，防止执行时被编译成单独的` css `文件。

2. 在新建一个` _theme-handle.scss `文件，用来操作变量

```scss
@import './_themes.scss';

// 遍历主题
@mixin themeify {
  @each $theme-name, $theme-map in $themes {
    // !global 把局部变量强升为全局变量
    $theme-map: $theme-map !global;
    // 判断 html 的 data-theme 的属性值
    [data-theme="#{$theme-name}"] & {
      @content;
    }
  }
}

// 声明一个根据 Key 获取颜色的 function
@function themed($key) {
  @return map-get($theme-map, $key);
}

// 获取背景颜色
@mixin background_color($color) {
  @include themeify {
    background-color: themed($color)!important;
  }
}

// 获取字体颜色
@mixin font_color($color) {
  @include themeify {
    color: themed($color)!important;
  }
}

// 获取边框颜色
@mixin border_color($color) {
  @include themeify {
    border-color: themed($color)!important;
  }
}
```

3. 在` Vue `组件中使用：

```vue
<style lang="scss" scoped>
@import "@/assets/styles/_theme-handle.scss";

.scss-container {
  font-size: 18px;
  @include font_color("main_color");
  @include background_color("main_background");
}
</style>
```

4. 动态切换主题：

```vue
<template>
  <div class="scss-container">
    <p>Vue + Scss 动态换肤</p>
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
