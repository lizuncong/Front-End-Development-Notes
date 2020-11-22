/********先来看一个demo**********/
const fs = require('fs')
function read(url){
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', function(err, data){
      if(err) reject(err);
      resolve(data)
    })
  })
}
// 如果一个promise的then方法中的函数(成功和失败)返回的结果是一个promise的话，会自动将
// 这个promise执行，并且采用它的状态，如果成功会将成功的结果向外层的下一个then传递
// 如果then返回的是一个普通值或者没有返回，那么会将这个普通值或者undefined作为下一次
// 的成功的结果
read('./name.txt')
    .then((res) => {
      console.log('res...', res)
      return read(res +'1')
    }, err => {
      console.log('err...', err)
    })
    .then(res => {
      console.log('res2...', res)
    }, err => {
      console.log('err2...', err)
      return undefined; // 如果返回的是一个普通值，那么会将这个普通值作为下一次的成功的结果
    })
    .then(res => {
      console.log('res3..', res);
      // 如果希望在这里不要再继续往下走then，该咋做
      // 如果是throw new Error()的话，也会继续往下走then的错误回调的
      // 因此如果要终端promise，不继续往下走，可以返回一个空的promise
      return new Promise(() => {})
    }, err => {
      console.log('err3...', err)
    })





/*********promise链式调用的实现*************/
// 1) then中传递的回调函数，判断成功和失败函数的返回结果。
// 2) 判断返回结果是不是promise，如果是promise就采用它的状态
// 3) 如果不是promise，直接将结果传递下去即可
const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected'

const resolvePromise = (promise2, x, resolve, reject) => {
  // x和promise2不能是同一个对象，参考下面的问题1
  if(promise2 === x){
    return reject(new TypeError('promise.then内不能返回自身'))
  }
  if(typeof x === 'object' && x !== null || typeof x === 'function'){
    let call;
    try {
      let then = x.then
      if(typeof then === 'function'){
        then.call(x, res => { // res可能还是一个promise，直到解析的结果是一个普通值
          if(call) return;
          call = true;
          resolvePromise(promise2,res, resolve, reject)
        }, err => {
          if(call) return;
          call = true
          reject(err)
        })
      } else {
        if(call) return;
        call = true;
        resolve(x)
      }
    }catch (e) {
      if(call) return;
      call = true;
      reject(e)
    }
  } else {
    // x是一个普通值
    resolve(x)
  }
}
class MiniPromise{
  constructor(executor){
    this.status = PENDING
    this.res = undefined;
    this.err = undefined;

    this.onResolvedCallbacks = []; // 成功的回调的数组
    this.onRejectedCallbacks = []; // 失败的回调的数组

    let resolve = (res) => {
      if(this.status !== PENDING) return;
      this.res = res;
      this.status = RESOLVED;
      this.onResolvedCallbacks.forEach(fn => fn())
    }

    let reject = (err) => {
      if(this.status !== PENDING) return;
      this.err = err;
      this.status = REJECTED
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try{
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected){

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;

    onRejected = typeof onRejected === 'function' ? onRejected : err => throw err

    let promise2 = new MiniPromise((resolve, reject) => {
      // promise的executor执行是同步的话，then的回调立马执行
      if(this.status === RESOLVED){
        // promise A+规范里面有说明，下面两行代码不能在当前执行栈里调用，因为当前执行栈无法
        // 获取到promise2，因此需要将下面两行代码放在setTimeout里面执行
        // const x = onFulfilled(this.res)
        // // resolve(x); 这里需要判断x是普通值还是一个promise，因此这里不能直接调用resolve
        // // 需要新开一个方法resolvePromise去处理x的类型问题
        // resolvePromise(promise2, x, resolve, reject);

        /***需要将resolvePromise(promise2, x, resolve, reject)放在setTimeout里执行***/
        setTimeout(() => {
          try {
            // 放在setTimeout里面才能拿到promise2
            const x = onFulfilled(this.res)
            resolvePromise(promise2, x, resolve, reject);
          }catch (e) {
            reject(e)
          }
        }, 0)
      }
      if(this.status === REJECTED){
        setTimeout(() => {
          try {
            const x = onRejected(this.err)
            resolvePromise(promise2, x, resolve, reject);
          }catch (e) {
            reject(e)
          }
        }, 0)
      }

      // 如果promise的executor执行是异步的话，比如里面包含了setTimeout，
      // 则调用then时并不会立即执行then里面的回调
      if(this.status === PENDING){
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.res)
              resolvePromise(promise2, x, resolve, reject);
            }catch (e) {
              reject(e)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.err)
              resolvePromise(promise2, x, resolve, reject);
            }catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2;
  }
}

/**********使用方式*************/
let promise1 = new MiniPromise((resolve, reject) => {
  resolve(100)
})

let promise2 = promise1.then(res => {
  throw new Error('报错了。。。');
})

promise2.then(res => {
  console.log('res2..', res)
}, err => {
  console.log('err...', err)
}).then(res => {
  console.log('res3...', res)
})

// 用法二
let promise1 = new MiniPromise((resolve, reject) => {
  resolve(100);
})

let promise2 = promise1.then(res => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('hello')
    }, 1000)
  })
})

promise2.then(res => {
  console.log('res2...', res)
}, err => {
  console.log('err2..', err)
}).then(res => {
  console.log('res3..', res)
})



// 问题1 x和promise2不能是同一个对象
let pro = new MiniPromise((resolve, reject) => {
  resolve()
})

let promise2 =  pro.then(() => {
  return promise2 // 错误的使用方法
})

promise2.then(null, function(err){
  console.log(err)
})
