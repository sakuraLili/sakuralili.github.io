---
title: 你不知道的JavaScript：this 和对象原型
date: 2020-04-24
tags:
  - Reading Notes
author: lili
location: shenzhen
---

## 关于 this

### 1.1 为什么要用 this

```js
function identify () {
  return this.name.toUpperCase();
}

function speak () {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}

var me = {
  name: "Kyle"
};

var you = {
  name: "Reader"
};

identify.call(me);
identity.call(you);

speak.call(me);
speak.call(you);
```

这段代码可以在不同的上下文对象（me和you）中重复使用函数identify()和speak()，不用针对每个对象编写不同版本的函数。

如果不使用this，那就需要给identify()和speak()显式传入一个上下文对象。

```js
function identify (context) {
  return context.name.toUpperCase();
}

function speak (context) {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}

identity.call(you);
speak.call(me);
```

然而，this提供了一种更优雅的方式来隐式“传递”一个对象引用，因此可以将API设计得更加简洁并且易于复用。

### 1.2 误解

有两种常见的对于this的解释，但是它们都是错误的。

#### 1.2.1 指向自身

人们很容易把this理解成指向函数自身，这个推断从英语的语法角度来说是说得通的。

那么为什么需要从函数内部引用函数自身呢？常见的原因是递归（从函数内部调用这个函数）或者可以写一个在第一次被调用后自己解除绑定的事件处理器。

我们先来分析一下这个模式，让大家看到this并不像我们所想的那样指向函数本身。

我们想要记录一下函数foo被调用的次数，思考一下下面的代码：

```js
function foo(num) {
  console.log('foo:', num);

  // 记录foo被调用的次数
  this.count++;
}

foo.count = 0;

var i;
for(i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// foo 被调用了多少次？
console.log(foo.count); // 0
```

console.log语句产生了4条输出，证明foo(..)确实被调用了4次，但是foo.count仍然是0。

执行foo.count = 0时，的确向函数对象foo添加了一个属性count。但是函数内部代码this.count中的this并不是指向那个函数对象，所以虽然属性名相同，根对象却并不相同，困惑随之产生。

> 负责的开发者一定会问“如果我增加的count属性和预期的不一样，那我增加的是哪个count? ”实际上，如果他深入探索的话，就会发现这段代码在无意中创建了一个全局变量count（原理参见第2章），它的值为NaN。当然，如果他发现了这个奇怪的结果，那一定会接着问：“为什么它是全局的，为什么它的值是NaN而不是其他更合适的值？”（参见第2章。）

遇到这样的问题时，许多开发者并不会深入思考为什么this的行为和预期的不一致，也不会试图回答那些很难解决但却非常重要的问题。他们只会回避这个问题并使用其他方法来达到目的，比如创建另一个带有count属性的对象。

```js
function foo(num) {
  console.log('foo:', num);

  // 记录foo被调用的次数
  data.count++;
}

var data = {
  count: 0
};

var i;
for(i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// foo 被调用了多少次？
console.log(data.count); // 4
```

从某种角度来说这个方法确实“解决”了问题，但可惜它忽略了真正的问题——无法理解this的含义和工作原理，使用了一种更熟悉的技术：词法作用域。

**如果要从函数对象内部引用它自身，那只使用this是不够的。一般来说你需要通过一个指向函数对象的词法标识符（变量）来引用它。**

思考一下下面这两个函数：

```js
function foo() {
  foo.count = 4;
}

setTimeout(function() {
  // 匿名函数无法指向自身
}， 10);
```

foo()函数是具名函数，在它的内部可以使用foo来引用自身。

setTimeout(..)的回调函数是匿名函数，没有名称标识符，因此无法从函数内部引用自身。

所以，记录一下函数foo被调用的次数，另一种解决方法是使用foo标识符替代this来引用函数对象：

```js
function foo(num) {
  console.log('foo:', num);

  // 记录foo被调用的次数
  foo.count++;
}

foo.count = 0;

var i;
for(i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// foo 被调用了多少次？
console.log(foo.count); // 4
```

这种方法同样回避了this的问题，并且完全依赖于变量foo的词法作用域。

另一种方法是强制this指向foo函数对象：

```js
function foo(num) {
  console.log('foo:', num);

  // 记录foo被调用的次数
  // 在当前的调用方式下，this 确实指向 foo
  this.count++;
}

foo.count = 0;

var i;
for(i = 0; i < 10; i++) {
  if (i > 5) {
    // 使用 call(...)可以确保 this 指向函数对象 foo 本身
    foo.call(foo, i);
  }
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// foo 被调用了多少次？
console.log(foo.count); // 4
```

#### 1.2.2 它的作用域

第二种常见的误解是，this指向函数的作用域。这个问题有点复杂，因为在某种情况下它是正确的，但是在其他情况下它却是错误的。

**需要明确的是，this在任何情况下都不指向函数的词法作用域。**

思考一下下面的代码，它试图（但是没有成功）跨越边界，使用this来隐式引用函数的词法作用域:

```js
function foo() {
  var a = 2;
  this.bar();
}

function bar () {
  console.log(this.a)
}

foo(); // ReferenceError: a is not defined
```

首先，这段代码试图通过this.bar()来引用bar()函数。这样调用能成功纯属意外，我们之后会解释原因。

此外，编写这段代码的开发者还试图使用this联通foo()和bar()的词法作用域，从而让bar()可以访问foo()作用域里的变量a。这是不可能实现的，使用this不可能在词法作用域中查到什么。

### 1.3 this 到底是什么

**之前我们说过this是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件。this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。**

**当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。this就是这个记录的一个属性，会在函数执行的过程中用到。**

## this 全面解析

每个函数的this是在调用时被绑定的，完全取决于函数的调用位置（也就是函数的调用方法）。

### 2.1 调用位置

调用位置就是函数在代码中被调用的位置（而不是声明的位置）。

只有仔细分析调用位置才能回答这个问题：这个this到底引用的是什么？

通常来说，寻找调用位置就是寻找“函数被调用的位置”，但是做起来并没有这么简单，因为某些编程模式可能会隐藏真正的调用位置。

最重要的是要分析调用栈（就是为了到达当前执行位置所调用的所有函数）

下面我们来看看到底什么是调用栈和调用位置：

```js
function baz() {
  // 当前调用栈：baz
  // 因此，当前调用位置是全局作用域

  console.log('baz');
  bar(); // bar 的调用位置
}

function bar () {
  // 当前调用栈：baz -> bar
  // 因此，当前调用位置是在 baz

  console.log('bar');
  foo(); // foo 的调用位置
}

function foo () {
  // 当前调用栈：baz -> bar -> foo
  // 因此，当前调用位置是在 bar 中

  console.log('foo');
}

baz(); // baz 的调用位置
```

需要分析出真正的调用位置的，因为它决定了this的绑定。

> 你可以把调用栈想象成一个函数调用链，就像我们在前面代码段的注释中所写的一样。但是这种方法非常麻烦并且容易出错。另一个查看调用栈的方法是使用浏览器的调试工具。绝大多数现代桌面浏览器都内置了开发者工具，其中包含JavaScript调试器。

### 2.2 绑定规则

我们来看看在函数的执行过程中调用位置如何决定this的绑定对象。

必须找到调用位置，然后判断需要应用下面四条规则中的哪一条。我们首先会分别解释这四条规则，然后解释多条规则都可用时它们的优先级如何排列。

#### 2.2.1 默认绑定

首先是最常用的函数调用类型：**独立函数调用**。可以把这条规则看作是无法应用其他规则时的默认规则。

思考一下下面的代码：

```js
function foo () {
  console.log(this.a);
}

var a = 2;
foo(); // 2
```

声明在全局作用域中的变量（var a = 2;）就是全局对象的一个属性。

而调用foo()函数时，应用了 this 的默认绑定，因此 this 指向全局对象，this.a 被解析成全局变量a。

在代码中，foo()是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。

如果使用严格模式（strict mode），则不能将全局对象用于默认绑定，因此this会绑定到undefined：

```js
function foo () {
  "use strict"
  console.log(this.a);
}

var a = 2;
foo(); // TypeError: this is undefined
```

这里有一个微妙但是非常重要的细节，虽然this的绑定规则完全取决于调用位置，但是只有foo()运行在非strict mode下时，默认绑定才能绑定到全局对象；在严格模式下调用foo()则不影响默认绑定：

```js
function foo () {
  console.log(this.a);
}

var a = 2;

(function() {
  "use strict";

  foo(); // 2 在严格模式下调用foo()不影响默认绑定
})();
```

#### 2.2.2 隐式绑定

**另一条需要考虑的规则是调用位置是否有上下文对象**，或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。

```js
function foo () {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

obj.foo(); // 2
```

上面的代码中，foo()是先定义，然后是被当做引用属性添加到obj中。但是无论是直接在obj中定义还是先定义再添加为引用属性，这个函数严格来说都不属于obj对象。

然而，调用位置会使用 obj 上下文来引用函数，因此你可以说函数被调用时，obj 对象“拥有”或者“包含”它。

无论你如何称呼这个模式，**当foo()被调用时，它的前面确实加上了对obj的引用。当函数引用有上下文对象时，隐式绑定规则会把函数调用中的this绑定到这个上下文对象**。因为调用foo()时this被绑定到obj，因此this.a和obj.a是一样的。

**对象属性引用链中只有上一层或者说最后一层在调用位置中起作用。**

例子：

```js
function foo () {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo
}

var obj1 = {
  a: 2,
  obj2: obj2
}

obj1.obj2.foo(); // 42
```

**隐式丢失**

一个最常见的this绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把this绑定到全局对象或者undefined上，取决于是否是严格模式。

```js
function foo () {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
}

var bar = obj.foo; // 函数别名

var a = "oops, global"; // a 是全局对象的属性

bar(); //  oops, global
```

虽然bar是obj.foo的一个引用，但是实际上，它引用的是foo函数本身，因此此时的bar()其实是一个不带任何修饰的函数调用，因此应用了默认绑定。

一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：

```js
function foo () {
  console.log(this.a)
}

function doFoo(fn) {
  // fn 其实引用的是foo

  fn(); // 调用位置
}

var obj = {
  a: 2,
  foo: foo,
};

var a = "oops, global" // a 是全局对象的属性
doFoo(obj.foo); // "oops, global"
```

参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样。

如果把函数传入语言内置的函数而不是传入你自己声明的函数，会发生什么呢？结果是一样的，没有区别：

```js
function foo () {
  console.log(this.a)
}

var obj = {
  a: 2,
  foo: foo,
};

var a = "oops, global" // a 是全局对象的属性

setTimeout(obj.foo, 100); // "oops, global"
```

#### 2.2.3 显示绑定

在分析隐式绑定时，我们必须在一个对象内部包含一个指向函数的属性，并通过这个属性间接引用函数，从而把this间接（隐式）绑定到这个对象上。


那么如果我们不想在对象内部包含函数引用，而想在某个对象上强制调用函数，该怎么做呢？

JavaScript中的“所有”函数都有一些有用的特性，可以用来解决这个问题。具体点说，可以使用函数的call(..)和apply(..)方法

这两个方法的第一个参数是一个对象，是给this准备的，接着在调用函数时将其绑定到this。因为你可以直接指定this的绑定对象，因此我们称之为显式绑定。

例子：

```js
function foo () {
  console.log(this.a);
}

var obj = {
  a: 2
};

foo.call(obj); // 2
```

通过foo.call(..)，我们可以在调用foo时强制把它的this绑定到obj上。

如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作this的绑定对象，这个原始值会被转换成它的对象形式（也就是newString(..)、new Boolean(..)或者new Number(..)）。这通常被称为“装箱”。

可惜，显式绑定仍然无法解决我们之前提出的丢失绑定问题。

1. **硬绑定**

但是显式绑定的一个变种可以解决这个问题。

如下代码：

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2
};

var bar = function() {
  foo.call(obj);
};

bar(); // 2
setTimeout(bar, 100); // 2

// 硬绑定的 bar 不可能再修改它的 this
bar.call(window); // 2
```

我们创建了函数bar()，并在它的内部手动调用了foo.call(obj)，因此强制把foo的this绑定到了obj。无论之后如何调用函数bar，它总会手动在obj上调用foo。这种绑定是一种显式的强制绑定，因此我们称之为硬绑定。

硬绑定的典型应用场景就是创建一个包裹函数，负责接收参数并返回值：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = function() {
  return foo.apply(obj, arguments)
};

var b = bar(3); // 2 3
console.log(b); // 5
```

另一种使用方法是创建一个可以重复使用的辅助函数：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

// 简单的辅助绑定函数
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments)
  }
}

var obj = {
  a: 2
};

var bar = bind(foo, obj)

var b = bar(3); // 2 3
console.log(b); // 5
```

由于硬绑定是一种非常常用的模式，所以ES5提供了内置的方法Function.prototype.bind，它的用法如下：

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = foo.bind(obj)

var b = bar(3); // 2 3
console.log(b); // 5
```

bind(..)会返回一个硬编码的新函数，它会把你指定的参数设置为this的上下文并调用原始函数。

**2. API 调用的“上下文”**

第三方库的许多函数，以及JavaScript语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”（context），其作用和bind(..)一样，确保你的回调函数使用指定的this。

例子：

```js
function foo (el) {
  console.log(el, this.id);
}
var obj = {
  id: "awesome"
};

// 调用 foo(...)时把this 绑定到obj
[1, 2, 3].forEach(foo, obj);
// 1 awesome 2 awesome 3 awesome
```

#### 2.2.4 new 绑定

JavaScript也有一个new操作符，使用方法看起来也和那些面向类的语言一样，绝大多数开发者都认为JavaScript中new的机制也和那些语言一样。然而，JavaScript中new的机制实际上和面向类的语言完全不同。

首先我们重新定义一下JavaScript中的“构造函数”。在JavaScript中，构造函数只是一些使用new操作符时被调用的函数。它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被new操作符调用的普通函数而已。

包括内置对象函数（比如Number(..)，详情请查看第3章）在内的所有函数都可以用new来调用，这种函数调用被称为构造函数调用。这里有一个重要但是非常细微的区别：实际上并不存在所谓的“构造函数”，只有对于函数的“构造调用”。

**使用new来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：**

1. 创建一个新对象，作为将要返回的对象实例。
2. 这个新对象的原型，指向构造函数的prototype属性。
3. 这个新对象会绑定到函数调用的this。
4. 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象。

new是最后一种可以影响函数调用时this绑定行为的方法，我们称之为new绑定。

### 2.3 优先级

现在我们已经了解了函数调用中this绑定的四条规则。但是，如果某个调用位置可以应用多条规则该怎么办？为了解决这个问题就必须给这些规则设定优先级。

毫无疑问，默认绑定的优先级是四条规则中最低的，所以我们可以先不考虑它。

隐式绑定和显式绑定哪个优先级更高？我们来测试一下：

```js
function foo () {
  console.log(this.a)
}

var obj1 = {
  a: 2,
  foo: foo
};

var obj2 = {
  a: 3,
  foo: foo
};

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```

可以看到，显式绑定优先级更高，也就是说在判断时应当先考虑是否可以存在显式绑定。

现在我们需要搞清楚new绑定和隐式绑定的优先级谁高谁低：

```js
function foo(something) {
  this.a = something;
}

var obj1 = {
  foo: foo
};

var obj2 = {};

obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call(obj2, 3);
console.log(obj2.a); // 3

var bar = new obj1.foo(4)
console.log(obj1.a); // 2
console.log(bar.a); // 4
```

可以看到new绑定比隐式绑定优先级高。

但是new绑定和显式绑定谁的优先级更高呢？

Function.prototype.bind(..)会创建一个新的包装函数，这个函数会忽略它当前的this绑定（无论绑定的对象是什么），并把我们提供的对象绑定到this上。

这样看起来硬绑定（也是显式绑定的一种）似乎比new绑定的优先级更高，无法使用new来控制this绑定。

我们看看是不是这样：

```js
function foo(something) {
  this.a = something;
}

var obj1 = { };

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a) // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a) // 3
```

bar被硬绑定到obj1上，但是new bar(3)并没有像我们预计的那样把obj1.a修改为3。相反，new修改了硬绑定（到obj1的）调用bar(..)中的this。因为使用了new绑定，我们得到了一个名字为baz的新对象，并且baz.a的值是3。

**判断 this**

现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的顺序来进行判断：

1. 函数是否在new中调用（new绑定）？如果是的话this绑定的是新创建的对象。

```js
var bar = new foo()
```

2. 函数是否通过call、apply（显式绑定）或者硬绑定调用？如果是的话，this绑定的是指定的对象。

```js
var bar = foo.call(obj2)
```

3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this绑定的是那个上下文对象。

```js
var bar = obj1.foo()
```

4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。

```js
var bar = foo()
```

### 2.4 绑定例外

规则总有例外，这里也一样。在某些场景下this的绑定行为会出乎意料，你认为应当应用其他绑定规则时，实际上应用的可能是默认绑定规则。

#### 2.4.1 被忽略的this

如果你把null或者undefined作为this的绑定对象传入call、apply或者bind，这些值在调用时会被忽略，实际应用的是默认绑定规则：

```js
function foo() {
  console.log(this.a);
}

var a = 2;

foo.call(null); // 2
```

那么什么情况下你会传入null呢？

一种非常常见的做法是使用apply(..)来“展开”一个数组，并当作参数传入一个函数。类似地，bind(..)可以对参数进行柯里化，这种方法有时非常有用：

```js
function foo(a, b) {
  console.log("a: ", a, ", b: ", b);
}
// 把数组“展开”成参数
foo.apply(null, [2, 3]); // a:2, b:3

// 使用 bind(...) 进行柯里化
var bar = foo.bind(null, 2);
bar(3); // // a:2, b:3
```

这两种方法都需要传入一个参数当作this的绑定对象。如果函数并不关心this的话，你仍然需要传入一个占位值，这时null可能是一个不错的选择，就像代码所示的那样。

然而，总是使用null来忽略this绑定可能产生一些副作用。如果某个函数确实使用了this（比如第三方库中的一个函数），那默认绑定规则会把this绑定到全局对象（在浏览器中这个对象是window），这将导致不可预计的后果（比如修改全局对象）。

显而易见，这种方式可能会导致许多难以分析和追踪的bug。

**更安全的this**

一种“更安全”的做法是传入一个特殊的对象，把this绑定到这个对象不会对你的程序产生任何副作用。我们可以创建一个对象——它就是一个空的非委托的对象。

如果我们在忽略this绑定时总是传入一个空对象，那就什么都不用担心了，因为任何对于this的使用都会被限制在这个空对象中，不会对全局对象产生任何影响。

在JavaScript中创建一个空对象最简单的方法都是Object.create(null)。Object.create(null)和{}很像，但是并不会创建Object.prototype这个委托，所以它比{}“更空”：

```js
function foo(a, b) {
  console.log("a: ", a, ", b: ", b);
}

var ø = Object.create(null);

// 把数组“展开”成参数
foo.apply(ø, [2, 3]); // a:2, b:3

// 使用 bind(...) 进行柯里化
var bar = foo.bind(ø, 2);
bar(3); // // a:2, b:3
```

#### 2.4.2 间接引用

另一个需要注意的是，你有可能（有意或者无意地）创建一个函数的“间接引用”，在这种情况下，调用这个函数会应用默认绑定规则。

间接引用最容易在赋值时发生：

```js
function foo () {
  console.log(this.a);
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo))(); // 2
```

赋值表达式p.foo = o.foo的返回值是目标函数的引用，因此调用位置是foo()而不是p.foo()或者o.foo()。根据我们之前说过的，这里会应用默认绑定。

#### 2.4.3 软绑定

之前我们已经看到过，硬绑定这种方式可以把this强制绑定到指定的对象（除了使用new时），防止函数调用应用默认绑定规则。问题在于，硬绑定会大大降低函数的灵活性，使用硬绑定之后就无法使用隐式绑定或者显式绑定来修改this。如果可以给默认绑定指定一个全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力。

可以通过一种被称为软绑定的方法来实现我们想要的效果：

```js
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function(obj) {
    var fn = this;
    // 捕获所有的 curried 参数
    var curried = [].slice.call(arguments, 1);

    var bound = function () {
      return fn.apply((!this || this === (window | global)) ? obj : this, curried.concat.apply(curried, arguments))
    };

    bound.prototype = Object.create(fn.prototype);
    return bound;
  }
}
```
除了软绑定之外，softBind(..)的其他原理和ES5内置的bind(..)类似。它会对指定的函数进行封装，首先检查调用时的this，如果this绑定到全局对象或者undefined，那就把指定的默认对象obj绑定到this，否则不会修改this。此外，这段代码还支持可选的柯里化

下面我们看看softBind是否实现了软绑定功能：

```js
function foo() {
  console.log("name: " + this.name);
}

var obj = { name: "obj" };
var obj2 = { name: "obj2" };
var obj3 = { name: "obj3" };

var fooOBJ = foo.softBind(obj);

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2

fooOBJ.call(obj3); // name: obj3

setTimeout(obj2.foo, 10);
// name: obj
```

可以看到，软绑定版本的foo()可以手动将this绑定到obj2或者obj3上，但如果应用默认绑定，则会将this绑定到obj。
