## 环境
1. 在src目录下执行npm install 安装依赖
2. 在src下执行npm run build-demo-xx打包对应的demo。
3. demo-01是一个简单的js应用，主要是为了查看打包后的源码。       
在src下执行npm run build-demo-01打包，在dist下生成打包后的源码，可以在浏览器打开index.html查看控制台输出

## 问题
在看webpack打包后的源码时，我带着以下问题去读懂其原理，带着问题去阅读，效果会更好      
1. commonjs语法。浏览器不能直接执行commonjs的语法，那么webpack是怎么模拟commonjs的module.exports，exports以及require的。      
2. webpack是什么？      
3. webpack打包的原理，打包后的源码解读      
4. webpack打包后的源码中，这段代码
```js
var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
};
```
为啥要搞个exports字段？      
5.webpack打包后的源码中，
```js
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
为啥要用call调用，如果不用call，直接调用会有啥问题      
6. webpack在解析文件时为啥要用eval
    eval的用意：读取模块文件时，以字符串的形式读取，方便第三方插件做代码格式的检查以及源码映射等


## webpack是什么？
webpack是一个用于现代JavaScript应用程序的静态模块打包工具。当使用webpack打包时，webpack会从入口模块开始构建内部依赖图。

webpack的几个核心概念：    
1. entry    
2. output    
3. loader    
   webpack只能处理JavaScript和JSON文件，loader提供了一种处理其他类型文件的途径。loader能够加载其他类型文件
   并转换成有效的模块
4. plugin    
   loader用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

## webpack打包的原理
webpack打包的过程，其实可以简单的看做是读取文件，并替换掉require语句或者其他语法。如果需要使用loader做语法转换，则对源文件的语法做转换，比如将
箭头函数转换成普通函数，然后替换源文件中箭头函数的部分。

以打包commonjs规范的代码为例
```js
//index.js文件
const add = require('./add');
const { minus } = require('./utils');
this.indexField = '这是index.js模块的作用域';
this.testName = 'index.js';
console.log('this...in..index.js', this);
add(3 , 4);
minus(4, 5);


// add.js文件
const c = 10
this.addField = '这是add.js模块的作用域'
this.testName = 'add.js';
this.code = '404'
module.exports = function(a, b) {
    console.log('add...this.testName', this.testName);
    console.log('a + b = ', a + b + c);
}

// utils.js文件
this.utilField = '这是util.js模块的作用域'
this.testName = 'util.js'
exports.minus = function(a, b) {
    console.log('minus...this.testName...', this.testName);
    console.log('a * b = ', a * b)
}

// webpack.config.js，webpack版本4.30，webpack-cli版本3.3.1
const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, './index.js'),
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'index.js',
    }
}
```
打包后的dist/index.js文件(删除了一些无关紧要的代码，只保留重要部分)，附源码注释：
```js
// modules其实就是一个对象，对象里面的key是文件路径，value是一个函数，函数里面主体是文件内容
// modules: { './add.js' : function(){ eval('文件内容')}}
(function(modules) { // webpackBootstrap
	// 缓存，已经加载过的模块
	var installedModules = {};

	// 根据moduleId加载模块的方法，moduleId其实就是文件路径
	function __webpack_require__(moduleId) {
		// 如果模块已经加载过，则直接读取缓存中的Check if module is in cache
		if(installedModules[moduleId]) {
			return installedModules[moduleId].exports;
		}
		// 创建一个新的模块，同时存入缓存
		var module = installedModules[moduleId] = {
			i: moduleId,
			l: false,
			exports: {}
		};

		// Execute the module function，这里为啥需要用call调用，this为啥要设置成module.exports????????
		// 其实这么做的用意就是保持各个模块里面的作用域独立
	/**mark:第一点**/	modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
		// 如果不用call，换成以下这种执行方式会有啥问题???????如果这样直接调用，那么modules[moduleId]方法里面的作用域就是
		// modules。比如
		// var myModule = {
		//     myName: 'lzc',
		//     print: function(){
		//         console.log('my name is:', this.myName)
		//     }
		// }
		// let print = myModule.print
		// print() // my name is: undefined
		// myModule.print() // my name is: lzc
	/**mark:第二点**/	// modules[moduleId](module, module.exports, __webpack_require__);

		// 标记，模块已加载的标记
		module.l = true;

		// Return the exports of the module
		return module.exports;
	}

	// Load entry module and return exports
	return __webpack_require__(__webpack_require__.s = "./demo-01/index.js");
})
({
"./demo-01/add.js":
	function(module, exports) {
		// const c = 10
		//
		// this.addField = '这是add.js模块的作用域'
		// this.testName = 'add.js';
		// this.code = '404'
		// module.exports = function(a, b) {
		// 	console.log('add...this.testName', this.testName);
		// 	console.log('a + b = ', a + b + c);
		// } //# sourceURL=webpack:///./demo-01/add.js?

		// 为啥要使用eval????????????
		// eval里面的内容其实就是add.js里面的内容，只不过webpack打包的时候将add.js以字符串的形式读取出来并插入到eval里面去执行
		// 至于为啥要插入eval当中，而不是直接当作函数体执行，个人猜测因为webpack打包的时候需要保留代码的格式，字符串是保持代码格式的最好方法
		// 因此需要以字符串的形式读取文件并插入eval执行。
		eval("const c = 10\n\nthis.addField = '这是add.js模块的作用域'\nthis.testName = 'add.js';\nthis.code = '404'\nmodule.exports = function(a, b) {\n    console.log('add...this.testName', this.testName);\n    console.log('a + b = ', a + b + c);\n}\n\n\n//# sourceURL=webpack:///./demo-01/add.js?");
	},
"./demo-01/index.js":
	function(module, exports, __webpack_require__) {
		// 很明显，webpack打包的时候将require替换成了__webpack_require__
		// const add = __webpack_require__(/*! ./add */ "./demo-01/add.js");
		// const { minus } = __webpack_require__(/*! ./utils */ "./demo-01/utils.js");
		//
		// this.indexField = '这是index.js模块的作用域';
		// this.testName = 'index.js';
		// console.log('this...in..index.js', this);
		// add(3 , 4);
		// minus(4, 5);


		//# sourceURL=webpack:///./demo-01/index.js?


		eval("const add = __webpack_require__(/*! ./add */ \"./demo-01/add.js\");\nconst { minus } = __webpack_require__(/*! ./utils */ \"./demo-01/utils.js\");\n\nthis.indexField = '这是index.js模块的作用域';\nthis.testName = 'index.js';\nconsole.log('this...in..index.js', this);\nadd(3 , 4);\nminus(4, 5);\n\n\n//# sourceURL=webpack:///./demo-01/index.js?");
	},

"./demo-01/utils.js":
	function(module, exports) {

		// this.utilField = '这是util.js模块的作用域'
		// this.testName = 'util.js'
		// exports.minus = function(a, b) {
		// 	console.log('minus...this.testName...', this.testName);
		// 	console.log('a * b = ', a * b)
		// }
		//
		//
		// //# sourceURL=webpack:///./demo-01/utils.js?

		eval("\nthis.utilField = '这是util.js模块的作用域'\nthis.testName = 'util.js'\nexports.minus = function(a, b) {\n    console.log('minus...this.testName...', this.testName);\n    console.log('a * b = ', a * b)\n}\n\n\n//# sourceURL=webpack:///./demo-01/utils.js?");
	}

});

```
## webpack打包后的源码分析
#### 1.webpack打包后的源码其实就是个自执行函数，这个函数的参数就是webpack通过入口文件构建的模块依赖关系对象
```js
(function(modules){
  
})
({
 './demo-01/add.js': function(){
   eval('/**这里是add.js的文件内容**/')
 },
 './demo-01/index.js': function(){
   eval('/**这里是index.js的文件内容**/')
 },
 './demo-01/utils.js': function(){
   eval('/**这里是utils.js的文件内容**/')
 }
})
```
可以看出modules就是一个对象，对象的key是模块所处的文件路径，value是一个函数，函数里面就是个简单的eval函数，eval函数体内的字符串
就是文件的内容。

#### 2.webpack怎么实现commonJS中的module.exports，exports，以及require的
js是没有require，module.exports以及exports的。webpack通过构造js对象，如var module2 = { exports: {} }，
然后执行require的文件内容去将模块里面的exports.add或者module.exports = add绑定到module2对象中去的，如:
```js
var module2 = { exports: {} }
// 假设我们有一个add.js文件
module.exports = function(a, b) { return a + b}
// 那么webpack打包的时候会将add.js的文件内容以字符串的形式读取，并插入一个函数当中，如：
function moduleExecute(module, exports){
  eval('module.exports = function(a, b) { return a + b}')
}
// 如果我们这么执行
moduleExecute(module2, module2.exports);
// 执行完后，add.js暴露出来的add方法就绑定到了module2模块当中
```

首先我们看一下打包后的./demo-01/index.js文件的内容
```js
//./demo-01/index.js
function index(module, exports, __webpack_require__) {
    eval("const add = __webpack_require__(/*! ./add */ \"./demo-01/add.js\");\nconst { minus } = __webpack_require__(/*! ./utils */ \"./demo-01/utils.js\");\n\nthis.indexField = '这是index.js模块的作用域';\nthis.testName = 'index.js';\nconsole.log('this...in..index.js', this);\nadd(3 , 4);\nminus(4, 5);\n\n\n//# sourceURL=webpack:///./demo-01/index.js?");
}

// 将eval中的字符串复制粘贴一下，其实index.js的函数就变成了这样
function index(module, exports, __webpack_require__) {
    // 很明显，webpack打包的时候将require替换成了__webpack_require__
     const add = __webpack_require__(/*! ./add */ "./demo-01/add.js");
     const { minus } = __webpack_require__(/*! ./utils */ "./demo-01/utils.js");
    //
    this.indexField = '这是index.js模块的作用域';
    this.testName = 'index.js';
    console.log('this...in..index.js', this);
    add(3 , 4);
    minus(4, 5);
    //# sourceURL=webpack:///./demo-01/index.js?
}

```
可以看出，webpack将index.js文件中的require全部替换成了__webpack_require__方法，达到模拟require的目的。

现在看看add.js打包后的内容:
```js
//./demo-01/add.js
function add(module, exports) {
    eval("const c = 10\n\nthis.addField = '这是add.js模块的作用域'\nthis.testName = 'add.js';\nthis.code = '404'\nmodule.exports = function(a, b) {\n    console.log('add...this.testName', this.testName);\n    console.log('a + b = ', a + b + c);\n}\n\n\n//# sourceURL=webpack:///./demo-01/add.js?");
}
// 其实eval执行和下面这样执行的效果一样
function add(module, exports){
  
    const c = 10
    //
    this.addField = '这是add.js模块的作用域'
    this.testName = 'add.js';
    this.code = '404'
    module.exports = function(a, b) {
      console.log('add...this.testName', this.testName);
      console.log('a + b = ', a + b + c);
    } //# sourceURL=webpack:///./demo-01/add.js?
}

// 看看webpack提供的__webpack_require__方法，
// 创建一个新的模块，同时存入缓存
var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
};

modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
// 当调用_
_webpack_require__('./demo-01/add.js')
// 会生成
var module = installedModules['./demo-01/add.js'] = { 
  i: './demo-01/add.js',
   l: false,
   exports: {}
}
//此时modules[moduleId]就是
function add(module, exports){
  
    const c = 10
    //
    this.addField = '这是add.js模块的作用域'
    this.testName = 'add.js';
    this.code = '404'
    module.exports = function(a, b) {
      console.log('add...this.testName', this.testName);
      console.log('a + b = ', a + b + c);
    } //# sourceURL=webpack:///./demo-01/add.js?
}
// 那么这个调用将传入module，module.exports去执行add方法，执行完成后
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
// 执行完成后，module就变成了
module = {
  i : './demo-01/add.js',
  l: false,
  exports: function(a, b){
      console.log('add...this.testName', this.testName);
      console.log('a + b = ', a + b + c);
  }
}
//add的执行成功的将module.exports绑定了，模拟了commonjs中的module.exports
// 从中也可以看出，在index.js中，
const add = __webpack_require__(/*! ./add */ "./demo-01/add.js")
//__webpack_require__返回的其实就是module.exports里面的内容，即return module.exports
```    
    
## 开发一个mini的webpack，需要至少具备哪几项核心功能？
1. 读取webpack.config.js
2. webpack如何解析文件的依赖？
3. 如何将require替换为__webpack_require__。
4. 本地使用对象存储所有的文件，然后通过使用__webpack_require__获取文件内容，执行函数以绑定module.exports或者exports
5. loader， plugin机制应该如何实现

