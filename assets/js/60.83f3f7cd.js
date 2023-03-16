(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{563:function(a,t,s){"use strict";s.r(t);var n=s(5),e=Object(n.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h2",{attrs:{id:"下载准备"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#下载准备"}},[a._v("#")]),a._v(" 下载准备")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("Nginx：到"),t("a",{attrs:{href:"http://nginx.org/en/download.html",target:"_blank",rel:"noopener noreferrer"}},[a._v("管网"),t("OutboundLink")],1),a._v("下载最新版本；")])]),a._v(" "),t("li",[t("p",[a._v("Php："),t("a",{attrs:{href:"http://windows.php.net/download#php-7.1",target:"_blank",rel:"noopener noreferrer"}},[a._v("管网"),t("OutboundLink")],1),a._v("下载最新版本。")])])]),a._v(" "),t("h2",{attrs:{id:"安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[a._v("#")]),a._v(" 安装")]),a._v(" "),t("ul",[t("li",[a._v("在D盘根目录下新建"),t("code",[a._v("wnmp")]),a._v("文件夹。（安装路径不要包含中文等特殊字符）；")]),a._v(" "),t("li",[a._v("将下载的"),t("code",[a._v("php")]),a._v("和"),t("code",[a._v("Nginx")]),a._v("压缩包直接解压到"),t("code",[a._v("D:\\wnmp")]),a._v("目录下。")])]),a._v(" "),t("h2",{attrs:{id:"修改配置文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改配置文件"}},[a._v("#")]),a._v(" 修改配置文件")]),a._v(" "),t("h3",{attrs:{id:"配置nginx"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#配置nginx"}},[a._v("#")]),a._v(" 配置Nginx")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("进入到"),t("code",[a._v("Nginx")]),a._v("的安装目录"),t("code",[a._v("D:\\wnmp\\nginx-1.12.1\\conf")]),a._v("下，找到"),t("code",[a._v("nginx.conf")]),a._v("文件并打开。")])]),a._v(" "),t("li",[t("p",[a._v("在"),t("code",[a._v("http")]),a._v("模块下，加入以下内容。")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("server "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    listen       "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("80")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    server_name  dev.com"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    root         F:"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("official-website"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("public"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    index        index.php index.html index.htm"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n\n    location / "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v("!")]),a._v("-e "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$request_filename")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n            rewrite ^/"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v(".*"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("$ /index.php/"),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$1")]),a._v(" last"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("break")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n\n    location ~ "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v(".php "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        fastcgi_index index.php"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("if")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$fastcgi_script_name")]),a._v(" ~ "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"^(.+?\\.php)(/{0,1}.*)$"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("set")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$real_script_name")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("set")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$path_info")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$2")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n        include fastcgi_params"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        fastcgi_param REDIRECT_STATUS "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("200")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        fastcgi_param SCRIPT_FILENAME "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$document_root")]),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$real_script_name")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        fastcgi_param SCRIPT_NAME "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$real_script_name")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        fastcgi_param PATH_INFO "),t("span",{pre:!0,attrs:{class:"token variable"}},[a._v("$path_info")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        fastcgi_pass "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("127.0")]),a._v(".0.1:9000"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n\nserver "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    listen       "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("80")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    server_name  test.com"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n\n    location / "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n        proxy_pass http://localhost:5000"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n        proxy_buffering off"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n")])])])])]),a._v(" "),t("h3",{attrs:{id:"配置php"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#配置php"}},[a._v("#")]),a._v(" 配置Php")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("进入到"),t("code",[a._v("Php")]),a._v("的安装目录"),t("code",[a._v("D:\\wnmp\\php-7.1.7-Win32-VC14-x64")]),a._v("下，找到"),t("code",[a._v("php.ini-development")]),a._v("文件（如果没有就在"),t("code",[a._v("ext")]),a._v("目录下找）;")])]),a._v(" "),t("li",[t("p",[a._v("复制"),t("code",[a._v("php.ini-development")]),a._v("文件在当前目录，并重命名为"),t("code",[a._v("php.ini")]),a._v(";")])]),a._v(" "),t("li",[t("p",[a._v("打开"),t("code",[a._v("php.ini")]),a._v("文件，按照以下方式修改文件：")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v('1. 搜索   extension_dir（738行）           去掉分号，将 "ext" 改为 "D:\\wnmp\\php-7.1.7-Win32-VC14-x64\\ext"；\n2. 搜索   date.timezone（939行）           去掉分号，再改为 date.timezone = Asia/Shanghai；\n3. 搜索   enable_dl（748行）               将 Off 改为 On；\n4. 搜索   cgi.force_redirect（755行）      去掉分号，将 1 改为 0；\n5. 搜索   fastcgi.impersonate（788行）     去掉前面的分号；\n6. 搜索   cgi.rfc2616_headers（800行）     去掉分号，将 0 改为 1；\n7. 搜索   Windows Extensions（886行）      找到以下扩展，并去掉前面的分号：\n          php_curl.dll        // 893行\n          php_gd2.dll         // 896行\n          php_mbstring.dll    // 903行\n          php_mysqli.dll      // 905行\n          php_openssl.dll     // 907行\n          php_pdo_mysql.dll   // 909行\n')])])])])]),a._v(" "),t("h2",{attrs:{id:"启动测试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#启动测试"}},[a._v("#")]),a._v(" 启动测试")]),a._v(" "),t("h3",{attrs:{id:"修改环境变量"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改环境变量"}},[a._v("#")]),a._v(" 修改环境变量")]),a._v(" "),t("p",[a._v("在启动之前，先将"),t("code",[a._v("nginx")]),a._v("和"),t("code",[a._v("php")]),a._v("添加到环境变量中去，方便以后执行。")]),a._v(" "),t("ul",[t("li",[a._v("打开“计算机系统”窗口，一次进入：高级系统设置 > 环境变量 > 系统变量下找到"),t("code",[a._v("Path")]),a._v("变量，并编辑；")]),a._v(" "),t("li",[a._v("将"),t("code",[a._v("Php")]),a._v("和"),t("code",[a._v("Nginx")]),a._v("安装路径添加到变量值的末尾，比如："),t("code",[a._v(";D:\\wnmp\\php-7.1.7-Win32-VC14-x64;D:\\wnmp\\nginx-1.12.1")]),a._v("，注意不同路径直接要用"),t("code",[a._v(";")]),a._v("隔开。")])]),a._v(" "),t("h3",{attrs:{id:"测试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#测试"}},[a._v("#")]),a._v(" 测试")]),a._v(" "),t("ul",[t("li",[a._v("按住"),t("code",[a._v("Win+R")]),a._v("打开“运行”窗口，输入"),t("code",[a._v("cmd")]),a._v("回车打开cmd命令行终端；")]),a._v(" "),t("li",[a._v("输入"),t("code",[a._v("nginx -v")]),a._v("回车，如果输出nginx的版本号，说明"),t("code",[a._v("nginx")]),a._v("已安装成功；")]),a._v(" "),t("li",[a._v("然后再输入"),t("code",[a._v("php -v")]),a._v("回车，正常输出版本号则说明"),t("code",[a._v("php")]),a._v("已安装成功；")]),a._v(" "),t("li",[a._v("如果提示缺少"),t("code",[a._v("VCRUNRIME140.dll")]),a._v("，到"),t("a",{attrs:{href:"http://download.microsoft.com/download/9/E/1/9E1FA77A-9E95-4F3D-8BE1-4D2D0C947BA2/enu_INREL/vcredistd14x64/vc_redist.x64.exe",target:"_blank",rel:"noopener noreferrer"}},[a._v("这里下载"),t("OutboundLink")],1),a._v("并安装该组件；")])]),a._v(" "),t("h3",{attrs:{id:"启动和关闭脚本"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#启动和关闭脚本"}},[a._v("#")]),a._v(" 启动和关闭脚本")]),a._v(" "),t("ul",[t("li",[a._v("下载一个"),t("code",[a._v("RunHiddenConsole.exe")]),a._v("，并移动到"),t("code",[a._v("D:\\wnmp\\")]),a._v("目录下；")]),a._v(" "),t("li",[a._v("继续在"),t("code",[a._v("D:\\wnmp\\")]),a._v("目录下新建"),t("code",[a._v("start.bat")]),a._v("和"),t("code",[a._v("stop.bat")]),a._v("文件，分别写入以下内容。")])]),a._v(" "),t("p",[t("code",[a._v("start.bat")]),a._v("文件：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("@echo off\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" Starting PHP FastCGI"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("..")]),a._v(".\nRunHiddenConsole php-cgi "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-b")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("127.0")]),a._v(".0.1:9000 "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-c")]),a._v(" D:"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("wnmp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("php-7.1.7-Win32-VC14-x64"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("php.ini\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" Starting nginx"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("..")]),a._v(".\nnginx "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-p")]),a._v(" D:"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("wnmp"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("\\")]),a._v("nginx-1.12.1\n")])])]),t("p",[t("code",[a._v("stop.bat")]),a._v("文件：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("@echo off\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" Stopping nginx"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("..")]),a._v(".\ntaskkill /F /IM nginx.exe "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" nul\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("echo")]),a._v(" Stopping PHP FastCGI"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("..")]),a._v(".\ntaskkill /F /IM php-cgi.exe "),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" nul\n"),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("exit")]),a._v("\n")])])]),t("p",[a._v("现在的目录结构是这样的：")]),a._v(" "),t("h2",{attrs:{id:"安装composer"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装composer"}},[a._v("#")]),a._v(" 安装Composer")]),a._v(" "),t("ol",[t("li",[t("p",[a._v("到"),t("a",{attrs:{href:"https://getcomposer.org/download/",target:"_blank",rel:"noopener noreferrer"}},[a._v("管网"),t("OutboundLink")],1),a._v("下载"),t("a",{attrs:{href:"https://getcomposer.org/Composer-Setup.exe",target:"_blank",rel:"noopener noreferrer"}},[t("code",[a._v("Composer")]),t("OutboundLink")],1),a._v("。")])]),a._v(" "),t("li",[t("p",[a._v("启动安装，程序会自动找到本地安装的"),t("code",[a._v("Php")]),a._v("路径，如果没找到，则手动找到"),t("code",[a._v("php")]),a._v("的安装路径。")])]),a._v(" "),t("li",[t("p",[a._v("安装完成之后，在cmd命令行终端下输入"),t("code",[a._v("composer -v")]),a._v("，能正常输出则安装成功。进入第7步；")])]),a._v(" "),t("li",[t("p",[a._v("如果多次安装仍失败，点击"),t("a",{attrs:{href:"https://getcomposer.org/composer.phar",target:"_blank",rel:"noopener noreferrer"}},[a._v("这里"),t("OutboundLink")],1),a._v("下载"),t("code",[a._v("composer.phar")]),a._v("，并移动到"),t("code",[a._v("php")]),a._v("安装的根目录下"),t("code",[a._v("D:\\wnmp\\php-7.1.7-Win32-VC14-x64\\")]),a._v("；")])]),a._v(" "),t("li",[t("p",[a._v("并在该目录下创建"),t("code",[a._v("composer.cmd")]),a._v("文件，写入以下内容：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[a._v("@php "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"%~dp0composer.phar"')]),a._v(" %*\n")])])])]),a._v(" "),t("li",[t("p",[a._v("执行第3步的验证，成功则进入下一步；")])]),a._v(" "),t("li",[t("p",[a._v("更换为国内镜像：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[a._v("composer")]),a._v(" config "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-g")]),a._v(" repo.packagist "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("composer")]),a._v(" https://packagist.phpcomposer.com\n")])])])])]),a._v(" "),t("h2",{attrs:{id:"运行项目"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#运行项目"}},[a._v("#")]),a._v(" 运行项目")]),a._v(" "),t("h3",{attrs:{id:"安装依赖"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装依赖"}},[a._v("#")]),a._v(" 安装依赖")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("将"),t("code",[a._v("revolution-admin")]),a._v("和"),t("code",[a._v("official-website")]),a._v("两个项目"),t("code",[a._v("clone")]),a._v("到本地；")])]),a._v(" "),t("li",[t("p",[a._v("进入到"),t("code",[a._v("official-website")]),a._v("根目录下，执行以下命令：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 安装前端依赖")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 安装后端依赖")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("composer")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("install")]),a._v("\n")])])])]),a._v(" "),t("li",[t("p",[a._v("同样进入到"),t("code",[a._v("revolution-admin")]),a._v("目录下，执行：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 安装前端依赖")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v("\n")])])])])]),a._v(" "),t("h3",{attrs:{id:"修改本地hosts文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改本地hosts文件"}},[a._v("#")]),a._v(" 修改本地hosts文件")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("进入到"),t("code",[a._v("C:\\Windows\\System32\\drivers\\etc")]),a._v("目录下，找到"),t("code",[a._v("hosts")]),a._v("文件；")])]),a._v(" "),t("li",[t("p",[a._v("用编辑器打开，在内容的最后添加：")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("127.0.0.1           dev.com\n127.0.0.1           test.com\n")])])])]),a._v(" "),t("li",[t("p",[a._v("如果修改文件失败，则为当前用户增加对该文件的“修改”权限，重新添加上面的内容。")])])]),a._v(" "),t("h3",{attrs:{id:"更新nginx配置文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#更新nginx配置文件"}},[a._v("#")]),a._v(" 更新Nginx配置文件")]),a._v(" "),t("ul",[t("li",[a._v("重新打开"),t("code",[a._v("D:\\wnmp\\nginx-1.12.1\\conf")]),a._v("目录下的"),t("code",[a._v("nginx.conf")]),a._v("文件；")]),a._v(" "),t("li",[a._v("在新增的第一个"),t("code",[a._v("server")]),a._v("中，将"),t("code",[a._v("root")]),a._v("指向你本地的"),t("code",[a._v("official-website")]),a._v("项目下的"),t("code",[a._v("public")]),a._v("路径（路径必须要正确）；")]),a._v(" "),t("li",[a._v("在新增的第二个"),t("code",[a._v("server")]),a._v("中，将"),t("code",[a._v("proxy_pass")]),a._v("指向"),t("code",[a._v("revolution-admin")]),a._v("项目启动的服务器（注意端口号）。这里可不修改，如果端口号改变，则改为正确的端口号即可。")])]),a._v(" "),t("h3",{attrs:{id:"启动项目"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#启动项目"}},[a._v("#")]),a._v(" 启动项目")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("首先启动Nginx和Php服务：进入到"),t("code",[a._v("D:\\wnmp\\")]),a._v("目录下双击执行"),t("code",[a._v("start.bat")]),a._v("脚本文件；")])]),a._v(" "),t("li",[t("p",[a._v("进入到"),t("code",[a._v("official-website")]),a._v("目录下，运行：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 编译前端文件，并启动监听")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v(" start\n")])])])]),a._v(" "),t("li",[t("p",[a._v("进入到"),t("code",[a._v("revolution-admin")]),a._v("目录下，运行：")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 编译前端项目文件，并启动本地服务器")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v(" start\n")])])])])]),a._v(" "),t("p",[a._v("如果一切正常，整个环境则配置完成。如果运行有报错，可能是"),t("code",[a._v("node-sass")]),a._v("没有安装成功，执行以下命令单独安装"),t("code",[a._v("node-sass")]),a._v("。")]),a._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 设置淘宝镜像")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v(" config "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v("set")]),a._v(" sass-binary-site http://npm.taobao.org/mirrors/node-sass\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[a._v("# 安装 node-sass")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("yarn")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[a._v("add")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token parameter variable"}},[a._v("-D")]),a._v(" node-sass\n")])])]),t("h3",{attrs:{id:"浏览器访问"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#浏览器访问"}},[a._v("#")]),a._v(" 浏览器访问")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("在浏览器中打开："),t("code",[a._v("http://dev.com")]),a._v("，进入本地薪乐宝管网（"),t("code",[a._v("official-website")]),a._v("项目）。如果页面出现错误代码"),t("code",[a._v("100003")]),a._v("，则按以下处理：")]),a._v(" "),t("blockquote",[t("p",[a._v("在当前项目的根目录下，找到"),t("code",[a._v(".env.example")]),a._v("，复制一份到当前目录，并重命名为"),t("code",[a._v(".env")]),a._v("。")])])]),a._v(" "),t("li",[t("p",[a._v("在浏览器中打开："),t("code",[a._v("http://test.com")]),a._v("，看到页面（"),t("code",[a._v("revolution-admin")]),a._v("项目）。")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);