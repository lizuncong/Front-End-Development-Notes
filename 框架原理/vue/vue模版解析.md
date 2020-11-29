#### 先来看看with的用法
```js
var obj = {
  name: 'zhangsan',
  age: 20,
  getAddress: function(){
    console.log('beijing')
  }
}

// 如果不使用with
function f1(){
  console.log(obj.name)
  console.log(obj.age)
  obj.getAddress()
}

f1()

// 使用with
function f2(){
  with(obj){
    console.log('f2....')
    console.log(name)
    console.log(age)
    getAddress()
  }
}

f2()
```

vue的模版渲染，假设有这么一个模版：
```html
<div id="app">
    <p>{{ price }}</p>
</div>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
          price: 100
        }
    })
</script>
```

模版 `<div id="app"><p>{{ price }}</p></div>` 最终生成下面的js：
```js
with(this){
  return _c(
      'div',
      {
        attrs: { "id": "app" }
      },
      [
          _c('p', [_v(_s(price))])
      ]
  )
}
```


