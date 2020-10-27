### LESS语言的几大特性：
#### 1. 变量
1. 变量插值: @{}；
2. 属性变量: 
```less
@property: color; 
#header{ 
  @{property}: red 
}; 
```
3. 变量的变量: @color1: red; @color2: color1; #header{ color: @@color2}
4. 将css属性做为变量：$。
```less
#header{
    color: red;
    background-color: $color;
}
```
#### 2. escaping
1. ~"anything"，如果anything包含变量插值，则anything里面的变量替换成相应的值
2. ~``，其中`里面可以是普通字符串，也可以是自执行nodejs函数。
#### 3. mixin
1. 将一个选择器的css属性集合拷贝到另一个选择器当中
2. 注意区分带括号与不带括号的mixin的差异
#### 4. extend本质上是一个伪类
1. 注意extend all的用法及含义。
#### 5. & 父选择器
1. & 代表的是所有的父选择器，可以简单的将父选择器替换到&出现的地方，就是编译后的css结果
2. & 能够改变选择器的顺序。
3. & 能够做组合。
#### 6. Merge。提供了一种合并css值的方式。




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

##### 3.将css属性做为变量
可以使用$符号将css做为变量读取该属性的值
```less
.block {
  color: red; 
  .inner {
    background-color: $color; 
  }
  color: blue;  
}
// 编译后：
.block {
  color: red; 
  color: blue;  
} 
.block .inner {
  background-color: blue; 
}
```

注意：编译后inner的background-color值为blue。


##### 4.变量的变量
```less
@color1: yellow;
@color: color1;
#header{
  background-color: @@color;
}
```

##### 5.父选择器 &
&代表所有的父选择器，并不仅仅是最近的父选择器
```less
.grand {
  .parent {
    & > & {
      color: red;
    }

    & & {
      color: green;
    }

    && {
      color: blue;
    }

    &, &ish {
      color: cyan;
    }
  }
}

// 编译后：
.grand .parent > .grand .parent {
  color: red;
}

.grand .parent .grand .parent{
  color: green;
}

.grand .parent.grand .parent{
  color: blue;
}
.grand .parent, .grand .parentish{
  color: cyan;
}
```

& 可以改变选择器顺序
```less
.header {
  .menu {
    border-radius: 5px;
    .no-borderradius & {
      background-color: red;
    }
  }
}
// 编译后：
.header .menu{
  border-radius: 5px;
}

.no-borderradius .header .menu{
  background-color: red;
}
```

& 组合
```less
p, a {
  border-top: 2px dotted #366;
  & + & {
    border-top: 0;
  }
}

// 编译后
p, a{
  border-top: 2px dotted #366;
}

p + p,
p + a,
a + p,
a + a{
  border-top: 0;
}

```


***总之一句话：将所有的父选择器放在 & 符号出现的地方，就是编译后的结果***


##### 6. Merge
其实就是种合并css属性的方法。

有两种方式： 1. 通过逗号连接值。 2. 通过空格连接值

1. 逗号："+"，属性名称后面要拼上"+"号
```less
.mixin() {
  box-shadow+: inset 0 0 10px #555;
}
.myclass {
  .mixin();
  box-shadow+: 0 0 20px black;
}

// 编译后：
.myclass{
  box-shadow: inset 0 0 10px #555, 0 0 20px black;
}

```

2. 空格：属性名称后面要拼上"+_"。
```less
.mixin() {
  transform+_: scale(2);
}
.myclass {
  .mixin();
  transform+_: rotate(15deg);
}
// 编译后：
.myclass {
  transform: scale(2) rotate(15deg);
}
```
