```js
Function.prototype.before = function before(callback){
  if(typeof callback !== 'function') throw new TypeError('callback must be function');
  
  const _self = this;
  
  return function proxy(...params){
    // this !== func 调用时候才知道
    // 控制callback和func本身的先后执行顺序
    callback.call(this, ...params)
    return _self.call(this, ...params)
  }
}

Function.prototype.after = function after(callback){
    if(typeof callback !== 'function') throw new TypeError('callback must be function');
    
    const _self = this;
    
    return function proxy(...params){
      const res = _self.call(this, ...params);
      callback.call(this, ...params);
      return res;
    }
}

const func = () => {
  // 主要的业务逻辑
  console.log('func....');
}

func.before(() => {
  console.log('===before===');
}).after(() => {
  console.log('===after===');
})()

```
