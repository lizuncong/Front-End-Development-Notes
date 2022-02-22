### 箭头函数能new吗？
- new 箭头函数是会报错的
- 箭头函数没有this，没有arguments，没有原型
- 箭头函数是没有原型对象的，如果尝试获取箭头函数的prototype属性，会发现该属性为undefined
- 同时 new 操作符的过程中，是需要创建一个继承自函数原型的对象，同时绑定this，箭头函数既没有原型对象又没有this。

### new 操作符的过程
- 创建一个空的继承自原型(person.prototype)的JavaScript对象，即{}
- 将构造函数的作用域赋给新对象，因此this就指向了这个新对象
- 执行构造函数中的代码，为这个新对象添加属性
- 如果构造函数没有返回对象，则返回this。如果构造函数没有return或者return的值不是对象，
则返回this。如果构造函数有return一个对象，则将return 的对象做为new操作符的结果。
