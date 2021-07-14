### JS面向对象的目标
- 代码复用 
- 节省内存 
- 对象识别

#### 创建对象的几种方法
- 工厂模式
- 构造函数模式
- 原型模式
- 组合使用构造函数模式


#### 工厂模式
- 优点。解决了创建多个相似对象会产生大量重复代码的问题        
- 缺点。由于返回的对象实例都是Object，因此无法识别出对象属于哪个类型，即怎样知道一个对象的类型
```js
function createPerson(name, age){
  const o = new Object();
  o.name = name;
  o.age = age;
  o.sayName = function(){
    console.log('My name is :' + this.name)
  }
  return o;
}
```

#### 构造函数模式
- 优点。能识别出对象的类型
- 缺点。每个方法都要在每个实例上重新创建一遍，浪费节省内存
```js
function Person(name, age){
  this.name = name;
  this.age = age;
  this.sayName = function(){
    console.log('My name is：' + this.name)
  }
}
```
#### 原型模式
- 缺点。原型中所有属性是被很多实例共享的，这种共享对于函数和基本类型的值还算合适，对于包含引用类型值的属性来说，问题就比较突出   
```js
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.sayName = function(){
    alert(this.name);
};

```

#### 组合使用构造函数模式和原型模式
- 最常见的创建对象的方式
- 构造函数用于定义**实例**属性
- 原型模式用于定义方法和共享的属性    
```js
function Person(name){
    this.name = name; 
    this.friends = ["Shelby", "Court"];
}
Person.prototype = {
    constructor : Person,
    sayName : function(){
        alert(this.name);
    }
}
```

#### 寄生构造函数模式
这种模式和工厂模式创建对象的方法一摸一样，差别只在于工厂模式以函数调用的方式返回新对象，寄生构造函数模式使用new 操作符调用方法
```js
function Person(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.sayName = function(){
        alert(this.name);
    };
    return o; 
}
// 函数内部的逻辑和工厂模式相同，只是调用方式不同，但返回结果相同
var friend = new Person("Nicholas", 29, "Software Engineer");

```

#### 稳妥构造函数模式
>稳妥对象：指的是没有公共属性，而且其方法里面也没有引用this。

>稳妥构造函数模式和寄生构造函数模式相似，但有两点不同： 1.稳妥构造函数不使用new操作符调用构造函数。2.新创建的实例方法不引用this。

```js
function Person(name){
    var o = new Object();
    var age = 'lzc'; // 记住这里定义的是私有变量，不能使用o.age = 25
    
    o.sayName = function(){
        console.log(name)
    }
    
    return;
}
let person = Person('lori')
```

