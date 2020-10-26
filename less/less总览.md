##### 1.calc
可以使用calc做一些简单的计算:
```less
@var: 50vh/2;
#header{
  width: calc(50% + @var - 20px);
}
```

##### 2.变量插值
***变量插值都是通过@{var}实现的***
变量插值的几个场景：1.选择器名称; 2.属性名称; 3.URLs; 4.@import语句
***总结一下就是凡是使用到字符串的地方都可以使用变量插值***
```less
@themes: "../../src/themes";
@import "@{themes}/tidal-wave.less";
@my-class-selector: header; // 可以用作类选择器，也可以用作id选择器，使用时需要披上.或者#前缀
@my-id-selector: #header; // id选择器
@my-property: color;
@images: "../img";
.@{my-class-selector}{ // 如果用作类选择器的话，需要拼上.前缀
  @{my-property}: red;
  background-@{my-property}: #999;
  background: url("@{images}/white-sand.png");
}
@{my-id-selector}{
    @{my-property}: red;
    background: url("@{images}/white-sand.png");
}
```
