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

可以看出，mixin会将一个规则集合中的所有属性包含到另一个规则集合中，比如.border中的属性
全部注入到了#header中。
