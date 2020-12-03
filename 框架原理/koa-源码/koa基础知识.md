#### koa2设计思想与实现
- koa继承自nodejs的events类，因此可以使用 events 提供的事件监听 on 及出发 emit 方法
- koa主要利用了getter/setter，函数组合这两个技术。
- koa的use方法返回this，因此可以链式调用，app.use().use().listen()
- app.context
    + 可以在app.context里面挂载一些全局使用的属性。
    + koa将nodejs原生的request和response对象封装到了ctx里面
    + koa为每一个请求创建一个context
    + koa是怎么将ctx的属性代理到ctx.request和ctx.response上的，比如ctx.path 代理到ctx.request.path
    + koa为了能够简化API，引入上下文context概念，将原始请求对象req和响应对象res封装并挂载到context上，
    并且在context上设置getter和setter，从而简化操作。
    + getter/setter
    + 为什么需要封装request、response和context？
           + 在原生node开发中，设置状态码既可以使用 `res.writeHead(200)`，也可以使用 `res.statusCode = 200`。API多样的同时容易让人
           迷茫。
           + 在原生node开发中，如果想返回json数据，不仅需要设置content-type，还需要对返回的数据进行JSON序列化。

```js
// getter/setter示例
const request = {
    req: { url: 'http://localhost:8080/' },
    get url(){
        return this.req.url
    },
    set url(val){
        this.req.url = val
    }
}

// 设置状态码方法示例
const http = require('http')
const server = http.createServer(async (req, res) => {
    res.writeHead(200);  //
    // res.statusCode = 200; 
    res.end('success')
})
server.listen(8000)

// 如果是返回json格式的数据，原生node还需要设置content-type等。
const http = require('http')
const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
    })
    
    res.end(JSON.stringify({ name: 'lzc', age: 26 })) // 还要额外对数据序列化。
})
server.listen(8000)
```   

#### 中间件机制与实现
koa中间件机制就是函数组合的概念。将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数
的返回值。洋葱圈模型可以形象表示这种机制，是koa源码中的精髓和难点。

##### 函数组合的概念
```js
function add(x, y){
    return x + y
}

function square(z){
    return z * z
}

function double(x){
    return x * 2
}
const ret = double(square(add(1, 2)))
console.log(ret);

// 简单版的复合函数，中间件数量有限
function compose(fn1, fn2){
    return (...args) => fn1(fn2(...args))
}

// 高级版的复合函数，可以同时复合多个中间件，只能解决同步函数的问题
function compose(middlewares){
    return middlewares.reduce((leftFn, rightFn) => (...args) => rightFn(leftFn(...args)))
}

const middlewares = [add, square, double]

let retFn = compose(middlewares);
console.log(retFn(1, 2))
```

#### 常见中间件任务与实现
