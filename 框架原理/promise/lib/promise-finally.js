import MiniPromise from './promise-then的链式调用'

let p = new MiniPromise((resolve, reject) => {
  resolve(1000)
})

p.finally(() => {
  console.log('finally')

  return new MiniPromise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 4000)
  })

}).then(data => {
  console.log(data)
}).catch(err => {
  console.log(err)
})



MiniPromise.prototype.finally = function(cb) {
  return p.then(data => {
          // cb();
          return MiniPromise.resolve(cb()).then(() => data)
          // return data
      },
          err => {
          // cb();
          // throw err;
          return MiniPromise.resolve(cb()).then(() => {
            throw err;
          })
      })
}
