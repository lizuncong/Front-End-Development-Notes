#### 概述
- Symbol是ES6引入的一种新的原始数据类型。它是JavaScript语言的第七种数据类型，前六种是：null，undefined，布尔值，字符串，数值，对象。         
- JS对象属性名现在可以有两种类型，一种是字符串，另一种是Symbol。可以说Symbol的引入也是为了解决对象属性名容易冲突的问题
- Symbol是基本类型值，不是对象
- 用途：可以用于定义私有方法
- Symbol(key)生成一个Symbol，Symbol.for(key)也可以生成一个Symbol，但是Symbol.for会在全局环境中注册这个symbol
#### 属性名的遍历
Symbol作为对象属性名，在遍历对象的时候，不会出现在for...in，for...of，Object.keys，
Object.getOwnPropertyNames()，JSON.stringify()等等之中。
