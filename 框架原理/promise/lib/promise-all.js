// demo
const fs = require('fs')
function read(url){
  return new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', function(err, data){
      if(err) reject(err);
      resolve(data)
    })
  })
}
Promise.all([1,2,3,4, read('./name.txt')]).then(data => {
  console.log('data...', data)
})


import MiniPromise from './promise-then的链式调用'

const isPromise = value => {
  if((typeof value === 'object' && value !== null) || typeof value === 'function'){
    if(typeof value.then === 'function'){
      return true
    }
  } else {
    return false;
  }
}

MiniPromise.all = function(promises){
  return new MiniPromise((resolve, reject) => {
    let resultArr = [] // 存储结果的
    let count = 0;
    function processData(key, value){
      resultArr[key] = value
      count++;

      // 这里有个注意的点，不能使用resultArr.length === promises.length 做判断，因为如果最后一项先返回来
      // 比如resultArr[5] = 'success'，则此时resultArr的长度为6
      if(count === promises.length){
        resolve(resultArr)
      }
    }

    for(let i = 0; i < promises.length; i ++){
      let current = promises[i]
      if(isPromise(current)){
        // 全部成功则成功，有任何一个失败就直接调reject
        current.then(data => {
          processData(i, data)
        }, reject)
      } else {
        processData(i, current)
      }
    }
  })
}

