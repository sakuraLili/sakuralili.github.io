---
title: 在Vue(v2) 组件中自动导入SASS/SCSS
date: 2022-02-10
tags:
  - 项目管理
author: lili
location: shenzhen
---

## 在` Vue cli 3 + `中

在` vue.config.js `文件中增加配置：

```js
module.exports = {
  css: {
    loaderOptions: {
      scss: {
        // 注意: 在sass-loader v8 中，这个选项是prependData, 在sass-loader v8 中，这个选项是 data
        additionalData: `@import "./src/_shared.scss";`,
      },
    },
  },
};
```

## 在` Vue cli 2 `中

在` /build/utils.js `文件中找到` scss: generateLoaders('sass') `的行：

```js
scss: generateLoaders("sass").concat({
  loader: "sass-resources-loader",
  options: {
    resources: path.resolve(__dirname, "./src/_shared.scss")
  }
})
```
