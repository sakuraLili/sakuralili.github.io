---
title: Html5 全屏 API
date: 2020-04-17
tags:
  - JavaScript
  - HTML
  - CSS
author: lili
location: shenzhen
---
全屏API可以控制浏览器的全屏显示，让一个` Element `节点（以及子节点）占满用户的整个屏幕

**这还是一种实验中的功能**，使用时需了解各种浏览器的兼容情况。

## :fullscreen 伪类

在全屏模式下，全屏的元素会有:fullscreen 伪类，使用这个伪类，可以对全屏状态设置单独的CSS属性。

```less
:-webkit-full-screen { // Chrome and Safari
  /* properties */
}

:-moz-full-screen { // Firefox
  /* properties */
}

:-ms-fullscreen { // Internet Explorer
  /* properties */
}

:fullscreen { /* spec */
  /* properties */
}
```

例子：

```html
<div id="fullscreen">
  <h1>:fullscreen Demo</h1>
  <p> This will become a big red text when on fullscreen.</p>
  <button id="fullscreen-button">Enter Fullscreen</button>
</div>
```
```css
#fullscreen:fullscreen {
  padding: 42px;
  background-color: pink;
  border:2px solid #f00;
  font-size: 200%;
}

#fullscreen:fullscreen > h1 {
  color: red;
}

#fullscreen:fullscreen > p {
  color: DarkRed;
}

#fullscreen:fullscreen > button {
  display: none;
}
```

## 方法

### 1. requestFullscreen()

Element 调用 requestFullscreen 方式时，可以使 Element 进入全屏模式

```js
function setFullScreen() {
  const dom = document.getElementById('fullscreen')
  if (dom.requestFullscreen) {
    dom.requestFullscreen()
  } else if (dom.webkitRequestFullscreen) {
    dom.webkitRequestFullscreen()
  } else if (dom.mozRequestFullScreen) {
    dom.mozRequestFullScreen()
  } else if(dom.msRequestFullscreen) {
    dom.msRequestFullscreen()
  }
}
```

调用此API并不能保证元素一定能够进入全屏模式。如果元素被允许进入全屏幕模式，返回的Promise会resolve，并且该元素会收到一个fullscreenchange事件，通知它已经进入全屏模式。如果全屏请求被拒绝，返回的promise会变成rejected并且该元素会收到一个fullscreenerror事件。

### 2. exitFullscreen()

document对象的exitFullscreen方法用于取消全屏。

```js
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}
```

用户手动按下ESC键或F11键，也可以退出全屏键。此外，加载新的页面，或者切换tab，或者从浏览器转向其他应用（按下Alt-Tab），也会导致退出全屏状态。

## 属性

### 1. document.fullscreenElement

fullscreenElement属性返回正处于全屏状态的Element节点，如果当前没有节点处于全屏状态，则返回null

```js
const fullscreenElement =
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement
```

### 2. document.fullscreenEnabled

fullscreenEnabled属性返回一个布尔值，表示当前文档是否可以切换到全屏状态。

```js
const fullscreenEnabled =
  document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.webkitFullscreenEnabled ||
  document.msFullscreenEnabled;

if (fullscreenEnabled) {
  videoElement.requestFullScreen();
} else {
  console.log('浏览器当前不能全屏');
}
```

## 事件

下面的事件与全屏操作有关：

> fullscreenchange事件：浏览器进入或离开全屏时触发。
>
> fullscreenerror事件：浏览器无法进入全屏时触发，可能是技术原因，也可能是用户拒绝。

```js
document.addEventListener("fullscreenchange", function( event ) {
  if (document.fullscreenElement) {
    console.log('进入全屏');
  } else {
    console.log('退出全屏');
  }
})
```

事件也需要进行浏览器兼容

### 前缀总览

![image from dependency](../../.vuepress/public/images/full-screen/01.jpg)

## 参考文献

MDN, [:fullscreen 伪类](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:fullscreen)

MDN, [Fullscreen API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)

阮一峰, [Fullscreen API：全屏操作](http://www.w3cbus.com/htmlapi/fullscreen.html#toc7)
