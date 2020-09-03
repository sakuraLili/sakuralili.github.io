---
title: 全站变灰
date: 2020-04-04
tags:
  - HTML
  - CSS
author: lili
location: shenzhen
---

```css
html {
    filter: grayscale(100%);
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grayscale\'><feColorMatrix type=\'matrix\' values=\'0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\'/></filter></svg>#grayscale");
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    -webkit-filter: grayscale(1);
}
```

注意：对于指定了 filter 样式且值不为 none 时，被应用该样式的元素其子元素中如果有 position 为 absolute 或 fixed 的元素，会为这些元素创建一个新的容器，使得这些绝对或固定定位的元素其定位的基准相对于这个新创建的容器。
