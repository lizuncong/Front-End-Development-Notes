### JS中三类循环对比及性能分析
- for循环及forEach底层原理
  + for循环是自己控制循环过程
  + 基于var声明的时候，for和while性能差不多，不确定循环次数的情况下使用while
  + 基于let声明的时候，for循环性能更好，原理：没有创造全局不释放的变量
- forEach循环性能比for及while循环都要差很多。
- for in循环性能比forEach差太多太多
  + 迭代当前对象中所有可枚举的属性，公有属性也有部分是可枚举的，查找机制上一定会找到原型链上去。
  + 遍历顺序以数字优先
  + 无法遍历Symbol属性
  + 可以遍历到公有中可枚举的
- for of循环
  + 部署了迭代器接口的数据结构才可以使用for of循环
```js
let arr = new Array(9999999).fill(0);

// 第一种方式，采用let定义计数器i，会发现for循环比while循环性能好
// for循环时间
console.time('FOR~~');
for(let i = 0; i < arr.length; i++){}
console.timeEnd('FOR~~');

// while循环时间
console.time('WHILE~~');
let i = 0;
while(i < arr.length){
  i++;
}
console.timeEnd('WHILE~~');

// 第二种方式，采用var定义计数器i，会发现for循环和while循环性能差不多
console.time('FOR~~');
for(var i = 0; i < arr.length; i++){}
console.timeEnd('FOR~~');

// while循环时间
console.time('WHILE~~');
var i = 0;
while(i < arr.length){
  i++;
}
console.timeEnd('WHILE~~');

// 第三种方式，forEach循环 92.4189453125
console.time('FOREACH~~');
arr.forEach(function (item){});
console.timeEnd('FOREACH~~');

// 第四种方式，for in循环
console.time('FOR IN~~');
for(let key in arr){}
console.timeEnd('FOR IN~~')

```


### for in循环的BUG及解决方案

### for of循环的底层机制
