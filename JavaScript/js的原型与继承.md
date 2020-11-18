js的继承和类的继承的差别
```js
function fn(){
    console.log('real..', this);
    var arr = [1,2,3]
    arr.map(function(item) {
       console.log('this..', this) 
       console.log('item..', item)
       return item + 1
    })
}

fn.call({ a: 100 })

const a = {
    name: 'lzc',
    print: function(){
        console.log(this.name)
    }
}
a.print()
```
