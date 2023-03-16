---
title: 浏览器缓存机制
date: 2018-12-30
tags:
  - 浏览器
author: lili
location: shenzhen
---

# 浏览器缓存机制

缓存无处不在，有客户端缓存，服务端缓存，代理服务器缓存等等。和前端相关的缓存一般都是指` http `缓存，也就是浏览器缓存。

就是说` ajax `请求之后，会把请求的` url `和返回的响应结果保存在缓存中，当下一次调用` ajax `发送相同的请求时，浏览器会从缓存中把数据取出来，这是为了提高页面的响应速度和用户体验，什么时候会出现这个现象呢，就是要这两次的请求` url `和请求参数完全一样的时候，浏览器就不会与服务器交互。

## 缓存的优缺点

### 优点

优点主要是体现在静态资源上。请求一些静态资源，` js `，` css `，图片这些，不会变化的资源，请求会变得更快，加快了客户端加载网页的速度，提高了页面的响应速度，也减少了冗余数据的传递，节省了网络带宽流量，减少服务端的负担，大大提高了网站性能。

### 缺点

客户端和服务端交互的时候，服务端的数据虽然变了，但是由于浏览器是从缓存中拿数据，导致页面没有改变

## 强制缓存和协商缓存

缓存一般分为强制缓存和协商缓存，**两者的主要区别是使用本地缓存的时候，是否需要向服务器验证本地缓存是否依旧有效。** 顾名思义，协商缓存，就是需要和服务器进行协商，最终确定是否使用本地缓存。

**这两种缓存机制可以同时存在，不过强制缓存的优先级高于协商缓存。**

### 强制缓存

就是缓存中已经有了请求数据的时候，客户端直接从缓存中获取数据，只有当缓存中没有请求数据的时候，客户端才会从服务端拿取数据。

强缓存主要是通过` http `请求头中的` Cache-Control `和 ` Expires `两个字段控制。

#### ` Expires `

` Expires `的值是服务端返回的数据到期时间。当再次请求时的请求时间小于返回的此时间，则直接使用缓存数据，但是因为客户端和服务端的时间可能有误差，所以这个缓存命中可能会有误差，另一方面，` expires `是` http1.0 `的产物，所以现在大多数都使用` Cache-Control `。

#### ` Cache-Control `

` Cache-Control `有很多产物，不同的属性代表的意义不同。

- ` private `： 客户端可以缓存

- ` public `： 客户端和服务器可以缓存

- ` max-age=t `：缓存内容在` t `秒后失效

- ` no-cache `：需要使用协商缓存来验证缓存数据

- ` no-store `：所有内容不使用缓存

### 协商缓存

也称为对比缓存，就是说客户端会从缓存中获取到一个缓存数据的标识，根据这个标识会请求服务端验证是否失效，如果没有失效，服务端会返回` 304 `，这时候客户端就直接从缓存中取数据，如果失效了，服务端会返回新的数据。

下面是协商缓存的方案：

#### ` Last-Modified `

##### ` Last-Modified `

服务端在响应请求时，会返回资源的最后修改时间

##### ` If-Modified-Since `

客户端再次请求服务端的时候，请求头会包含这个字段，后面跟着在缓存中获取的资源的最后修改时间。服务端收到请求发现此请求头中有` If-Modified-Since `字段，会与被请求资源的最后修改时间进行对比，如果一致则会返回` 304 `和响应报文头，浏览器从缓存中获取数据即可。从字面上看，就是说从某个时间节点开始看，是否被修改了，如果被修改了，就返回整个数据和` 200 OK `，如果没有被修改，服务端只要返回响应头报文，` 304 Not Modified `。

##### ` If-Unmodified-Since `

和` If-Modified-Since `相反，就是说从某个时间点开始看，是否没有被修改.如果没有被修改，就返回整个数据和` 200 OK `，如果被修改了，不传输和返回` 412 Precondition failed  `(预处理错误)

` If-Modified-Since `和` If-Unmodified-Since `区别就是一个是修改了返回数据一个是没修改返回数据。

` Last-Modified `也有缺点，就是说服务端的资源只是改了下修改时间，但是其实里面的内容并没有改变，会因为` Last-Modified `发生了改变而返回整个数据，为了解决这个问题，` http1.1 `推出了` Etag `。

#### ` Etag `

##### ` Etag `

服务端响应请求时，通过此字段告诉客户端当前资源在服务端生成的唯一标识（生成规则由服务端决定）

##### ` If-None-Match `

再次请求服务端的时候，客户端的请求报文头部会包含此字段，后面的值是从缓存中获取的标识，服务端接收到报文后发现` If-None-Match `则与被请求的资源的唯一标识对比。如果相同，说明资源不用修改，则响应` header `，客户端直接从缓存中获取数据，返回状态码` 304 `，如果不同，说明资源被改过，返回整个数据，` 200 OK `。

但是实际应用中由于` Etag `的计算是使用算法计算出来的，而算法会占用服务端的资源，所有服务端的资源都是宝贵的，所以很少使用` Etag `。

现在顺便说一下不同的刷新的请求执行过程哈

1. 浏览器直接输入` url `，回车

浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存中拿（最快）

2. ` F5 `

告诉浏览器，去服务端看下文件是否过期了，于是浏览器发了一个请求带上` If-Modified-Since `

3. ` Ctrl+F5 `

告诉浏览器，先把缓存删了，再去服务端请求完整的资源文件过来，于是浏览器就完成了强制更新的操作

#### ` ETag `与` Last-Modified `谁优先

协商缓存，有` ETag `和` Last-Modified `两个字段。那当这两个字段同时存在的时候，会优先以哪个为准呢？

在` Express `中，使用了[` fresh `](https://github.com/jshttp/fresh)这个包来判断是否是最新的资源。主要源码如下：

```js
function fresh (reqHeaders, resHeaders) {
  // fields
  var modifiedSince = reqHeaders['if-modified-since']
  var noneMatch = reqHeaders['if-none-match']

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  var cacheControl = reqHeaders['cache-control']
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false
  }

  // if-none-match
  if (noneMatch && noneMatch !== '*') {
    var etag = resHeaders['etag']

    if (!etag) {
      return false
    }

    var etagStale = true
    var matches = parseTokenList(noneMatch)
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i]
      if (match === etag || match === 'W/' + etag || 'W/' + match === etag) {
        etagStale = false
        break
      }
    }

    if (etagStale) {
      return false
    }
  }

  // if-modified-since
  if (modifiedSince) {
    var lastModified = resHeaders['last-modified']
    var modifiedStale = !lastModified || !(parseHttpDate(lastModified) <= parseHttpDate(modifiedSince))

    if (modifiedStale) {
      return false
    }
  }

  return true
}
```

我们可以看到，如果不是强制刷新，而且请求头带上了` if-modified-since `和` if-none-match `两个字段，则先判断` etag `，再判断` last-modified `。

## ` ETag `计算

### ` Nginx `

` Nginx `官方默认的` ETag `计算方式是为"文件最后修改时间` 16 `进制-文件长度` 16 `进制"。例：` ETag： "59e72c84-2404" `

### ` Express `

` Express `框架使用了` serve-static `中间件来配置缓存方案，其中，使用了一个叫[` etag `](https://github.com/jshttp/etag)的` npm `包来实现` etag `计算。从其源码可以看出，有两种计算方式：

- 方式一：使用文件大小和修改时间

```js
function stattag (stat) {
  var mtime = stat.mtime.getTime().toString(16)
  var size = stat.size.toString(16)

  return '"' + size + '-' + mtime + '"'
}
```

- 方式二：使用文件内容的` hash `值和内容长度

```js
function entitytag (entity) {
  if (entity.length === 0) {
    // fast-path empty
    return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"'
  }

  // compute hash of entity
  var hash = crypto
    .createHash('sha1')
    .update(entity, 'utf8')
    .digest('base64')
    .substring(0, 27)

  // compute length of entity
  var len = typeof entity === 'string'
    ? Buffer.byteLength(entity, 'utf8')
    : entity.length

  return '"' + len.toString(16) + '-' + hash + '"'
}
```

## 参考文献

[浏览器缓存机制分析](https://segmentfault.com/a/1190000012472330)

[前端缓存最佳实践](https://juejin.im/post/5c136bd16fb9a049d37efc47)
