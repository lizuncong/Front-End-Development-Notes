### React核心的几个步骤
- createElement function
  + babel会将jsx转换成React.createElement方法，这个方法返回值是一个对象
    至少包含type和props属性。
  + 调用该方法后，最终生成的是一个dom树。
    { type, props: { children: [ { type, props } ] } }
- render function
  + 接收一个element参数和一个container参数
  + 首先，对每一个element，调用document.createElement(element.type)创建真实的dom
  + 然后给dom添加props中的属性
  + 对children里面的子元素，递归的调用render方法创建真实的dom
  + 将创建的dom append到container中。
  + 递归过程完了以后，就可以在浏览器上看到页面了。
- concurrent mode
  + 将render任务拆分成小的执行单元。
  + 在每个执行单元完成后，浏览器都可以打断这个render过程。
- fibers
  + 每个fiber节点都包含一个dom属性，这个dom属性包含了fiber节点对应的真实dom节点(通过document.createElement(fiber.type)创建的)。
  + performUnitOfWOrk函数主要做了以下几件事：
      + 1.接收当前fiber对象做为参数
      + 2.调用document创建DOM元素，并添加到fiber的父节点中。即fiber.parent.dom.appendChild(fiber.dom)
      + 3.遍历fiber的props.children属性，为每个child创建fiber节点，同时为当前的fiber设置child指针，为每个子节点设置兄弟指针。注意这个过程并没有递归操作。
      + 4.查找下一个可执行单元并返回给workLoop。查找过程：先找子节点，再找兄弟节点，最后是父节点的兄弟节点，以此类推，直到返回根节点。
      + 5.如果返回到了根节点，说明render过程已经完成，这个过程完成了以后，同时也生成了一棵fiber树。
- render and commit phases。这里主要解释了为啥需要commit阶段
  + 仔细观察上一节fibers中performUnitOfWOrk函数的第2点，每次调用performUnitOfWOrk都会创建一个dom并添加到dom中，如果此时浏览器打断render的过程
    执行其他任务，那么用户看到的将是不完整的界面，因此这里是存在问题的。
  + 为了解决这个问题，在performUnitOfWOrk函数中只创建真实的dom元素，但并不添加到fiber.parent.dom中。
  + 因此需要使用一个wipRoot变量保存fiber树的根节点。
  + 当performUnitOfWOrk返回的下一个fiber不存在时，说明已经找到根节点了，此时render阶段结束，同时生成了一棵完整的fiber树。然后进入commit阶段，
    调用commitRoot方法将fiber树提交给dom。commitRoot首先将当前fiber的dom元素append到fiber.parent.dom中。
    然后再递归调用子节点，然后是兄弟节点。这个过程是一气呵成的。最后将wipRoot变量重置为null。
- reconciliation协调过程
  + 上面的commit阶段只是简单的添加DOM，并没有涉及更新或者删除节点的过程。
  + 我们使用currentRoot变量保存当前页面对应的fiber树，当组件调用setState触发render时，render方法又会重新从根节点开始创建一棵新的fiber树，我们使用
    wipRoot变量保存render方法重新生成的这棵fiber树。
  + 同时，我们给每一个fiber节点新增一个alternate属性，这个属性指向旧的fiber节点，即currentRoot中的fiber节点。
  + 注意，performUnitOfWork函数中，不再创建新的节点，即删除第2和第3个步骤，变成调用reconcileChildren方法。
- function components
- hooks

### 来认识一下requestIdleCallback
requestIdleCallback接收一个函数做为参数，这个函数会在每一帧的浏览器空闲时间执行。
这个函数接收一个deadline对象，deadline对象里面有一个timeRemaining api可以查看浏览器当前帧还有多少
剩余空间。



### render方法的问题
可以看出，在render方法中，一旦开始调用render，那么就会递归的执行，直到创建出完整的dom树，这个过程是不能中断的。
如果组件层级很深，这个过程就会占用主线程很久，导致页面卡顿。


### 说说Fibers
在React16以前，React.createElement创建出来的virtual dom是一种树结构的数据，然后react.render方法会递归的调用，创建dom，
然后添加到dom容器中。这个过程是不可中断的，如果vdom树很深，就会长时间占用主线程导致页面卡顿。

React16进行了重构，将render拆分成小的可中断执行的单元。为了能组织这种执行单元，就需要一种Fiber Tree数据结构。

本质上，Fiber Tree就是一个链表结构的树。每个Fiber节点包含指向子节点，兄弟节点，父节点的指针，这样方便查找下一个执行单元。
