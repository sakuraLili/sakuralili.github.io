---
title: 用JavaScript理解Functor, Applicative 和 Monad
date: 2019-10-16
tags:
  - JavaScript
  - 函数式编程
author: lili
location: shenzhen
---

在之前的[文章](Functor-Applicative-Monad.md)中，我们用图片的形式来解释了` Functor `、` Applicative `和` Monad `，但还是太抽象了，现在让我们用` JavaScript `来继续说明这些概念。

## 容器

任何值都可以被放入一个上下文中。这个值就好像被放入了盒子中，我们不能直接操作这个值。

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/3.png)

如图，在上下文（` content `）中，封装着一个值` 2 `。实现这个盒子的代码：

```js
const Just = function(x) {
  this.__value = x;
}

Just.of = function(x) {
  return new Just(x);
};
```

在上面的代码中，数据类型` Just `形成了一个上下文，在这个上下文中，有属性` __value ` 用来保存被放入的值。在数据类型` Just `上有` of `方法，它作为` Just `的构造器。

> ` of `方法不仅用来避免使用` new `关键字的，而且还用来把值放到*默认最小化上下文*（` default minimal context `）中的。

让我们看看这个盒子：

```js
Just.of(3)
// Just { __value: 3 }

Just.of('hotdogs')
// Just { __value: 'hotdogs' }

Just.of(Just.of({ name: 'yoda' }))
// Just { __value: Just { __value: { name: 'yoda' } } }
```

> 上面的结果是用` node `打印出来的，下面的同样如此。

## ` Functor `

当一个值被封装在一个盒子中，我们不能直接操作这个值：

```js
const Just = function (x) {
  this.__value = x;
}

Just.of = function (x) {
  return new Just(x);
};

function add(x) {
  return 3 + x;
}

add(Just.of(2))
// 3[object Object]
```
![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/5.png)


这时，我们就需要一个方法让别的函数能够操作这个值：

```js
// (a -> b) -> Just a -> Just b
Just.prototype.map = function(f){
  return Just.of(f(this.__value))
}
```
上面的代码中，` map `函数接受两个参数，返回一个容器：

- 第一个参数是函数（` a-> b `）: 这个函数接受一个变量` a `，返回一个变量` b `，这个` a `和` b `的类型可能相同，可能不同。
> 这里变量指没有放在上下文中的值。
- 第二个参数是数据类型` Just `，这个` Just `中封装着类型和` a `相同的值，和（` a -> b `）中的 ` a `相对应。
- 返回值是数据类型` Just `，这个` Just `中封装着类型和` b `相同的值，和（` a -> b `）中的` b `相对应。

此时，我们就可以使用` map `函数来操作上下文里的值了：

```js
Just.of(2).map((a) => a + 3)
// Just { __value: 5 }
```

过程如下：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/9.png)

我们使用` map `方法来操作数据，是为了在数据（比如` 2 `）不脱离数据类型（比如` Just `）的情况下，就可以操作数据，操作结束后，为了防止意外再把它放回它所属的容器（` Just `）。这样，我们能连续地调用` map `，运行任何我们想运行的函数。甚至还可以改变值的类型。

此时，` Just `就是一个` Functor `，它不仅是一种容器类型，也可以使用` map ` 将一个函数运用到一个封装的值上。

所以，**` functor `是实现了` map `函数并遵守一些特定规则的容器类型。**
> ` map `方法应该是泛指实现了能操作容器里的值的方法， 下面` Monad `和` Applicative `的定义同样如此。

### ` Maybe `

上下文中可以放入任意的值，当然也就可以放入` falsy ` 值，我们叫这个容器为` Maybe `。那么运用其他函数来操作里面的值时，有可能会抛出错误，所以我们可以在` Maybe `里面进行容错处理。

```js
const Maybe = function(x) {
  this.__value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}
```

` Maybe `看起来跟其他容器非常类似，但是有一点不同：` Maybe ` 会先检查自己的值是否为空，然后才调用传进来的函数。

```js
Maybe.of(null).map((a) => a + 3)
// Just { __value: null }
```

当传给` map `的值是` null  ` 时，代码并没有爆出错误。这样我们就能连续使用` map `，保证了一种线性的工作流，不必担心错误的数据造成代码抛出错误。

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/10.png)

## ` Monad `

这是我们上面定义的容器：

```js
const Just = function (x) {
  this.__value = x;
}

Just.of = function (x) {
  return new Just(x)
}
```

当我们想操作容器里的值时，我们可以这样做：

```js
Just.prototype.map = function (f) {
  return Just.of(f(this.__value))
}

const half = function (x) {
  return x / 2
}
```

如果此时容器是这样的：

```js
Just.of(3).map(half)
```

此时容器里面封装着值` 3 `，我们使用` map `操作它的值是没有问题的。这就是上面讲的` Functor `

但如果此时，容器是这样的：

```js
const nestedContainer = Just.of(Just.of(3))
// Just { __value: Just { __value: 3 } }
```

此时，如果我们使用` map `来操作` nestedContainer `容器里的值是不可能的：

```js
nestedContainer.map(half)
```
此时回调函数` half `参数为：

```js
Just { __value: 3 }
```

这时，我们又将一个被封装过的值运用到一个普通函数上，这又回到了我们最开始的时候。

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/22.png)

如果此时我们想操作` nestedContainer `容器里的值，那我们就需要` Monad `：

> ` monad `是可以变扁（` flatten `）的` pointed functor `。
>
> ` pointed functor `是实现了` of `方法的` functor `。

我们来为` Maybe `定义一个` join `方法，让它成为称为一个` Monad `：

```js
// m a -> (a -> m b) -> m b
Maybe.prototype.join = function() {
  return this.isNothing() ? Maybe.of(null) : this.__value;
}

const mmo = Maybe.of(Maybe.of("nunchucks"));
// Maybe { __value: Maybe { __value: 'nunchucks' } }

mmo.join();
// Maybe { __value: 'nunchucks' }
```

而对于` half `（` Just 3 `），` Monad `是这样处理的：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/24.png)

### 理论

下面是一个组合（` compose `）函数：

```js
const compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
```

对于` Monad `有：

#### 1. 结合律

```js
 // 结合律
  compose(join, map(join)) == compose(join, join)
```

用图表示则是：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad-JavaScript/1.png)


从左上角往下，先用` join `合并` M(M(M a)) `最外层的两个 ` M `，然后往右，再调用一次` join `，就得到了我们想要的` M a `。或者，从左上角往右，先打开最外层的` M `，用` map(join) `合并内层的两个 ` M `，然后再向下调用一次` join `，也能得到` M a `。不管是先合并内层还是先合并外层的` M `，最后都会得到相同的`  M a `，所以这就是结合律。

#### 2. 同一律

```js
 // 同一律 (M a)
  compose(join, of) == compose(join, map(of)) == id
```
用图表示则是：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad-JavaScript/2.png)

如果从左上角开始往右，可以看到` of `的确把` M a `丢到另一个` M ` 容器里去了。然后再往下` join `，就得到了` M a `，跟一开始就调用` id `的结果一样。从右上角往左，可以看到如果我们通过` map `进到了` M ` 里面，然后对普通值` a `调用` of `，最后得到的还是` M (M a) `；再调用一次` join `将会把我们带回原点，即` M a `。

## ` Applicative `

` Functor `可以将封装到上下文里的值运用到普通函数上：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/18.png)

那如果` (+3) `函数也被封装在容器中：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/15.png)

那么此时，对容器` Just `里面的值进行加` 3 `操作，就变成了：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/19.png)

此时是两个` Functor `之间的交互，就需要用到` Applicative `了。

我们先定义一个` ap `方法，让它可以让两个` functor `进行交互：

```js
function add(x) {
  return function (y) {
    return x + y;
  };
}

Just.prototype.ap = function (otherContainer) {
  return otherContainer.map(this.__value)
}

Just.of(add(2)).ap(Just.of(3));
// Just { __value: 5 }
```

其中` map `函数的参数` this.__value `是一个函数。

所以` Applicative `就可以定义为：

**` applicative functor `是实现了` ap `方法的` pointed functor `**


下面是一个特性：

```js
M.of(a).map(f) = F.of(f).ap(M.of(a))
```

用图表示则是：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad-JavaScript/3.png)

上面实际表示的是` map `一个` f `等价于` ap `一个值为` f `的` functor `

## 总结：

![image from dependency](../../.vuepress/public/images/Functor-Applicative-Monad/32.png)

- **` Functor `**：你可以使用` map `将一个函数运用到一个封装的值上
- **` Applicative `**：你可以使用` ap ` 将一个封装过的函数运用到一个封装的值上
- **` Monad `**：你可以使用` join `将一个返回封装值的函数运用到一个封装的值上

### 参考文献

[` JS `函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/)

[` Functors, Applicatives, And Monads In Pictures `](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)
