#### 原型链
让原型对象等于另一个类型的实例

原型链最主要的问题来自包含引用类型值的原型


#### 组合继承
```js
function SuperType(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
  alert(this.name);
}

function SubType(name, age){
    //继承属性 
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType(); 
SubType.prototype.constructor = SubType; 
SubType.prototype.sayAge = function(){
    alert(this.age);
};
var instance1 = new SubType("Nicholas", 29);
```


#### 原型式继承
这就是Object.create方法的原理，基本和下面的实现一样
```js
function object(o){
  function F(){}
  F.prototype = o;
  return new F();
}
```

#### 寄生式继承
```js
function createAnother(original){
  var clone = object(original)
  clone.sayName = function (){
    
  }
  return clone
}
```
