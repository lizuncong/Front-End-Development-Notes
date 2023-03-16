### React和Vue相似之处
- 使用了Virtual DOM
- 提供了响应式(Reactive)和组件化(Composable)的视图组件
- 将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库。

### React和Vue不同之处
- React是声明式的，必须手动调用`setState`更新页面。Vue是响应式的，使用依赖收集监听数据变化自动更新页面。
- React社区相对Vue社区更加庞大，更加丰富
- 最重要的是，React需要手动使用PureComponent或者shouldComponentUpdate等方法优化。而Vue组件的依赖是自动追踪的，所以系统能精确知道哪个组件确实需要被
  重渲染，不需要开发者手动优化。
- React使用jsx渲染组件。Vue使用template渲染组件。
- Vue有丰富的指令体系，React没有。
- vue有mixin复用组件逻辑，react使用高阶组件或者自定义hooks。
- vue有计算属性和监听器，react则需要在shouldComponentUpdate里面监听，比较麻烦。
- Vue的路由库和状态管理库都是由官方维护支持且与核心库同步更新的。React则是选择把这些问题交给社区维护。


### Vue生命周期
- new vue()
- Init Events & Lifecycle
- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed
