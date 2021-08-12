### 数组和对象的深拷贝及浅拷贝

#### 数组浅拷贝的几种方法
```js
const arr = [10, 20, [30, 40, [50, 60]], 70];

// 第一种方式
const newArr = [...arr];

// 第二种方式
const newArr1 = arr.concat([]);

// 第三种方式
const newArr2 = arr.slice();
```

#### 对象浅拷贝的几种方法
```js
const obj = {
  0: 'math',
  1: 'chinese',
  2: 'english',
  score: {
    math: 98,
    chinese: 100,
    english: 19,
  },
  reg: /\d+/img,
  time: new Date,
  friends: ['张三', '李四'],
  say: function (){
    console.log('what i say');
  },
  tag: Symbol('TAG'),
  [Symbol.toStringTag]: 'object'
}


// 第一种方式，这种方式包含了原始对象中 Symbol 属性
let newObj = {
  ...obj
}


// 第二种方式，这种方式包含了原始对象中 Symbol 属性
newObj = Object.assign({}, obj)


// 第三种方式，缺陷：[Symbol.toStringTag]这个key没有拷贝过来。因此for in不支持对Symbol属性的处理
newObj = {};
for(const key in obj){
  newObj[key] = obj[key];
}

// 第四种方式，Object.keys只能拿到非Symbol属性，可结合Object.getOwnPropertySymbols()一起使用
const keys = [
  ...Object.keys(obj),
  ...Object.getOwnPropertySymbols(obj)
]
newObj = {}
keys.forEach(k => {
  newObj[k] = obj[k]
})
```


#### 浅拷贝的实现
```js
let types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error', 'Symbol'];
const class2type = {};
const toString = class2type.toString;
types.forEach(name => {
  class2type[`[object ${name}]`] = name.toLowerCase();
})
// 获取数据类型的方法
function toType(obj){
  if(obj == null){
    // 检测null 或者 undefined
    return obj + "";
  }
  
  return typeof obj === 'object' || typeof obj === 'function' ?
    class2type[toString.call(obj)] || 'object' : typeof obj;
  
}
// 针对各种数据类型进行拷贝
function shallowClone(obj){
  const type = toType(obj); // typeof 识别不了数组类型
  const Construct = obj.constructor;
 
  // 对于Symbol或者bigint类型
  if(/^(symbol|bigint)$/i.test(type)){
    return Object(obj);
  }
  
  // 对于Error对象的处理
  if(/^error$/i.test(type)){
    return new Construct(obj.message)
  }
  
  // 对于函数的处理
  if(/^function$/i.test(type)){
    return function(){
      return obj.call(this, ...arguments)
    }
  }
  
  
  // 正则或日期的处理
  if(/^(regexp|date)$/i.test(type)){
    return new Construct(obj);
  }
  
  // 数组或者对象类型
  if(/^(object|array)$/i.test(type)){
    const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
    const result = new Construct;
    keys.forEach(k => {
      result[k] = obj[k]
    })
    return result;
  }
  
  return obj;
}
```

#### JSON.stringify
JSON.stringify也可以实现深拷贝，不支持函数，symbol类型的数据

#### 深拷贝的实现
深拷贝要注意循环引用的问题。比如
```js
const obj = {
  name: 'lzc',
  age: 20,
}
obj.info = {
  test: obj,
}
```
```js
// 为了解决循环引用的问题，使用cache缓存克隆过的属性
function deepClone(obj, cache = new Set()){
  const type = toType(obj);
  const Ctor = obj.constructor;
  if(!/^(object|array)$/i.test(type)){
    return shallowClone(obj);
  }
  if(cache.has(obj)) return obj;
  cache.add(obj)
  
  
  const keys = [
    ...Object.keys(obj),
    ...Object.getOwnPropertySymbols(obj)
  ]
  const result = new Ctor;
  keys.forEach(k => {
    result[k] = deepClone(obj[k], cache);
  })
  return result;
}
```
