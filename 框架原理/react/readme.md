### JSX语法
JSX是JavaScript的一种语法扩展，它和模版语言很接近，但是它充分具备JavaScript的能力。所以
无法像JavaScript一样被直接执行。在React中之所以能够执行，是因为借助了Babel的转换，最终会被转换成一段JS。
```jsx
// JSX
let age = 18;
let element = (
    <div>
        <h1>age: {age}</h1>
        <button onClick={() => alert(18)}>修改age的值</button>
    </div>
)

// Babel解析为：

let age = 18;
let element = React.createElement("div", {}, 
    React.createElement("h1", {}, "age: ", age),
    React.createElement("button", {
        onClick: function onClick() {
            return alert(18);
        }
    }, "修改age的值"));
```
所以React只要提供createElement方法就可以正确解析JSX。

### React核心的API    
1. React.createElement: JSX就是createElement函数的返回值，经过createElement方法的处理，就能将JSX转换成对应的虚拟DOM节点

2. render：render方法会接收一个虚拟DOM对象和一个真实的容器DOM作为虚拟DOM渲染完成后的挂载点。其主要作用就是将虚拟DOM渲染为真实DOM
并挂载到容器下

3. Component


### 虚拟DOM
virtual dom，也就是虚拟节点。它通过JS的Object对象模拟DOM中的节点，然后再通过特定的render方法将其渲染成
真实的DOM。


### Fiber简介
我们可以把一个耗时长的 `任务` 分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长。但是在每个小片执行完之后，都给 `其他任务` 一个执
行的机会。这样唯一的线程就不会被独占，其他任务依然有运行的机会。

React中的Fiber就把整个更新过程碎片化。

render()方法在更新的时候是进行递归操作的，如果在更新的过程中有大量的节点需要更新，就会出现长时间占用JS主线程的情况，并且整个递归过程是无法被
打断的，由于JS线程和GUI线程是互斥的，所以可能会看到UI卡顿。

所以要实现Fiber架构，必须要解决两个问题：     
1.保证任务在浏览器空闲的时候执行。      
2.将任务进行碎片化。     

##### requestIdleCallback
requestIdleCallback(callback)是实验性API，可以传入一个回调函数，回调函数能够收到一个deadline对象，通过该对象的timeRemaining()方法
可以获取到当前浏览器的空闲时间，如果有空闲时间，那么就执行一小段任务，如果时间不足了，则继续requestIdleCallback，等到浏览器又有空闲时间
的时候再接着执行。

##### 链表结构
目前的虚拟DOM是树结构，当任务被打断后，树结构无法恢复之前的任务继续执行，所以需要一种新的数据结构，即链表，链表可以包含多个指针，可以轻易
找到下一个节点，继而恢复任务的执行。

Fiber采用的链表中包含三个指针，parent指向其父Fiber节点，child指向其子Fiber节点，sibling指向其兄弟Fiber节点。一个Fiber节点对应一个
任务节点。


### 实现Fiber
#### 保证任务在浏览器空闲的时候执行
定义一个工作循环回调函数，并通过requestIdleCallback注册，通过判断当前Fiber是否存在以及浏览器是否有空闲时间来判断是否需要打断任务执行
```js
// 新增如下代码
let currentFiber; // 保存当前工作的Fiber节点
let rootFiber; // 根Fiber节点，render()方法内会进行初始化
function commitRoot() {

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

function getNextFiber(fiber) {

}
```

#### 启动任务
目前我们注册了workLoop回调，其执行条件是currentFiber必须存在，所以要启动任务，必须初始化currentFiber，render()方法中将不再递归遍历
虚拟DOM，创建真实DOM并加入到容器中，我们需要在render()中初始化一个rootFiber，并把rootFiber当作是currentFiber。
```js
function render(vdom, container) {
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
```
Fiber节点和虚拟DOM节点非常相似，只是比虚拟DOM多了一些属性。

#### 实现获取下一个Fiber的逻辑
a. 首先看一下fiber对应的dom有没有创建出来，如果没有则创建出对应的真实DOM

b. 取出fiber的虚拟子节点并遍历，遍历的过程中开始层层构建fiber链表，将第一个子节点作为当前fiber的child，将第二个子节点作为第一个子节点
的sibling，以此类推，将第三个子节点作为第二个子节点的sibling，最终构建出下一层Fiber链表。

c. 下一层Fiber链表构建完成后，就可以找到下一个Fiber节点，即下一个任务了，获取下一个任务的时候，首先会把当前Fiber的child指向的fiber作为
下一个任务，如果当前Fiber没有child，那么就获取其sibling，如果当前Fiber也没有sibling了，那么就找到其parentFiber，再通过parentFiber找
到其sibling作为下一个任务。
```js

// 这里需要给Fiber节点创建出对应的真实DOM，所以将创建DOM的方法抽取出来
function createDOM(vdom) {
    let dom;
    if (vdom.type === "TEXT") {
        dom = document.createTextNode("");
    } else {
        dom = document.createElement(vdom.type);
    }
    updateProperties(dom, vdom.props);
    return dom;
}
function getNextFiber(fiber) {
    if (!fiber.dom) { // 刚开渲染的时候，只有根fiber才有对应的dom，即容器
        fiber.dom = createDOM(fiber);
    }
    const vchildren = (fiber.props && fiber.props.children) || []; // 取出当前fiber的子节点，即子虚拟DOM
    createFiberLinkedList(fiber, vchildren);
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
    let prevSibling = null; // 兄弟节点的上一个节点
    while(index < vchildren.length) { // 遍历子节点，进行层层构建
        let vchild = vchildren[index];
        let newFiber = { // 根据子节点构造出对应的Fiber节点
            type: vchild.type, // 当前节点类型 h1
            props: vchild.props, // 当前节点属性
            parent: fiber, // 指向父节点
            dom: null,
            child: null
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
```

#### 提交整个根Fiber并渲染出界面
现在根Fiber已经构建完成，接下来就是将整个根Fiber进行提交，然后渲染出界面，提交的时候需要将整个根Fiber重置为null，避免多次提交。

提交的时候首先从根Fiber的child开始，找到其父Fiber对应的DOM，然后将子Fiber对应的DOM加入到父Fiber对应的DOM中，接着重复该过程递归将
当前Fiber的child和sibling进行提交。
```js

function commitRoot() {
    commitWorker(rootFiber.child); // 将根fiber的子fiber传入
    rootFiber = null;
}
function commitWorker(fiber) {
    if (!fiber) {
        return;
    }
    const parentDOM = fiber.parent.dom; // 拿到当前fiber的父fiber对应的dom
    parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    commitWorker(fiber.child); // 递归将当前fiber的子fiber提交
    commitWorker(fiber.sibling); // 递归将当前fiber的下一个兄弟fiber提交
}
```


### 支持函数组件
函数组件的type比较特殊，是一个函数，无法像HTML标签一样，直接通过document.createElement()方法创建出对应的DOM元素，所以在
getNextFiber()的时候，必须先判断是否是函数组件，如果是函数组件，那么不创建DOM，而是执行函数组件获取到其返回的虚拟节点作为函数组件对应
Fiber的子节点。
```js
function doFunctionComponent(fiber) {
    const vchildren = [fiber.type(fiber.props)]; // 执行函数组件拿到对应的虚拟DOM作为函数组件的虚拟子节点
    createFiberLinkedList(fiber, vchildren);
}

function doNativeDOMComponent(fiber) {
    if (!fiber.dom) { // 刚开渲染的时候，只有根fiber才有对应的dom，即容器
        fiber.dom = createDOM(fiber);
    }
    const vchildren = (fiber.props && fiber.props.children) || []; // 子节点就是虚拟DOM
    createFiberLinkedList(fiber, vchildren);
}

function getNextFiber(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";
    if (isFunctionComponent) { // 处理函数组件
        doFunctionComponent(fiber);
    } else { // 处理DOM
        doNativeDOMComponent(fiber);
    }
}
```
新增了函数组件对应的Fiber节点后，在提交的时候会存在一些问题:

a. 由于函数组件对应的Fiber没有对应的真实DOM，所以无法直接通过其父Fiber的DOM将其加入

b. 由于函数组件对应的Fiber没有对应的真实DOM，所以其子Fiber节点也无法通过其父Fiber(函数组件对应的Fiber)
获取到DOM并加入子Fiber节点对应的DOM。
```js
function commitWorker(fiber) {
    // const parentDOM = fiber.parent.dom; // 拿到当前fiber的父fiber对应的dom
    let parentFiber = fiber.parent; // 获取到当前Fiber的父Fiber
    while (!parentFiber.dom) { // 看看父Fiber有没有DOM，如果没有说明是函数组件对应的Fiber，需要继续向上获取其父Fiber节点，直到其父Fiber有DOM为止
        parentFiber = parentFiber.parent;
    }
    const parentDOM = parentFiber.dom; // 获取到父Fiber对应的真实DOM
    // parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    if (fiber.dom) { // 如果当前fiber存在dom则加入到父节点中, 函数组件没有对应dom
        parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    }
}
```
useState可以让我们的函数组件拥有自己的状态。useState的实现非常简单，首先在创建函数组件对应Fiber的时候，会给
其添加一个hooks数组，用于存储当前函数组件内创建的hook。

每当执行useState()函数的时候，内部会创建一个hook对象，该hook对象包含了当前的state和修改时传入的最新状态
数组queue，同时返回一个setState()函数，然后将创建的hook放到函数组件对应Fiber的hooks数组内。

当setState(newState)函数被调用的时候，传入的最新状态就会被放到hook的queue数组中，同时更新rootFiber和currentFiber，以便让workLoop
可以继续执行，此时整个组件将会被重新渲染，当函数组件重新渲染的时候，useState()也会重新执行，此时会通过上一次渲染时函数组件对应的Fiber拿到
上一次的hook，继而从hook的queue中取出调用setState时候传入的最新状态数据，然后更新为当前hook的状态，从而使状态得到更新。
```js
let functionComponentFiber; // 保存函数组件对应的Fiber
let hookIndex; // 可能一个组件中使用到多个hook，记录hook的索引
let oldRootFiber; // rootFiber提交完后保存为旧的rootFiber即上一次渲染的rootFiber
function doFunctionComponent(fiber) {
    functionComponentFiber = fiber; // 保存函数组件对应的Fiber节点
    hookIndex = 0; // 初始化hook索引为0
    functionComponentFiber.hooks = []; // 并在函数组件对应的fiber上添加一个hooks数组，每次重新渲染都会重新初始化为空数组
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
```

在useState()中需要获取上一次的hook，所以需要给Fiber节点增加一个base属性用于保存上一次的Fiber节点。
```js
function createFiberLinkedList(fiber, vchildren) {
    let oldFiber = fiber.base && fiber.base.child; // 取出第一个子节点对应的oldFiber
    while(index < vchildren.length) { // 遍历子节点，进行层层构建
        let newFiber = { // 根据子节点构造出对应的Fiber节点
            type: vchild.type, // 当前节点类型 h1
            props: vchild.props, // 当前节点属性
            parent: fiber, // 指向父节点
            dom: null,
            child: null,
            base: oldFiber // 保存上一次的Fiber
        }
        // 如果比较的时候有多个子节点，需要更新oldFiber
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
    }
}
```

此时还有一个问题，就是重新渲染的时候，必须将容器DOM中上一次渲染的DOM清空，否则会重新创建一份DOM追加到容器DOM中。

```js
function commitRoot() {
    let rootDOM = rootFiber.dom; // 取出容器DOM
    while(rootDOM.hasChildNodes()) {
        rootDOM.removeChild(rootDOM.firstChild); // 清空容器DOM中的子节点
    }
}
```

### 实现DOM-DIFF
DOM-DIFF主要就是比较两个Fiber节点的type是否一致，如果一致则进行复用上一次渲染的DOM节点，然后更新DOM的属性即可
```js
function createFiberLinkedList(fiber, vchildren) {
    while(index < vchildren.length) { // 遍历子节点，进行层层构建
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
    }
}
```

由于进行了DOM的复用，所以在提交DOM的时候，就不用先将容器DOM的所有子节点清空了，如:

```js
function commitRoot() {
    // 不需要先清空容器DOM的所有子节点了
    // let rootDOM = rootFiber.dom;
    // while(rootDOM.hasChildNodes()) {
    //     rootDOM.removeChild(rootDOM.firstChild);
    // }
}
function commitWorker(fiber) {
    if (fiber.effectTag === "ADD" && fiber.dom != null) { // 新增
        parentDOM.appendChild(fiber.dom); // 将当前fiber对应的dom加入父dom中
    } else if (fiber.effectTag === "UPDATE" && fiber.dom !== null) { // 更新
        updateProperties(fiber.dom, fiber.base.props, fiber.props);
    }
}
```

复用之前的DOM时，需要更新DOM上的属性，所以需要修改updateProperties()方法，传入新的和旧的属性，如

```js
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
```

### 完整代码件lib文件夹下的fiber.js
