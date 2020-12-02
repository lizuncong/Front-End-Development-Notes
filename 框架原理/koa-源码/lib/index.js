const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')

class MiniKoa {

    constructor(){
        this.middlewares = [];
    }

    compose(middlewares) {
        return function(ctx){
            return dispatch(0);

            function dispatch(i){
                let mid = middlewares[i];
                if(!mid){
                    return Promise.resolve();
                }
                return Promise.resolve(
                    mid(ctx, function next(){
                        // promise完成后，再执行下一个
                        return dispatch(i + 1)
                    })
                )
            }
        }
    }

    createContext(req, res){
        // Object.create原型式继承
        const ctx = Object.create(context)
        ctx.request = Object.create(request)
        ctx.response = Object.create(response)

        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;

        return ctx;
    }

    listen(...args){
        http
            .createServer(async (req, res) => {
                // 创建上下文对象
                const ctx = this.createContext(req, res)

                // 将middlewares复合成一个函数，fn是个异步
                const fn = this.compose(this.middlewares)

                await fn(ctx)
                // this.callback(ctx)

                // 给用户返回数据
                res.end(ctx.body)
            })
            .listen(...args)
    }

    use(mid){
        this.middlewares.push(mid)
    }
}


module.exports = MiniKoa;
