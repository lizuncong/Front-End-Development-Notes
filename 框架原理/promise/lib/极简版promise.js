const PENDING = 'pending';
const RESOLVED = 'fulfilled';
const REJECTED = 'rejected'

/******极简版的promise实现*******/
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
