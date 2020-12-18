#### 一道vue经典面试题：vue怎么实现响应式的
#### Object.defineProperty或多或少用过，但你真的了解这个方法是干嘛的吗？
#### 对象的属性类型有哪些？属性又有哪些特性？
#### 属性类型和数据类型，不是一回事的 
#### 你能想到多少种方法高效快捷易维护创建一组集合
```js
var person1 = {
    name: '111',
    age: 23,
    talk: function(){
        console.log(this.name + 'is' + this.age + 'years old')
    }
}
var person2 = {
    name: '222',
    age: 23,
    talk: function(){
        console.log(this.name + 'is' + this.age + 'years old')
    }
}
var person3 = {
    name: '333',
    age: 23,
    talk: function(){
        console.log(this.name + 'is' + this.age + 'years old')
    }
}
// .....
```
#### 面向对象的好处：1.节省代码量，易于维护 2.类型识别(怎么做到类型识别的) 3.节省内存(怎么做到节省内存的)
#### 什么是构造函数，构造函数和普通函数的区别，构造函数的执行机制。
#### 什么是原型，以及原型链
#### 什么是实例属性，什么是原型属性，为什么Object提供的方法中有些会带上 "own"，比如 Object.getOwnProperty
#### 创建对象的几种方法
#### 继承的几种方法
#### 为什么说函数是一种特殊的对象
```js
var sum = function(num1, num2){
        return num1 + num2;
};
var sum = new Function("num1", "num2", "return num1 + num2");
```
