const Emitter = require('events');
const http = require('http');
const response = require('./response');
const context = require('./context');
const request = require('./request');


module.exports = class Application extends Emitter {
    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(fn) {
        this.middleware.push(fn);
        return this;
    }

    // request = { app, req, res, ctx, response }
    // response = { app, req, res, ctx, request }
    // context = { request, response, app, req, res, }
    createContext(req, res) {
        const context = Object.create(this.context);
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        return context;
    }
    compose (middleware) {
        return function (context, next) {
            // last called middleware #
            let index = -1
            return dispatch(0)
            function dispatch (i) {
                if (i <= index) return Promise.reject(new Error('next() called multiple times'))
                index = i
                let fn = middleware[i]
                if (i === middleware.length) fn = next
                if (!fn) return Promise.resolve()
                try {
                    return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
                } catch (err) {
                    return Promise.reject(err)
                }
            }
        }
    }
    listen(...args) {
        const fn = this.compose(this.middleware);

        const server = http.createServer((req, res) => {
            const ctx = this.createContext(req, res);
            fn(ctx)
                .then(() => res.end(ctx.body))
                .catch((err) => {console.log(err)});
        });

        return server.listen(...args);
    }
};


