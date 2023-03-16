### generator
迭代器就是一个对象，具备next方法，调用next方法后返回一个对象，包含value和done属性。

```javascript
/**
 * generator和promise结合使用
 * */

const readFile = (url) => {
  return new Promise((resolve, reject) => {
    resolve('url：' + url)
  })
}

/**
 * read看上去很像同步执行的代码哦
 * */
function* read(){
  let content = yield readFile('./name.txt')
  let r = yield readFile('./age.txt')
  return {
    content,
    r
  }
}

let it = read();
let { value, done } = it.next();
Promise.resolve(value).then(res => {
  let {value, done } = it.next(res);
  Promise.resolve(value).then(res2 => {
    let {value, done} = it.next(res2)
    console.log('value...', value, done);
  })
})
/**
 * 可以看到上面的Promise.resolve部分重复了，而且深层嵌套。
 * 循环：循环不支持异步
 * 递归：递归支持异步
 *
 * 迷你版的co库，原理
 * */
function co(it){
  return new Promise((resolve, reject) => {
    function next(data){
      let {value, done} = it.next(data);
      if(done){
        resolve(value)
      } else {
        Promise.resolve(value).then(res => {
          next(res)
        }, err => {
          it.throw(err);
          reject()
        })
      }
    }

    next();

  })
}

co(read()).then(res => {
  console.log('res...', res)
})

/**
 * async await 正是基于generator + co实现的一个语法糖
 * */
```
