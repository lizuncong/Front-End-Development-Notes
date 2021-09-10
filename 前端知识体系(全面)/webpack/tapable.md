```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Mini React</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script></script>
  <style>

  </style>
</head>
<body>
  test
</body>
<script>
  class SyncHook {
    constructor(args){
        this.tasks = [];
        this._args = args;
    }
    tap(name, task){
        this.tasks.push(task)
    }

    // 直接遍历注册的hooks，然后调用，代码简洁，易于理解
    callDirectly(...args){
        this.tasks.forEach(task => task(...args))
    }

    // createCall动态创建方法，创建的目的，举个例子，加入我们调用new SyncHook(['name', 'age', 'address'])，在初始化hook的时候，
    // 参数个数已经是明确的了，那么我们调用的时候就可以根据单态特征创建一个类似的调用函数：
    // finalCall(name, age, addre){
    //   callback1(name, age, address);
    //   callback2(name, age, address);
    //   callback3(name, age, address);
    //   ....
    //   callbackn(name, age, address);
    // }
    // 其中callback是调用myHook.tap注册的回调函数。在webpack中，这种回调函数数量巨大，而且执行具有单态特征，并且每个
    // callback执行的逻辑不一样
    createCall(){
      let code = '';
      const params = this._args.join(',');
      for(let i = 0; i < this.tasks.length; i++){
        code += `
          var callback${i} = this.tasks[${i}];
          callback${i}(${params})
        `
      }
      return new Function(params, code)
    }
    callByFunction(...args){
      const finalCall = this.createCall();
      // console.log(finalCall)
      return finalCall.apply(this, args)
    }
  }

  const myHook = new SyncHook(['name', 'age']) // 数组里表示接收的参数，数量不限，比如可以是const myHook = new SyncHook(['name', 'age', 'address'])

  // 注册钩子
  for(let i = 0; i < 1000; i++){
    myHook.tap(`callback-${i}`, function(name, age){
        const str = `my name is ${name}, age is ${age}`
    })
  }


  console.time();
  myHook.callDirectly('mike', 26)
  console.timeEnd();


  console.time();
  myHook.callByFunction('mike', 26)
  console.timeEnd();
  var sum = new Function(['a', 'b'].join(','), 'return a + b');

</script>
</html>

```
