bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，
而其余参数将作为新函数的参数，供调用时使用
```js
Function.prototype.bind = function () {
   // 保存原函数
  var self = this
  // 取出第一个参数作为上下文, 相当于[].shift.call(arguments)
  var context = Array.prototype.shift.call(arguments)
  // 取剩余的参数作为arg; 因为arguments是伪数组, 所以要转化为数组才能使用数组方法
  var arg = Array.prototype.slice.call(arguments)
  // 返回一个新函数
  return function () {
    // 绑定上下文并传参
    self.apply(context, Array.prototype.concat.call(arg, Array.prototype.slice.call(arguments)))
  }
}

// 用法
function list(){
    return Array.prototype.slice.call(arguments)
}

var list1 = list(1,2,3) // [1,2,3]

// 创建一个函数，它拥有预设参数列表
var leadingThirtysevenList = list.bind(null, 37);
var list2 = leadingThirtysevenList(); 
// [37]

var list3 = leadingThirtysevenList(1, 2, 3); 
// [37, 1, 2, 3]
```

注意下面这段代码的调用方式 `Array.prototype.slice.call(arguments)`
```js
// 取剩余的参数作为arg; 因为arguments是伪数组, 所以要转化为数组才能使用数组方法
var arg = Array.prototype.slice.call(arguments) // 实际上就是将argumengt转成数组再使用
```
