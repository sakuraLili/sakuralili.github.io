---
title: webpack 相关配置
date: 2022-02-10
tags:
  - 项目管理
author: lili
location: shenzhen
---

## Webpack DefinePlugin：定义全局变量

` DefinePlugin `可以在编译时期创建全局变量。比如在` vue.config.js `中配置：

```js
const fs = require("fs");
const webpack = require("webpack");
const path = require("path");

// 获取主题文件名
const themeFiles = fs.readdirSync("./src/style/theme");
let ThemesArr = [];
themeFiles.forEach(function (item, index) {
  let stat = fs.lstatSync("./src/style/theme/" + item);
  if (stat.isDirectory() === true) {
    ThemesArr.push(item);
  }
});
// console.log("themeFiles", themeFiles, "ThemesArr", ThemesArr);


module.exports = {
  configureWebpack: (config) => {
    return {
      plugins: [
        new webpack.DefinePlugin({
          THEMEARR: JSON.stringify(ThemesArr),
          THEMEFILES: JSON.stringify(themeFiles),
        }),
      ],
    };
  },
};
```
