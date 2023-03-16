react setState中运用到的一种思想

```js
function perform(anyMethod, wrappers){
  return function(){
      wrappers.forEach(wrapper => wrapper.initialize())
      anyMethod();
      wrappers.forEach(wrapper => wrapper.close())
  }
}

let newFn = perform(function(){
  console.log('print')
}, [
    {
      initialize(){
        console.log('wrapper1 initialize')
      },
      close(){
        console.log('wrapper1 close')
      }
    },
    {
      initialize () {
        console.log('wrapper2 initialize')
      },
      close(){
        console.log('wrapper2 close')
      }
    }
])

newFn()
```
