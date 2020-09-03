---
title: 翻墙：搬瓦工+shadowsocks
date: 2019-01-08
tags:
  - 其他
author: lili
location: shenzhen
---
# 翻墙：搬瓦工+shadowsocks

为了查询资料的便利性，大部分时候需要使用` Google ` 浏览器，但是国内除了高校能默认支持访问` Google ` 的服务外，基本所有人想使用` Google `的服务都需要借助 虚拟专用网` VPN `(` Virtual Private Network `)

为能正常使用` Google ` 的资源以及考虑到数据访问的私密性，就开始考虑搭建一个私人的` VPN `服务。查询了一些资料，找到了 搬瓦工 (` BandwagonHost `) 。以下是搭建的流程：

### 一、购买主机服务` VPS `

首先需要到搬瓦工上购买主机服务

![image from dependency](../../.vuepress/public/images/vpn-shadowsocks/1.png)

选一个适合自己的

购买成功之后就可以看到：

![image from dependency](../../.vuepress/public/images/vpn-shadowsocks/2.png)

### 二、登录` VPS `

打开` git bash `终端，在终端输入命令**ssh root@IP地址 -p ssh端口**，其中` IP `地址和` SSH ` 端口换成上图中的` Public IP address `和` SSH Port `信息

```sh
ssh root@111.11.111.111 -p 1111
```

### 三、安装` SSR `脚本

` VPS `登录成功后，执行下面的脚本

##### 1. 等到出现` root@host ~ `字样，执行命令

```sh
wget --no-check-certificate -O shadowsocks-all.sh https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
```

**注意 (warning) : 国外服务器运行脚本时容易出错，如出现错误提示 bash: wget: command not found，可以请在先执行 yum -y install wget 命令。成功后，再执行上面的命令。如果没有出现提示错误，请略过。**

##### 2. 等待上一步的命令执行结束后，继续执行命令

```sh
chmod +x shadowsocks-all.sh
```

##### 3. 等待上一步的命令执行结束后，继续执行命令

```sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log
```
##### 4. 根据需要选择，不懂的话直接选1，或者默认回车。下面会提示你输入你的 SS SERVER 的密码和端口。不输入就是默认。跑完命令后会出来你的 SS 客户端的信息。


```sh
Which Shadowsocks server you’d select:
1) Shadowsocks-Python
2) ShadowsocksR
3) Shadowsocks-Go
4) Shadowsocks-libev
Please enter a number (Default Shadowsocks-Python):1

You choose = Shadowsocks-Python

Please enter password for Shadowsocks-Python
(Default password: teddysun.com):123456

password = 123456

Please enter a port for Shadowsocks-Python [1-65535]
(Default port: 11260):11260

port = 11260
```

##### 5. 特别注意，由于` iPhone `端的的` wingy ` 目前只支持到` cfb `，所以我们选择 ` aes-256-cfb `，即` 7 `，回车。

##### 6. 当我们看到` Congratulations, Shadowsocks-Python server install completed! `时，则证明我们已经成功安装了 ` SS `。请立即将这些信息复制下来加以保存，我们就会用到这几个比较重要的信息：主机服务器` IP `地址、端口号、密码和加密方式。上面的命令全部回车执行后，如果没有报错，即为执行成功，出现确认提示的时候，输入` y `后，回车即可。


这样的话我们就在搬瓦工` VPS `主机上完成了` SS ` 的手动安装，记录保存好你的上述信息：` Server IP `、` Server Port `、` Password `、` Encryption Method `，我们就可以在不同的设备终端找到相应的` SS ` 进行安装设置使用了。

```sh
INFO: loading config from /etc/shadowsocks-python/config.json
2019-03-28 05:14:24 INFO     loading libcrypto from libcrypto.so.10
Starting Shadowsocks success

Congratulations, Shadowsocks-Python server install completed!
Your Server IP        :  111.11.111.111
Your Server Port      :  11260
Your Password         :  123456
Your Encryption Method:  aes-256-cfb

Your QR Code: (For Shadowsocks Windows, OSX, Android and iOS clients)
ss://xxxxxxxxxxxxxxxxx
Your QR Code has been saved as a PNG file path:
/root/shadowsocks_python_qr.png

Welcome to visit: https://teddysun.com/486.html
Enjoy it!
```

### 四、使用` Shadowsocks `终端体验` VPN `服务

在` GitHub `上可以下载` Windows `、` Mac `和` iPhone `等版本的` shadowsocks `。

根据设备类型，下载对应的平台软件，并设置好参数就可以畅享` VPN `服务了。

比如配置` Windows `版本：

` Windows `：[` Github `链接地址](https://github.com/shadowsocks/shadowsocks-windows/releases)

压缩包下载解压后，双击运行` shadowsocks.exe `，之后会在任务栏有一个小飞机图标，右击小飞机图标，选择服务器->编辑服务器：

![image from dependency](../../.vuepress/public/images/vpn-shadowsocks/3.png)

在` shadowsocks `的` windows `客户端中，服务器` IP `指你购买的` VPS `的` IP `，服务器端口指你服务器的配置文件中的端口，密码指你服务器的配置文件中的密码，加密指你服务器的配置文件中的加密方式，代理端口默认为` 1080 `不需要改动。其他都可以默认。设置好后，点击添加按钮即可。
