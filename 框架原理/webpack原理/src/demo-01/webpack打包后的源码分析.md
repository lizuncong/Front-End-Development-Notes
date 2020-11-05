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
            l: false,
            i: moduleId,
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

eval("module.exports = (a, b) => {\n    console.log('a + b = ', a + b);\n}\n\n\n//# sourceURL=webpack:///./demo-01/add.js?");

}),

"./demo-01/index.js":
(function(module, exports, __webpack_require__) {

eval("const add = __webpack_require__(/*! ./add */ \"./demo-01/add.js\");\n\nadd(1 , 2);\nadd(3 , 4);\n\n\n//# sourceURL=webpack:///./demo-01/index.js?");

})

});
```    

