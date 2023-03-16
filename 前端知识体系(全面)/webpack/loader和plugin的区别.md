> 建议边看文章边动手实践以加强理解

## loader 和 plugin 的区别

两者的区别可以从下面几点分析：

- 概念
- 用法
- 执行顺序
- 如何开发 loader 和 plugin
- 源码层面

### 概念上

引用 webpack 官网 关于 [loader](https://webpack.js.org/concepts/#loaders) 和 [plugin](https://webpack.js.org/concepts/#plugins) 的解释：

- loader。webpack 自带的功能只能处理 javaScript 和 JSON 文件，loader 让 webpack 能够去处理其他类型的文件，并将它们转换成有效的模块，以及被添加到依赖图中。
- plugin。插件可以执行范围更广的任务，包括打包优化，资源管理，注入环境变量

loader 的概念相对容易理解。插件的就比较拗口，其实插件就是暴露了 webpack 整个打包构建生命周期 中的钩子给我们订阅，方便我们监听整个打包过程

### 用法上

#### [loader](https://webpack.js.org/concepts/loaders/#using-loaders)

有两种方式使用 loader：

- 配置文件
- 内联方式

##### 配置文件。loader 有两个属性：

- test 属性，识别出哪些文件会被转换
- use 属性，定义出在进行转换时，应该使用哪个 loader。

```js
module.exports = {
  output: {
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: [{ test: /\.txt$/, use: "raw-loader" }],
  },
};
```

##### [内联方式](https://webpack.js.org/concepts/loaders/#inline)

在每个 import 语句中显式指定 loader

```javascript
// inline loader一样可以传递options，通过?key=value&foo=bar这种方式
import Styles from "style-loader!css-loader?modules!./styles.css";
```

#### plugin。

只需要引入对应的 plugin，然后在 plugins 数组中 new 一下即可

```js
const webpack = require("webpack"); // 访问内置的插件
module.exports = {
  plugins: [new webpack.ProgressPlugin()],
};
```

### 执行顺序

#### plugin

plugin 的执行时机和 webpack 钩子或者其他插件的钩子有关，本质上利用的是 [Tapable](https://github.com/webpack/tapable) 定义的钩子。webpack 提供了各种各样的钩子，可以看[这里](https://webpack.js.org/api/compiler-hooks/)。因此如果想要熟练开发 webpack 插件，一定要对 [Tapable](https://github.com/webpack/tapable) 用法比较熟悉。我手写了 Tapable 所有的钩子，解读了 Tapable 的源码，并提供了使用 Demo，具体可以看[这里](https://github.com/lizuncong/mini-tapable)

#### loader

默认情况下，loader 按照我们在配置文件中配置的 `module.rules` 从下往上，从右到左依次执行。但是可以通过 `enforce` 以及 `inline loader` 修改 loader 的执行顺序。

```javascript
rules: [
  {
    test: /\.js$/,
    use: {
      loader: "loader3",
    },
    enforce: "pre", // enforce: 'post'
  },
];
```

##### loader 的分类

按执行顺序，loader 可以这么划分：

- preLoader。`enforce` 被设置成 `pre` 的 loader
- postLoader。`enforce` 被设置成 `post` 的 loader
- normal loader。在配置文件中配置的并且没有设置 `enforce` 属性的普通 loader
- inline loader。在 import 语句中使用的 loader

##### loader 的执行顺序

默认情况下，loader 按照我们在配置文件中配置的 `module.rules` 从下往上，从右到左依次执行。

实际上，loader 会按照下面的顺序执行：

- 先执行 `preLoader`
- 其次执行 `normal loader`
- 然后执行 `inline loader`
- 最后执行 `postLoader`

`inline loader`的使用方式不同，也会改变 loader 的顺序，这又引入了新的复杂度，可以点击[这里](https://webpack.js.org/concepts/loaders/#inline)查看

- 如果`inline loader`前面只有`!`号，则文件不会再通过配置的`normal loader`解析

```javascript
import Styles from "!style-loader!css-loader?modules!./styles.css";
```

- 如果`inline loader`前面有`!!`号，则表示文件不再通过其他 loader 处理，只经过 inline loader 处理。

```javascript
import Styles from "!!style-loader!css-loader?modules!./styles.css";
```

- 如果`inline-loader`前面有`-!`，则不会让文件再去通过`preLoader` 以及 `normal loader`解析，但还是会经过`postLoader`解析

```javascript
import Styles from "-!style-loader!css-loader?modules!./styles.css";
```

**执行顺序这块建议动手实践一下**

### 如何开发 loader 和 plugin

- [如何开发 loader](https://webpack.js.org/contribute/writing-a-loader/)
- [如何开发 plugin](https://webpack.js.org/contribute/writing-a-plugin/)

#### loader

**记住，loader 只能是普通函数，不能是箭头函数，因为 webpack 在运行 loader 时，会往我们的 loader 中注入 [loaderContext](https://github.com/webpack/loader-runner/blob/main/lib/LoaderRunner.js#L268) 上下文**，可以点击[这里](https://github.com/webpack/loader-runner/blob/main/lib/LoaderRunner.js#L132)查看。因此 loader 函数中的 this 是有意义的，不能使用箭头函数。

##### loader 的组成

loader 包含两部分，[pitchLoader](https://webpack.js.org/api/loaders/#pitching-loader) 和 normalLoader，pitch 和 normal 的执行顺序正好相反

- 当 pitch 没有定义或者没有返回值时，会先依次执行 pitch 在获取资源执行 loader
- 如果定义的某个 pitch 有返回值则会跳过读取资源和自己的 loader。假设有 use: [loader1，loader2，loader3]，三个 loader 都包含 pitchloader 和 normal loader。
  - 第一种情况，三个 loader 的 pitch loader 都没有返回值，那么执行顺序为：pitch loader3 -> pitch loader2 -> pitch loader1 -> 获取资源 -> normal loader1 ->
    normal loader2 -> normal loader3
  - 第二种情况，pitch loader 有返回值，假设 pitch loader2 有返回值，则执行顺序为：pitch loader3 -> pitch loader2 -> noraml loader3

```javascript
function loader(source) {
  console.log("pitchLoader...", source);
}

loader.pitch = function () {
  console.log("pitch...");
};

module.exports = loader;
```

**建议动手实践方便比较 pitch loader 和 normal loader 的关系**。目前我们用的 `style-loader` 就使用了 `pitch loader`，具体可以查看我手写的 [style-loader](https://github.com/lizuncong/mini-webpack/blob/master/loaders/style-loader/index.js)

#### plugin

plugin 是一个类，其中必须实现一个 apply 方法，apply 方法接收 webpack 的 compiler 对象，从中可以定义插件自己的钩子或者订阅其他插件的钩子

```js
// A JavaScript class.
class MyExampleWebpackPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync(
      "MyExampleWebpackPlugin",
      (compilation, callback) => {
        console.log("This is an example plugin!");
        console.log(
          "Here’s the `compilation` object which represents a single build of assets:",
          compilation
        );

        // Manipulate the build using the plugin API provided by webpack
        compilation.addModule(/* ... */);

        callback();
      }
    );
  }
}
```

### 源码上

从 webpack 调用 loader 以及 plugin 的时机简单介绍

#### loader

loader 的调用在[lib/NormalModule](https://github.com/webpack/webpack/blob/main/lib/NormalModule.js#L819)中。

webpack 在打包我们的源码时，会从入口模块开始构建依赖(主要流程在 Compilation.js 中)。对每一个文件都会依次执行下面的顺序：

- 调用 NormalModule.build() 构建模块(一个文件对应一个 NormalModule)
- 对每一个模块调用 runLoaders 执行模块匹配的 loaders，获取经过 loader 处理后的模块源码
- 调用 this.parser.parse() 解析处理后的模块源码，提取模块依赖
- 对提取的模块依赖，再重复以上过程

可以看出，loader 的执行在依赖解析之前完成

#### plugin

plugin 的调用时机就比较灵活。实际上 webpack 在整个生命周期都会调用相应的钩子。比如

- 在根据文件路径解析模块时，会调用相应的 [resolvers](https://webpack.js.org/api/resolvers/#types) 钩子。

假设有个需求，需要分析都有哪些文件引用了 `product.js` 这个文件，此时就可以使用 `resolvers` 钩子。

### 总结

综上可以看出，虽然 loader 的分类，组成，用法比较多样，但是只要理解了这些差异，就能轻松的开发自己的 loader。

plugin 的组成，用法比较单一，但是如果要自己开发的话还是有难度的。因为需要理解 webpack 在整个生命周期过程中都暴露了哪些钩子，怎么结合自己的业务需求去使用对应的钩子。

> 一般来说，看到这里基本就已经熟悉了 loader 和 plugin 的区别。如果你不满足于此，可以关注我 Github 里面的[mini-webpack](https://github.com/lizuncong/mini-webpack)。在这里我不仅手写了常见的 loader，比如 babel-loader，css-loader，file-loader，less-loader，style-loader 以及 url-loader。还原汁原味手写了 webpack4 的主流程源码。如果对源码感兴趣的朋友可以在仓库里面给我提 issue 一起讨论。
