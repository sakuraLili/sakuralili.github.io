---
title: JavaScript 问题收集
date: 2019-12-24
tags:
  - 问题累积
  - JavaScript
author: lili
location: shenzhen
---

## ` element.getBoundingClientRect `的兼容性问题

```js
const rect = element.getBoundingClientRect();
```
方法` getBoundingClientRect `获取元素相对于视口的位置，返回对象` rect `，在大部分手机中，` rect `包含下面的对象：

![image from dependency](../../.vuepress/public/images/js-question/01.png)

但是在低版本的荣耀手机中，` rect `只包含了下面图中几个对象，比其他手机机型少了` x `和` y `属性。

![image from dependency](../../.vuepress/public/images/js-question/02.png)


## ` IOS `不支持` webp `格式的图片

解决：自动引入目录中的文件

```js
function importAll(r) {
  r.keys().forEach(r);
}
importAll(require.context('../assets/sprites', true, /\.svg$/));
```
