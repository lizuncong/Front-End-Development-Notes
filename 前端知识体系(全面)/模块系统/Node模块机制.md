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
- 1.核心模块。即原生模块。 用二进制发布的模块。只能通过模块名引用，不能通过文件路径引用。
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
模块在首次加载时，会基于其文件名（绝对路径）被缓存起来。在require.cache对象中


### require模块加载机制
Node的模块加载机制，分为三个步骤：路径解析、文件定位、编译执行
- 1.首先判断是否在文件模块缓存区中，是的话，返回exports对象，否则继续下面的步骤
- 2.其次判断是否是原生模块。
    + 不是原生模块，则查询文件模块，根据文件扩展名导入文件模块，缓存文件模块，最后返回exports对象
    + 是原生模块。
        + 判断是否在原生模块缓存区，是的话则直接返回exports对象。否则，加载原生模块，缓存原生模块，并返回exports对象。

### require加载模块的时候是同步还是异步？
同步的
- 一个作为公共依赖的模块，当然想一次加载出来，同步更好。
- 模块的个数往往是有限的，而且Node.js在require的时候会自动缓存已经加载的模块，再加上访问的都是本地文件，产生的IO开销几乎可以忽略。所以不需要异步。

### require加载模块会先运行目标文件
当在文件中require某个模块时，会从头开始先运行目标文件。

例子1：module.exports导出的是基础数据类型
```js
// a.js文件
let a = 1;
a = a + 1;
module.exports = a;
a = a + 1;

// main.js文件
const a = require('./a');
console.log(a); // 2
```
a.js导出了一个基础数据类型a，module.exports ，这时 a = 2，后面的 a 再次加一，并不会影响前面a的结果

例子2：module.exports导出的是引用类型
```js
// b.js文件
let b = {
    x: 1,
    y: 2,
};
b.x = 3;
module.exports = b;
b.x = 4;

// main.js文件
const b = require('./b');
console.log(b.x); // 4
```
当a不是基础的数据类型，而是一个引用类型时，module.exports 后面的赋值 a.x = 4 生效。并且你可以在外部改变这个值。

##### 当基础数据类型和引用数据类型出现不一致的结果

reqire时会从头到尾先运行目标文件，当 a 是基本数据类型时，运行到 module.exports 时将当前 a 的值赋值给 module.exports ，也就相当于在内存中创建了一个变量然后给它赋值为2，它的值就不会改变了，后面对 a 的修改并不会对它有影响。

当为引用数据类型时，赋值给 module.exports 是一个内存地址指向对象，后续对对象的修改也会反应到 module.exports 中。


### 模块的循环引用
如果两个 js 文件，a.js 、b.js，在 a 中引用 b ，在 b 中引用 a ，会有问题吗？
```js
// a.js文件
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');

// b.js文件
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');

// main.js文件
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
1. node main.js

2. require a.js，load a.js，输出“a starting“

3. a: exports.done = false，require b.js，load b.js

4. 输出”b starting“，b: exports.done = false

5. require a.js， 由于a.js没有执行完，将未完成的副本导出，所以 a = {done: false}

6. 输出in b, a.done = false

7. b: exports.done = true，输出b done，b.js执行完毕，返回a.js继续执行

8. b = { done: true }，输出in a, b.done = true，输出a done

9. a.js 执行完毕，a = { done: true } ，返回 main.js 继续执行，require b.js

10. 由于 b.js 已经被执行完毕，缓存中拿值，现在 a = { done: true }， b = { done: true }

11. 输出in main, a.done = true, b.done = true

当main.js加载时a.js，则a.js依次加载b.js。此时，b.js尝试加载a.js。为了防止无限循环，将未完成的a.js导出对象副本返回到 b.js模块。b.js然后完成加载，并将其exports对象提供给a.js模块。


### 循环依赖的时候为什么不会无限循环引用
不会循环引用的大体思路是：
1. require('./a.js')；此时会调用 self.require(), 然后会走到module._load，在_load中会判断./a.js是否被load过，当然运行到这里，./a.js还没被 load 过，所以会走完整个load流程，直到_compile。

2. 运行./a.js，运行到 exports.done = false 的时候，给 esports 增加了一个属性。此时的 exports={done: false}。

3. 运行require('./b.js')，同 第 1 步。

4. 运行./b.js，到require('./a.js')。此时走到_load函数的时候发现./a.js已经被load过了，所以会直接从_cache中返回。所以此时./a.js还没有运行完，exports = {done.false}，那么返回的结果就是 in b, a.done = false;

5. ./b.js全部运行完毕，回到./a.js中，继续向下运行，此时的./b.js的 exports={done:true}， 结果自然是in main, a.done=true, b.done=true


### 未定义变量引用问题
在 a.js 中没有被定义的变量，在 b.js 可以访问吗？“。答案是可以的，我们看例子

```js
// a.js文件
let a = 1;
a = a + 1;
x = 10;
module.exports = a;

// b.js文件
let b = {
  x: 1,
  y: 2,
};
b.x = 3;
console.log(x); // 10
module.exports = b;

// main.js文件
const a = require('./a');
console.log(a); // 2

const b = require('./b');
console.log(b.x); // 4
```
发现在 b.js 总可以访问到 a.js 未定义的变量 x。还可以正常获取到值。原因很简单，因为 x 是一个未声明的变量，也就是一个挂在全局的变量，那么在其他地方当然是可以拿到的。



### exports和module.exports的区别
在 node 的 js 模块里可以直接调用 exports 和 module 两个“全局”变量，但是 exports 是 module.exports 的一个引用。在 node 编译的过程中，会把js模块编译成如下形式：
```js
// require 是对 Node.js 实现查找模块的 Module._load 实例的引用
// __finename 和 __dirname 是 Node.js 在查找该模块后找到的模块名称和模块绝对路径
(function(exports, require, module, __filename, __dirname){
  // ....
})
```
1. exports 是 module.exports 的一个引用

2. module.exports 初始化是一个{}，exports 也只想这个{}

3. require 引用返回的是 module.exports，而不是 exports

4. exports.xxx = xxxx 相当于在导出对象上直接添加属性或者修改属性值，在调用模块直接可见

5. exports = xxx 为 exports 重新分配内存，将脱离 module.exports ，两者无关联。调用模块将不能访问。


### require和import的区别
1. import在代码编译时被加载，所以必须放在文件开头，require在代码运行时被加载，所以require理论上可以运用在代码的任何地方，所以import性能更好。

2. import引入的对象被修改时，源对象也会被修改，相当于浅拷贝，require引入的对象被修改时，源对象不会被修改，官网称值拷贝，我们可以理解为深拷贝。

3. import有利于tree-shaking（移除JavaScript上下文中未引用的代码），require对tree-shaking不友好。

4. import会触发代码分割（把代码分离到不同的bundle中，然后可以按需加载或者并行加载这些文件），require不会触发。

5. import是es6的一个语法标准，如果要兼容浏览器的话必须转化成es5的语法，require 是 AMD规范引入方式。

目前所有的引擎都还没有实现import，import最终都会被转码为require，在webpack打包中，import和require都会变为_webpack_require_。