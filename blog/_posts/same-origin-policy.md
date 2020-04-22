---
title: 同源策略与跨域
date: 2020-02-11
tags:
  - JavaScript
  - web
author: lili
location: shenzhen
---

## 一、同源策略

### 1.1 含义

同源策略要求源相同才能正常进行通信，***即协议、域名和端口号都完全一致***。

同源策略的目的是为了保证用户信息的安全，防止恶意的网站窃取数据。

### 1.2 限制范围

目前，如果非同源，共有三种行为受到限制：

- ` Cookie `、` LocalStorage `和` IndexDB `无法读取。
- ` DOM `无法获得。
- ` Ajax `请求不能发送。

但是有三个标签是允许跨域加载资源：
- ` <img src=XXX> `
- ` <link href=XXX> `
- ` <script src=XXX> `

` home.com `加载的` cdn.home.com/index.js `可以向` home.com `发请求而不会跨域，这是因为` home.com `加载的` JS `是工作在` home.com `的，它的源不是提供` JS `的` cdn `，所以这个时候是没有跨域的问题的，==并且` script `标签能够加载非同源的资源，不受同源策略的影响。==

为什么限制` DOM `读取？

如果不限制的话，那么很容易就可以伪装其他的网站，如套一个` iframe `或者通过` window.open `方法，从而得到用户的操作和输入，如账户、密码。

添加这个` HTTP `头可以限制别人把你的网站套成它的` iframe `：
```
X-Frame-Options:SAMEORIGIN
```

## 二、什么是跨域

跨域是因为同源策略的限制。

跨域分为两种，一种是跨域请求，另一种访问跨域的页面，跨域请求可以通过` CORS/JSONP `等方法进行访问，跨域的页面主要通过` postMesssage `的方式。

### 2.1 跨域误区

关于跨域的误区：

- 错误：动态请求就会有跨域的问题。

  正确：跨域只存在于浏览器端，不存在与安卓` /ios/Node.js/python/ java `等其它环境。
- 错误：跨域就是请求发不出去。

  正确：跨域请求能发出去，服务器端能收到请求并正常返回结果，只是结果被浏览器拦截了。

规避同源策略有如下几种方法。

### 2.2 跨域方法

- Cookie
- iframe
- Ajax

## 三、Cookie

` Cookie `是服务器写入浏览器的一小段信息，只有同源的网页才能共享。但是，两个网页一级域名相同，只是二级域名不同，浏览器允许通过设置` document.domain `共享` Cookie `。

比如：` A `网页是` http://w1.example.com/a.html `，` B `网页是` http://w2.example.com/b.html `，那么只要设置相同的` document.domain `，两个网页就可以共享` Cookie `。

```js
document.domain = 'example.com'

// A网页设置Cookie
document.cookie = 'hello world';

// B网页可以读取到Cookie
const cookieA = document.cookie;
```

==注意，` Cookie `方法只适用于` Cookie `和` iframe ` 窗口，` LocalStorage `和` IndexDB ` 无法通过这种方法==，规避同源策略，而要使用` PostMessage API `。

另外，服务器也可以在设置` Cookie `的时候，指定` Cookie `的所属域名为一级域名，比如` .example.com `。

```
Set-Cookie: key=value; domain=.example.com; path=/
```

这样的话，二级域名和三级域名不用做任何设置，都可以读取这个` Cookie `。

关于` cookie `还有两个地方值得注意，如下图所示：

![image from dependency](../.vuepress/public/images/same-origin-policy/01.png)


## 四、iframe

` iframe `访问父页面可通过` window.parent `得到父窗口的` window `对象，通过` window.open `打开的页面可以用` window.opener `，进而得到父窗口的任何东西；
1. 父窗口如果和` iframe `同源的，那么可通过` iframe.contentWindow `得到` iframe `的` window `对象，
2. 如果和` iframe `不同源，则存在跨域的问题，目前有三种方法解决跨域：

- 片段识别符（` fragment identifier `）
- ` window.name `
- 跨文档通信` API `（` Cross-document messaging `）

### 4.1 片段识别符

片段识别符指的是` URL `的` # `号后面的部分，如果只是改变片段标识符，页面不会重新刷新。

父窗口可以把信息写入子窗口的片段标识符：

```js
const src = origin + '#' + data;
document.getElementById('myIframe').src = src;
```

子窗口通过监听` hashchange `事件得到通知:

```js
window.onhashchange = checkMessage;

function checkMessage() {
    const message = window.location.hash;
    // ...
}
```

子窗口也可以改变父窗口的片段标识符：

```js
parent.location.href = target + '#' + hash;
```

### 4.2 window.name

浏览器窗口有` window.name `属性。这个属性的最大特点是，无论是否同源，只要在同一个窗口里，前一个网页设置了这个属性，后一个网页可以读取它。

父窗口先打开一个子窗口，载入一个不同源的网页，该网页将信息写入` window.name `属性。

```js
window.name = data;
```

接着，子窗口跳回一个与主窗口同域的网址。

```js
location = 'http://parent.url.com/xxx.html';
```

然后，主窗口就可以读取子窗口的` window.name `了。

```js
const data = document.getElementById('myFrame').contentWindow.name;
```

==这种方法的优点是，` window.name `容量很大，可以放置非常长的字符串；缺点是必须监听子窗口` window.name `属性的变化，影响网页性能。==

### 4.3 ` window.postMessage `

跨文档通信` API `为` window `对象新增了一个` window.postMessage `方法，允许跨窗口通信，不论这两个窗口是否同源。

` postMessage `方法的第一个参数是具体的信息内容，第二个参数是接收消息的窗口的源（` origin `），即"协议` + `域名` + ` 端口"。也可以设为` * `，表示不限制域名，向所有窗口发送。

子窗口向父窗口发送消息:

```js
window.opener.postMessage('Nice to see you', 'http://aaa.com');
```

由于` script/iframe/img `等标签的请求是能带上` cookie `，用这些标签发请求是能绕过同源策略，因此就可以利用这些标签做==跨站请求伪造==（` CSRF `），代码如下：

```html
// 转账请求
<iframe src="http://Abank.com/app/transferFunds?amount=1500&destinationAccount=..."></iframe>

// 配置路由器添加代理
<img src="http://192.168.1.1/admin/config/outsideInterface?nexthop=123.45.67.89" style="display:none" />
```

如果相应的网站支持` GET `请求，或者没有做进一步的防护措施，那么如果用户在另外一个页面登陆过了，再打开一个“有毒”的网站就中招了。

### 4.4 LocalStorage

通过` window.postMessage `，读写其他窗口的` LocalStorage ` 也成为了可能。

下面是一个例子：

```js

// 父窗口发送消息
var win = document.getElementsByTagName('iframe')[0].contentWindow;
var obj = { name: 'Jack' };
// 存入对象
win.postMessage(JSON.stringify({key: 'storage', method: 'set', data: obj}), 'http://bbb.com');
// 读取对象
win.postMessage(JSON.stringify({key: 'storage', method: "get"}), "*");
window.onmessage = function(e) {
  if (e.origin != 'http://aaa.com') return;
  // "Jack"
  console.log(JSON.parse(e.data).name);
};

// 子窗口接收消息
window.onmessage = function(e) {
  if (e.origin !== 'http://bbb.com') return;
  var payload = JSON.parse(e.data);
  switch (payload.method) {
    case 'set':
      localStorage.setItem(payload.key, JSON.stringify(payload.data));
      break;
    case 'get':
      var parent = window.parent;
      var data = localStorage.getItem(payload.key);
      parent.postMessage(data, 'http://aaa.com');
      break;
    case 'remove':
      localStorage.removeItem(payload.key);
      break;
  }
};

```

## 五、Ajax

同源政策规定，` AJAX `请求只能发给同源的网址，否则就报错。

除了架设服务器代理（浏览器请求同源服务器，再由后者请求外部服务），有三种方法规避这个限制:

1. ` JSONP `
2. ` WebSocket `
3. ` CORS `

### 5.1 ` WebSocket `

` WebSocket `是一种通信协议，使用` ws:// `（非加密）和` wss:// `（加密）作为协议前缀。该协议不实行同源策略，只要服务器支持，就可以通过它进行跨源通信。

补充：` CSS `的字体文件是会有跨域问题，指定` CORS `就能加载其它源的字体文件（通常是放在` cdn `上的）。而` canvas `动态加载的外部` image `，也是需要指定` CORS `头才能进行图片处理，否则只能画不能读取。

下面是一个例子，浏览器发出的` WebSocket `请求的头信息（摘自[维基百科](https://en.wikipedia.org/wiki/WebSocket)）。

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

上面代码中，字段` Origin `表示该请求的请求源（` origin `），即发自哪个域名。

正是因为有了` Origin `字段，所以` WebSocket `才没有实行同源政策。因为服务器可以根据这个字段，判断是否许可本次通信。如果该域名在白名单内，服务器就会做出如下回应。

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
Sec-WebSocket-Protocol: chat
```

### 5.2 ` JSONP `

`JSONP `是服务器与客户端跨源通信的常用方法。最大特点就是简单适用，老式浏览器全部支持，服务器改造非常小。

它的基本思想是，网页通过添加一个`<script> `元素，向服务器请求` JSON `数据，这种做法不受同源政策限制；服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。

```js

function updateList(data) {
    console.log(data);
}
$body.append('<script src="http://http://example.com/ip?callback=updateList"></script>');

```


上面代码通过动态添加` <script> `元素，向服务器` example.com `发出请求。注意，该请求的查询字符串有一个` callback `参数，用来指定回调函数的名字，这对于` JSONP `是必需的。

服务器收到这个请求以后，会将数据放在回调函数的参数位置返回。

```js
foo({
  "ip": "8.8.8.8"
});

```
由于` <script> `元素请求的脚本，直接作为代码运行。这时，只要浏览器定义了` foo `函数，该函数就会立即调用。作为参数的` JSON `数据被视为` JavaScript `对象，而不是字符串，因此避免了使用` JSON.parse `的步骤。

### 5.3 ` CORS `

` CORS `即跨源资源分享（` Cross-Origin Resource Sharing `）是跨源` AJAX `请求的根本解决方法。相比` JSONP `只能发` GET `请求，` CORS `允许任何类型的请求。

` CORS `需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，` IE `浏览器不能低于` IE10 `。

整个` CORS `通信过程，都是浏览器自动完成，不需要用户参与。

浏览器一旦发现` AJAX `请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

因此，实现` CORS `通信的关键是服务器。只要服务器实现了` CORS `接口，就可以跨源通信。

#### 5.3.1 两种请求

浏览器将` CORS `请求分成两类：简单请求和非简单请求。

只要同时满足以下两大条件，就属于简单请求。

1. 请求方法是以下三种方法之一：

 - ` HEAD `
 - ` GET `
 - ` POST `

2. ` HTTP `的头信息不超出以下几种字段：

 - ` Accept `
 - ` Accept-Language `
 - ` Content-Language `
 - ` Last-Event-ID `
 - ` Content-Type `：只限于三个值` application/x-www-form-urlencoded `、` multipart/form-data `、` text/plain `

凡是不同时满足上面两个条件，就属于非简单请求。

#### 5.2 简单请求

对于简单请求，浏览器直接在头信息之中，增加一个` Origin `字段。比如：

```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

` Origin `字段用来说明，本次请求来自哪个源（协议` + `域名` + `端口）。服务器根据这个值，决定是否同意这次请求。

如果` Origin `指定的源，不在许可范围内，服务器会返回一个正常的` HTTP `回应。浏览器发现，这个回应的头信息没有包含` Access-Control-Allow-Origin `字段（详见下文），从而抛出一个错误，被` XMLHttpRequest `的` onerror `回调函数捕获。注意，这种错误无法通过状态码识别，因为` HTTP `回应的状态码有可能是` 200 `。

如果` Origin `指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```
- ` Access-Control-Allow-Origin `

该字段是必须的。它的值要么是请求时` Origin `字段的值，要么是一个` * `，表示接受任意域名的请求。

- ` Access-Control-Allow-Credentials `

该字段可选。它的值是一个布尔值，表示是否允许发送` Cookie `。默认情况下，` Cookie `不包括在` CORS `请求之中。设为` true `，即表示服务器明确许可，` Cookie `可以包含在请求中，一起发给服务器。这个值也只能设为` true `，如果服务器不要浏览器发送` Cookie `，删除该字段即可。

- ` Access-Control-Expose-Headers `

该字段可选。` CORS `请求时，` XMLHttpRequest `对象的` getResponseHeader() `方法只能拿到` 6 `个基本字段：` Cache-Control `、` Content-Language `、` Content-Type `、` Expires `、` Last-Modified `、` Pragma `。如果想拿到其他字段，就必须在` Access-Control-Expose-Headers `里面指定。上面的例子指定，` getResponseHeader('FooBar') `可以返回` FooBar `字段的值。

- ` withCredentials `属性

` CORS `请求默认不发送` Cookie `和` HTTP `认证信息。如果要把` Cookie `发到服务器，一方面要服务器同意，指定` Access-Control-Allow-Credentials `字段。

```
Access-Control-Allow-Credentials: true
```

另一方面，开发者必须在` AJAX `请求中打开` withCredentials `属性。


```js
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

否则，即使服务器同意发送` Cookie `，浏览器也不会发送。或者，服务器要求设置` Cookie `，浏览器也不会处理。

但是，如果省略` withCredentials `设置，有的浏览器还是会一起发送` Cookie `。这时，可以显式关闭` withCredentials `。

```
xhr.withCredentials = false;
```

需要注意的是，如果要发送` Cookie `，` Access-Control-Allow-Origin `就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，` Cookie `依然遵循同源政策，只有用服务器域名设置的` Cookie `才会上传，其他域名的` Cookie `并不会上传，且（跨源）原网页代码中的` document.cookie `也无法读取服务器域名下的` Cookie `。


#### 5.3.3 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是` PUT `或` DELETE `，或者` Content-Type `字段的类型是` application/json `。

1. 预检请求

非简单请求的` CORS `请求，会在正式通信之前，增加一次` HTTP `查询请求，称为"预检"请求（` preflight `）。

，预检请求使用` OPTIONS `方式去检测当前请求是否安全，如图所示：

![image](https://user-gold-cdn.xitu.io/2018/1/20/16113382cc7e75a9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

代码中只发了一个请求，但是在控制台可以看到两个请求，第一个就是` OPTIONS `，请求头信息如下：

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

- ` Access-Control-Request-Method `

该字段是必须的，用来列出浏览器的` CORS `请求会用到哪些HTTP方法。

- ` Access-Control-Request-Headers `

该字段是一个逗号分隔的字符串，指定浏览器` CORS `请求会额外发送的头信息字段。

服务器收到"预检"请求以后，检查了` Origin `、` Access-Control-Request-Method `和` Access-Control-Request-Headers `字段以后，确认允许跨源请求，就可以做出回应。

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
上面的` HTTP `回应中，关键的是` Access-Control-Allow-Origin `字段，表示` http://api.bob.com `可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

如果浏览器否定了"预检"请求，会返回一个正常的` HTTP `回应，但是没有任何` CORS `相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被` XMLHttpRequest `对象的` onerror `回调函数捕获。控制台会打印出如下的报错信息。

服务器回应的其他` CORS `相关字段如下:

```
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

- ` Access-Control-Allow-Methods `

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

- ` Access-Control-Allow-Headers `

如果浏览器请求包括` Access-Control-Request-Headers `字段，则` Access-Control-Allow-Headers `字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

- ` Access-Control-Allow-Credentials `

该字段与简单请求时的含义相同。

- ` Access-Control-Max-Age `

该字段可选，用来指定本次预检请求的有效期，单位为秒。在这个有效期内就不用再发一个` options `的请求。


### 5.4 支持` CORS `

##### 5.4.1 ` Nginx `可以这么配：

```
location / {
    if ($request_method = 'OPTION') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
    add_header 'Access-Control-Expose-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
}
```

#### 5.4.2 ` Node.js `后台配置(` express `框架)

```js
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
        //这段仅仅为了方便返回json而已
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200);
    } else {
        next();
    }
});
```

参考文献：

阮一峰, [浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)

阮一峰, [跨域资源共享` CORS ` 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

[我知道的跨域与安全](https://juejin.im/post/5a6320d56fb9a01cb64ee191)

[` ajax `跨域，这应该是最全的解决方案了](https://segmentfault.com/a/1190000012469713)
