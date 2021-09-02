### 概念
Web Workers可以在独立于主线程的后台线程中，运行一个脚本操作。这样做的好处是可以在独立线程中执行费时的处理任务，从而允许主线程（通常是UI线程）不会因此被阻塞/放慢

### 用法
使用 Worker('./a.js') 创建一个worker对象。Worker构造函数接收一个JS文件URL

- Worker运行在与当前window不同的另一个全局上下文中，叫 DedicatedWorkerGlobalScope
- 不能在worker线程中操纵DOM元素，或使用window对象中的某些方法和属性。大部分window对象的方法和属性是可以使用的，包括websocket，indexeddb等。
- 主线程和 worker 线程相互之间使用 postMessage() 方法来发送信息，数据的交互方式为传递副本，而不是直接共享数据。
- worker 可以另外生成新的 worker，这些 worker 与它们父页面的宿主相同
- worker 可以通过 XMLHttpRequest 来访问网络，只不过 XMLHttpRequest 的 responseXML 和 channel 这两个属性的值将总是 null 。
- 所有 Worker 必须与其创建者同源

### worker的种类
- Shared Workers
- Service Workers
- Chrome Workers
- 音频 Workers