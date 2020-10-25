##### 背景
在平时开发中，经常能遇到屏幕宽度调整或者容器尺寸变化，元素宽高比例保持不变的需求，比如图片的宽高比保持不变。

##### 原理
利用css中元素的padding-top设置为百分比时，这个百分比相对于元素的宽度。比如元素宽度为100px。
这时如果设置元素的padding-top:100%，那么padding-top就是100px。

```jsx
<div className="demo-container">
  <div className="block">
    <div className="content">这个元素宽高比1:1</div>
  </div>
</div>
```

```less
.demo-container{
  width: 300px; // 改变这个宽度，会发现content的宽度也会变宽，宽高比还是1：1
  background: yellow;
  .block{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    background: red;
  }
  .content{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: green;
  }
}

```
