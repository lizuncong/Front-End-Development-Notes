### 环境
1. 在src目录下执行npm install 安装依赖
2. 在src下执行npm run build-demo-xx打包对应的demo。




1. 读取webpack.config.js
2. webpack如何解析文件的依赖？
3. 替换require为__webpack_require__。
4. 本地使用{}存储所有的文件，然后通过使用__webpack_require__获取文件内容，执行函数
5. loader， plugin机制。

"webpack": "^4.30.0",
"webpack-cli": "^3.3.1"
