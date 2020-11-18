let currentFiber; // 保存当前工作的Fiber节点
let rootFiber; // 根Fiber节点，render()方法内会进行初始化
let functionComponentFiber; // 保存函数组件对应的Fiber
let hookIndex; // 可能一个组件中使用到多个hook，记录hook的索引
let oldRootFiber; // rootFiber提交完后保存为旧的rootFiber即上一次渲染的rootFiber
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

function render(vdom, container) {
    // let dom;
    // let props = vdom.props;
    // if (vdom.type === "TEXT") { // 是文本节点
    //     dom = document.createTextNode("");
    // } else {
    //     dom = document.createElement(vdom.type);
    // }
    // updateProperties(dom, props); // 更新DOM属性
    // vdom.props.children.forEach((child) => { // 遍历子节点，递归调用render()方法将子节点渲染出来
    //     render(child, dom);
    // });
    // container.appendChild(dom); // 整个虚拟DOM渲染完成后将其加入到容器中进行挂载到页面上
    rootFiber = { // 渲染的时候创建一个根fiber
        type: "root",
        props: {
            children: [vdom] // children存储对应的虚拟DOM节点
        },
        dom: container, // rootFiber节点对应的dom为容器
        parent: null, // 指向父Fiber
        child: null, // 指向子Fiber
        sibling: null // 指向兄弟Fiber
    };
    currentFiber = rootFiber; // 将根fiber节点标记为currentFiber，开始一个一个节点进行渲染
}

function createDOM(vdom) {
    let dom;
    if (vdom.type === "TEXT") {
        dom = document.createTextNode("");
    } else {
        dom = document.createElement(vdom.type);
    }
    updateProperties(dom, {}, vdom.props);
    return dom;
}

function updateProperties(dom, oldProps, newProps) {
    for (let key in oldProps) {
        if (!newProps[key]) {
            dom.removeAttribute(key);
        }
    }
    for (let key in newProps) { // 遍历属性并更新到DOM节点上
        if (key !== "children") {
            if (key.slice(0, 2) === "on") {
                dom.addEventListener(key.slice(2).toLowerCase(), newProps[key], false);
            } else {
                if (oldProps[key] !== newProps[key]) { // 如果属性值发生变化则进行更新
                    dom[key] = newProps[key];
                }
            }
        }
    }
}

function commitRoot() {
    // 不需要先清空容器DOM的所有子节点了
    // let rootDOM = rootFiber.dom;
    // while(rootDOM.hasChildNodes()) {
    //     rootDOM.removeChild(rootDOM.firstChild);
    // }
    commitWorker(rootFiber.child); // 将根fiber的子fiber传入
    oldRootFiber = rootFiber; // 提交后将最终的rootFiber保存为oldRootFiber
    rootFiber = null;
}

function commitWorker(fiber) {
    if (!fiber) {
        return;
    }
    let parentFiber = fiber.parent;
    while (!parentFiber.dom) {
        parentFiber = parentFiber.parent;
    }
    const parentDOM = parentFiber.dom;
    // const parentDOM = fiber.parent.dom; // 拿到当前fiber的父fiber对应的dom
    // if (fiber.dom) { // 如果当前fiber存在dom则加入到父节点中, 函数组件没有对应dom
    //     parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    // }
    if (fiber.effectTag === "ADD" && fiber.dom != null) {
        parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) {
        updateProperties(fiber.dom, fiber.base.props, fiber.props);
    }
    // parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    commitWorker(fiber.child); // 递归将当前fiber的子fiber提交
    commitWorker(fiber.sibling); // 递归将当前fiber的下一个兄弟fiber提交
}

function workLoop(deadline) {
    while(currentFiber && deadline.timeRemaining() > 0) {
        currentFiber = getNextFiber(currentFiber);
    }
    if (!currentFiber && rootFiber) { // 如果没有任务了，则一次性提交整个根fiber，渲染出界面
        commitRoot(); // 提交根Fiber节点开始渲染到界面
    }
    requestIdleCallback(workLoop); // 如果还有任务, 但是空闲时间不够了，则继续注册回调，等浏览器空闲之后再恢复执行
}
requestIdleCallback(workLoop);

function doNativeDOMComponent(fiber) {
    if (!fiber.dom) { // 刚开渲染的时候，只有根fiber才有对应的dom，即容器
        fiber.dom = createDOM(fiber);
    }
    const vchildren = (fiber.props && fiber.props.children) || []; // 子节点就是虚拟DOM
    createFiberLinkedList(fiber, vchildren);
}

function doFunctionComponent(fiber) {
    functionComponentFiber = fiber;
    hookIndex = 0;
    functionComponentFiber.hooks = []; // 并在函数组件对应的fiber上添加一个hooks数组，每次重新渲染都会重新初始化为空数组
    const vchildren = [fiber.type(fiber.props)]; // 执行函数组件拿到对应的虚拟DOM作为函数组件的虚拟子节点
    createFiberLinkedList(fiber, vchildren);
}

function getNextFiber(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";
    if (isFunctionComponent) {
        doFunctionComponent(fiber);
    } else {
        doNativeDOMComponent(fiber);
    }

    if (fiber.child) { // 如果当前fiber存在child则取出其child指向的Fiber节点作为下一个任务
        return fiber.child;
    }
    // 当遍历到最底层的时候，就会出现没有child的情况，此时就要开始找其兄弟节点了
    let currentFiber = fiber;
    while(currentFiber) {
        if (currentFiber.sibling) { // 如果存在兄弟节点
            return currentFiber.sibling; // 返回其兄弟节点
        }
        // 当遍历到最后一个子节点的时候，会出现sibling兄弟节点不存在的情况
        currentFiber = currentFiber.parent; // 找到当前节点的父节点
    }
}

function createFiberLinkedList(fiber, vchildren) {
    let index = 0;
    let oldFiber = fiber.base && fiber.base.child; // 取出第一个子节点对应的oldFiber
    let prevSibling = null; // 兄弟节点的上一个节点
    while(index < vchildren.length) { // 遍历子节点，进行层层构建
        let vchild = vchildren[index];
        let newFiber;
        const sameType = oldFiber && vchild && oldFiber.type === vchild.type; // 比较新旧Fiber的type是否一致
        if (sameType) { // 表示是更新
            newFiber = {
                type: oldFiber.type,
                props: vchild.props, // 从最新的虚拟节点中获取最新的属性
                dom: oldFiber.dom, // 使用上次创建的dom即可
                parent: fiber,
                child: null,
                base: oldFiber,
                effectTag: "UPDATE" // 标识为更新
            }
        }
        if (!sameType && vchild) { // 如果类型不同且存在虚拟子节点则表示新增
            newFiber = {
                type: vchild.type, // 当前节点类型 如h1
                props: vchild.props, // 当前节点属性
                parent: fiber, // 指向父节点
                dom: null,
                child: null,
                base: null,
                effectTag: "ADD" // 标识为新增
            }
        }

        // 如果比较的时候有多个子节点，需要更新oldFiber
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (index === 0) { // 如果是第一个子节点，则作为当前fiber的子fiber
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber; // 将第二个以及之后的子节点作为上一个兄弟节点的兄弟节点
        }
        prevSibling = newFiber; // 将当前创建的fiber保存为其兄弟节点的上一个节点
        index++;
    }
}

function useState(init) {
    // 从上一次渲染完成的函数组件对应的fiber的hooks数组中根据索引获取到对应的hook
    const oldHook = functionComponentFiber.base && functionComponentFiber.base.hooks && functionComponentFiber.base.hooks[hookIndex];
    const hook = { // 创建一个新的hook，state从上次中获取
        state: oldHook? oldHook.state: init,
        queue: []
    };
    const newStates = oldHook ? oldHook.queue : []; // 从上次hook中获取最新的状态
    newStates.forEach(newState => {
        hook.state = newState; // 更新hook
    });
    const setState = (newState) => {
        hook.queue.push(newState); // 将新的状态放到hook的queue数组中
        rootFiber = {
            dom: oldRootFiber.dom,
            props: oldRootFiber.props,
            base: oldRootFiber
        }
        currentFiber = rootFiber;
    }
    functionComponentFiber.hooks.push(hook); // 将当前hook保存到函数组件对应的fiber节点的hooks数组中
    hookIndex++; // 可能会有多个状态
    return [hook.state, setState];
}
export default {
    createElement,
    render,
    useState
}


// 应用如下：


import React from "./fiber.jsx";
let ReactDOM = React;
function App(props) {
    const [minAge, setMinAge] = React.useState(1);
    const [maxAge, setMaxAge] = React.useState(100);
    return (
        <div>
        <h1>minAge: {minAge}</h1>
    <button onClick={() => setMinAge(minAge + 1)}>加</button>
    <h1>maxAge: {maxAge}</h1>
    <button onClick={() => setMaxAge(maxAge - 1)}>减</button>
    </div>
);
}
ReactDOM.render(<App/>, document.getElementById("root"));
