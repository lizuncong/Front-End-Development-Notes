### context
组件树间需要共享数据时，只能一层一层传递props，这种方式就很繁琐。context提供了一种无需一层层传递props，就能在
组件树间共享数据的方法。


### API
- React.createContext
  + 这个API创建了一个共享的context，并返回Provider和ConsumerAPI。
- Context.Provider
  + 使用Provider将当前的context传递给组件树。
  + 注意：当Provider的value值发生变化时，它内部的所有消费组件都会重新渲染，并且不受制于shouldComponentUpdate的影响。
- Class.contextType
  + 类的静态方法。子组件消费context的方法之一。这样子组件的实例就能通过this.context访问到context了
  + 这种方式只能订阅单一的context
- Context.Consumer
  + 可以订阅多个context
  + 包裹的是一个函数式组件，组件接收的值是context的值。
- Context.displayName
  + 主要是用于react dev tools中。
- useContext
  + 在函数式组件中使用该hook消费context
  + 参数是react.createContext的返回值。useContext的返回值是context的当前值。
  
  

### 对context的理解
这个要从react组件树共享数据说起。在传统做法中，如果需要共享数据，需要将数据提升到组件树的根组件中去，然后一层层手动往下添加props。如果子组件需要
更改状态，那么还要一层层往上手动添加回调方法。可以看出这种方式极其繁琐且难维护。context提供了一种无需手动传递props就能共享数据的方法。


context最主要的几个API就是React.createContext，Context.Provider，Context.Consumer，Class.contextType以及useContext。

其中，React.createContext接收一个组件树需要共享的数据。然后返回Provider和Consumer组件。

Provider组件接收一个value属性，只要value属性改变了，任何消费了该context的子组件都会重新渲染，而不管是否在shouldcomponentupdate里面做了优化。
