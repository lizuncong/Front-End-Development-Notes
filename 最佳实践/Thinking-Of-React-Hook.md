关于 `React Hook` 使用的优点在 `React` 官网有大量的描述，这里就不在赘述了。主要想讲讲个人在使用 `React Hook`
编写函数式组件以及使用 `Class` 编写组件的一些思考

## 性能优化
在类组件中，为了优化性能，减少子组件render次数，一般传递给子组件的函数prop需要在构造函数中绑定。如：
组件B：
```jsx 
const ComponentB = React.memo(({ onChange }) => (
  <div>
    组件B
    <div
      onClick={() => onChange()}
    >
      Click Me
    </div>
  </div>
));
```
组件A：
```jsx
import ComponentB from './componentB';

class ComponentA extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      value: 1,
    };
  }

  onChange() {
    const { value } = this.state;
    this.setState({
      value: value + 1,
    });
  }

  render() {
    return (
      <div>
        <div onClick={() => { this.setState({ value : this.state.value + 1})}}>
            Click A
        </div>
        <ComponentB
          onChange={this.onChange}
        />
      </div>
    );
  }
}

```

可以看出 `ComponentB` 使用了 `React.memo` 做优化，此时只要 `onChange` 属性不变，那么 `ComponentB` 
就不会 `render`。因此在 `ComponentA` 中，为了减少 `ComponentA` 的 `render` 导致 `ComponentB` 的
 `render`，在 `ComponentA` 的构造函数中使用 
```jsx 
this.onChange = this.onChange.bind(this) 
```
绑定 `onChange` 函数，然后在传递给 `ComponentB` 的 `onChange` 属性。此时疯狂点击 `Click A` 按钮，只会导致
`ComponentA` 渲染，而不会导致 `ComponentB` 渲染。

如果换成 `React Hook` ，用函数式组件的写法实现 `ComponentA`，如下：

````jsx 
import ComponentB from './componentB';

const ComponentA = React.memo(() => {
  const [value, setValue] = React.useState(1);
  return (
    <div>
      <div onClick={() => { setValue(value + 1); }}>
        Click A
      </div>
      <ComponentB
        onChange={React.useCallback(() => {
          setValue(value + 1);
        }, [value])}
      />
    </div>
  );
});
````
在函数式组件中，这里使用 `React.useCallback` 包装了一下 onchange 函数，但由于函数里面依赖了 value，因此
`React.useCallback`第二个参数必须要加上value，否则会有闭包导致的函数内部的value还是旧值。此时只要value一改变，
那么 `React.useCallback` 返回的引用就会改变，就会导致 `ComponentB` 重新渲染。点击 `Click A`按钮，就会
导致 `ComponentB` 重新渲染。

#以上就是使用 class 组件 和 函数式 组件的一些思考


当然，useCallback这一不足也可以通过以下方案解决：
```jsx
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // 把它写入 ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // 从 ref 读取它
    alert(currentText);
  }, [textRef]); // 不要像 [text] 那样重新创建 handleSubmit

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```
