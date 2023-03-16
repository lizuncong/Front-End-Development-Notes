```js
Array.prototype.myMap = function () {
  var arr = this
  var [fn, thisValue] = Array.prototype.slice.call(arguments)
  var result = []
  for (var i = 0; i < arr.length; i++) {
    result.push(fn.call(thisValue, arr[i], i, arr))
  }
  return result
}
var arr0 = [1, 2, 3]
console.log(arr0.myMap(v => v + 1))
```
