#### 问题
先来看看下面几个问题，下面的输出结果是啥？？？
```js
// demo1.当构造函数没有返回值时
function Person(){
    this.name = 'This is Person'
}
let person = new Person();
console.log('person..', person);


// demo2.当构造函数返回一个对象时
function Student(){
    this.name = 'This is Student'
    return { testName: 'test' }
}
let student = new Student();
console.log('student..', student);


// demo3.当构造函数返回的不是一个对象时
function Teacher(){
    this.name = 'This is Teacher'
    return 'test'
}
let teacher = new Teacher();
console.log('teacher...', teacher);
```

#### new操作符创建对象的过程
构造函数也仅仅是个普通函数而已，如果需要使用构造函数创建对象，那么必须要使用new操作符。那么new操作符创建对象的过程是咋样的？？？？     

以new操作符创建对象实际上会经历以下四个步骤：     
>1.创建一个空的简单的JavaScript对象，即{}
2.将构造函数的作用域赋给新对象，因此this就指向了这个新对象
3.执行构造函数中的代码，为这个新对象添加属性
4.如果构造函数没有返回对象，则返回this。如果构造函数没有return或者return的值不是对象，
则返回this。如果构造函数有return一个对象，则将return 的对象做为new操作符的结果。

```js
function Person(){
    this.name = 'lzc'
}
let person = new Person();
```
当 `new `
