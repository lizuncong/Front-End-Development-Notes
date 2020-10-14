##### 需求背景
> 一个容器，子元素水平排列，当子元素少的时候，居中显示。但子元素多的时候，不换行，
要求父容器水平滚动。

##### 实现思路
> 水平居中，很容易想到使用display: flex; justify-content: center。方便快捷

##### 问题
> 当子元素内容少时，确实能实现水平居中。但是如果子元素内容过多时，水平滚动就出现了问题。子元素最左边无法滚动到视野内。

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/flex-01.jpg)


![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/flex-02.jpg)

从图中可以看出，滚动条已经到达容器最左边了，但是方块4前面的1,2,3无法滚动到视野内。代码如下：
```jsx
  <span
    className={styles.click}
    onClick={() => {
      this.setState({
        showMore: !showMore,
      });
    }}
  >
    点击切换元素个数
  </span>
  <div className={styles.flexContainer}>
    {
      (showMore ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3]).map((item) => (
        <div
          className={styles.square}
          key={item}
        >
          {item}
        </div>
      ))
    }
  </div>
  .flexContainer{
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    height: 80px;
    margin-bottom: 12px;
    border: 1px solid #e8e8e8;
  }
  .square{
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    background: #FFF4EB;
    border-right: 1px solid #e8e8e8;
    &:first-child{
      border-left: 1px solid #e8e8e8;
    }
  }
```

##### 原因
> 估计是flex布局的bug？？

##### 解决方法1
> 再使用一层容器包住flexContainer。然后flexContainer不能再使用flex，而是使用inline-flex。

代码如下：
```jsx
  <div className={styles.flexWrap}>
    <div className={styles.flexContainer}>
      {
        (showMore ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3]).map((item) => (
          <div
            className={styles.square}
            key={item}
          >
            {item}
          </div>
        ))
      }
    </div>
  </div>
  .flexWrap{
    width: 400px;
    text-align: center;
    overflow: auto;
    margin-bottom: 30px;
    border: 1px solid #e8e8e8;
    height: 80px;
  }
  .flexContainer{
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .square{
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    background: #FFF4EB;
    border-right: 1px solid #e8e8e8;
    &:first-child{
      border-left: 1px solid #e8e8e8;
    }
  }
```
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/flex-03.jpg)

##### 解决方法2
> 不使用flex布局，子元素使用display: inline-block。

代码如下：
```jsx
  <div className={styles.blockContainer}>
    {
      (showMore ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3]).map((item) => (
        <div
          className={styles.square}
          key={item}
        >
          {item}
        </div>
      ))
    }
  </div>
  .blockContainer{
    width: 400px;
    overflow: auto;
    height: 80px;
    white-space: nowrap;
    margin-bottom: 12px;
    text-align: center;
    border: 1px solid #e8e8e8;
    .square{
      display: inline-block;
      width: 80px;
      height: 80px;
      background: #FFF4EB;
      border-right: 1px solid #e8e8e8;
      &:first-child{
        border-left: 1px solid #e8e8e8;
      }
    }
  }
```
