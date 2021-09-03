---
title: 使用 OpenSSL 生成 RSA 密钥
date: 2020-05-12
tags:
  - tools
author: lili
location: shenzhen
---

## Windows 环境

### 下载 OpenSSL

[https://www.openssl.org/](https://www.openssl.org/)没有提供Windows版本的安装包，但是可以选择其他开源平台提供的工具：例如[http://slproweb.com/products/Win32OpenSSL.html](http://slproweb.com/products/Win32OpenSSL.html)。

### 安装和运行

- 下载 OpenSSL 后，按照提示安装OpenSSL。
- 安装完成后，进入安装目录下的bin目录，点击运行openssl.exe，打开命令行窗口。


## Mac 环境

### 安装

一般 Mac 系统安装后都会自动安装openssl，如果没有安装，则可以：

```sh
sudo apt-get install openssl
```

然后打开 terminal，在命令行输入 openssl 就可以进入 openssl 交互页面

## 命令

1. 生成 RSA 私钥

```sh
genrsa -out rsa_private_key.pem 1024
```

该命令会生成1024位的私钥，生成成功的界面如下：

![image from dependency](../../.vuepress/public/images/openssl-rsa/01.png)

2. 生成 RSA公钥

```sh
rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
```

结果如图：

![image from dependency](../../.vuepress/public/images/openssl-rsa/02.png)

(mac环境)接着:

```sh
open ~
```

此时我们就可以看到这个目录下的公钥和私钥文件：

![image from dependency](../../.vuepress/public/images/openssl-rsa/03.png)

## 其他命令

- 将 *RSA私钥* 转换成 DER 格式:

```sh
rsa -in rsa_private_key.pem -out rsa_private_key.der -outform der
```

- 将 *RSA公钥* 转换成 DER 格式:

```sh
 rsa -in rsa_public_key.pem -out rsa_public_key.der -pubin -outform der
```

- 以明文输出 *RSA私钥* 内容:

```sh
rsa -in rsa_private_key.pem -text -out rsa_private_key.txt
```

- 以明文输出 *RSA公钥* 内容:

```sh
rsa -in rsa_public_key.pem -out rsa_public_key.txt -pubin -pubout -text
```

- 把 *RSA私钥* 转换成 PKCS8 格式：

```sh
pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM –nocrypt
```

- 从私钥创建公钥证书请求:

```sh
req -new -key rsa_private_key.pem -out rsa_public_key.csr
```

- 生成证书并签名(有效期10年)：

```sh
x509 -req -days 3650 -in rsa_public_key.csr -signkey rsa_private_key.pem -out rsa_public_key.crt
```

- 把crt证书转换为der格式：

```sh
x509 -outform der -in rsa_public_key.crt -out rsa_public_key.der
```

- 把crt证书生成私钥p12文件：

```sh
pkcs12 -export -out rsa_private_key.p12 -inkey rsa_private_key.pem -in rsa_public_key.crt
```
