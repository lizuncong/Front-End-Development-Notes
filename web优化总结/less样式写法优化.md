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
