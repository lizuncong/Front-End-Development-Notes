#### class和普通构造函数的区别
JS构造函数
```js
function MathFunc(x, y){
    this.x = x;
    this.y = y;
}

MathFunc.prototype.add = function() {
    return this.x + this.y;
}

var myFunc = new MathFunc(1,2)
console.log(myFunc.add())
```

class基本语法
```js
class MathCls {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    add(){
        return this.x + this.y
    }
}

const myCls = new MathCls(1,3);
console.log(myCls.add())
```

class其实就是function的语法糖
```js
console.log(typeof MathFunc) // 'function'
console.log(MathFunc.prototype.constructor === MathFunc); // true
console.log(myFunc.__proto__ === MathHandle.prototype) // true

console.log(typeof MathCls) // 'function'
console.log(MathCls.prototype.constructor === MathCls); // true
console.log(myCls.__proto__ === MathCls.prototype) // true
```

class和js构造函数的差别    
class在语法上更加贴合面向对象的写法    
class实现继承更加易读、易理解    
本质上还是语法糖，使用prototype


