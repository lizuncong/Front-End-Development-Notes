#### 问题
1.什么是实例属性？什么是原型属性？区分好实例属性和原型属性，是理解原型对象的关键！！！怎么判断一个属性是在实例中，还是在原型中？      
2.构造函数和实例是否有直接关系？？instanceof干嘛的？？       
3.构造函数和原型对象有什么关系？？      
4.实例和原型对象有什么关系？？？？__proto__是什么???       
5.in操作符？？？ in可以单独使用，也可以使用for..in..。既可以访问实例中的属性，也可以访问原型中的属性       
6.Object.keys只能访问实例中的属性       
7.原型对象的问题是啥？原型对象的最大问题就是由其共享的本性所导致的。         
8.Object.getPrototypeOf, hasOwnProperty          
8.JavaScript创建对象的方法有哪些？？？工厂模式、构造函数模式、原型模式、组合使用构造函数模式和原型模式、
寄生构造函数模式是什么鬼？？什么是稳妥？？稳妥构造函数模式又是个什么玩意？？？      
其实工厂模式，寄生构造函数模式，稳妥构造函数模式代码逻辑相似，可以细细品味。       
工厂模式和稳妥构造函数模式都不需要用new创建对象，寄生构造函数模式需要使用new创建对象。       
工厂模式和寄生构造函数模式创建的对象里面的方法都可以引用this，稳妥构造函数模式不能引用this

#### 创建对象
我觉得创建对象，应该以减少代码冗余，节省内存为目的。我们常见的创建对象的方式：      
```js
let o = new Object(); 
o.name = 'lzc'; 
o.sayName = function(){
    console.log('My name is：' + this.name)
}
// 或者对象字面量的方式创建：
let o = { 
    name: 'lzc',
    sayName: function(){
        console.log('My name is：' + this.name);
    }
}
```
这两种方式创建对象很简单，但是会产生大量的重复代码。如果我们需要再创建一个包含一样属性的对象，那么就需要重复写一次这些代码。


#### 工厂模式
```js
function createPerson(name, age, job){
  const o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function(){
    console.log('My name is :' + this.name)
  }
  return o;
}

var person1 = createPerson('lzc', 26, '程序员')
```
优点：解决了创建多个相似对象会产生大量重复代码的问题        
缺点：由于返回的对象实例都是Object，因此无法识别出对象属于哪个类型，即怎样知道一个对象的类型


#### 构造函数模式
对象的constructor属性最初是用来标识对象类型的。可以通过person instanceof Person来判断
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function(){
    console.log('My name is：' + this.name)
  }
}

let person1 = new Person('lzc', 26, '程序员')
let person2 = new Person('lzc2', 27, '送外卖')
// person1有一个constructor(构造函数)属性，该属性指向Person
person1.constructor === Person
```

要创建Person的新实例，必须使用new操作符。以这种方式调用构造函数实际上会经历以下4个步骤：      
1.创建一个新对象      
2.将构造函数的作用域赋给新对象(因此this就指向了这个新对象)      
3.执行构造函数中的代码(为这个新对象添加属性)      
4.返回新对象       

****构造函数的问题      
使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。我们的目的就是让所有实例共享一个方法，节省内存。实际上相当于下面这样：****
```js
function Person(name, age, job){
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = new Function("alert(this.name)"); // 与声明函数在逻辑上是等价的，每创建一个对象，就重新创建了一个方法的实例 
}

// 或许可以改成下面这样，这样创建的所有对象就可以共享一个方法的实例
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
// 也有缺点，这个sayName不能单独调用
function sayName(){
    alert(this.name);
}
```


#### 原型模式
1)每个函数都有一个prototype属性，这个属性指向的是函数的原型对象        
2)原型对象有个constructor属性，这个属性又指向函数。      
3)原型对象包含的属性和方法可以由所有对象实例共享。        
```js
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};
var person1 = new Person();
person1.sayName();   //"Nicholas"
var person2 = new Person();
person2.sayName(); //"Nicholas"
alert(person1.sayName === person2.sayName);  //true

Person.prototype.constructor === Person
```

##### 理解原型对象
1)只要创建了一个新函数，新函数就会自动获得prototype属性，该属性指向函数的原型对象。函数的原型对象是Object的实例      
2)函数的原型对象自动获得一个constructor，constructor指向该函数      
3)当调用构造函数创建一个新实例后，该实例的内部将包含一个指针__proto__指向构造函数的原型对象。
4)可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。当为对象实例添加一个属性时，
这个属性就会屏蔽原型对象中保存的同名属性        
5)当查找对象的属性时，比如person.name，会沿着__proto__指针继续查找原型对象知道找到属性为止
6)控制台打印测试
```js
// demo-01 Object是个啥
console.log(Object); // 会发现打印出来的Object是个函数

//demo-02 Object.prototype又是个啥
console.log(Object.prototype); // 会发现打印出来的是个对象
//{
//    constructor: f Object()
//    hasOwnProperty: f hasOwnProperty()
//    isPrototypeOf: f isPrototypeOf()
//    propertyIsEnumerable: f propertyIsEnumerable()
//    toLocaleString: f toLocaleString()
//    toString: f toString()
//    valueOf: f valueOf()
//}
// 可以发现Object.prototype有个constructor属性指向Object函数

// demo-03 new Object()是个啥
console.log(new Object()); // 打印出来的是个空对象，空对象里面有个__proto__属性，指向Object函数的原型对象

// demo-04 函数的原型对象
function Person() {} // 首先创建一个简单的Person函数
console.log(Person) // 打印出来的还是函数本身
console.log(Person.prototype)// Person.prototype是个Object对象实例，包含一个constructor属性，及一个__proto__属性指向Object.prototype
```
```js
function Person(){
}
Person.prototype = {
    name : "Nicholas",
    age : 29,
    job: "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};

// Person.prototype对象的constructor不再指向Person。而是指向新对象的constructor属性（即指向Object构造函数）
```

****原型对象的问题：原型中所有属性是被很多实例共享的，这种共享对于函数非常合适，对于那么包含基本值的属性也还好，
对于包含引用类型值的属性来说，问题就比较突出****

#### 组合使用构造函数模式和原型模式
这种创建自定义类型的最常见方式。      
****构造函数模式用于定义实例属性，原型模式用于定义方法和共享的属性，如果原型模式定义共享的属性，建议使用Object.defineProperty
将该属性定义为不可修改不可删除的****
```js
function Person(name, age, job){
    this.name = name; 
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}
Person.prototype = {
    constructor : Person,
    sayName : function(){
        alert(this.name);
    }
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

#### 寄生构造函数模式
???这种模式和工厂模式创建对象的方法一摸一样，差别只在于工厂模式以函数调用的方式返回新对象，寄生构造函数模式使用new 操作符调用方法
```js
function Person(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
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
```




#### 关于原型的最后总结
1.Object.prototype是所有类型(包括Object，以及自定义的构造函数如function Person(){})的对象实例的根。       
2.所有类型对象实例都有一个__proto__属性指向该类型的原型对象，比如 let o = new Object()。
则o必定包含一个__proto__属性指向Object的原型对象Object.prototype。除非手动改变了o.__proto__ = null，此时o的原型就无法识别了。       
3.实例和构造函数之间没有直接的关系，new 构造函数的过程只不过是创建一个新对象的过程。
实例和构造函数的原型对象之间通过__proto__联系起来。       
4.那么问题来了，原型对象和构造函数之间总要有个联系吧？不然怎么知道这个原型对象是哪个构造函数的，因此
原型对象就包含了constructor属性指向了构造函数。       
5.重写实例的属性(包括基本值和对象)，比如person.name = '666'; person.tempArr = [1,2,3]，这种重新赋值的写法，不会覆盖原型中的同名属性。
也不会给原型新增了name和tempArr属性。你想想，假设有个实例，let o = new Object();
如果o.myName = '666'能够直接覆盖了Object.prototype中的myName属性值或者直接给Object.prototype添加属性，那Object.prototype就会很乱。。。
我们平时开发中给实例添加属性的写法就都会写到了Object.prototype上面去了。        
****使用Object.hasOwnProperty()可以判断一个属性是存在于实例中，还是存在与原型对象中****
```js
let o = new Object();
o.myName = 'lzc'; // 此时myName存在与实例o中，而不是原型Object.prototype中
```         
6.但是，实例可以修改原型对象的引用属性。比如 
```js
function Person(){}
Person.prototype.tempArr = [1,2,3]
let person1 = new Person();
let person2 = new Person();
person1.tempArr.push(4)
console.log(person1.tempArr); // [1,2,3,4]
console.log(person2.tempArr); // [1,2,3,4]

person1.tempArr = [4,5]; // 重写的是person1实例的属性，不会影响到原型对象，此时tempArr存在于对象的实例中。
console.log(person1.tempArr); // [4,5]
console.log(person2.tempArr); // [1,2,3,4]
```

7.要我说原型链，其实就是以下的过程
```js
function Person() {}
let person = new Person();

//person.__proto__  -->  Person.prototype，Person.prototype.__proto__   -->  Object.prototype
// Object.prototype是没有__proto__属性的，因为它就是所有实例的根。

```
