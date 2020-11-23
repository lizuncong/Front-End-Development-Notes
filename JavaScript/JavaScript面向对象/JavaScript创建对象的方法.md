### 创建对象
创建对象可以直接使用 `let o = new Object(); o.name = 'lzc' ` 或者对象字面量的方式 `let o = { name: 'lzc' }`


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
****优点：解决了创建多个相似对象的问题      
缺点：没有解决对象识别的问题，即怎样知道一个对象的类型****


#### 构造函数模式
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
使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。实际上相当于下面这样：****
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
1)每个函数都有一个prototype属性，指向一个对象，这个对象自动获得constructor属性。这个对象包含可以由特定类型的所有实例共享的属性和方法。        
2)prototype就是通过调用构造函数而创建的那个对象实例的原型对象。     
3)使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。
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
1)只要创建了一个新函数，新函数就会自动获得prototype属性，该属性指向函数的原型对象      
2)函数的原型对象自动获得一个constructor，constructor指向该函数      
3)当调用构造函数创建一个新实例后，该实例的内部将包含一个指针__proto__指向构造函数的原型对象。
4)可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。当为对象实例添加一个属性时，
这个属性就会屏蔽原型对象中保存的同名属性

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
构造函数模式用于定义实例属性，原型模式用于定义方法和共享的属性
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
