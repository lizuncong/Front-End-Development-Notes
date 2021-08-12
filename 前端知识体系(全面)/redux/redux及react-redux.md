### redux
redux只是一种架构模式，它不关注我们到底用什么库，可以把它应用到React和Vue中。


redux中比较重要的几个概念：Reducers，Actions，Store
- reducers是一个纯函数，接收一个state和一个action对象，然后根据action.type更新state并返回一个新的state。
- actions是一个对象，包含一个type属性和一个payload属性。
- Store提供了getState方法获取当前最新的state。dispatch方法触发state更新。subscribe方法订阅state状态变化的回调。

### react redux
react redux无非就是将context和redux架构结合实现的react共享状态管理方法。
react redux最主要的就是提供了connect方法，Provider组件将context从react组件中剥离出来，使得我们所写的组件能够和context解耦。

### redux的使用流程
```js
// 定一个 reducer
function reducer (state, action) {
  /* 初始化 state 和 switch case */
}
// 生成 store
const store = createStore(reducer)
// 监听数据变化重新渲染页面
store.subscribe(() => renderApp(store.getState()))
// 首次渲染页面
renderApp(store.getState()) 
// 后面可以随意 dispatch 了，页面自动更新
store.dispatch(...)
```


### 对redux和react redux的理解
1. 先从redux说起

redux是一种架构思想，与框架无关。redux最主要的三个概念就是Store，Reducers，Actions。

Reducers就是一个纯函数，接收一个state参数和一个action对象。然后根据action.type去修改state，并返回一个全新的state对象。

Actions就是一个对象，包含type和payload属性。决定了如何修改state对象的值。

Store就是createStore方法的返回值，包含getState，dispatch，subscribe方法。

getState方法主要是用于获取当前的state。

dispatch方法做的事情也比较简单，执行reducers函数获取最新的state，并且遍历listeners里面的回调，说明数据修改了。

subscribe主要用于监听数据的修改。


2. 再说react redux

react redux无非就是将context和redux思想结合起来，使得context能和我们的业务组件解耦并且方便状态管理。

react redux最主要的两个API就是context方法和Provider组件。

其中，Provider组件比较简单，接收一个store对象。这个store对象就是redux的createStore方法的返回值，包含getState，dispatch，subscribe方法。
然后Provider组件创建一个context，包含store的值，并在render方法原封不动的渲染子组件。

connect方法接收一个mapStateToProps和一个mapDispatchToProps方法。并返回一个函数，这个函数接收一个组件，并且返回值是一个高阶组件。
这个高阶组件主要做了以下几件事：

订阅context，读取store对象，调用store.subscribe监听状态修改，然后执行更新操作。更新操作里面调用mapStateToProps以及mapDispatchToProps
方法，并将两个方法的返回值当作Props传递给包裹的组件。



### 简单版本的实现：

```jsx
let appState = {
  title: {
    text: 'React.js 小书',
    color: 'red',
  },
  content: {
    text: 'React.js 小书内容',
    color: 'blue'
  }
}


function dispatch (action) {
  switch (action.type) {
    case 'UPDATE_TITLE_TEXT':
      appState.title.text = action.text
      break
    case 'UPDATE_TITLE_COLOR':
      appState.title.color = action.color
      break
    default:
      break
  }
}


function createStore (reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener) => listeners.push(listener)
  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }
  dispatch({}) // 初始化 state
  return { getState, dispatch, subscribe }
}

const store = createStore(appState, stateChanger)
let oldState = store.getState() // 缓存旧的 state
store.subscribe(() => {
  const newState = store.getState() // 数据可能变化，获取新的 state
  renderApp(newState, oldState) // 把新旧的 state 传进去渲染
  oldState = newState // 渲染完以后，新的 newState 变成了旧的 oldState，等待下一次数据变化重新渲染
})


export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor () {
      super()
      this.state = {
        allProps: {}
      }
    }
    componentWillMount () {
      const { store } = this.context
      this._updateProps()
      store.subscribe(() => this._updateProps())
    }
    _updateProps () {
      const { store } = this.context
      let stateProps = mapStateToProps
          ? mapStateToProps(store.getState(), this.props)
          : {} // 防止 mapStateToProps 没有传入
      let dispatchProps = mapDispatchToProps
          ? mapDispatchToProps(store.dispatch, this.props)
          : {} // 防止 mapDispatchToProps 没有传入
      this.setState({
        allProps: {
          ...stateProps,
          ...dispatchProps,
          ...this.props
        }
      })
    }
    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}

export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext () {
    return {
      store: this.props.store
    }
  }
  render () {
    return (
        <div>{this.props.children}</div>
    )
  }
}
```



