##### Extend
Extend是Less新增的一个伪类，类似于&:before，&:after一样的调用方式&:extend(.class)。Extend会将&代表的
父选择器放到.class出现的地方。
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
