## 链式调用及函数组合

实现一个 compose 函数，使得它能够链式调用，效果如下：

```js
compose(f1)(f2)(f3, f4)([1, 2, 3]) => f4(f3(f2(f1([1,2,3]))))
```

## 实现如下

```js
function compose(...fns) {
  let tasks = [...fns];
  const finalExe = (arg) => {
    let res = arg;
    tasks.forEach((task) => {
      res = task(res);
    });
    return res;
  };
  const next = (...args) => {
    const length = args.length;
    if (length === 1 && typeof args[0] === "object") {
      return finalExe(args[0]);
    } else {
      tasks = [...tasks, ...args];
      return next;
    }
  };
  return next;
}

function f1(args) {
  return args.map((a) => a * 1);
}

function f2(args) {
  return args.map((a) => a * 2);
}

function f3(args) {
  return args.map((a) => a * 3);
}

function f4(args) {
  return args.map((a) => a + 3);
}
// compose(f1, f2)([1, 2, 3]) => f2(f1([1,2,3]))
console.log(compose(f1)(f2)(f3, f4)([1, 2, 3]));
// compose(f1, f2)(f3, f4)([1, 2, 3])
```
