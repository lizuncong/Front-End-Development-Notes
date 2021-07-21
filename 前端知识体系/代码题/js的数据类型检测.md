### Javascript数据类型检测的方法
- typeof
  + 直接在计算机底层基于数据类型的值(二进制)进行检测
  + typeof null "object"
  + typeof 普通对象/数组对象/正则对象/日期对象 "object"
  + type 区分不了普通对象，数组对象，正则对象这些。
- instanceof
  + 底层机制：只要当前类出现在实例的原型链上，结果都是true
  + 检测当前实例是否属于这个类的，可以弥补type检测对象的不足
  + 基本数据类型检测不了，比如数字，字符串等。
  + 由于可以修改原型的指向，所以检测出来的结果是不准的。
```js
// instance_of实现原理
function instance_of(instance, classFunc){
  const classFuncPrototype = classFunc.prototype;
  let proto = Object.getPrototypeOf(instance);
  while(proto){
    if(proto === classFunc.prototype){
      return true
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```
  
- constructor
  + 可以用于检测基本数据类型。`let n = 1; n.constructor === Number`
  + constructor可以随便修改
- Object.prototype.toString.call([value])
  + 标准检测数据类型的办法: Object.prototype.toString不是转换为字符串，是返回当前实例所属类的信息
  + 返回："[object Number/String/Boolean/Null/Undefined/Symbol/Object/Array/RegExp/Date/Function]"
```js
let obj = {
  name: 'lzc',
}
obj.toString(); // "[object Object]"
// obj.toString()方法执行，this是obj，所以检测是obj它的所属类信息
// 推测：是不是只要把Object.prototype.toString执行，让它里面的this变为要检测的值，那就能返回当前值
// 所属类的信息
```

### 实现数据类型检测方法的封装
```js
let types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'];
const class2type = {};
const toString = class2type.toString;
types.forEach(name => {
  class2type[`[object ${name}]`] = name.toLowerCase();
})

function toType(obj){
  if(obj == null){
    // 检测null 或者 undefined
    return obj + "";
  }
  
  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[toString.call(obj)] || 'object' : typeof obj;
  
}
```
  
