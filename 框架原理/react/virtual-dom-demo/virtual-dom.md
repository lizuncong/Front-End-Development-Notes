#### 需求场景
1.将下面的数据展示成一个表格。      
2.随便修改一个信息，表格也跟着修改      
3.demo可查看 `./index.html` 文件      
```js
let data = [
    {
        name: '张三',
        age: 20,
        address: '北京'
    },
    {
        name: '李四',
        age: 30,
        address: '上海'
    },
    {
        name: '王五',
        age: 23,
        address: '广州'
    }
]
```

#### DOM的问题
DOM操作是昂贵的！      
DOM操作是昂贵的！      
DOM操作是昂贵的！       
js运行效率高          
尽量减少DOM操作
```js
var div = document.createElement('div');

// 可以看出创建一个dom节点，属性非常多
console.dir(div)
```

#### 虚拟DOM核心API
虚拟DOM核心API有：h函数、patch函数
