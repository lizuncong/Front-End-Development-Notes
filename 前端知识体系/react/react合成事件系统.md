### 合成事件原理
react将所有的事件都代理到document上，当事件发生并冒泡至document处时，React将事件内容封装并交由真正的处理函数执行。
可以通过nativeEvent获取浏览器的底层原生事件。在合成事件中，react会复用event对象，当所有事件处理函数被调用之后，其所有属性会被置空。
如果需要在事件处理函数运行之后获取事件对象属性，可以调用event.persist()方法，或者使用局部变量缓存事件属性。


从 v17 开始，e.persist() 将不再生效，因为 SyntheticEvent 不再放入事件池中。


### 合成事件的好处
- 避免在大量的DOM上绑定事件，节省内存以提高性能
- 屏蔽底层不同浏览器之间的事件系统差异


### 合成事件和原生事件混合使用。
当我们在同一个DOM节点通过react的onClick属性绑定点击事件，以及通过addEventListener绑定原生点击事件时：
- 点击dom节点，先触发通过addEventListener绑定的原生事件，然后才是合成事件
- 如果在原生事件中调用evt.stopPropagation()，则事件无法冒泡到document，合成事件不会被执行。
