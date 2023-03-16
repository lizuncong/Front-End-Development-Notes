# 基本概念
## 什么是flex
Flexible Box 模型，通常被称为 flexbox，是一种一维的布局模型。

## 两个轴线
主轴 交叉轴 flex-direction

## 起始线 与 终止线
row-reverse 会改变其方向
column 会导致主轴和交叉轴互换

## flex 容器和 flex 元素
我们把一个容器的 display 属性值改为 flex 或者 inline-flex。（flex容器）
完成这一步之后，容器中的直系子元素就会变为 flex 元素。
默认行为
- 元素排列为一行 (flex-direction 属性的初始值是 row)。
- 元素从主轴的起始线开始。
- 元素不会在主维度方向拉伸，但是可以缩小。
- 元素被拉伸来填充交叉轴大小。
- flex-basis 属性为 auto。
- flex-wrap 属性为 nowrap。

## flex wrap 是实现了多了 一维的flex容器
通过设置flex-wrap属性，我们可以在flex容器中实现多行排列，从而实现多维的布局。

## flex-flow 是 flex-direction 和 flex-wrap 的合并
flex-flow属性是flex-direction和flex-wrap属性的合并形式。

## flex 元素上的属性 （上面的都是flex容器的）
- flex-basis width(%, px , em, 相对于flex容器) | content (基于 flex 的元素的内容自动调整大小)
- flex-grow 是对剩余空间的使用 flex元素全部加起来的百分比 。
- flex-shrink 如果我们的容器中没有足够排列 flex 元素的空间，那么可以把 flex 元素flex-shrink属性设置为正整数来缩小它所占空间到flex-basis 以下
- 三个简写 flex: flex-grow flex-shrink  flex-basis  。flex默认值 flex: 0 1 auto (记住flex-shrink 默认是1)

## 关于flex-grow 和 flex-shrink的伸缩算法
**正可用空间和负可用空间的概念**
盒子的长度减去子元素的flex-basis之和，多的就是正可用空间，少的就是负可用空间。而伸缩就发生在其中
如果： 为正，那么，伸展的长度就是 单个元素的(flex-grow / 总子元素的flex-grow 之和) *  正可用空间
如果：为负，那么，收缩的长度就是 单个元素的(flex-shrink / 总子元素的flex-shrink之和) *  负可用空间

案例：创建几个flexbox
```html
  <div class="container">
    <div class="box1">
      <h1>Box 1</h1>
      <p>Some text</p>
    </div>
    <div class="box2">
      <h1>Box 2</h1>
      <p>Some text</p>
    </div>
    <div class="box3">
      <h1>Box 3</h1>
      <p>Some text</p>
    </div>
  </div>
```
首先尝试伸展
```css
 <style>
    .container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      width: 500px; (看这里)
      box-sizing: border-box;
    }
    .box1 {
      background-color: red;
      height: 100px;
      width: 100px;
      flex-shrink: 1;
      flex-grow: 1;
      block-size: border-box;
    }
    .box2 {
      background-color: green;
      width: 100px;
      height: 100px;
    }
    .box3 {
      background-color: blue;
      width: 100px;
      height: 100px;
    }
  </style>
```
上面的例子，外层总长度为500，每个元素的flex-basis 是 100px，那么剩余可用空间是200px。 ok，那么计算伸展，box2，box3 默认flex-grow 是0，而box1是 1，那么
box1的伸展空间就是 1 / (1+0+0) * 200 = 200px。
那么box1的长度就是100 + 200px = 300px。

**把容器宽度的改小**
```css
    .container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      width: 240px; (看这里)
      box-sizing: border-box;
    }
```
面的例子，外层总长度为240px，每个元素的flex-basis 是 100px，那么负可用空间是300 - 240 = 60px。
box2, box3 每个元素的flex-shrink 是 1 (默认值也是1)。
box1的收缩长度是： 1 / (1+1+1) * 60 = 20px。
那么 box1 的长度是100-20px = 80px 。

# 对齐

## 控制对齐的属性
- justify-content - 控制主轴（横轴）上所有 flex 项目的对齐。
- align-items - 控制交叉轴（纵轴）上所有 flex 项目的对齐。
- align-self - 控制交叉轴（纵轴）上的单个 flex 项目的对齐。
- align-content - 控制“多条主轴”的 flex 项目在交叉轴的对齐。 ？（出现在换行的情况，多条主轴进行对齐，类似于街头烤串要在铁丝网上怎么放，居中 or 首尾 or 从头到尾）

## 对齐属性的值
- flex-start开始端
- flex-end 结束端
- center 居中
- baseline 基线（首元素起始线）



