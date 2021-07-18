### update和updateQueue
- update用于记录组件状态的改变，存放于updateQueue中，updateQueue是一个单向链表的结构，多个
update可以同时存在，比如在点击事件中多次调用setState

update的数据结构：
```javascript
var update = {
  expirationTime,
  tag: UpdateState, // 0 UpdateState，1 ReplaceState  2 ForceUpdate，3 CaptureUpdate
  payload, // setState的第一个参数
  callback, // setState的第二个参数
  next, // 下一个更新
  nextEffect // 下一个side effect
}
```

### setState
- 給节点的Fiber创建更新
- 每一个类的实例都有一个classComponentUpdater对象，这个对象在组件实例化的时候被创建，
这个对象包含一个enqueueSetState方法，一个enqueueReplaceState以及enqueueForceUpdate等方法。

当我们调用setState时，会调用enqueueSetState方法，这个方法接收组件的实例，setState的第一个参数payload，以及第二个参数
callback，然后函数里面会根据实例获取对应的fiber节点，计算expirationTime，根据expirationTime创建一个update对象，
然后调用enqueueUpdate，将update添加到fiber的updateQueue队列中，最后调用scheduleWork剩下的就交给调度系统。
