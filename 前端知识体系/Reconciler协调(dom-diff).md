### 协调
协调的过程也即是dom diff的过程。

React基于以下假设设计了dom diff算法：
- 两个不同类型的元素会产生出不同的树；
- 开发者可以通过设置 key 属性，来告知渲染哪些子元素在不同的渲染下可以保存不变；

### Dom Diffing算法的过程
- 首先对比两个dom元素是否相同类型。
  + 如果类型不同，比如从<a>变成<img>或者从<span>变成<div>，那么react会拆卸原有的树并且重新创建新的树。
  + 如果两个dom元素类型相同。React会保留DOM节点，仅比对及更新有改变的属性
  + 处理完当前节点之后，继续对子节点进行递归

### React核心的几个步骤
- createElement function
- render function
- concurrent mode
- fibers
- render and commit phases
- reconciliation
- function components
- hooks
