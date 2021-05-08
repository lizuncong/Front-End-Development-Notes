### 引言
Node中采用了 CommonJs 规范，通过 module.exports 和 require 来导出导入模块。在模块加载机制中，Node 采用延迟加载的策略，只有到使用到时，才会去加载，加载之后会被存入 cache 中

### 关于模块机制的常见问题
- require 的加载机制？
- 假设有 a.js、b.js 两个模块相互引用，会有什么问题？是否为陷入死循环？
- a 模块中的 undeclaredVariable 变量在 b.js 中是否会被打印？
- module.exports 与 exports 的区别
- import 和 require 的区别
- 模块在 require 的过程中是同步还是异步

### Node模块分类
分类：核心模块、文件模块、文件夹模块、加载node_modules模块、缓存模块。
- 1.核心模块。 用二进制发布的模块。只能通过模块名引用，不能通过文件路径引用。
- 2.文件模块。通过绝对路径从文件系统中加载。
```js
const module = require('../my_module/module');
```
可以省略.js后缀，如果没有找到这个文件，Node会在文件名后面加上.js再次查找路径。

- 3.文件夹模块
```js
const module = require('../my_module');
```
Node会在指定的文件夹中查找模块。Node会假设当前文件夹是一个包含了package.json的包定义。

如果package.json存在就会解析文件，查找main属性，并将main属性作为入口点。

如果package.json不存在，就会将包入口点假设为index.js

- 4.加载node_modules模块

如果在核心模块和文件模块都没有找到模块，Node就会尝试在当前目录下的node_modules文件夹中查找该模块
```js
const myModule = require('myModule.js');
```
尝试找到文件 `./node_modules/myModule.js`

如果没有找到，就会查找上一级目录 `../node_modules/myModule.js`

如果还是没有找到，就再往上一级目录，直到找到根目录或者找到为止。

- 5.缓存模块
模块在首次加载时，会被缓存起来。在require.cache对象中