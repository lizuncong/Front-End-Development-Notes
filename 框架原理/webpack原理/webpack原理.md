## 环境
1. 在src目录下执行npm install 安装依赖
2. 在src下执行npm run build-demo-xx打包对应的demo。
3. demo-01是一个简单的js应用，主要是为了查看打包后的源码。       
在src下执行npm run build-demo-01打包，在dist下生成打包后的源码，可以在浏览器打开index.html查看控制台输出

## webpack是什么？
### 1.背景：Javascript的模块化
Javascript本身不是一种模块化编程语言，它不支持class，也不支持模块(module)。不过，ES6是可以支持类及模块化(import，export)的。但是ES6
又不能直接在浏览器中运行，比如import './xxx'在浏览器中会直接报错。Javascript社区做了很多努力，在现有的运行环境中，实现"模块"的效果。


1. commonjs语法。浏览器不能直接执行commonjs的语法，那么webpack是怎么模拟commonjs
的module.exports，exports以及require的。
1. webpack是什么？
2. webpack打包的原理，打包后的源码解读
3. webpack打包后的源码中，这段代码
```js
var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
};
```
为啥要搞个exports字段？
4.webpack打包后的源码中，
```js
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
为啥要用call调用，如果不用call，直接调用会有啥问题
3. webpack在解析文件时为啥要用eval
    eval的用意：读取模块文件时，以字符串的形式读取，方便第三方插件做代码格式的检查以及源码映射等
1. 读取webpack.config.js
2. webpack如何解析文件的依赖？
3. 替换require为__webpack_require__。
4. 本地使用对象存储所有的文件，然后通过使用__webpack_require__获取文件内容，执行函数
5. loader， plugin机制。

"webpack": "^4.30.0",
"webpack-cli": "^3.3.1"
