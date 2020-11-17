
function render(vdom, container) {
    let dom;
    let props = vdom.props;
    if (vdom.type === "TEXT") { // 是文本节点
        dom = document.createTextNode("");
    } else {
        dom = document.createElement(vdom.type);
    }
    updateProperties(dom, props); // 更新DOM属性
    vdom.props.children.forEach((child) => { // 遍历子节点，递归调用render()方法将子节点渲染出来
        render(child, dom);
    });
    container.appendChild(dom); // 整个虚拟DOM渲染完成后将其加入到容器中进行挂载到页面上
}

function updateProperties(dom, props) {
    for (let key in props) { // 遍历属性并更新到DOM节点上
        if (key !== "children") {
            if (key.slice(0, 2) === "on") {
                dom.addEventListener(key.slice(2).toLowerCase(), props[key], false);
            } else {
                dom[key] = props[key];
            }
        }
    }
}
export default { render }
