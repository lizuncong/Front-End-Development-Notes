Promise优缺点：
优点: 解决回调地狱, 对异步任务写法更标准化与简洁化     
缺点:      
首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消;      
其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部;     
第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成).     
极简版promise封装：
```js
function promise () {
  this.msg = '' // 存放value和error
  this.status = 'pending'
  var that = this
  var process = arguments[0]

  process (function () {
    that.status = 'fulfilled'
    that.msg = arguments[0]
  }, function () {
    that.status = 'rejected'
    that.msg = arguments[0]
  })
  return this
}

promise.prototype.then = function () {
  if (this.status === 'fulfilled') {
    arguments[0](this.msg)
  } else if (this.status === 'rejected' && arguments[1]) {
    arguments[1](this.msg)
  }
}

const p = new Promise((resolve, reject) => {
    const success = true;
    if(success){
        resolve()
    } else {
        reject()
    }
})
p.then(res => {}, err => {})
```
