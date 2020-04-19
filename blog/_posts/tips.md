---
title: CSS Tips
date: 2020-01-31
tags:
  - CSS
author: lili
location: shenzhen
---
[[toc]]

### 渐变色文字

```html
<span class="gradient-text">GRADIENT TEXT</span>
```

```css
.gradient-text {
  font-size: 50px;
  background-image: linear-gradient(90deg, red, blue);
  background-image: -webkit-linear-gradient(0deg, red, blue);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
```
效果:

![image from dependency](../.vuepress/public/images/css-tips/1.png)

### 下划线动画效果

```html
<div class="content">
  <p>Lorem ipsum dolor <a class="fancy-link" href="#">sit amet consectetur adipisicing elit. Impedit repudiandae assumenda beatae</a>, quo iure quaerat voluptate placeat. A eius cum, rem aspernatur ipsa illum. Commodi ullam cupiditate aliquid ducimus consequatur.</p>
</div>
```
```css
.fancy-link {
  text-decoration: none;
  background-image: linear-gradient(red, red);
  background-repeat: no-repeat;
  background-position: bottom left;
  background-size: 0 3px;
  transition: background-size 500ms ease-in-out;
}
.fancy-link:hover {
  background-size: 100% 3px;
}
```
效果:

![image from dependency](../.vuepress/public/images/css-tips/2.gif)


### text-shadow - 文字多层阴影效果
```html
<h2 class="so-many-shadows">This is fun</h2>
```
```css
.so-many-shadows {
  text-shadow:
    3px 3px 0 yellow,
    6px 6px 0 blue,
    9px 9px red,
    12px 12px 0 black;

  text-transform: uppercase;
}
```
效果:

![image from dependency](../.vuepress/public/images/css-tips/3.png)

### 背景混合

` background-blend-mode `属性定义了背景层的混合模式（图片与颜色）

```html
<div class="content">
  <div class="one"></div>
  <div class="two"></div>
  <div class="three"></div>
</div>
```
```css
.one, .two, .three {
  background-color: orange;
  background-image: url(https://picsum.photos/id/1005/600/600);
}
.one { background-blend-mode: screen; }
.two { background-blend-mode: multiply; }
.three { background-blend-mode: overlay; }
```

效果:

![image from dependency](../.vuepress/public/images/css-tips/4.png)
