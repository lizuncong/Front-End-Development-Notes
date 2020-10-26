escaping，即转义。less的转义和js的转义稍有不同。less的转义使用 ***~"anything"***。如果anything里面
没有包含变量插入的话，那么 ***~"anything"*** 就简单的返回 `anything`。

新建一个escaping.less文件：
```less
@function1: ~`(function(){ console.log('function1=============='); return '200px'})()`; //
@function2: ~"(function(){ console.log('function2=============='); return '200px'})()";
@function3: (function(){ console.log('function3=============='); return '2px'})(); // Less3.5版本以上，可以不用写~以及""
@number: 2;
@var: ~"@{number}px"; // 变量的模版插入语法，不能使用~`${number}px`这种es6的语法。
@min768: (min-width: 768px); // 也可以直接使用，不需要~""
.test-escaping{
  width: @function1;
  height: @function2;
  border-left: @function3 solid black;
  border-right: @var solid black;
  @media @min768{
    background-color: yellow;
  }
}

```

在index.less文件中引用：
```less
@import "escaping";
#header{
  background: gray;
  .test-escaping();
}
```
编译后：
```less
#header{
    background: gray;
    width: 200px;
    height: (function(){ console.log('function2=============='); return '200px'})();
    border-left: (function(){ console.log('function3=============='); return '2px'})() solid black;
    border-right: 2px solid black;
}
@media (min-width: 768px) {
  #header{
    background-color: yellow;
  }
}
```

##### 1.普通用法
```less
@min768: ~"(min-width: 768px)"; 
//@min768: (min-width: 768px); // 也可以直接这样子用，不需要～""
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```
编译后：
```less
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```
##### 2.模版插值
```less
@number: 2;
@width: ~"@{number}px";
#header{
  width: @width;
}
```
编译后：
```less
#header{
  width: 2px;
}
```

less的模版插值使用的是 ***""***，而不是ES6中的 ***``***。使用插入的变量使用的是 ***@{}***，而不是ES6中的
***${}***。


##### 3.自定义函数自执行
***~`(function(){})()`***，记住 ***~*** 后面是***``***，而不是 ***""***。
```less
@function1: ~`(function(){ console.log('function1=============='); return '200px'})()`; //
#header{
  width: @function1;
}
```
编译后：
```less
#header{
  width: 200px;
}
```
注意观察控制台，会发现控制台打印了两行:
```js
function1=============
function1=============
```
这是因为定义@function1的时候函数执行了一遍，在#header里面使用width:@function1的时候，函数又执行了一遍。
