Promise.all的用法基本都用过了。先来看一个简单的demo：

```jsx
const p1 = new Promise((resolve, reject) => {
  resolve('p1....success');
});
const p2 = new Promise((resolve, reject) => {
  resolve('p2.....success');
});
const p3 = new Promise((resolve, reject) => {
  resolve('p3....success');
});
const p4 = new Promise((resolve, reject) => {
  resolve('p4.....success');
});

Promise.all([p1, p2, p3, p4]).then((res) => {
  console.log('allP...sucess...', res);
}).catch((error) => {
  console.log('allP...error...', error);
});
```

执行这段程序，可以看到控制台输出:
```
allP...sucess...  ["p1....success", "p2.....success", "p3....success", "p4.....success"]
```
因为p1, p2, p3, p4都是成功的，都调用了resolve。

如果改一下，p2执行reject错误，如下：
```jsx
    const p1 = new Promise((resolve, reject) => {
      resolve('p1....success');
    });
    const p2 = new Promise((resolve, reject) => {
      // resolve('p2.....success');
      reject('p2....reject');
    });
    const p3 = new Promise((resolve, reject) => {
      resolve('p3....success');
    });
    const p4 = new Promise((resolve, reject) => {
      resolve('p4.....success');
    });

    Promise.all([p1, p2, p3, p4]).then((res) => {
      console.log('allP...sucess...', res);
    }).catch((error) => {
      console.log('allP...error...', error);
    });
```
可见p2执行失败。即使剩下的p1，p3，p4都执行成功了，Promise.all还是执行了catch语句，控制台输出:
```jsx
allP...error... p2....reject
```

那么问题来了，如果我们希望任何一个promise执行失败都不会影响到其他promise正确的返回结果，应该咋做？
可以给每个promise设置catch捕获异常，比如：
```jsx
const p1 = new Promise((resolve, reject) => {
  console.log(1 + a); // 异常 a未定义
  resolve('p1....success');
}).catch((error) => {
  console.log('p1...catch', error);
});

const p2 = new Promise((resolve, reject) => {
  // resolve('p2.....success');
  reject('p2....reject');
}).catch((error) => { console.log('p2...catch', error); });

const p3 = new Promise((resolve, reject) => {
  resolve('p3....success');
}).catch((error) => {
  console.log('p3...catch', error);
});

const p4 = new Promise((resolve, reject) => {
  resolve('p4.....success');
}).catch((error) => {
  console.log('p4...catch', error);
});

Promise.all([p1, p2, p3, p4]).then((res) => {
  console.log('allP...sucess...', res);
}).catch((error) => {
  console.log('allP...error...', error);
});
```

控制台输出：
```jsx
p1...catch ReferenceError: a is not defined
    at eval (index.jsx?fa9c:12)
    at new Promise (<anonymous>)
    at Index.componentDidMount (index.jsx?fa9c:11)
    at commitLifeCycles (react-dom.development.js?61bb:19814)
    at commitLayoutEffects (react-dom.development.js?61bb:22803)
    at HTMLUnknownElement.callCallback (react-dom.development.js?61bb:188)
    at Object.invokeGuardedCallbackDev (react-dom.development.js?61bb:237)
    at invokeGuardedCallback (react-dom.development.js?61bb:292)
    at commitRootImpl (react-dom.development.js?61bb:22541)
    at unstable_runWithPriority (scheduler.development.js?3069:653)
p2...catch p2....reject
allP...sucess... [undefined, undefined, "p3....success", "p4.....success"]
```

可以看出，p1和p2的catch语句执行了，最后Promise.all的then语句执行了，Promise.all的catch语句未执行。
但是从Promise.all的then语句输出中可以看出，p1，p2因为异常，返回的结果为undefined，p3和p4返回结果正常，这样其实
也不利于我们在Promise.all的then返回中处理错误信息。

换种写法：
```jsx
const p1 = new Promise((resolve, reject) => {
  console.log(1 + a); // 异常 a未定义
  resolve('p1....success');
});

const p2 = new Promise((resolve, reject) => {
  // resolve('p2.....success');
  reject('p2....reject');
});

const p3 = new Promise((resolve, reject) => {
  resolve('p3....success');
});

const p4 = new Promise((resolve, reject) => {
  resolve('p4.....success');
});

const promiseArray = [p1, p2, p3, p4].map((p) => new Promise((resolve) => {
  p.then(resolve).catch(resolve);
}));

Promise.all(promiseArray).then((res) => {
  console.log('allP...sucess...', res);
}).catch((error) => {
  console.log('allP...error...', error);
});
```

查看控制台输出：
```jsx
allP...sucess... 
[
 ReferenceError: a is not defined at eval (webpack-internal:///./src/pages/demo/index.jsx:97:25)…,
 "p2....reject", 
 "p3....success", 
 "p4.....success"
]
```
可以看出，不管是程序异常如p1变量未定义程序自动抛出异常，还是p2的reject，都能在Promise.all的then中拿到结果，也不会影响其他的p3，
p4的正常执行。
