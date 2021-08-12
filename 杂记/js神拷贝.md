#### JSON.stringify
如果属性的值是函数、null、undefined或者正则表达式，JSON.stringify会过滤掉这些属性。。。

#### 递归实现
```js
function deepClone(obj){
  if(obj == null) return obj;
  if(obj instanceof Date) return new Date(obj);
  if(obj instanceof RegExp) return new RegExp(obj);
  if(typeof obj !== 'object') return obj;
  // 剩下的要么是数组，要么是对象
  let cloneObj = new obj.constructor;
  
  for(let key in obj){
    // 只拷贝实例属性，不拷贝原型属性
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key])
    }
  }
  return cloneObj;
}

let obj = { school: { name: 'lzc', age: 12 }, address: 'aaa' }
deepClone(obj);

// 循环引用
obj.test = obj
deepClone(obj) // 此时死循环。。。。

// 未解决循环引用的问题，可以使用weakMap
function deepClone(obj, hash = new WeakMap()){
  if(obj == null) return obj;
  if(obj instanceof Date) return new Date(obj);
  if(obj instanceof RegExp) return new RegExp(obj);
  if(typeof obj !== 'object') return obj;
  // 剩下的要么是数组，要么是对象
  // 如果拷贝的对象是存在的，直接从WeakMap中返回即可。
  if(hash.has(obj)){
    return hash.get(obj)
  }
  let cloneObj = new obj.constructor;
  hash.set(obj, cloneObj)
  for(let key in obj){
    // 只拷贝实例属性，不拷贝原型属性
    if(obj.hasOwnProperty(key)){
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }
  return cloneObj;
}

// 深拷贝如果遇到递归爆栈怎么解决。
```
