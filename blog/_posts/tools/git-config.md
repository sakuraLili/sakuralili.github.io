---
title: Git 配置问题
date: 2019-01-22
tags:
  - tools
author: lili
location: shenzhen
---

### 换行符问题

在各操作系统下，文本文件所使用的换行符是不一样的。` UNIX/Linux `使用的是 ` 0x0A（LF）`，早期的` Mac OS `使用的是` 0x0D（CR）`，后来的` OS X `在更换内核后与` UNIX `保持一致了。但` DOS/Windows `一直使用 ` 0x0D0A（CRLF）`作为换行符。

` Git `提供了一个“换行符自动转换”功能。这个功能默认处于“自动模式”，当你在签出文件时，它试图将` UNIX `换行符`（LF）`替换为` Windows ` 的换行符（` CRLF `）；当你在提交文件时，它又试图将` CRLF `替换为` LF `。` Git ` 的“换行符自动转换”功能听起来似乎很智能、很贴心，因为它试图一方面保持仓库内文件的一致性（` UNIX `风格），一方面又保证本地文件的兼容性（` Windows ` 风格）。但遗憾的是，这个功能是有` bug `的，而且在短期内都不太可能会修正。

总结各种操作系统中的换行符：

- ` UNIX/Linux / OS X : LF `

- ` OS X `(早期)： ` CR `

- ` DOS/Windows： CRLF `

#### 解决方案
1. ` Git `设置

```bash
git config --global core.autocrlf false
git config --global core.safecrlf true
```

含义：

1. **` AutoCRLF `**
- 提交时转换为` LF `，检出时转换为` CRLF `
```bash
git config --global core.autocrlf true
```

- 提交时转换为` LF `，检出时不转换
```bash
git config --global core.autocrlf input
```

- 提交检出均不转换
```bash
git config --global core.autocrlf false
```

2. **` SafeCRLF `**
- 拒绝提交包含混合换行符的文件
```bash
git config --global core.safecrlf true
```

- 允许提交包含混合换行符的文件
```bash
git config --global core.safecrlf false
```

- 提交包含混合换行符的文件时给出警告

```bash
git config --global core.safecrlf warn
```

### 产生` SSH key `

```bash
git config --global user.name "xxxx"
git config --global user.email "email@email.com"
```

```
ssh-keygen -t rsa -C "email@email.com"
```
