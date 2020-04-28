---
title: MAC 生成 SSH KEY
date: 2019-01-10
tags:
  - 其他
author: lili
location: shenzhen
---

- 打开终端查看是否已经存在` SSH `密钥

```sh
cd ~/.ssh
```

如果没有密钥则不会有此文件夹

- 生成新的秘钥, 命令如下

```sh
ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，因为这个` Key `仅仅用于简单的服务，所以也无需设置密码。

- 到ssh目录下打开.ssh

```sh
cd ~/.ssh
open .
```

里面存放着三个文件` id_rsa `、` id_rsa.pub `、` known_hosts `

将` id_rsa.pub `(公钥` ssh key `)里的内容全部复制到服务器端(例如` gitHub `的公钥` sshkey `)

` id_rsa `为私钥文件，存储在本地
