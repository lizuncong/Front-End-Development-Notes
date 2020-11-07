### Webpack打包后的源码分析

#### 1.运行
在src目录下运行build-demo-01执行打包。打包完成后在demo-01目录下生成了一个dist文件夹，dist/index.js
即是打包后的源码文件。打包后的代码，删除一些干扰代码，只保留重要部分，如下
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
(function(module, exports) {

eval("const c = 10\n\nthis.addField = '这是add.js模块的作用域'\nthis.name = 'add.js';\n\nmodule.exports = (a, b) => {\n    console.log('add...this.name', this.name);\n    console.log('a + b = ', a + b + c);\n}\n\n\n//# sourceURL=webpack:///./demo-01/add.js?");

}),

"./demo-01/index.js":
(function(module, exports, __webpack_require__) {

eval("const add = __webpack_require__(/*! ./add */ \"./demo-01/add.js\");\nconst { minus } = __webpack_require__(/*! ./utils */ \"./demo-01/utils.js\");\n\nthis.indexField = '这是index.js模块的作用域';\nthis.name = 'index.js';\nadd(3 , 4);\nminus(4, 5);\n\n\n//# sourceURL=webpack:///./demo-01/index.js?");

}),

"./demo-01/utils.js":
(function(module, exports) {

eval("\nthis.utilField = '这是util.js模块的作用域'\nthis.name = 'util.js'\nexports.minus = (a, b) => {\n    console.log('minus...this.name...', this.name);\n    console.log('a * b = ', a * b)\n}\n\n\n//# sourceURL=webpack:///./demo-01/utils.js?");

})

});
```

#### 2.源码分析
1.首先删掉一些代码，只保留关键代码，方便分析。删除后的源码：



1. 当前作用域是如何绑定的？

2. 为啥是eval

3. 为啥是exports，module.exports

浏览器是不能直接运行commonjs语法的，比如，在浏览器中不能直接require，或者使用module.exports以及exports
webpack在js里用对象模拟了commonjs中的module.exports以及exports。这也是为啥
```js
modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
```
这段代码就是将module，module.exports传入各个模块，将各个模块中暴露的内容加载到对象中
