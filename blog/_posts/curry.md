---
title: 柯里化
date: 2019-10-12
tags:
  - 函数式编程
author: lili
location: shenzhen
---

### 什么是柯里化

柯里化是函数式编程中的一种过程，可以将接受具有多个参数的函数转化为一个的嵌套函数队列，然后返回一个新的函数以及期望下一个的内联参数。它不断返回一个新函数（期望当前参数）直到所有参数都用完为止。这些参数会一直保持“存活”不会被销毁（利用闭包的特性）以及当柯里化链中最后的函数返回并执行时，所有参数都用于执行。

> 柯里化就是将具有多个arity（参数个数）的函数转化为具有较少的arity的函数。

下面，我们看一个简单的例子：

```js
function multiply(a, b, c) {
  return a * b * c;
}

multiply(1,2,3); // 6
```

接下来创建一个柯里化版本的函数，看看如何在一系列调用中调用相同的函数（并且得到同样的结果）。

```js
function multiply(a) {
  return (b) => {
    return (c) => {
      return a * b * c
    }
  }
}
log(multiply(1)(2)(3)) // 6
```

我们已经将` multiply(1,2,3) `函数调用形式转化为` multiply(1)(2)(3) `多个函数调用的形式。
一个单独的函数已经转化为一系列的函数。为了得到三个数字` 1、2、3 `的乘法结果，这些数字一个接一个传递，每个数字会预先填充用作下一个函数内联调用。

> 备注：以上变量保持存活是闭包特性

### 柯里化和部分应用函数

现在，有些人可能开始认为柯里化函数的嵌套函数的数量取决于它接受的参数。是的，这就是柯里化。 设计一个求长方体（正方体）的容积的柯里化函数，有两种方法。

方法一：

```js
function volume(l) {
  return (w) => {
    return (h) => {
      return l * w * h
    }
  }
}
const aCylinder = volume(100)(20)(90) // 180000
```

方法二：

```js
function volume(l) {
  return (w, h) => {
    return l * w * h
  }
}
```

所以，可以像这样去调用：

```js
const hCy = volume(70);
hCy(203,142);
hCy(220,122);
hCy(120,123);

// 或者
volume(70)(90,30);
volume(70)(390,320);
volume(70)(940,340);
```

方法二中，它接受` 3 `个参数和有` 2 `层嵌套函数，跟方法一接受` 3 `个参数和有` 3 `层嵌套函数的版本不一样。
但是方法二并不是柯里化。我们只是做了一个部分应用的` volume `函数。
柯里化和部分应用函数有关联，但是它们是不同的概念。

部分应用函数是将一个函数转化为具有更少的元素（即更是的参数）的函数。

柯里化是根据函数的参数数量创建嵌套函数，每个函数接受一个参数。如果没有参数，那就没有柯里化。 可能存在一种情况，即柯里化和部分应用彼此相遇。假设我们有一个函数：

```js
function div(x,y) {
  return x/y;
}
```
如果写出部分应用形式，得到的结果：

```js
function div(x) {
  return (y) => {
    return x/y;
  }
}
```

同样地，柯里化也是同样地结果：

```js
function div(x) {
  return (y) => {
    return x/y;
  }
}
```

虽然柯里化和部分应用函数给出同样地结果，但它们是两个不同的存在。 像我们之前说的，柯里化和部分应用是相关的，但设计上实际是完全不一样的。相同之处就是它们都依赖闭包。

### 通用的柯里化函数

我们来开发一个函数，它接受任何函数并返回一个柯里化版本的函数。 要做到这点，我们将有这个：

```js
function curry(fn, ...args) {
  return (..._arg) => {
    return fn(...args, ..._arg);
  }
}
```

` curry `函数接受一个我们想要柯里化的函数（` fn `）和 一些可变数量的参数（` …args `）。剩下的操作用于将` fn `之后的参数数量收集到` …args `中。
然后，返回一个函数，同样地将余下的参数收集为` …args `。这个函数调用原始函数` fn `通过使用` spread `运算符作为参数传入` ...args `和` ...args `，然后，将值返回给使用。

现在我们可以用` curry `函数来创建特定的函数啦。 下面我们用` curry `函数来创建更多计算体检的特定函数

```js
function volume(l,h,w) {
  return l * h * w
}
const hCy = curry(volume,100);
hCy(200,900); // 18000000l
hCy(70,60); // 420000l
```

上面的这种` curry `实现其实还是部分应用，不是真正的柯里化函数

```js
const curry = (fn, ...arr) => (...args) => (arg => !fn.length || arg.length === fn.length ? fn(...arg) : curry(fn, ...arg))([...arr, ...args])
```

等价于：

```js
const curry = function (fn, ...arr) {
  return function (...args) {
    return (function (arg) {
      if (!fn.length || arg.length === fn.length) {
        return fn(...arg)
      } else {
        return curry(fn, ...arg)
      }
    })([...arr, ...args])
  }
}
```

### 结语

闭包使` JavaScript `柯里化成为可能。能够保留已经执行的函数的状态，使我们能够创建工厂函数 - 可以为其参数添加特定值的函数。
