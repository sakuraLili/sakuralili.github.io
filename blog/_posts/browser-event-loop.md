---
title: 浏览器中的 Event Loop
date: 2020-02-10
tags:
  - JavaScript
  - Event Loop
  - web
author: lili
location: shenzhen
---
## ` event loop `

通过[` HTML5 `规范](https://www.w3.org/TR/html5/webappapis.html#event-loops-definitions)的定义来看` event loop `的定义

> 为了协调时间，用户交互，脚本，界面渲染，网络等等，用户代理必须使用下一节描述的 event loops。event loops 分为两种：浏览器环境及为 Web Worker 服务的。

在这里只关注浏览器部分，` JavaScript ` 引擎并不是独立运行的，它需要运行在宿主环境中， 所以其实用户代理（` user agent `）或者称为运行环境或者宿主环境，也就是浏览器。

> 每个用户代理必须至少有一个[` browsing context event loop `](https://www.w3.org/TR/html5/browsers.html#browsing-context)，但每个[` unit of related similar-origin browsing contexts `](https://www.w3.org/TR/html5/browsers.html#units-of-related-similar-origin-browsing-contexts) 最多只能有一个。

关于[` unit of related similar-origin browsing contexts `](https://www.w3.org/TR/html5/browsers.html#units-of-related-similar-origin-browsing-contexts)，节选一部分规范的介绍：

>  Each [ unit of related browsing contexts ](https://www.w3.org/TR/html5/browsers.html#unit-of-related-browsing-contexts) is then further divided into the smallest number of groups such that every member of each group has an [active document](https://www.w3.org/TR/html5/browsers.html#active-document) with an [origin](https://www.w3.org/TR/html5/browsers.html#concept-origin) that, through appropriate manipulation of the document.domain attribute, could be made to be [same origin-domain](https://www.w3.org/TR/html5/browsers.html#same-origin-domain) with other members of the group, but could not be made the same as members of any other group. Each such group is a unit of related similar-origin browsing contexts.

简而言之就是一个浏览器环境（` unit of related similar-origin browsing contexts.`），只能有一个事件循环（` event loop `）。

### ` event loop `做了什么？

> 每个` event loop `都有一个或多个 task queues. 一个[ task queue ](https://www.w3.org/TR/html5/webappapis.html#task-queues)是` tasks `的有序的列表, 是用来响应如下工作的算法:
> - 事件
>
>   在` EventTarget `触发的时候发布一个事件` Event ` 对象，这通常由一个专属的 task 完成。
>
>    注意：并不是所有的事件都从是[` task queue `](https://www.w3.org/TR/html5/webappapis.html#task-queues)中发布，也有很多是来自其他的 tasks。
> - 解析
>
>   [` HTML `解析器 ](https://www.w3.org/TR/html5/syntax.html#html-parser)令牌化然后产生` token `的过程，是一个典型的` task `。
> - 回调函数
>
> 一般使用一个特定的` task `来调用一个回调函数。
> - 使用资源（其实就是网络）
>
>   当算法[ 获取](https://fetch.spec.whatwg.org/#concept-fetch) 到了资源，如果获取资源的过程是非阻塞的，那么一旦获取了部分或者全部的内容将由` task `来执行这个过程。
> - 响应` DOM `的操作
>
>   有一些元素会对` DOM `的操作产生` task `，比如当元素被[ 插入到 ` document ` 时](https://www.w3.org/TR/html5/infrastructure.html#document-inserted-into)。

可以看到，一个页面只有一个` event loop `，但是一个 ` event loop `可以有多个` task queues `

> 每个来自相同` task source `并由相同` event loop `（比如，` Document `的计时器产生的回调函数，` Document `的鼠标移动产生的事件，` Document `的解析器产生的 ` tasks `） 管理的` task `都必须加入到同一个` task queue `中，可是来自不同  [` task sources `](https://www.w3.org/TR/html5/webappapis.html#task-source) 的` tasks `可能会被排入到不同的` task queues `中。

规范对` task source `进行了分类：

> 如下` task sources ` 被大量应用于本规范或其他规范无关的特性中：
>
> - ` DOM `操作的` task source `
>
>   这种` task source `用来对` DOM ` 的操作进行反应，比如像` inserted into the document `的非阻塞的行为。
>
> - 用户操作的` task source `
>
>   这种` task source ` 用来响应用户的反应，比如鼠标和键盘的事件。这些用来反应用户输入的事件必须由[` user interaction task source ` ](https://www.w3.org/TR/html5/webappapis.html#user-interaction-task-source)来触发并排入` tasks queued `。
>
> - 网络` task source `
>
>   这种` task source `用来反应网络活动的响应。
>
> - 时间旅行` task source `
>
>   这种` task source `用来将` history.back() `等` API `排入` task queue `。

规范中明确表示了是有多个` task queues `，并举例说明了这样设计的意义：

> 举例来说，一个用户代理可以有一个处理键盘鼠标事件的 ` task queue `（来自` user interaction task source `)，还有一个` task queue ` 来处理所有其他的。用户代理可以以` 75% ` 的几率先处理鼠标和键盘的事件，这样既不会彻底不执行其他 ` task queues `的前提下保证用户界面的响应， 而且不会让来自同一个` task source `的事件顺序错乱。

接着：

> 当用户代理将要排入任务时，必须将任务排入相关的` event loop `的` task queues `。

这句话很关键，是用户代理（宿主环境/运行环境/浏览器）来控制任务的调度，这里就引出了下面的` Web APIs `。

接下来我么来看看` event loop `是如何执行` task `的。

### 处理模型

` event loop `会在整个页面存在时不停的将` task queues ` 中的函数拿出来执行，具体的规则如下：

一个` event loop `在它存在的必须不断的重复一下的步骤：
1. 从` task queues `中取出` event loop `的最先添加的 ` task `，如果没有可以选择的` task `，那么跳到第 ` Microtasks `步。
2. 设定` event loop `当前执行的` task `为上一步中选择的 ` task `。
执行：执行选中的` task `。
3. 执行：执行选中的` task `。
4. 将` event loop `的当前执行` task `设为` null `。
5. 从` task queue `中将刚刚执行的` task `移除。
6. ` Microtasks `： [执行` microtask ` 检查点的任务](https://www.w3.org/TR/html5/webappapis.html#performs-a-microtask-checkpoint)。
7. 更新渲染，如果是浏览器环境中的` event loop `（相对来说就是` Worker `中的` event loop `）那么执行以下步骤：
8. 如果是` Worker `环境中的` event loop `（例如，在[ ` WorkerGlobalScope `](https://www.w3.org/TR/workers/#workerglobalscope)中运行），可是在` event loop `的` task queues `中没有 ` tasks `并且  [` WorkerGlobalScope ` ](https://www.w3.org/TR/workers/#workerglobalscope)对象为关闭的标志，那么销毁` event loop `，终止这些步骤的执行，恢复到[`  run a worker ` ](https://www.w3.org/TR/workers/#run-a-worker)的步骤。
9. 回到第` 1 `步。

### ` microtask `

规范引出了` microtask `，

> 每个` event loop `都有一个` microtask queue `。` microtask `是一种要排入[` microtask queue ` ](hhttps://www.w3.org/TR/html5/webappapis.html#microtask-queue)的而不是` task queue `的任务。有两种[ ` microtasks `](https://www.w3.org/TR/html5/webappapis.html#microtask)：` solitary callback microtasks `和 ` compound microtasks `。

规范只介绍了[` solitary callback microtasks `](https://www.w3.org/TR/html5/webappapis.html#solitary-callback-microtasks)，` compound microtasks ` 可以先忽略掉。

> 当一个` microtask `要被排入的时候，它必须被排入相关 ` event loop `的` microtask queue，microtask `的` task source `是` microtask task source `.

### ` microtasks `检查点

当用户代理执行到了` microtasks `检查点的时候，如果[ ` performing a microtask checkpoint flag ` ](https://www.w3.org/TR/html5/webappapis.html#performing-a-microtask-checkpoint-flag)为 ` false `，则用户代理必须运行下面的步骤：

1. 将` performing a microtask checkpoint flag `置为`  true `。
2. 处理` microtask queue `：如果` event loop `的 ` microtask queue `是空的，直接跳到` Done `步。
3. 选择` event loop `的` microtask queue `中最老的 ` microtask `。
4. 设定` event loop `当前执行的` task `为上一步中选择的 ` task `。
5. 执行：执行选中的` task `。
>   注意：这有可能涉及相关的脚本回调函数，这些回调函数最后都会执行[` clean up after running script ` ](https://www.w3.org/TR/html5/webappapis.html#clean-up-after-running-script)，这回导致再次[执行` microtask ` 检查点的任务](https://www.w3.org/TR/html5/webappapis.html#performs-a-microtask-checkpoint)，这就是我们要使用 ` performing a microtask checkpoint flag `的原因。
6. 将` event loop `的当前执行` task `设为` null `。
7. 将上一步中执行的` microtask `从` microtask queue ` 中移除，然后返回 处理` microtask queue `步骤。
8. 完成： 对每一个[` responsible event loop ` ](https://html.spec.whatwg.org/multipage/webappapis.html#responsible-event-loop)就是当前的` event loop `的[ ` environment settings  object `](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object)，给[` environment settings object ` ](https://html.spec.whatwg.org/multipage/webappapis.html#environment-settings-object)发一个[` rejected promises `](https://html.spec.whatwg.org/multipage/webappapis.html#notify-about-rejected-promises)的通知。
9. [清理` IndexedDB ` 的事务](https://w3c.github.io/IndexedDB/#cleanup-indexed-database-transactions)。
10. 将` performing a microtask checkpoint flag `设为 ` false `。

为啥要用` microtask `？根据` HTML Standard `，在每个 ` task `运行完以后，` UI `都会重渲染，那么在` microtask ` 中就完成数据更新，当前` task `结束就可以得到最新的` UI `了。反之如果新建一个` task ` 来做数据更新，那么渲染就会进行两次。

整个流程如下图：

![image](https://user-gold-cdn.xitu.io/2018/7/25/164d18380a1dccc6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### ` task & microTask `

` task `主要包含：

- ` script `（整体代码）
- ` setTimeout `
- ` setInterval `
- ` setImmediate `
- ` I/O `
- ` UI rendering `

` microtask `主要包含：

- ` process.nextTick `（` Node.js `环境）
- ` Promises `（这里指浏览器实现的原生` Promise `）
- ` Object.observe `（已被` MutationObserver `替代）
- ` MutationObserver `
- ` postMessage `

### ` Web APIs `

在上面讲到了用户代理（宿主环境/运行环境/浏览器）来控制任务的调度，` task queues ` 只是一个队列，它并不知道什么时候有新的任务推入，也不知道什么时候任务出队。` event loop ` 会根据规则不断将任务出队，那谁来将任务入队呢？答案是 ` Web APIs `。
我们都知道` JavaScript ` 的执行是单线程的，但是浏览器并不是单线程的，` Web APIs `就是一些额外的线程，它们通常由` C++ ` 来实现，用来处理非同步事件比如` DOM `事件，` http ` 请求，` setTimeout `等。他们是浏览器实现并发的入口，对于` Node.JavaScript `来说，就是一些` C++ `的` APIs `。

> ` WebAPIs `本身并不能直接将回调函数放在函数调用栈中来执行，否则它会随机在整个程序的运行过程中出现。每个 ` WebAPIs `会在其执行完毕的时候将回调函数推入到对应的任务队列中，然后由` event loop ` 按照规则在函数调用栈为空的时候将回调函数推入执行栈中执行。` event loop ` 的基本作用就是检查函数调用栈和任务队列，并在函数调用栈为空时将任务队列中的的第一个任务推入执行栈中，每一个任务都在下一个任务执行前执行完毕。

` WebAPIs `提供了多线程来执行异步函数，在回调发生的时候，它们会将回调函数和推入任务队列中并传递返回值。


### 参考文献

<!-- [` Node.js `事件循环一: 浅析](https://github.com/ccforward/cc/issues/47) -->

[` HTML5 `规范](https://www.w3.org/TR/html5/webappapis.html#event-loops-definitions)

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[跟着` Event loop ` 规范理解浏览器中的异步机制](https://juejin.im/post/5b5873a1e51d4519133fbc35)

[` Vue `中如何使用` MutationObserver ` 做批量处理？](https://www.zhihu.com/question/55364497/answer/144215284)
