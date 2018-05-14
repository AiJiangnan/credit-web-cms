# Node.js
## 一、安装与配置

1. 下载：http://nodejs.cn/download/（最好下载解压版）

2. 配置环境变量：在`Path`中添加，添加node的可执行文件的目录

3. 检查安装：在命令提示符中输入下面指令检查Node和npm(node package manager)

   ```sh
   # 返回版本号则安装成功
   node -v
   npm -v
   ```

4. 配置淘宝镜像

   ```sh
   # 配置
   npm config set registry https://registry.npm.taobao.org
   # 检查是否配置成功
   npm config get registry
   ```

## 二、Hello world

使用Node创建一个Web服务器

1. 引入模块
2. 创建服务器
3. 接收请求和响应请求

```javascript
var http = require('http');

http.createServer(function(request, response) {
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    // 发送响应数据 "Hello World"
    response.end('Hello world!\n');
}).listen(8080);

// 终端打印信息
console.log('Server running at http://127.0.0.1:8080');
```

将文件保存为`hello.js`在当前目录下打开命令指示符，执行下面命令运行即可用浏览器访问：

```sh
node hello.js
```

## 三、NPM

NPM是随同Node.js一起安装的包管理工具，能解决Node.js代码部署上的很多问题，常见的使用场景有以下几种：

- 允许用户从NPM服务器下载别人编写的第三方包到本地使用。
- 允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
- 允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

### 包的管理

```sh
npm install express     # 本地安装
npm install express -g  # 全局安装
npm uninstall express   # 卸载模块
npm update express      # 更新模块
```

### 本地安装

1. 将安装包放在`./node_modules`下（运行`npm`命令时所在的目录），如果没有`node_modules`目录，会在当前执行`npm`命令的目录下生成`node_modules`目录。
2. 可以通过`require()`来引入本地安装的包。

### 全局安装

1. 将安装包放在`node`的安装目录。
2. 可以直接在命令行里使用。



## 四、文档

### Node: http://www.runoob.com/nodejs/nodejs-tutorial.html

### Express: http://www.expressjs.com.cn/

### request: https://www.npmjs.com/package/request

### layui: http://www.layui.com/doc/