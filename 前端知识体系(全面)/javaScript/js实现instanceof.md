```js
// 检测l的原型链（__proto__）上是否有r.prototype，若有返回true，否则false
function myInstanceof (l, r) {
  var R = r.prototype
  while (l.__proto__) {
    if (l.__proto__ === R) return true
    l = l.__proto__
  }
  return false
}
```
