### 为什么使用typescript
- 是JavaScript的超级，增加了可选的静态类型和基于类的面向对象编程
- 支持ES6到ES10甚至是ES-NEXT的语法
- 程序更容易理解，比如函数的输入输出的参数类型
- 丰富的接口提示，编译期间能够发现大部分错误
- 同时也增加了学习成本和开发成本

### 示例demo
下面所有的例子都使用如下代码示例
```typescript
interface Foo {
    foo: string;
    name: string;
}
interface Bar {
    bar: string;
    name: string;
}
const foo: Foo = {
    foo: 'good',
    name: 'lzc'
}
```
### 数据类型
- 基础类型
    + 数字，字符串，布尔，null，undefined，object。一般用interface代替object，null和undefined用处不大
    + 新增的基础类型：any，void，unknown，never，枚举
        + void vs undefined。 void仅仅用于函数声明表示没有明确的返回值，undefined或者null用于变量声明。
        + unknown。所有类型值都可以赋值给unknown类型，但unknown类型只能给any或者unknown本身赋值。
        + never。用于声明函数返回类型，表示函数存在无法达到的终点。never只可以赋值给any类型，任何类型即使是any类型也不可以给never类型赋值。
        + 枚举。ts仅支持数字枚举与字符串枚举。数字枚举本身会向自增，字符串枚举不具备。
- 复合类型
    + 数组类型。数组中的元素类型相同，长度不固定。
    + 元组类型。元素类型不必相同，长度固定。
    + 接口类型。interface。
- 高级类型
    + 联合类型，使用|表示。如 name：string | undefined表示name要么是字符串要么是undefined
    + 交叉类型，使用&表示。如 const sayHello = (obj: Foo & Bar) => {}，表示obj必须**同时**包含Foo和Bar中的所有属性。
    + 联合 vs 交叉。联合可以联合任意类型，交叉类型只能用于接口类型。

### 关键字
- typeof。可以用来获取一个变量的类型。注意，变量指的是使用let，const，var，function定义的具有值的变量。使用type，interface定义的是类型，而不是变量。
- keyof。用来获取一个**类型**的所有key值，本质上是联合类型。和typeof相反，keyof后面只能是类型。比如 type K = keyof Foo，表示
type K = 'foo' | 'name'。当然还可以keyof number，keyof string，keyof number[]。
- in。in只用于约束对象的键值，in后面跟类型。目前看来，in只能用于联合类型以及枚举类型。比如：
```markdown
type Keys = 'a' | 'b' // 或者type Keys = 'a'
enum Direction {
    UP,
    DOWN
}
type Obj = {
    [p in Keys]: any // 约束Obj类型必须包含a和b属性，少一个多一个都不行
}
const o: Obj = { a: 1, b: 2} // o只能包含a和b两个属性
type Obj2 = {
    [p in Direction]: any; // Obj2只能包含0和1属性
}
```
