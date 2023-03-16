#### 问题
1.instanceof干嘛的？？？instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。        
2.实现继承的6种方法：原型链继承、借用构造函数、组合继承(前面两种方式的组合)、原型式继承、
寄生式继承、寄生组合式继承？都能手写出来吗？？？        
3.Object.create原理是啥，和哪种继承方式类似？

#### JavaScript的继承
JavaScript的继承主要是依靠原型链实现的。

基本思想：利用原型，让一个引用类型继承另一个引用类型的属性和方法。


#### 原型链继承
```js
function SuperType(){
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){
    return this.property;
}

function SubType(){
    this.subproperty = false;
}

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function(){
    return this.subproperty;
}
```

原型链的问题：        
1.原型如果包含引用类型的值，则由子类的所有实例共享        
2.在创建子类型的实例时，不能向超类型的构造函数中传递参数

#### 借用构造函数
基本思想：在子类型构造函数的内部调用父类型的构造函数
```js
function SuperType(name){
    this.name = name;
    this.colors = ['red', 'green']
    this.sayName = function(){
        console.log('my name is：', this.name);
    }
}

function SubType(name){
    SuperType.call(this, name);
    this.subName = 'li';
}

const subtype = new SubType('lzc');
```
主要问题：方法都是在构造函数中定义的，函数不能复用

#### 组合继承(最常用的继承方式)
基本思想：使用原型链实现对原型属性和原型方法的继承，而通过借用构造函数实现对实例属性的继承。

缺点：这种方式SuperType会执行两次，而且SubType.prototype都包含了SuperType构造函数定义的属性
```js
function SuperType(name){
    this.name = name;
    this.colors = ['red', 'yellow']
}
SuperType.prototype.sayName = function(){
    console.log('my name is：', this.name)
}
const supertype = new SuperType();

function SubType(name){
    SuperType.call(this, name);
    this.age = 26;
}
SubType.prototype = supertype
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log('I am ' + this.age + 'years old')
}

const subtype = new SubType('lzc')
```


#### 原型式继承
和Object.create方法的实现几乎一样
```js
function create(o){
    function F(){}
    F.prototype = o;
    return new F();
}
const person = {
    name: 'lzc',
    friends: ['mike', 'sarah']
}

let p2 = create(person);

//Object.create方法
Object.create(person, {
    name: {
        value: 'ohuo',
        writable: false,
    }
})

// Object.create方法第二个参数和Object.defineProperties()方法第二个参数相同
```

#### 寄生式继承
增强版的原型式继承
```js
function create(o){
    function F(){};
    F.prototype = o;
    const f = new F();
    f.sayName = function(){
        console.log('my name is：', this.name);
    }
    return f;
}

let person = {
    name: 'lzc',
    friends: ['mike', 'sarah']
}
let person2 = create(person);
```

#### 寄生组合式继承
寄生组合式继承，其核心思想是通过借用构造函数来继承属性，通过原型链的混成形式来继承方法。

这个好处就在于只调用了一次SuperType的构造函数(组合继承调用了两次)。并且因此避免了在SubType.prototype上面创建不必要，多余的属性(组合继承，
SubType.prototype上面都包含了SuperType构造函数里面定义的属性)。

先来看看组合式继承
```js
function SuperType(name){
    this.name = name;
    this.colors = ['red', 'yellow']
}
SuperType.prototype.sayName = function(){
    console.log('my name is：', this.name)
}

function SubType(name){
    SuperType.call(this, name);
    this.age = 26;
}
SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log('I am ' + this.age + 'years old')
}

const subtype = new SubType('lzc')

// 在组合式继承中SubType.prototype = new SuperType()使得SuperType构造函数执行了两次，并且SubType.prototype中包含了SuperType
// 构造函数中定义的属性，这些属性是冗余的，如果我们只想SubType.prototype继承Super.prototype的原型方法，而不需要SuperType的属性，该怎么做？？
function F(){};
F.prototype = SuperType.prototype;
SubType.prototype = new F();
SubType.prototype.constructor = SubType;
```

```js
function inheritPrototype(subType, superType){
    function F(){};
    F.prototype = superType.prototype;
    subType.prototype = new F();
    subType.prototype.constructor = subType;
}

function SuperType(name){
    this.name = name
}
SuperType.prototype.sayName = function(){
    console.log('my name is：', this.name)
}

function SubType(name, age){
    SubType.call(this, name)
    this.age = age;
}

// 至此，属性已经通过借用构造函数实现了。那么方法该怎么继承？

// 尝试-01，能不能直接将SubType.prototype = SuperType.prototype ?。答案是必不可能的，这样SubType.prototype
// 和SuperType.prototype就是同一个对象，SubType.prototype和SuperType.prototype就不存在原型链了。别忘了原型链是通过__proto__实现的。

// 怎么让SubType.prototype.__proto__ = SuperType.prototype？

// 需要一个对象，比如 let o = { constructor: SubType, __proto__: SuperType.prototype}，然后将o赋给SubType.prototype

// 这才有了寄生组合式继承
inheritPrototype(SubType, SuperType)
SubType.prototype.sayAge = function(){
    console.log('my age is：', this.age)
}

```
