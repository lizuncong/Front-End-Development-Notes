const Koa = require('koa');
const app = new Koa();

// 错误处理中间件, 洋葱最外层
// app.use(async (ctx, next)=>{
//     try {
//         await next();
//     } catch (error) {
//         console.log('+++++++++++++++++++++')
//         // 响应用户
//         ctx.status = error.statusCode || error.status || 500;
//         ctx.body = error.message;
//         ctx.app.emit('error', error); // 触发应用层级错误事件
//     }
// });


app.use(async (ctx, next) => {
    console.log('before.......1111111')
    await next(); // 这个不使用await和使用await，打印顺序不一样，而且异常也捕获不了。
    console.log('after........1111111')
});

app.use(async (ctx, next) => {
    console.log('before.......2222222')
    await next();
    console.log('after........2222222')
});

app.use(async (ctx, next) => {
    console.log('before.......3333333')
    await next();
    console.log('after........3333333')
});

app.use(async (ctx, next) => {
    // console.log('a.b.c.d', dd.b.c.d);
    ctx.body = 'hello koa'
});

// app.on('error',  (ctx) => {
//     console.log('===========================报错了哦亲===========================')
//     ctx.body = '出错了。'
// })

app.listen(5002, () => {

});
