### 为什么需要React Hook
- 在组件之间复用状态逻辑很难
  + class组件如果需要复用状态，可以采用render props和高阶组件，这些方案需要重新组织组件结构
  + Hook使得无需修改组件结构的情况下复用状态逻辑

- 复杂组件变得难以理解
  + class组件中，我们经常会在componentDidMount里面获取数据，然后设置定时器，componentDidMount里面就夹杂了太多的不相关的逻辑。然后还需要在componentWillUnmount中清除定时器，定时器相关的代码就被拆分了。
  + Hook将组件中相互关联的部分拆分成更小的函数(比如设置订阅或请求数据)，而并非强制按照生命周期划分。

- 难以理解的class和this

### Hook是什么
Hook是一个特殊的函数，它可以让你"钩入"React的特性。例如`useState`是允许你在React函数组件中添加state的Hook。


### Hook的规则，或者说限制
- 只能在函数最外层调用Hook。不要在循环，条件判断或者子函数中调用。
- 只能在React的函数组件或者自定义的Hook中调用Hook。不要在其他JS函数中调用。

### useState为什么返回的是数组？函数执行完后，state是怎么保留的？
- `数组解构`的语法让我们在调用`useState`时可以给state变量取不同的名字。
- 一般来说，在函数退出后变量就会"消失"，而state中的变量会被React保留，这是怎么做到的？
  + React保持对当前渲染中的组件的追踪。每个组件内部都有一个记忆单元格列表，用来存储一些数据的JavaScript对象。
  当使用useState调用一个Hook的时候，它会读取当前的单元格，然后把指针移动到下一个。这就是多个useState调用
  会得到各自独立的本地state的原因。因此我们需要保证hook的调用顺序在每次渲染时都是一致的。这也是为啥不能在条件判断和循环中
  调用hook。


### useEffect副作用
- useEffect类似于class组件中的生命周期特性。通过`useEffect`Hook，可以把组件内相关的副作用组织在一起。比如创建及取消订阅
- 默认情况下，***useEffect会在每次渲染后都执行***。如果传递了第二个参数，只会在依赖更新时执行。
- useLayoutEffect和useEffect结构相同，只是调用时机不同
```jsx harmony
useEffect(() => {
  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, []);
```

### useCallback
useCallback有时候会引起重复渲染，这相当困扰。这个时候可以使用useRef保留值或者
保留回调。也可以使用context结合useReducer传递dispatch，取代传递callback回调的方式。
