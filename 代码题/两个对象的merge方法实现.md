### 实现两个对象的合并，即merge
如下两个对象的合并，一般在合并对象时，只对对象合并，数组直接替换
```js
const options = {
  url: '',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  data: null,
  arr: [10, 20, 30],
  config: {
    xhr: {
      async: true,
      cache: false,
    }
  }
}

const params = {
  url: 'http://www.baidu.com/api/',
  headers: {
    'X-Token': 'EF00134343434',
  },
  data: {
    lx: 1,
    from: 'weixin',
  },
  arr: [30,40],
  config: {
    xhr: {
      cache: true,
    }
  }
}
```
#### Object.assign
Object.assign基于浅比较实现的对象合并，比如Object.assign({}, options, params)。
params中的header，config会直接替换掉options中的header和config。

#### merge方法的实现
需要考虑的几种情况，这里用 A -> options中的key值， B -> params中的key值
- A&B都是原始值类型，B替换A即可
- A是对象 & B是原始值，抛出异常信息
- A是原始值 & B是对象，B替换A即可
- A & B都是对象，依次遍历 B 中的每一项，替换A中的内容。

params替换options
```js
// 是否为普通对象
function isObj(value){
  return toType(value) === 'object'
}
function merge(options, params = {}){
  const keys = Object.keys(params);
  keys.forEach(k => {
    const isA = isObj(options[k]);
    const isB = isObj(params[k]);
    
    if(isA && !isB) {
      throw new TypeError(`${key} in params must be object`);
    }
    
    if(isA && isB){
      options[k] = merge(options[k], params[k]);
      return;
    }
    
    options[k] = params[k]
    
  })
  
  return options;
}
```
