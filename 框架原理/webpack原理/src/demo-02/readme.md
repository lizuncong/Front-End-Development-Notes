这个demo02主要用来演示不同的webpack.config.js打包后的源码的差异
```js
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
比如，output如果设置了output.libraryTarget = 'umd'或者'amd'或者'commonjs'等等，打包后的源码是咋样的，都可以在这里演示


注意观察webpack打包es6的import，export。webpack对es6的模块化处理方式和commonjs的处理方式有很大的差异。
