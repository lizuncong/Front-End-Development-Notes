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
const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected'

class MiniPromise{
  constructor(executor){
    this.status = PENDING
    this.res = undefined;
    this.err = undefined;

    // 这里需要设置成功和失败的回调，原因可以看下面的demo-01
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
    // promise的executor执行是同步的话，then的回调立马执行
    if(this.status === RESOLVED){
      onFulfilled(this.res)
    }
    if(this.status === REJECTED){
      onRejected(this.err)
    }

    // 如果promise的executor执行是异步的话，比如里面包含了setTimeout，
    // 则调用then时并不会立即执行then里面的回调
    if(this.status === PENDING){
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.res)
      })

      this.onRejectedCallbacks.push(() => {
        onRejected(this.err)
      })
    }
  }
}

/***********demo-01***************/

let p = new MiniPromise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})

// then在调用的时候，此时p的状态还是pending，定时器执行完成才真正执行回调
// then可以调多次，会被放入this.onResolvedCallbacks数组中
p.then(res => {
  console.log('res...', res)
}, err => {
  console.log('err...', err)
})


p.then(res => {
  console.log('res...', res)
}, err => {
  console.log('err...', err)
})


p.then(res => {
  console.log('res...', res)
}, err => {
  console.log('err...', err)
})
