const Koa = require('koa');
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

app.use((ctx) => {
    ctx.body = 'hahah'
})

app.listen(3006, () => {
    console.log('listen....')
})
