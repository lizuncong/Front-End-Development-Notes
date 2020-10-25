在平时的业务开发过程中经常会用到枚举，但是ES6又没有枚举类型。有一段时间我曾经使用对象创建一个伪枚举。

比如定义一个订单状态相关的枚举：

```jsx
const STATUS = {
   ALL: { label: '未定义', value: 0},
   UP: { label: '已上架', value: 1},
   DOWN: { label: '已下架', value: 2},
}
```

如果后端返回一个value值，然后需要前端显示相应的label。比如返回1，前端显示 `已上架`。这个时候关键是要根据给定的

value找出对应的label。比如写个工具方法：

```jsx
const getLabel = (value, enumObj) => {
    const findItem = Object.values(enumObj).find(item => item.value === value)
    return findItem ? findItem.label : ''
}
```

此时就可以通过 

```jsx
    getLabel(1, STATUS)
```

找出对应的label。如果存在，就返回label。如果value 不存在，就返回空的。

可以看出这种写法比较繁琐而且不好维护，也不够优雅。因为用到枚举的地方都需要引入 `getLabel` 方法。


# 使用class实现一个简单的枚举

```jsx
class CEnum {
  constructor(enumObj) {
    Object.keys(enumObj).forEach((key) => {
      const op = enumObj[key];
      this[key] = op;
      if (op.value !== undefined) {
        this[op.value] = op;
      }
    });
    this.list = Object.values(enumObj);
  }

  getLabel(value) {
    const op = this[value] || { label: '' };
    return op.label;
  }

  get(value, key) {
    if (key === 'label') {
      return this.getLabel(value);
    }
    const op = this[value] || {};
    if (key === undefined) {
      return op;
    }
    return op[key] || '';
  }
}
```

这里需要注意一点，不要使用 `Enum` 关键字，以免后面 `ES6` 内置了枚举后产生冲突。因此这里我加了一个 'C' (Custom) 前缀。

使用的方法也很简单：

```jsx
const STATUS = new CEnum({
   ALL: { label: '未定义', value: 0},
   UP: { label: '已上架', value: 1},
   DOWN: { label: '已下架', value: 2},
})

STATUS.UP.label; // 已上架
STATUS.UP.value; // 1
const value = 1;
STATUS[value].label; // 已上架。根据value取出对应的label。
STATUS.getLabel(value); // 也可以通过getLabel方法获取
STATUS.get(value, 'label'); // 也可以通过get方法获取。get方法用途非常广泛。

// 假如有如下需求，不同状态显示不同颜色。
const STATUS = new CEnum({
   ALL: { label: '未定义', value: 0, color: 'red'},
   UP: { label: '已上架', value: 1, color: 'yellow'},
   DOWN: { label: '已下架', value: 2, color: 'blue'},
})

// 如果需要根据value取出color，则可以使用
STATUS.get(value, 'color');
// 如果不传key，则取出的是整个对象
STATUS.get(value); // { label: '已上架', value: 1, color: 'yellow'}
STATUS.list // [{ label: '未定义', value: 0, color: 'red'}, { label: '已上架', value: 1, color: 'yellow'},{ label: '已下架', value: 2, color: 'blue'}ß]
```

这种使用方法相对来说简单点，也优雅。弊端就是如果 `STATUS.UP` 这样访问 `UP`。IDE没有代码补全。


> 期待更加优雅的JS枚举写法.....
