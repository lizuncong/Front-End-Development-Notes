function createElement(type, props, ...children){
  props.children = children
  return { type, props }
}


class Component{
  // 区别class组件和function组件的参数
  static isReactComponent = true

  setState(){

  }
}

class Updater {
  // 更新的异步队列
  constructor(){

  }
}
export default { Component, createElement }
