### loader和plugin的区别
两者的区别可以从概念，用法，执行时机，源码层面去分析

### 概念上
- loader。webpack自带的功能只能处理javaScript和JSON文件，loader让webpack能够去处理其他类型的文件，并将它们转换成有效的模块。
- plugin。插件可以执行范围更广的任务，包括打包优化，资源管理，注入环境变量

### 用法上
- loader。有两种方式使用loader
    + 配置。在module.rules中配置两个属性：test属性和use属性。test属性指定哪些文件会被转换，use属性指定使用什么loader
    + 内联方式。可以在每个导入语句指定loader
```javascript
// inline loader一样可以传递options，通过?key=value&foo=bar这种方式
import Styles from 'style-loader!css-loader?modules!./styles.css';
```
- plugin。只需要引入对应的plugin，然后在plugins数组中new一下即可

### 源码上
- loader。loader只是一个简单的函数，接收源码字符串以及options。loader只能是普通函数，不能使用箭头函数，因为loader中，this提供了整个上下文的环境
- plugin。plugin是一个类，其中必须实现一个apply方法，apply方法接收webpack的compiler对象，从中可以定义插件自己的钩子或者订阅其他插件的钩子

### 执行时机
#### plugin
plugin的执行时机和webpack钩子或者其他插件的钩子有关，本质上利用的是Tapable定义的钩子

#### loader
默认情况下，loader从下往上，从右到左依次执行。但是可以通过 `enforce` 修改loader的执行顺序。
```javascript
rules: [
  {
    test: /\.js$/,
     use: {
       loader: 'loader3',
    },
    enforce: 'pre', // enforce: 'post'
 }]
```
因此，loader的执行顺序是：

`pre loader` -> `normal loader` -> `inline loader` -> `post loader`。

`pre loader` 就是 `enforce: 'pre'` 的loader。

`normal loader` 就是没有配置 `enforce` 的正常loader。

`inline loader` 就是通过内联方式引入的loader。

`post loader` 就是配置 `enforce: 'post'` 的loader。

`inline loader`的使用方式不同，也会改变loader的顺序：

- 如果`inline loader`前面只有`!`号，则文件不会再通过配置的`normal loader`解析
```javascript
import Styles from '!style-loader!css-loader?modules!./styles.css';
```
- 如果`inline loader`前面有`!!`号，则表示文件不再通过其他loader处理，只经过inline loader处理。
```javascript
import Styles from '!!style-loader!css-loader?modules!./styles.css';
```
- 如果`inline-loader`前面有`-!`，则不会让文件再去通过`pre loader` 以及 `normal loader`解析，但还是会经过`post loader`解析
```javascript
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```

#### loader的组成
loader包含两部分，pitchLoader和normalLoader，pitch和normal的执行顺序正好相反
- 当pitch没有定义或者没有返回值时，会先依次执行pitch在获取资源执行loader
- 如果定义的某个pitch有返回值则会跳过读取资源和自己的loader。假设有use: [loader1，loader2，loader3]，三个loader都包含pitchloader和normal loader。
    + 第一种情况，三个loader的pitch loader都没有返回值，那么执行顺序为：pitch loader3  -> pitch loader2 -> pitch loader1 -> 获取资源 -> normal loader1 ->
    normal loader2 -> normal loader3
    + 第二种情况，pitch loader有返回值，假设pitch loader2有返回值，则执行顺序为：pitch loader3 -> pitch loader2 -> noraml loader3
    
```javascript
function loader(source){
    console.log('pitchLoader...', source)
}

loader.pitch = function(){
    console.log('pitch...')
}

module.exports = loader
```
