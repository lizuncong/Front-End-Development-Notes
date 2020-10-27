mixins既可以是id，也可以是class。
新建一个mixins.less文件：
```less
.border{
  border-top: 2px solid red;
  border-bottom: 2px solid black;
}
.padding{
  padding: 20px;
}

#color{
  color: red
}

#font-size{
  font-size: 20px;
}
```

新建index.less文件：
```less
@import "mixins";
#header{
  background: gray;
  .border; // 可以直接通过类名引用
  .padding(); // 可以通过类名 + ()引用。
  #color; // 可以直接通过id选择器引用。
  #font-size(); // 可以通过id选择器+（）引用。
}
```
编译后的结果：
```less
#header{
  background: gray;
  border-top: 2px solid red;
  border-bottom: 2px solid black;
  padding: 20px;
  color: red;
  font-size: 20px;
}
```

***可以看出，mixin会将一个规则集合中的所有属性包含到另一个规则集合中，比如.border中的属性
全部注入到了#header中。***



mixin的定义也可以带括号()
```less
.border(){
  border-top: 2px solid red;
  border-bottom: 2px solid black;
}
// 使用
#header{
  background-color: red;
  .border();
}
```

带括号与不带括号的差别在于：带括号的mixin部分不会被打包进css中，比如
```less
.border(){
  border-top: 2px solid red;
  border-bottom: 2px solid black;
}
```
.border()里面的规则集合是不会被打包进css中的。
但是如果是不带括号的，比如:
```less
.border2{
  border-top: 2px solid red;
  border-bottom: 2px solid black;
}
```
实际上.border2就是个普通的css类，因此里面的规则集合是会被打包进css中的。



使用带括号的mixin定义规则集合
```less
#bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab { 
    color: red;
  }
  .citation { 
    background-color: green;
  }
}

// 使用
#header{
  background: yellow;
  #bundle.button();
}

```
这里#bundle带了括号，因此#bundle里面的规则集合不会全部打包进css中。这里#header只使用到了#bundle.button()里面的规则集合。
因此只有#bundle.button里面的规则集合会被打包进#header里面，而#bundle.tab，以及#bundle.citation都不会被打包进css中。


使用mixin定义字典
新建一个maps.less文件：
```less
#colors(){
  color1: red;
  color2: green;
}

.width(){
  width1: 100px; // 这个就和css属性的写法一致，不用width1: "100px"，而是直接：width1：100px;
  width2: 50px;
}
```
在index.less中引用：
```less
@import "maps";
.circle{
  color: #colors[color1];
  background-color: #colors[color2];
  width: .width[width1];
  height: .width[width2];
}
```


综上可以看出，mixin的名字要么是一个id选择器，要么是类选择器，比如#colors，.border，而不能直接colors或者border。
优先使用带括号的方式。


mixin的命名空间：
```less
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer.inner();
}
```
