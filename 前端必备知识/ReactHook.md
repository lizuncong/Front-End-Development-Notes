### 为什么需要React Hook
- 在组件之间复用状态逻辑很难
  + class组件如果需要复用状态，可以采用render props和高阶组件，这些方案需要重新组织组件结构
  + Hook使得无需修改组件结构的情况下复用状态逻辑

- 复杂组件变得难以理解
  + class组件中，我们经常会在componentDidMount里面获取数据，然后设置定时器，componentDidMount里面就夹杂了太多的不相关的逻辑。然后还需要在
    componentWillUnmount中清除定时器，定时器相关的代码就被拆分了。
  + Hook将组件中相互关联的部分拆分成更小的函数(比如设置订阅或请求数据)，而并非强制按照生命周期划分。

- 难以理解的class和this
