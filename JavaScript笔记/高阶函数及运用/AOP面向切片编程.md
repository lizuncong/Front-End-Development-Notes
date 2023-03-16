#### AOP面向切片编程，重写一些原生方法
如果需要劫持函数的执行可以利用AOP的思想
```js
function print(content){
  console.log('print：' + content);
}

// 所有的函数都将继承这个before原型方法
Function.prototype.before = function(beforeFunc){
  return (...args) => {
    beforeFunc();
    this(...args)
  }
}

let newFn = print.before(function(){
  console.log('打印前...')
})

newFn('哈哈哈')

```

vue2.0利用了函数劫持的思想，比如在数组执行push方法添加元素时，触发更新操作，那么可以利用AOP的思想重写数组的push方法。
```js
let oldPush = Array.prototype.push;
function push(...args){
  console.log('数据更新啦..')
  oldPush.call(this, ...args);
}

let arr = [1,2,3]
push.call(arr, 4, 5, 6)
console.log(arr)
```
