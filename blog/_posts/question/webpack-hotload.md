---
title: Webpack 热加载时项目挂掉
date: 2019-02-24
tags:
  - 问题累积
author: lili
location: shenzhen
---

最近用` webpack `热加载项目时经常挂掉，并报:

```sh
webpack:CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

错误原因是：编译的时间内存泄漏,因为前端项目如果非常的庞大，` webpack `编译时就会占用很多的系统资源，如果超出了`V8 `对` Node `默认的内存限制大小就会出现这个错误了。

解决办法是我们在` Node `在启动时可以传递` --max-old-space-size `或` --max-new-space-size `来调整内存大小的使用限制；

```
node --max-old-space-size=2048
node --max-new-space-size=2048
```

在开发中，如果使用` webpack-dev-server `插件，打开 `package.json `可以看到

```json
"scripts": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "build": "node build/build.js"
  },
```

上面的命令中没有使用` node `命令，上面的解决方法无法使用。

解决方法：

` webpack-dev-server `封装了` node run dev `命令，可以在` webpack-dev-server `命令中修改：

- 打开` node_modules `文件夹
- 打开` .bin `文件夹
- 找到` webpack-dev-server.cmd `；这个文件并用编辑器打开；打开后我的如下：

```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
)
```

这里就有` dev `环境的` node `运行命令了,我们只要在倒数第二行` node `后面加上上文提到的代码就可以了；注意空格；

```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  --max-old-space-size=4096  "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
)
```
