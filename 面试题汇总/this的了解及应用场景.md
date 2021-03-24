### this的五种情况分析
- this执行主体，谁把它执行的(和在哪创建&在哪执行都没有必然的关系)
- 五种情况：
  + 函数执行，看方法前面是否有"."，没有"."，this是window(严格模式下是undefined)，有"."，"."前面是谁this就是谁
  + 给当前元素的某个事件行为绑定方法，当事件行为触发，方法中的this是当前元素本身(排除attachEvent)
  + 构造函数体中的this是当前类的实例
  + 箭头函数中没有执行主体，所用到的this都是其所处上下文中的this
  + 可以基于Function.prototype上的call/apply/bind去改变this指向
````js
// 第一种情况
const fn = function fn(){
  console.log(this);
}
const obj = {
  name: 'lzc',
  fn: fn,
}
fn();
obj.fn();

// 第二种情况
document.body.addEventListener('click', function(){
  console.log(this);
})

// 第三种情况
function Factory(){
  this.name = 'lzc';
  this.age = 12;
  console.log(this);
}

let f = new Factory;

// 第四种情况
let demo = {
  name: 'demo',
  fn(){
    console.log('1..',this);
    setTimeout(function(){
      console.log('2..',this)
    }, 1000)
    
    setTimeout(() => {
      console.log('3..',this);
    }, 1000)
  }
}
demo.fn();

// 第五种情况
function func(x, y){
  console.log(this, x, y);
}

let obj = {
  name: 'obj'
}

// func函数基于__proto__找到Function.prototype.call，把call方法执行
func.call(obj, 10, 20);
func.apply(obj, [10, 20])

// func函数基于__proto__找到Function.prototype.bind，把bind方法执行
// 在bind方法内部，利用闭包把传递进来的obj/10/20等信息存储起来，执行bind返回一个新的函数
document.body.addEventListener('click', func.bind(obj, 10, 20))
````

### 手撕call/apply/bind源码
```js
// call的原理就是利用'.'确定this机制
Function.prototype.call = function call(context, ...params){
  let self = this;
  let key = Symbol('KEY');
  let result;
  context == null ? context = window : null;
  // 如果context是个基本类型，则需要转换一下
  !/^(object|function)$/i.test(typeof context) ? context = Object(context) : null;
  
  context[key] = self;
  result = context[key](...params);
  delete context[key];
  return result;
}


// 手撕bind源码
Function.prototype.bind = function bind(context, ...params){
  const self = this;
  return function proxy(...args){
    // 把func执行并且改变this即可
    self.apply(context, params.concat(args))
  }
}
```

### 掌握this的几个好玩应用
