function render(virtualDom, parent){
  let dom = document.createElement(virtualDom.type);
  Object.keys(virtualDom.props)
      .filter(key => key !== 'children')
      .forEach(key => {
        dom[key] = virtualDom.props[key];
      })
  if(Array.isArray(virtualDom.props.children)){
    virtualDom.props.children.forEach(child => render(child, dom))
  }
  parent.appendChild(dom)
}

export default { render }
