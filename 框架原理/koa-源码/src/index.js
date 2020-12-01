// const Koa = require('koa');
// const app = new Koa();
//
// app.use(async (ctx, next) => {
//     console.log('before.......1111111')
//     await next();
//     console.log('after........1111111')
// });
//
// app.listen(3006);

const MiniKoa = require('../lib/index')

const app = new MiniKoa();

app.use((req, res) => {
    res.writeHead(200)
    res.end('hello my koa')
})

app.listen(3000, () => {
    console.log('listen....')
})
