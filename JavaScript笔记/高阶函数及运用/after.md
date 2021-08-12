有时候希望在函数调用规定的次数后，才真正的执行业务逻辑
```js
function after(times, callback){
  return function(){
    if(--times === 0){
      callback()
    }
  }
}

let fn = after(3, function(){
  console.log('fn调用三次之后执行')
})

fn()
fn()
fn()
```
