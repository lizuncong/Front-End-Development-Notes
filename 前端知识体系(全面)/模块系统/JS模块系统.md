### 背景
Javascript本身不是一种模块化编程语言，它不支持class，也不支持模块(module)。不过，ES6是可以支持类及模块化(import，export)的。
但是ES6又不能直接在浏览器中运行，比如import './xxx'在浏览器中会直接报错。

最早的时候，所有的Javascript代码都写在一个文件里面，只要加载这个文件就可以了。后来，随着网页应用越来越庞大，代码越来越多，一个文件不够了。
必须拆分成多个文件，依次加载。比如：
```html
<script src="1.js"></script>
<script src="2.js"></script>
<script src="3.js"></script>
<script src="4.js"></script>
<script src="5.js"></script>
<script src="main.js"></script>
```
这段代码依次加载多个js文件。这样的写法有很大的缺点，首先，加载的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长。其次，
由于js文件之间存在依赖关系，因此必须严格保证加载顺序。依赖性最大的模块一定要放到最后加载，当依赖关系很复杂的时候，代码的编写和维护都会变得困难。


Javascript社区做了很多努力，在现有的运行环境中，实现"模块"的效果。

目前Javascript模块规范总共有: CommonJS，AMD，ES6模块。

### CommonJS规范。同步加载
CommonJS是一种同步加载模块的规范。

在CommonJS中，有一个全局方法require()，用于加载模块。然后模块内部可以使用 `module.exports` 或者 `exports.xxx = yy` 的方式
对外暴露方法或变量。比如
```js
// 文件index.js中
var tool = require('./tool.js');
tool.add(2,3)

// 文件tool.js中
exports.add = function(a, b){
  return a + b;
}
```
node.js中的模块系统就是参照CommonJS规范实现的。那么问题来了，***为什么浏览器中不能采用CommonJS规范呢？***，如果浏览器也能实现CommonJS中的规范，
那么Javascript的代码就都能在nodejs及浏览器环境中跑了。如果我们在浏览器中运行下面的代码
```js
var tool = require('./tool.js');
tool.add(2,3)
```
很容易看出，`tool.add` 在 `var tool = require('./tool.js');` 之后运行，因此必须等待 tool.js 文件加载完成。如果加载时间很长，整个
应用就会停在那里等。    

在服务器端，所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是在浏览器端，所有的文件都放在服务器，
等待的时间取决于网速的快慢，可能要等很长的时间。


***因此，浏览器端的模块，不能采用同步加载，只能采用异步加载，这也是AMD规范诞生的背景***


### AMD规范(Asynchronous Module Definition)。异步加载
**注意：这里异步指的是不堵塞浏览器其他任务（dom构建，css渲染等），而加载内部是同步的（加载完模块后立即执行回调）**

AMD采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会执行。

AMD也采用require()语句加载模块，但是不同于CommonJS，它要求两个参数
```js
require([module], callback);
```

前面的代码改写成AMD：
```js
require(['./tool.js'], function(tool){
  tool.add(2,3)
})
```

AMD定义模块：
```js
　　define(function (){

　　　　var add = function (x,y){

　　　　　　return x+y;

　　　　};

　　　　return {

　　　　　　add: add
　　　　};

　　});
```
tool.add()与tool模块加载不是同步的。所以很显然，AMD比较适合浏览器环境。

目前主要有两个Javascript库实现了AMD规范：require.js和curl.js。

### UMD 不是一种规范
UMD，Universal Module Definition，即统一模块定义。是结合AMD和CommonJS的一种更为通用的JS模块解决方案

符合AMD规范的模块并不能直接运行于CommonJS模块规范的环境中，符合CommonJS规范的模块也不能由AMD进行异步加载。如果要发布一个模块供其他人用，
我们不可能为每种规范发布一个版本，因此需要一种方案来兼容这些规范。这就是UMD的背景。实现的方式就是在代码前面做下判断，根据不同的规范使用对应的
加载方式

```js
// 以vue为例
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, function () { 
    // vue code ...
}))
```

```js
// 打包时配置
//output: {
//  path: path.resolve(__dirname, '../dist'),
//  filename: 'vue.js',
//  library: 'Vue',
//  libraryTarget: 'umd'
//}

// 表示打包出来的模块为umd模块，既能在服务端运行，又能在浏览器端运行。我们来看vue打包后的源码vue.js。
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) : 
  (global.Vue = factory());
}(this, (function () { 'use strict';
// ...
})))
//首先判断是否为 node 环境：exports 为一个对象，并且 module 存在
//如果是 node 环境就用 module.exports = factory() 把 vue 导出 （通过 require(‘vue’) 进行引用）
//如果不是 node 环境判断是否支持 AMD：define 为 function 并且 define.amd 存在
//如果支持 AMD 就使用 define 定义模块，（通过 require([‘vue’]) 引用）
//否则的话直接将 vue 绑定在全局变量上（通过 window.vue 引用）
```

### ES6模块规范。异步加载
**注意：这里异步指的是不堵塞浏览器其他任务（dom构建，css渲染等），而加载内部是同步的（加载完模块后立即执行回调）**

ES6模块使用import加载模块和export xxx 或者 export default xxx 输出模块。

不论语法，从形式上看，ES6的模块跟CommonJS很像，那它俩有什么区别？


CommonJS模块输出的是一个值的拷贝，ES6模块输出的是值的引用。即CommonJS中的值的改变，对引用了它的模块没有影响了，ES6模块则仍然会有影响。


CommonJS模块是运行时加载，加载的是一个对象，运行时才会生成；ES6模块是编译时输出接口，在代码的静态解析阶段就会生成。


运行机制不同，ES6模块是动态引用，不会缓存值，模块变量绑定其所在的模块。
