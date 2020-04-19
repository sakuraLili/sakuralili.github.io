---
title: MacOS 安装 npm 全局包时遭遇权限问题
date: 2019-12-24
tags:
  - 问题累积
author: lili
location: shenzhen
---

最近在` Mac `上使用` npm `安装全局包:

```shell
npm install -g yarn react-native-cli
```
结果就出现了下面的问题：

```shell
WH-JSdeMacBook-Pro-2:ReactNativeDemo wh-js$ npm install -g yarn react-native-cli
npm WARN checkPermissions Missing write access to /usr/local/lib/node_modules
npm ERR! path /usr/local/lib/node_modules
npm ERR! code EACCES
npm ERR! errno -13
npm ERR! syscall access
npm ERR! Error: EACCES: permission denied, access '/usr/local/lib/node_modules'
npm ERR!  { [Error: EACCES: permission denied, access '/usr/local/lib/node_modules']
npm ERR!   stack:
npm ERR!    'Error: EACCES: permission denied, access \'/usr/local/lib/node_modules\'',
npm ERR!   errno: -13,
npm ERR!   code: 'EACCES',
npm ERR!   syscall: 'access',
npm ERR!   path: '/usr/local/lib/node_modules' }
npm ERR!
npm ERR! The operation was rejected by your operating system.
npm ERR! It is likely you do not have the permissions to access this file as the current user
npm ERR!
npm ERR! If you believe this might be a permissions issue, please double-check the
npm ERR! permissions of the file and its containing directories, or try running
npm ERR! the command again as root/Administrator (though this is not recommended).

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/wh-js/.npm/_logs/2019-07-15T02_17_29_666Z-debug.log
```

解决方法：在安装命令前加上` sudo `就可以了

```shell
sudo npm install -g yarn react-native-cli
```
