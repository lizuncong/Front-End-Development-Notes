#### 原生DOM操作 vs 通过框架封装操作


#### 虚拟DOM优点
1.减少dom操作     
虚拟dom可以将多次操作合并为一次操作，比如你添加1000个节点，却是一个接一个操作的。     
虚拟dom借助dom diff可以把多余的操作省掉，比如你添加1000个节点，其实只有10个是新增的     

2.跨平台     
虚拟dom不仅可以变成dom，还可以变成小程序、iOS应用、安卓应用，因为虚拟dom本质上只是一个js对象


#### 虚拟DOM长什么样子
1. React中
```js
const vNode = {
  key: null,
  ref: null,
  type: 'div',
  props: {
    children: [
        { type: 'span', ...},
        { type: 'span', ...},
    ],
    className: 'red',
    onClick: () => {}
  }
}
```

2. Vue中
```js
const vNode = {
  tag: 'div',
  data: {
    class: 'red',
    on: {
      click: () => {}
    }
  },
  children: [
      {tag: 'span', ...},
      {tag: 'span', ...},
  ]
}
```

#### 如何创建虚拟DOM
1. React.createElement      
2. Vue只能在render函数里得到
