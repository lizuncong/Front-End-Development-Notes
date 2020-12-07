##### 1.优先使用带括号的mixin
```less
// .border()不是普通的css类，因此不会被单独打包成css
.border(){
  border-top: 2px solid red;
  border-bottom: 2px solid black;
}

// .border2会被单独打包成css
.border2{
  border-left: 2px solid red;
  border-right: 2px solid black;
}
#header{
  .border(); // .border()的属性集合会被打包进#header中
  .border2(); // .border2的属性集合会被打包进#header中
}

```
.border2其实就是个普通的css类，因此.border2的属性集合都会被打包进css中。

.border()不能被看成是个普通的css类，因此.border()里面的规则集合不会被打包进css中

***因此优先使用带括号的mixin定义规则集合，能减少一些css代码量***


##### 2.相对于mixin，优先使用extend
extend能够减少CSS大小。mixins将一个选择器中的所有属性全部拷贝到另一个选择器中，这就造成了css代码的重复。
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

#### 3 选择器层级嵌套不能太深
