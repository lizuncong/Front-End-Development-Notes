const webpack = require('webpack')
const config = require('./webpack.config');

// webpack(config, (err, stats) => {
//     if(err){
//         console.error(err);
//         return;
//     }
//     // 输出构建信息
//     console.log(stats.toString({
//         chunks: false,
//         colors: true
//     }))
// })


const compiler = webpack(config)

// compiler实例上的hooks属性，用于将一个插件注册到compiler的生命周期中的所有钩子事件上。


compiler.run((err, stats) => {
    console.log(stats.toString({
        chunks: true,
        colors: true
    }))
})
