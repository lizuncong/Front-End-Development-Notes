##### Extend
Extend是Less新增的一个伪类，类似于&:before，&:after一样的调用方式&:extend(.class)。Extend会将&代表的
父选择器放到.class出现的地方。

selectorA:extend(selectorB){}，简单点理解，就是选择器selectorA和选择器selectorB的属性集合相同
```less
nav ul {
  &:extend(.inline);
  background: blue;
}
.inline {
  color: red;
}
// 编译后
nav ul {
  background: blue;
}
.inline,
nav ul {
  color: red;
}

```

新建一个extend.less文件：
```less
.colors {
  color: red;
}

```
在index.less中：
```less
// 如果不import extend.less文件，在#header中&:extend(.colors)不会报错，只是css不生效。
@import "extend.less";
#header{
  &:extend(.colors);
}
```

```less
.c:extend(.d all){
  // extends all instances of ".d"，例如：".x.d" or ".d.x"
}

.c:extend(.d){
  // extends only instances where the selector will be output as just ".d"
}

```

##### Extend "all"
先看个例子
```less
.a.b.test,
.test.c {
  color: orange;
}
.test {
  &:hover {
    color: green;
  }
}

.replacement:extend(.test all) {} // extend "all"

// 编译后：
.a.b.test,
.test.c,
.a.b.replacement,
.replacement.c {
  color: orange;
}
.test:hover,
.replacement:hover {
  color: green;
}
```
上面的例子可以看出，extend加了个 all 参数后，其实就是简单的理解为将.test出现的地方替换成.replacement。


#### Extend的典型使用场景：
1. 可以避免添加基础类。比如一个很常见的场景：
```less
.animal {
  background-color: black;
  color: white;
}
.bear {
  background-color: brown;
}
```
```html
<a class="animal bear">Bear</a>
```

使用extend就可以这样做：
```less
.animal {
  background-color: black;
  color: white;
}
.bear {
  &:extend(.animal);
  background-color: brown;
}
```
```html
<a class="bear">Bear</a>
```

2. 减少CSS大小。

mixins将一个选择器中的所有属性全部拷贝到另一个选择器中，这就造成了css代码的重复。
因此可以使用extend去复用css代码。

使用mixin：
```less
.my-inline-block() {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  .my-inline-block;
}
.thing2 {
  .my-inline-block;
}

// 编译后：
.thing1 {
  display: inline-block;
  font-size: 0;
}
.thing2 {
  display: inline-block;
  font-size: 0;
}
```
使用extends：
```less
.my-inline-block {
  display: inline-block;
  font-size: 0;
}
.thing1 {
  &:extend(.my-inline-block);
}
.thing2 {
  &:extend(.my-inline-block);
}

// 编译后：
.my-inline-block,
.thing1,
.thing2 {
  display: inline-block;
  font-size: 0;
}
```

可以看出，extend还是能减少一定的代码量的
