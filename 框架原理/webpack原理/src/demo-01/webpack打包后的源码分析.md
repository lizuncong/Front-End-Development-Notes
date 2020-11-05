### Webpack打包后的源码分析

#### 1.运行
在src目录下运行build-demo-01执行打包。打包完成后在demo-01目录下生成了一个dist文件夹，dist/index.js
即是打包后的源码文件。

#### 2.源码分析
1.首先删掉一些代码，只保留关键代码，方便分析。删除后的源码：
```js
(function(modules) { // webpackBootstrap
    // The module cache
    var installedModules = {};

    // The require function
    function __webpack_require__(moduleId) {

        // Check if module is in cache
        if(installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        // Create a new module (and put it into the cache)
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };

        // Execute the module function
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

        // Flag the module as loaded
        module.l = true;

        // Return the exports of the module
        return module.exports;
    }
    // Load entry module and return exports
    return __webpack_require__(__webpack_require__.s = "./demo-01/index.js");
})
({
"./demo-01/add.js":
/*! no static exports found */
(function(module, exports) {

eval("const c = 10\nmodule.exports = (a, b) => {\n    console.log('a + b = ', a + b + c);\n}\n\n\n//# sourceURL=webpack:///./demo-01/add.js?");

}),

"./demo-01/index.js":
 (function(module, exports, __webpack_require__) {

eval("const add = __webpack_require__(/*! ./add */ \"./demo-01/add.js\");\nconst { minus } = __webpack_require__(/*! ./utils */ \"./demo-01/utils.js\");\n\nconsole.log('utils...', add);\nadd(1 , 2);\nadd(3 , 4);\nminus(4, 5);\n\n\n//# sourceURL=webpack:///./demo-01/index.js?");
 
 }),

"./demo-01/utils.js":
(function(module, exports) {

eval("exports.minus = (a, b) => {\n    console.log('a * b = ', a * b)\n}\n\n\n//# sourceURL=webpack:///./demo-01/utils.js?");

})

});

```    

可以发现，打包后的源码就是个自执行函数，类似下面这样：
```js
(function(modules) {
    
})
({
    './demo-01/add.js': (function(){ eval("console.log('add.js')")}),
    './demo-01/index.js': (function(){ eval("console.log('index.js')")}),
})
```


1. 当前作用域是如何绑定的？
```js
function myFunc(cusModule){
    this.name = "lzc";
    console.log('this.name', this, this.name);
    cusModule.exports = (a, b) => { console.log('a + b', a + b); console.log('this.name', this.name) };
}
```

2. 为啥是eval

3. 为啥是exports，module.exports

