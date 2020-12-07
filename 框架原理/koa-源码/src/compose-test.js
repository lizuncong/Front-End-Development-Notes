function compose (middleware) {
    return function (context) {
        let index = -1
        return dispatch(0)
        function dispatch (i) {
            // 一个中间件不能多次调用next
            if (i <= index) return Promise.reject(new Error('多次调用了next()'))
            index = i
            let fn = middleware[i]
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(
                    // 执行中间件
                    fn(context, function next(){
                        return dispatch(i + 1)
                    })
                );
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}


let mid1 = async (ctx, next) => {
    console.log('before.......1111111', this.__proto__)
    await next();
    // await next(); 多次调用了next()
    console.log('after........1111111')
};

let mid2 = async (ctx, next) => {
    console.log('before.......2222222')
    await next();
    console.log('after........2222222')
};

let mid3 = async (ctx, next) => {
    console.log('before.......3333333')
    await next();
    console.log('after........3333333')
};

let mid4 = async (ctx, next) => {
    ctx.body = 'hello koa'
};

let fn = compose([mid1,mid2, mid3, mid4])

let context = {}

fn(context).then(res => {
    console.log('res...', res)
    console.log('context...', context)
})
