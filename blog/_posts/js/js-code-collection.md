---
title: JavaScript Code Collection
date: 2019-12-24
tags:
  - Code Collection
  - JavaScript
author: lili
location: shenzhen
---

## 正则表达式

### 1 数字、字母和特殊字符至少两种

```js
export const REG_PASSWORD = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]+$)[\x21-\x7e]{8,15}$/;
```

### 2. 必须包含数字、大写字母、小写字母

```js
const regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
```

### 3. 包含数字、大写字母、小写字母和特殊字符

```js
const regxMultiple = /^(?![0-9a-zA-Z]+$)(?![0-9a-z\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]+$)(?![0-9A-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]+$)(?![a-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]+$)[\x21-\x7e]{8,16}$/ // 不能为数字+小写字母+大写字母、数字+小写字母+特殊字符、数字+大写字母+特殊字符、小写字母+大写字母+特殊字符、

```

### 4. 数字逗号分隔，` 1234567890 --> 1,234,567,890 ` [参考](https://github.com/jawil/blog/issues/20)

**第一种方法：**

```js
let test1 = '1234567890'
let format = test1.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
```

下面简单分析下正则` /\B(?=(\d{3})+(?!\d))/g `：

1. ` /\B(?=(\d{3})+(?!\d))/g `：正则匹配边界` \B `，边界后面必须跟着` (\d{3})+(?!\d) `;
2. ` (\d{3})+ `：必须是` 1 `个或多个的` 3 `个连续数字;
3. ` (?!\d) `：第` 2 `步中的` 3 `个数字不允许后面跟着数字;
4. ` (\d{3})+(?!\d) `：所以匹配的边界后面必须跟着` 3*n（n>=1）`的数字。

**第二种方法:**

```js
function commafy(num){
  if (!num) return '';
  return num
    .toString()
    .replace(/(\d)(?=(\d{3})+\.)/g, function($1, $2){
      return $2 + ',';
    });
  }
```

## 获取数组交集

```js
const getIntersection = (a, ...args) => a.filter(itemA => args.every(b => b.includes(itemA)))
```

## 去掉字符串空格

```js
// 字符串去掉首尾空格
str.replace(/^\s+|\s+$/g, '')

// 字符串去掉开头空格
str.replace(/^(\s*)(.*)$/, '$2')

// 字符串去掉结尾空格
str.replace(/^(.*?)(\s*)$/, '$1')
```

## 获取元素类型

```js
const dataType = obj => Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
```

## input 限制只能输入中文

```js
const input = document.querySelector('input[type="text"]')
const clearText = target => {
    const {
        value
    } = target
    target.value = value.replace(/[^\u4e00-\u9fa5]/g, '')
}
input.oninput = ({target}) => {
    clearText(target)
}
```

## 去除字符串中的html代码

```js
const removeHTML = (str = '') => str.replace(/<[\/\!]*[^<>]*>/ig, '')
console.log(removeHTML('<h1>哈哈哈哈<呵呵呵</h1>')) // 哈哈哈哈<呵呵呵
```

## 浏览器中保存格式为base64的图片

```js
/*
- 参数:
  - { String } content: 图片的base64资源
  - { String } fileName: 保存的图片名称
*/
downloadFile (content, fileName) {
  const base64ToBlob = (code) => {
    const parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], {
      type: contentType
    })
  }
  const aLink = document.createElement('a')
  const blob = base64ToBlob(content)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.click()
}
```

## 将数据解压缩

```js
const unzip = function(b64Data) {
  const strData = atob(b64Data);
  // Convert binary string to character-number array
  const charData = strData.split("").map(function(x) {
    return x.charCodeAt(0);
  });
  // Turn number array into byte-array
  const binData = new Uint8Array(charData);
  // // unzip
  const data = pako.inflate(binData);
  // Convert gunzipped byteArray back to ascii string:
  strData = String.fromCharCode.apply(null, new Uint16Array(data));
  return strData;
};
```

## 将` HTML `页面的` title `设置为空字符串

一些 HTML 页面的设计是没有标题的，但是将设置 document.title = '' 时，页面的标题是当前页面的 url, 还是不符合要求

解决方法:

```js
document.title='\u200E'
```

## 点击 Tab 项，元素进入视图

```js
const scrollIntoView = (mainRef, index) => {
  if (!mainRef?.current) {
    return;
  }

  const eleContainer = mainRef.current;

  const invisibleWidth =
    eleContainer.scrollWidth - document.documentElement.clientWidth;
  if (invisibleWidth <= 0) {
    return;
  }

  const items = eleContainer.children || [];
  const ele = items[index];

  if (ele) {
    const { left, right } = ele.getBoundingClientRect();
    const eleCenterX = (left + right) / 2;
    const viewCenterX = document.documentElement.clientWidth / 2;
    const diffX = eleCenterX - viewCenterX;
    const scrollLeft = eleContainer.scrollLeft + diffX;
    eleContainer.scrollLeft = Math.min(invisibleWidth, scrollLeft);
  }
};

```
