### loader和plugin的区别
两者的区别可以从概念，用法，执行时机，源码层面去分析

### 概念上
- loader。webpack自带的功能只能处理javaScript和JSON文件，loader让webpack能够去处理其他类型的文件，并将它们转换成有效的模块。
- plugin。插件可以执行范围更广的任务，包括打包优化，资源管理，注入环境变量

### 用法上
- loader。loader需要在config.module.rules中配置两个属性：test属性和use属性。test属性指定哪些文件会被转换，use属性指定使用什么loader
- plugin。只需要引入对应的plugin，然后在config.plugins数组中new一下即可

### 执行时机
- loader。loader从下往上，从右到左依次执行
- plugin。plugin的执行时机和webpack钩子或者其他插件的钩子有关，本质上利用的是Tapable定义的钩子

### 源码上
- loader。loader只是一个简单的函数，接收源码字符串以及options。
- plugin。plugin是一个类，其中必须实现一个apply方法，apply方法接收webpack的compile以及compilation对象，从中可以
定义插件自己的钩子或者订阅其他插件的钩子
