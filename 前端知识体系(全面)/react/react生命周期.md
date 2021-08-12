#### 初始化的时候
- 父元素constructor
- 父元素componentWillMount
- 父元素 render
- 子元素constructor
- 子元素componentWillMount
- 子元素 render
- 子元素 componentDidMount
- 父元素 componentDidMount

#### 当调用setState触发更新时
- 父元素 componentWillReceiveProps
- 父元素 componentWillUpdate
- 父元素 render
- 子元素 componentWillReceiveProps
- 子元素 componentWillUpdate
- 子元素 render
- 子元素componentDidUpdate
- 父元素componentDidUpdate


#### 当卸载的时候
- 父元素 componentWillUnmount
- 子元素 componentWillUnmount


#### 代码实例如下：
```jsx harmony
import React, { memo } from 'react'

class Child extends React.Component{
  constructor(props){
    super(props)
    console.log('子元素constructor')
  }

  componentWillMount() {
    console.log('子元素componentWillMount')
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('子元素componentDidUpdate')
  }
  componentDidMount() {
    console.log('子元素 componentDidMount')
  }
  componentWillUnmount() {
    console.log('子元素 componentWillUnmount')
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('子元素 componentWillReceiveProps')
  }
  componentWillUpdate(nextProps, nextState, nextContext) {
    console.log('子元素 componentWillUpdate')
  }
  
  render(){
    console.log('子元素 render')
    return (
        <div>子元素:{this.props.title}</div>
    )
  }
}


class Parent extends React.Component{
  constructor(props){
    super(props)
    console.log('父元素constructor')
  }

  componentWillMount() {
    console.log('父元素componentWillMount')
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('父元素componentDidUpdate')
  }
  componentDidMount() {
    console.log('父元素 componentDidMount')
  }
  componentWillUnmount() {
    console.log('父元素 componentWillUnmount')
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('父元素 componentWillReceiveProps')
  }
  componentWillUpdate(nextProps, nextState, nextContext) {
    console.log('父元素 componentWillUpdate')
  }

  render(){
    console.log('父元素 render')
    return (
        <div>
          父元素:{this.props.count}
          <Child title={`计数器：${this.props.count}`}/>
        </div>
    )
  }
}


const App = () => {
  const [count, setCount] = useState(0);
  return (
      <div>
        计数器: { count }
        <div>
          <button
              id="btn"
            onClick={() =>{
                setCount(count + 1)
            }}
          >
            add count
          </button>
        </div>
        {
          count > 3 ? null :
              <Parent count={count}/>
        }
      </div>
  )
}


```
