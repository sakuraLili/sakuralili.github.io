---
title: Docker 前端实践
date: 2020-09-07
tags:
  - Docker
author: lili
location: shenzhen
---

### 使用 .dockerignore 文件

可以通过 .dockerignore 文件来让Docker忽略匹配路径或文件，在创建镜像时不将无关数据发送到服务器。

比如：

```.dockerignore
*/temp *
*/*/temp *
tmp?
~*
Dockerfile
!README.md
```

- *: 表示任意多个字符；
- ?: 表示单个字符；
- !: 表示不匹配，即不忽略指定的路径或文件；

<table>
  <tr>
    <th>指令</th>
    <th>格式</th>
    <th>实例</th>
    <th>说明</th>
  </tr>
  <tr>
    <td>ARG</td>
    <td>ARG &lt;name&gt;[=&lt;default value&gt;]</td>
    <td>ARG VERSION=9.3</td>
    <td>定义创建镜像过程中使用的变量</td>
  </tr>
  <tr>
    <td>FROM</td>
    <td>1.FROM &lt;image&gt; [AS &lt;name&gt;] <br>2.FROM &lt;image&gt;:&lt;tag&gt; [AS &lt;name&gt;] <br>3.FROM &lt;image&gt;@&lt;digest&gt; [AS &lt;name&gt;]</td>
    <td>FROM debian:${VERSION}</td>
    <td>指定所创建镜像的基础镜像</td>
  </tr>
  <tr>
    <td>LABEL</td>
    <td>LABEL &lt;key1&gt;=&lt;value1&gt; &lt;key2&gt;=&lt;value2&gt;</td>
    <td>LABEL version="1.0.0-rc3"</td>
    <td>为生成的镜像添加元数据标签信息</td>
  </tr>
  <tr>
    <td>EXPOSE</td>
    <td>EXPOSE &lt;port&gt; [&lt;port&gt;/&lt;protocol&gt;]</td>
    <td>EXPOSE 22 808443</td>
    <td>声明镜像内服务监听的端口</td>
  </tr>
  <tr>
    <td>ENV</td>
    <td>1.ENV &lt;key&gt; &lt;value&gt; <br>2.ENV &lt;key&gt;=&lt;value&gt;</td>
    <td>ENV APP_HOMT=/usr/local/app</td>
    <td>指定环境变量</td>
  </tr>
  <tr>
    <td>ENTRYPOINT</td>
    <td>1.ENTRYPOINT ["executable", "param1", "param2"]<br>2.ENTRYPOINT command param1 param2</td>
    <td>--</td>
    <td>指定镜像的默认入口命令</td>
  </tr>
  <tr>
    <td>VOLUME</td>
    <td>VOLUME ["/data"]</td>
    <td>--</td>
    <td>创建一个数据卷挂载点</td>
  </tr>
  <tr>
    <td>USER</td>
    <td>USER daemon</td>
    <td>--</td>
    <td>指定运行容器时的用户名或UID</td>
  </tr>
  <tr>
    <td>WORKDIR</td>
    <td>WORKDIR /path/to/workdir</td>
    <td>--</td>
    <td>配置工作目录</td>
  </tr>
  <tr>
    <td>ONBUILD</td>
    <td>ONBUILD [INSTRUCTION]</td>
    <td>ONBUILD ADD . /app/src</td>
    <td>创建子镜像时指定自动执行的操作命令</td>
  </tr>
  <tr>
    <td>STOPSIGNAL</td>
    <td>STOPSIGNAL signal</td>
    <td>--</td>
    <td>指定退出的信号值</td>
  </tr>
  <tr>
    <td>HEALTHCHECK</td>
    <td>1.HEALTHCHECK [OPTIONS] CMD command<br>2.HEALTHCHECK NONE</td>
    <td></td>
    <td>配置所启动容器如何进行健康检查</td>
  </tr>
  <tr>
    <td>SHELL</td>
    <td>SHELL ["executable", "param1"]</td>
    <td>SHELL ["/bin/sh", "-c"]</td>
    <td>指定默认的 shell 类型</td>
  </tr>
  <tr>
    <td>RUN</td>
    <td>1.RUN &lt;command&gt;<br>2.RUN ["executable", "param1","param2"]</td>
    <td>RUN ["/bin/bash","-c","echo hello"]</td>
    <td>运行指定命令</td>
  </tr>
  <tr>
    <td>CMD</td>
    <td>1.CMD ["executable", "param1","param2"]<br>2.CMD command param1 param2<br>3.CMD ["param1","param2"]</td>
    <td></td>
    <td>启动容器时指定默认执行的命令</td>
  </tr>
  <tr>
    <td>ADD</td>
    <td>ADD &lt;src&gt; &lt;dest&gt;</td>
    <td>ADD *.c /code/</td>
    <td>将src目录下的内容添加到容器中的dest目录下</td>
  </tr>
  <tr>
    <td>COPY</td>
    <td>COPY &lt;src&gt; &lt;dest&gt;</td>
    <td></td>
    <td>复制内容到镜像</td>
  </tr>
</table>
