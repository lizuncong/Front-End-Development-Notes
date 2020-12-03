const MiniKoa = require('../lib/index')

function delay(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000)
    })
}
const app = new MiniKoa();

app.use(async (ctx, next) => {
    ctx.body = '1'
    setTimeout(() => {
        ctx.body = '2'
    }, 2000)

    await next();

    ctx.body += '3'
})

app.use(async (ctx, next) => {
    ctx.body = '4'

    await delay()

    await next()

    ctx.body += '5'
})

app.use(async (ctx, next) => {
    ctx.body += '6'
})

app.listen(3006, () => {
    console.log('listen....')
})
