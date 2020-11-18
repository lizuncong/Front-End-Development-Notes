
function createElement(type, config, ...children) { // Babel解析后传递的config肯定是一个对象，不管JSX中有没有设置属性
    delete config.__source; // ——souce属性和__self属性太复杂直接移除
    delete config.__self;
    const props = {...config};
    props.children = children.map((child) => { // 遍历子节点，主要处理一些纯文本
        return typeof child === "object" ? child : createTextElement(child)
    });
    return { // 构造一个虚拟DOM节点
        type,
        props
    }
}

function createTextElement(text) { // 专门处理纯文本，将纯文本转化成一个React虚拟DOM节点
    return {
        type: "TEXT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}
export default { createElement }
