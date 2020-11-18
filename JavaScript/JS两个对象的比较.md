JS中关于两个对象的比较方法：

1. JSON.stringify，比如：
```jsx
const a = {
  name: 'mike',
  info: {
    address: 'guangzhou',
    phone: '121212',
  },
};
const b = {
  name: 'mike',
  info: {
    address: 'guangzhou',
    phone: '121212',
  },
};

console.log('a === b', JSON.stringify(a) === JSON.stringify(b));
```
这种方法是最简单的。。。。

2. 傻一点的方法，就是遍历两个对象的属性。这种方法比较蠢，如果对象嵌套层级太深，并且
属性包含数组，对象等，复杂度就增加了
