#### 函数组合
函数组合是函数式编程中非常重要的思想。redux中间件，koa中间件等各种中间件的原理都类似于函数组合。koa中间件比较特殊一点，koa中间件是个异步
中间件。         
koa中间件机制就是 `函数组合` 的概念，将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示
这种机制，是koa源码中的精髓和难点。          

一、先来看个简单的例子      

```js
function add(x, y){
    return x + y
}

function square(z){
    return z * z
}

function double(x){
    return 2 * x
}

let ret = double(square(add(1, 2))) // 先执行add，后执行square，最后double
console.log(ret); // 输出18

// 可以定义一个函数ret
let ret = (x, y) => {
    return double(square(add(x, y)))
}

ret(4,5);

// 如果更灵活点，可以定义一个组合函数
let compose = (f1, f2, f3) => {
    return (...arg) => {
        return f3(f2(f1(...arg)))
    }
}

let ret = compose(add, square, double)
ret(4,5)
```

二、如何根据给定的中间件数组组合函数？

```js
function add(x, y){
    return x + y
}

function square(z){
    return z * z
}

function double(x){
    return 2 * x
}

let mids = [add, square, double]

// 这是一段值得细细品味的代码
// 这是一段值得细细品味的代码
// 这是一段值得细细品味的代码
function compose(middlewares){
    // 要返回这种函数：(args) => middlewares[1](middlewares[0](...args))
    // 当middlewares 为空时，会报错，因为reduce没有传初始值
    // 当middlewares 只有一项时，reduce直接将第一项做为reduce的返回结果
    // 当middlewares 有多项时，会从第二项(因为没有传初始值，所以从第二项开始遍历)开始遍历执行reduce的回调
    return middlewares.reduce((resultFn, currentFn) => {
        return (...args) => {
            return currentFn(resultFn(...args))
        }
    })
}
```

三、异步中间件，重磅中的重磅
```js
function compose(middlewares) {
    return function(){
        return dispatch(0);
        // 执行第0个
        function dispatch(i){
            let fn = middlewares[i];
            if(!fn){
                return Promise.resolve();
            }
            return Promise.resolve(
                fn(function next(){
                    // promise完成后，再执行下一个
                    return dispatch(i + 1)
                })
            )
        }
    }
}

// 测试用例：
async function fn1(next){
    console.log('fn1..before...');
    await next(); // 如果这里不用await，直接调用next()，观察一下输出顺序。。
    console.log('fn1...after...');
}

async function fn2(next){
    console.log('fn2...before....');
    await delay();
    await next();
    console.log('fn2...after.....');
}

function fn3(next){
    console.log('fn3...')
}

function delay(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('delay..');
            resolve();
        }, 2000)
    })
}

let mids = [fn1, fn2, fn3]
let finalFn = compose(mids)

finalFn();


```
