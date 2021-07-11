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
        + any可以接收任何类型，包括never和unknown
        + void vs undefined。 void仅仅用于函数声明表示没有明确的返回值，undefined或者null用于变量声明。
        + unknown。所有类型值都可以赋值给unknown类型，unknown类型的值只能接收unknown或者any类型
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
- infer。用于条件类型语句中，可以用infer声明一个类型变量并且对它进行引用，简单理解就是占位用的。
- type。用于定义类型别名。
- extends。继承。可以应用于约束泛型
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

### 类型保护
通俗点理解，类型保护就是判断类型，确保调用该类型上存在的函数或者属性
- 类型断言：其实就是显示转换
  + (<string>someValue).length
  + as语法。
- 类型保护
  + typeof
  + instanceof
  + in

### 函数重载
函数重载是指函数名称相同，参数数量或者类型不同

### 接口的继承
- interface Foo extends Bar{}，表示Foo类型必须包含Bar中的属性
- class Clock implements ClockInterface {}，表示Clock必须包含ClickInterface定义的属性

### 构造函数类型
```typescript
interface IClass {
  new(hour: number, minute: number);
}
let test2: IClass = class {
  constructor(x: number, y: number){}
}
```

### 类的继承
- 通过extends实现
- 修饰符。private只在本类可见，protected本类和子类都可以使用，public都可以使用。
- 抽象类abstract。可以定义一些类的公共属性、公共方法，让继承的子类去实现，也可以自己实现
  + 抽象类不能直接实例化
  + 抽象类中的抽象属性和抽象方法，必须被子类实现
  
### 泛型
泛型是允许同一个函数接受不同类型参数的一种模版，可以用于创建可复用的组件。
泛型可以用于函数，接口，类中

- 泛型约束
  + 确保属性存在
```typescript
interface Length{
  length: number
}
function log<T extends Length>(arg: T): T{
  console.log(arg.length)
  return arg
}
```

  + 检查对象上的键是否存在
```typescript
function getProperty<T, K extends keyof T>(obj: T, k: K): T[K]{
  return obj[k]
}
```

### 泛型工具类型
- ReadOnly，将T中的类型都变为只读。
```typescript
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K]
}
interface IPoint{
  x: number;
  y: number;
}
const start: ReadOnly<IPoint> = { // start中的属性都变成了只读属性
  x: 0,
  y: 0
}
```

- Partial，将T中的类型都变为可选
```typescript
type Partial<T> = {
  [K in keyof T]?: T[K]
}
interface Point{
  x: number;
  y: number;
}

const p: Partial<Point> = {
  x: 4
}
```

- Record<K, T>，将 K 中所有的属性的值转化为 T 类型
```typescript
interface PageInfo{
  title: string
}
type Page = 'home' | 'about' | 'contact'

const x: Record<Page, PageInfo> = {
  about: { title: 'about'},
  home: { title: 'home' },
  contact: { title: 'contact' }
}
```

- Pick<T, K>，将T类型中的所有属于K类型的子属性挑出来。
```typescript
type Pick<T, K extends keyof T> = {
  [P in K] : T[P]
}

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, 'title' | 'completed'>
const todo: TodoPreview = {
  title: 'Clean room',
  completed: false
}
```

- Exclude<T, U>，将T中某些属于U的类型移除掉
```typescript
type Exclude<T, U> = T extends U ? never : T;

type T0 = Exclude<'a'|'b'|'c', 'a'>; // 'b' | 'c'

type T1 = Exclude<string | number | (() => void), Function> // string | number

// 执行原理解析：
type T0 = ( 'a' extends 'a' ? never : 'a') | 
          ( 'b' extends 'a' ? never : 'b') |
          ( 'c' extends 'a' ? never : 'c')
          
// 结果
type T0 = 'b' | 'c'
```

- ReturnType，用于获取函数T的返回类型
```typescript
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

type T0 = ReturnType<() => string> // string
```

### 类型兼容性
以 A = B 为例
- 协变。B的结构体必须包含A中的所有结构，即B的属性可以比A多，但不能少。
- 逆变。和协变相反，即B中的所有属性都能在A中找到，可以比A的少。
- 双向协变。没有规则，B中的属性可以比A多，也可以比A少。
