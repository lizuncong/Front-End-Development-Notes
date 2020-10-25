`@media` 和 `@supports` 都可以嵌套。只不过他们和普通的选择器嵌套不一样，`@media` 和 `@supporst` 是支持冒泡的


```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media  (min-resolution: 192dpi) {
      background-color: red;
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

编译后：
```less
.component{
  width: 300px;
}
@media (min-width: 768px) {
  .component{
    width: 600px;
  }
}

// 注意这里，多层嵌套的@media用and连接
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component{
    background-color: red;
  }
}

@media (min-width: 1280px) {
  .component{
    width: 800px;
  }
}

```
