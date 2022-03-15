### 正则表达式动态生成模式
```js
let keyword = 'abc'
let flag = new RegExp(keyword, 'i');
// 如果keyword为字符串abc，则flag: /abc/i
// 如果keyword包含特殊字符，比如
keyword = "(fda"
flag = new RegExp(keyword, 'i');
// 会直接报错。
// 因此需要将特殊字符转义一下

flag = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
```

