---
title: 基于 Express 的 Node.js 的后端开发
date: 2020-04-29
tags:
  - Express
  - Node.js
  - JavaScript
author: lili
location: shenzhen
---

现在作为一名的前端，你会后端开发么？你需要后端开发么？

o(╥﹏╥)o......然后我遇到了这样的需求，然后只能冲鸭！冲鸭！冲鸭！


## 技术栈

- 框架: [express](http://expressjs.com/)

- 数据库` ORM `: [sequelize](https://github.com/sequelize/sequelize)、[mysql2](https://github.com/sidorares/node-mysql2)

- 依赖注入: [awilix](https://github.com/jeffijoe/awilix)

- 路由插件: [awilix-express](https://github.com/talyssonoc/awilix-express)

## 项目结构

```
|-- express-backend
    |-- src
        |-- api    // controller api文件
        |-- config // 项目配置目录
        |-- container  // DI 容器
        |-- daos  // dao层
        |-- initialize  // 项目初始化文件
        |-- middleware  // 中间件
        |-- models  // 数据库 model
        |-- services // service层
        |-- utils // 工具类相关目录
        |-- app.js // 项目入口文件
```

## 搭建项目基础

1. 初始化项目

```sh
npm init
```

2. 安装依赖

```sh
npm i express sequelize mysql2 awilix awilix-express
```

## 配置

### 配置` Babel `

因为` awilix `和` awilix-express `会用到` ES6 `的` class `和` decorator `语法，所以需要 [@babel/plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) 和 [@babel/plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) 转换一下

- 安装依赖

```sh
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

```sh
npm install --save-dev @babel/node
```

```sh
npm install --save-dev @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

- 配置` babel `

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": false,
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ]
  ]
}
```

### 热更新

在开发过程中，热更新是必需的，在这里，我们使用的是[nodemon](https://www.npmjs.com/package/nodemon)

1. 安装依赖

```sh
npm install --save-dev nodemon
```

2. 在项目根目录下添加` nodemon.json `

```json
{
  "ignore": [
    ".git",
    "node_modules/**/node_modules",
    "package-lock.json",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "yarn.lock",
    ".idea",
    ".vscode",
    "*.suo",
    "*.ntvs*",
    "*.njsproj",
    "*.sln"
  ]
}
```

` ignore `表示要忽略的部分，即这部分文件变化时， 项目不会重启，而` ignore `以外的代码变化时，会重新启动项目。

3. 添加命令

下面我们在` package.json `定义启动命令：

```json
"scripts": {
  "dev": "cross-env NODE_ENV=development nodemon ./src/app.js --exec babel-node"
},
```

### 环境配置

在实践过程中，我们往往会和一些敏感的数据信息打交道，比如数据库的连接用户名、密码，第三方` SDK `的` secret `等。这些参数的配置信息最好不要进入到` git `仓库的。一来在开发环境中，不同的开发人员本地的开发配置各有不同，不依赖于` git `版本库配置。二来敏感数据的入库，增加了人为泄漏配置数据的风险，任何可以访问` git `仓库的开发人员，都可以从中获取到生产环境的` secret key `。一旦被恶意利用，后果不堪设想。

所以可以引入一个被` .gitignore `的` .env `的文件，以` key-value `的方式，记录系统中所需要的可配置环境参数。并同时配套一个` .env.example `的示例配置文件用来放置占位，` .env.example `可以放心地进入` git `版本仓库。

在本地创建一个` .env.example `文件作为配置模板，内容如下：

```conf
# 服务的启动名字和端口
HOST = 127.0.0.1
PORT = 3000
```

#### 读取` .env `中的配置

` Node.js `可以通过` env2 `的插件，来读取` .env `配置文件，加载后的环境配置参数，可以通过例如` process.env `来读取信息。

```sh
npm i env2
```

```js
require('env2')('./.env')
```

然后在配置目录中：

```js
// config/index.js
const { env } = process;

export default {
  PORT: env.PORT,
  HOST: env.HOST,
};
```

## 代码介绍

### 数据库

后端开发常常涉及对数据库的增删改查操作，在这里我们使用的是 [sequelize](https://github.com/sequelize/sequelize)和[mysql2](https://github.com/sidorares/node-mysql2)

#### 1. 定义数据库业务相关的` model `

我们在` models `目录下继续创建一系列的` model `来与数据库表结构做对应：

```
├── models                       # 数据库 model
│   ├── index.js                 # model 入口与连接
│   ├── goods.js                 # 商品表
│   ├── shop.js                 # 店铺表
```

以店铺表为例，定义店铺的数据模型` shop `:

```js
/*
 * 创建店铺 model
 */

 // models/shop.js
import Sequelize from 'sequelize';

export default function (sequelize, DataTypes) {
  class Shop extends Sequelize.Model {}
  Shop.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbUrl: {
        type: DataTypes.STRING,
        field: 'thumb_url',
      },
      createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_date',
      },
    },
    {
      sequelize,
      modelName: 'shop',
      tableName: 't_shop',
    }
  );
  return Shop;
}
```

然后在` models/index.js `，用来导入` modes `目录下的所有` models `:

```js
// models/index.js
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const db = {};

export function initModel(sequelize) {
  fs.readdirSync(__dirname)
    .filter(
      (file) =>
        file.indexOf('.') !== -1 &&
        file.slice(-3) === '.js' &&
        file !== 'index.js'
    )
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });
  Object.keys(db).forEach((moduleName) => {
    if (db[moduleName].associate) {
      db[moduleName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
}

export default db;
```

#### 2. ` Sequelize `连接` MySQL `数据库

` Sequelize `连接数据库的核心代码主要就是通过` new Sequelize（database, username, password, options）` 来实现，` options `是配置选项，具体可以查阅[官方手册](https://sequelize.org/master/class/lib/sequelize.js~Sequelize.html#instance-constructor-constructor)。

我们先在` config `目录下` config.js `文件，增加对数据库的配置：

```js
// config/config.js
const env2 = require('env2')

if (process.env.NODE_ENV === 'production') {
  env2('./.env.prod')
} else {
  env2('./.env')
}

const { env } = process

module.exports = {
  development: {
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABSAE,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
  },
  production: {
    username: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABSAE,
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    dialect: 'mysql',
    operatorsAliases: false,
  }
}
```

然后在` initialize `目录下新建` sequelize.js `用来连接数据库

```js
/*
* 创建并初始化 Sequelize
*/

// initialize/sequelize.js

import Sequelize from 'sequelize';

let sequelize;

const defaultConfig = {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  operatorsAliases: false,
  define: {
    updatedAt: false,
    createdAt: 'createdDate',
  },
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export function initSequelize(config) {
  const { host, database, username, password, port } = config;
  sequelize = new Sequelize(
    database,
    username,
    password,
    Object.assign({}, defaultConfig, {
      host,
      port
    })
  );
  return sequelize;
}

export default sequelize;
```

上面关于数据库方面，我们导出了` initModel `和` initSequelize `方法，这两个方法会在[初始化入口](#初始化入口)这里使用。


### 初始化入口

在` initialize `目录下新建` index.js `文件，用来初始化` Model `和连接数据库：

```js
// initialize/index.js
import { initSequelize } from './sequelize';
import { initModel } from '../models';
import { asValue } from 'awilix';
import container from '../container';

import config from '../config/config'

export default function initialize() {
  const env = process.env.NODE_ENV || 'development'
  const sequelize = initSequelize(config[env]); // 初始化 sequelize
  initModel(sequelize); // 初始化 Model
  container.register({
    sequelize: asValue(sequelize),
  });
}

```

` model `初始化完了之后，我们就可以定义我们的` Dao `层来使用` model `了。

### ` Dao `层和` Service `层

我们定义` Dao `层来操作数据库，定义` Service `层来连接外部和` Dao `层

1. 首先我们在` daos `目录下新建` ShopDao.js `文件，用来操作店铺表：

```js
// daos/ShopDao.js
import BaseDao from './base'

export default class ShopDao extends BaseDao {
  modelName = 'shop'

  // 分页查找店铺
  async findPage(params = {}) {
    const listParams = getListSql(params);
    const sql = {
      ...listParams
    };
    return await this.findAndCountAll(sql)
  }
  // ...
}
```

这里` shopDao `是` BaseDao `的子类，而` BaseDao `封装着一下数据库的操作，比如增删改查，戳[源代码](https://github.com/I-pencil/express-backend/blob/master/src/daos/base.js)

2. 在` services `目录下新建` ShopService.js `文件：

```js
// services/ShopService.js
import BaseService from './BaseService';

export default class ShopService extends BaseService {
  constructor({ shopDao }) {
    super();
    this.shopDao = shopDao
  }
  // 分页查找
  async findPage(params) {
    const [err, list] = await this.shopDao.findPage(params);
    if (err) {
      return this.fail('获取列表失败', err);
    }
    return this.success('获取列表成功', list || []);
  }
  // ...
}
```

我们定义好了` Dao `层和` Service `层，然后可以使用依赖注入来帮我们管理` Dao `和` Service `的实例。

### 依赖注入

依赖注入（` DI `）最大的作用是帮我们创建我们所需要是实例，而不需要我们手动创建，而且实例创建的依赖我们也不需要关心，全都由` DI `帮我们管理，可以降低我们代码之间的耦合性。

这里用的依赖注入是[awilix](https://github.com/jeffijoe/awilix)，

1. 首先我们创建容器，在` container `目录下新建` index.js `：

```js
/*
 * 创建 DI 容器
 */

 // container/index.js

import { createContainer, InjectionMode } from 'awilix';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

export default container;
```

2. 然后告诉` DI `我们所有的` Dao `和` Service `：

```js
// app.js
import container from './container';
import { asClass } from 'awilix';

// 依赖注入配置service层和dao层
container.loadModules(['./services/*Service.js', './daos/*Dao.js'], {
  formatName: 'camelCase',
  register: asClass,
  cwd: path.resolve(__dirname),
});
```

### 定义路由

现在底层的一切都做好了，就差向外部暴露接口，供其他应用调用了;

在这里定义路由，我们使用[awilix-express](https://github.com/talyssonoc/awilix-express)来定义后端router

我们先来定义关于店铺的路由。

在` api `目录下新建` shopApi.js `文件

```js
// api/shopApi.js
import bodyParser from 'body-parser'
import { route, POST, before } from 'awilix-express'

@route('/shop')
export default class ShopAPI {
  constructor({ shopService }) {
    this.shopService = shopService;
  }

  @route('/findPage')
  @POST()
  @before([bodyParser.json()])
  async findPage(req, res) {
    const { success, data, message } = await this.shopService.findPage(
      req.body
    );
    if (success) {
      return res.success(data);
    } else {
      res.fail(null, message);
    }
  }
  // ...
}
```

我们定义好了路由，然后在项目初始化的时候，用[awilix-express](https://github.com/talyssonoc/awilix-express)初始化路由：

```js
// app.js
import { Lifetime } from 'awilix';
import { scopePerRequest, loadControllers } from 'awilix-express';
import container from './container';

const app = express();

app.use(scopePerRequest(container));

app.use(
  '/api',
  loadControllers('api/*Api.js', {
    cwd: __dirname,
    lifetime: Lifetime.SINGLETON,
  })
);
```

现在我们可以用` postman `试一下我们定义的接口啦：

![image from dependency](../../.vuepress/public/images/express-backend/01.png)

### 其他

如果我们需要在` Service `层或者` Dao `层使用当前的请求对象，这个时候我们就可以在` DI `中为每一条请求注入` request `和` response `，如下中间件：

```js
// middleware/base.js
import { asValue } from 'awilix';

export function baseMiddleware(app) {
  return (req, res, next) => {
    res.success = (data, error = null, message = '成功', status = 0) => {
      res.json({
        error,
        data,
        type: 'SUCCRSS',
        // ...
      });
    };
    res.fail = (data, error = null, message = '失败', status = 0) => {
      res.json({
        error,
        data,
        type: 'FAIL',
        // ...
      });
    };

    req.app = app;
    req.container = req.container.createScope();
    req.container.register({
      request: asValue(req),
      response: asValue(res),
    });
    next();
  };
}
```

然后使用中间件

```js
// app.js
import express from 'express';

const app = express();
app.use(baseMiddleware(app));
```

## 部署

这里部署使用的是[pm2](https://github.com/Unitech/pm2), 在项目根目录新建` pm2.json `:

```json
{
  "apps": [
    {
      "name": "express-backend",
      "script": "./dist/app.js",
      "exp_backoff_restart_delay": 100,
      "log_date_format": "YYYY-MM-DD HH:mm Z",
      "output": "./log/out.log",
      "error": "./log/error.log",
      "instances": 1,
      "watch": false,
      "merge_logs": true,
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

然后在` package.json `下增加命令：

```json
"scripts": {
  "clean": "rimraf dist",
  "dev": "cross-env NODE_ENV=development nodemon ./src/main.js --exec babel-node",
  "babel": "babel ./src --out-dir dist",
  "build": "cross-env NODE_ENV=production npm run clean && npm run babel",
  "start": "pm2 start pm2.json",
}
```

` npm run build `构建命令，先清理` dist `目录，然后编译代码到` dist `目录下，最后执行` npm run start `，` pm2 `就会启动应用。

## 最后

[源代码](https://github.com/I-pencil/express-backend)，戳！戳！戳！

## 参考文献

[Vue+Express+Mysql 全栈初体验](https://juejin.im/post/5ce96694f265da1bc5523f69#heading-9)
