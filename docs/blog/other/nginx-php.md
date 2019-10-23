# Nginx+Php本地环境搭建

## 下载准备

- Nginx：到[管网](http://nginx.org/en/download.html)下载最新版本；

- Php：[管网](http://windows.php.net/download#php-7.1)下载最新版本。

## 安装

- 在D盘根目录下新建`wnmp`文件夹。（安装路径不要包含中文等特殊字符）；
- 将下载的`php`和`Nginx`压缩包直接解压到`D:\wnmp`目录下。

## 修改配置文件

### 配置Nginx

- 进入到`Nginx`的安装目录`D:\wnmp\nginx-1.12.1\conf`下，找到`nginx.conf`文件并打开。
- 在`http`模块下，加入以下内容。

    ```bash
    server {
        listen       80;
        server_name  dev.com;
        root         F:\official-website\public;
        index        index.php index.html index.htm;

        location / {
            if (!-e $request_filename) {
                rewrite ^/(.*)$ /index.php/$1 last;
                break;
            }
        }

        location ~ \.php {
            fastcgi_index index.php;
            if ($fastcgi_script_name ~ "^(.+?\.php)(/{0,1}.*)$") {
                set $real_script_name $1;
                set $path_info $2;
            }
            include fastcgi_params;
            fastcgi_param REDIRECT_STATUS 200;
            fastcgi_param SCRIPT_FILENAME $document_root$real_script_name;
            fastcgi_param SCRIPT_NAME $real_script_name;
            fastcgi_param PATH_INFO $path_info;
            fastcgi_pass 127.0.0.1:9000;
        }

    }

    server {
        listen       80;
        server_name  test.com;

        location / {
            proxy_pass http://localhost:5000;
            proxy_buffering off;
        }
    }
    ```

### 配置Php

- 进入到`Php`的安装目录`D:\wnmp\php-7.1.7-Win32-VC14-x64`下，找到`php.ini-development`文件（如果没有就在`ext`目录下找）;
- 复制`php.ini-development`文件在当前目录，并重命名为`php.ini`;
- 打开`php.ini`文件，按照以下方式修改文件：

    ```
    1. 搜索   extension_dir（738行）           去掉分号，将 "ext" 改为 "D:\wnmp\php-7.1.7-Win32-VC14-x64\ext"；
    2. 搜索   date.timezone（939行）           去掉分号，再改为 date.timezone = Asia/Shanghai；
    3. 搜索   enable_dl（748行）               将 Off 改为 On；
    4. 搜索   cgi.force_redirect（755行）      去掉分号，将 1 改为 0；
    5. 搜索   fastcgi.impersonate（788行）     去掉前面的分号；
    6. 搜索   cgi.rfc2616_headers（800行）     去掉分号，将 0 改为 1；
    7. 搜索   Windows Extensions（886行）      找到以下扩展，并去掉前面的分号：
              php_curl.dll        // 893行
              php_gd2.dll         // 896行
              php_mbstring.dll    // 903行
              php_mysqli.dll      // 905行
              php_openssl.dll     // 907行
              php_pdo_mysql.dll   // 909行
    ```

## 启动测试

### 修改环境变量

在启动之前，先将`nginx`和`php`添加到环境变量中去，方便以后执行。

- 打开“计算机系统”窗口，一次进入：高级系统设置 > 环境变量 > 系统变量下找到`Path`变量，并编辑；
- 将`Php`和`Nginx`安装路径添加到变量值的末尾，比如：`;D:\wnmp\php-7.1.7-Win32-VC14-x64;D:\wnmp\nginx-1.12.1`，注意不同路径直接要用`;`隔开。

### 测试

- 按住`Win+R`打开“运行”窗口，输入`cmd`回车打开cmd命令行终端；
- 输入`nginx -v`回车，如果输出nginx的版本号，说明`nginx`已安装成功；
- 然后再输入`php -v`回车，正常输出版本号则说明`php`已安装成功；
- 如果提示缺少`VCRUNRIME140.dll`，到[这里下载](http://download.microsoft.com/download/9/E/1/9E1FA77A-9E95-4F3D-8BE1-4D2D0C947BA2/enu_INREL/vcredistd14x64/vc_redist.x64.exe)并安装该组件；

### 启动和关闭脚本

- 下载一个`RunHiddenConsole.exe`，并移动到`D:\wnmp\`目录下；
- 继续在`D:\wnmp\`目录下新建`start.bat`和`stop.bat`文件，分别写入以下内容。

`start.bat`文件：

```bash
@echo off
echo Starting PHP FastCGI...
RunHiddenConsole php-cgi -b 127.0.0.1:9000 -c D:\wnmp\php-7.1.7-Win32-VC14-x64\php.ini
echo Starting nginx...
nginx -p D:\wnmp\nginx-1.12.1
```

`stop.bat`文件：

```bash
@echo off
echo Stopping nginx...
taskkill /F /IM nginx.exe > nul
echo Stopping PHP FastCGI...
taskkill /F /IM php-cgi.exe > nul
exit
```

现在的目录结构是这样的：

## 安装Composer

1. 到[管网](https://getcomposer.org/download/)下载[`Composer`](https://getcomposer.org/Composer-Setup.exe)。
2. 启动安装，程序会自动找到本地安装的`Php`路径，如果没找到，则手动找到`php`的安装路径。
3. 安装完成之后，在cmd命令行终端下输入`composer -v`，能正常输出则安装成功。进入第7步；
4. 如果多次安装仍失败，点击[这里](https://getcomposer.org/composer.phar)下载`composer.phar`，并移动到`php`安装的根目录下`D:\wnmp\php-7.1.7-Win32-VC14-x64\`；
5. 并在该目录下创建`composer.cmd`文件，写入以下内容：

    ```bash
    @php "%~dp0composer.phar" %*
    ```

6. 执行第3步的验证，成功则进入下一步；

7. 更换为国内镜像：

    ```bash
    composer config -g repo.packagist composer https://packagist.phpcomposer.com
    ```

## 运行项目

### 安装依赖

- 将`revolution-admin`和`official-website`两个项目`clone`到本地；
- 进入到`official-website`根目录下，执行以下命令：

    ```bash
    # 安装前端依赖
    yarn

    # 安装后端依赖
    composer install
    ```

- 同样进入到`revolution-admin`目录下，执行：

    ```bash
    # 安装前端依赖
    yarn
    ```

### 修改本地hosts文件

- 进入到`C:\Windows\System32\drivers\etc`目录下，找到`hosts`文件；
- 用编辑器打开，在内容的最后添加：

    ```
    127.0.0.1           dev.com
    127.0.0.1           test.com
    ```

- 如果修改文件失败，则为当前用户增加对该文件的“修改”权限，重新添加上面的内容。

### 更新Nginx配置文件

- 重新打开`D:\wnmp\nginx-1.12.1\conf`目录下的`nginx.conf`文件；
- 在新增的第一个`server`中，将`root`指向你本地的`official-website`项目下的`public`路径（路径必须要正确）；
- 在新增的第二个`server`中，将`proxy_pass`指向`revolution-admin`项目启动的服务器（注意端口号）。这里可不修改，如果端口号改变，则改为正确的端口号即可。

### 启动项目

- 首先启动Nginx和Php服务：进入到`D:\wnmp\`目录下双击执行`start.bat`脚本文件；

- 进入到`official-website`目录下，运行：

    ```bash
    # 编译前端文件，并启动监听
    yarn start
    ```
- 进入到`revolution-admin`目录下，运行：

    ```bash
    # 编译前端项目文件，并启动本地服务器
    yarn start
    ```

如果一切正常，整个环境则配置完成。如果运行有报错，可能是`node-sass`没有安装成功，执行以下命令单独安装`node-sass`。

```bash
# 设置淘宝镜像
yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
# 安装 node-sass
yarn add -D node-sass
```

### 浏览器访问

- 在浏览器中打开：`http://dev.com`，进入本地薪乐宝管网（`official-website`项目）。如果页面出现错误代码`100003`，则按以下处理：

    > 在当前项目的根目录下，找到`.env.example`，复制一份到当前目录，并重命名为`.env`。

- 在浏览器中打开：`http://test.com`，看到页面（`revolution-admin`项目）。
