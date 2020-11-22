const { readBody}  = require('./util')
function moduleRewritePlugin({ app, root }){
  app.use(async (ctx, next) => {
    await next()
    // 默认会先执行静态服务中间件，会将结果放到ctx.body

    // 需要将流转换成字符串，只需要处理js中的引用问题
    if(ctx.body && ctx.response.is('js')){
      console.log(ctx.body)
    }
  })
}

module.exports = moduleRewritePlugin;
