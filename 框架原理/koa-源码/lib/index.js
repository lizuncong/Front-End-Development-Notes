const http = require('http')
const request = require('./request')
const response = require('./response')
const context = require('./context')

class MiniKoa {

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
            .createServer((req, res) => {
                // 创建上下文对象
                const ctx = this.createContext(req, res)
                this.callback(ctx)

                // 给用户返回数据
                res.end(ctx.body)
            })
            .listen(...args)
    }

    use(callback){
        this.callback = callback
    }
}


module.exports = MiniKoa;
