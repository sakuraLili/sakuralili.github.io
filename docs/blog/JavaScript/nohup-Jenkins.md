# 使用Jenkins时，报“Cannot run program "nohup"”错误

最近在学习` Jenkins `。在学习[` Build a Node.js and React app with npm ` ](https://note.youdao.com/)部分时，按照官网给的` simple-node-js-react-npm-app `例子，需要跑一个` pipeline `，配置文件` Jenkifile `如下

```
pipeline {
  agent any
  environment {
    CI = 'true'
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh './jenkins/scripts/test.sh'
      }
    }
    stage('Deliver') {
      steps {
        sh './jenkins/scripts/deliver.sh'
        input message: 'Finished using the web site? (Click "Proceed" to continue)'
        sh './jenkins/scripts/kill.sh'
      }
    }
  }
}
```
但在运行时总报下面的错误：

```
java.io.IOException: Cannot run program "nohup" (in directory "C:\Users\king\.jenkins\workspace\node-pipeline-demo"): CreateProcess error=2, 系统找不到指定的文件。
```
有答案说` sh `是` Linux `用的，` window `应该用` bat `，我将` sh `改成` bat `还是没有解决。

最后在[stackoverflow](https://stackoverflow.com)上面找到了原因和一个比较满意的答案，

原因是在` Windows `下，使用了如下路径：

- ` mklink "C:\Program Files\Git\cmd\nohup.exe" "C:\Program Files\git\usr\bin\nohup.exe" `
- ` mklink "C:\Program Files\Git\cmd\msys-2.0.dll" "C:\Program Files\git\usr\bin\msys-2.0.dll" `
- ` mklink "C:\Program Files\Git\cmd\msys-iconv-2.dll" "C:\Program Files\git\usr\bin\msys-iconv-2.dll" `
- ` mklink "C:\Program Files\Git\cmd\msys-intl-8.dll" "C:\Program Files\git\usr\bin\msys-intl-8.dll" `


解决步骤如下

- 下载[` git-bash `](https://git-scm.com/downloads)，例如安装目录是` C:\Program Files\Git `
- 将` C:\Program Files\Git\bin `注册到环境变量下， 注意注册环境变量后，可能需要重启才能生效，我重启后就没报错了。
- 在使用` git-bash `时，使` nohup `对` Jenkins `可用。以管理员身份运` 行windows cmd `，然后输入下列命令：

```shell
mklink "C:\Program Files\Git\bin\nohup.exe" "C:\Program Files\git\usr\bin\nohup.exe"

mklink "C:\Program Files\Git\bin\msys-2.0.dll" "C:\Program Files\git\usr\bin\msys-2.0.dll"

mklink "C:\Program Files\Git\bin\msys-iconv-2.dll" "C:\Program Files\git\usr\bin\msys-iconv-2.dll"

mklink "C:\Program Files\Git\bin\msys-intl-8.dll" "C:\Program Files\git\usr\bin\msys-intl-8.dll"
```
