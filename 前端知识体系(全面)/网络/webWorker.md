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

### worker环境
在Worker内部是无法访问主程序的任何资源的。这意味着不能访问它的任何全局变量，也不能访问页面的DOM或者其他资源。这是一个完全独立的线程。
但是，可以执行网络操作（Ajax、WebSockets）以及设定定时器。还有Worker可以访问几个重要的全局变量和功能的本地复本，包括navigator、location、JSON
和applicationCache。还可以通过importScripts(..)向Worker加载额外的JavaScript 脚本

***worker和主线程之间传递的是消息的副本，而不是消息本身***

Web Worker 通常应用于哪些方面呢？
- 处理密集型数学计算
- 大数据集排序
- 数据处理（压缩、音频分析、图像处理等）
- 高流量网络通信

### worker的种类
- 专用workers
- Shared Workers
- Service Workers
- Chrome Workers
- 音频 Workers


#### 专用worker
- 通过`new Worker(url)`创建Worker时，即使url相同，那么每次调用`new`都会新建一个专用worker，这些worker相互独立
- 如果检查开发者工具Network，会发现有对worker.js文件的请求

index.html：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>Web Workers Demo</title>
  </head>
  <body>
    <button id="btn">click</button>
    <script>
      const btn = document.querySelector('#btn');
      const myWorker = new Worker("worker.js");
      const data = { from: '主线程' }
      myWorker.onmessage = function(e) {
        console.log('主线程接收worker数据:', e.data);
      }

      btn.onclick = function(){
        myWorker.postMessage(data);
      }

    </script>
  </body>
</html>
```
worker.js：
```javascript
onmessage = function(e) {
    const receivedData = e.data;
    console.log('Worker1接收到的数据：', e.data);
    receivedData.from = 'worker';
    const start = new Date().getTime()
    while(new Date().getTime() - start < 5000){}
    postMessage(receivedData);
}
```

####共享Worker
- `共享Worker`可以降低系统的资源使用。通过`new SharedWorker(url);` 创建`共享worker`时，只要url相同，那么所有这些脚本共用一个worker
- 端口（port）。由于`共享worker`可以与站点的多个页面连接，因此需要通过`port`识别消息来自哪个页面。
- connect事件。与`专用worker`不同，`共享worker`内部必须要额外处理`connect`事件。
- 遵循同源协议。如果要使`共享worker`连接到多个不同的页面，这些页面必须是同源的（相同的协议、host 以及端口）
- 如果显示调用`port.addEventListener`监听`message`事件，则必须调用`port.start()`
- 问题比较大的是，在本地开发时，只要调用过一次`new SharedWorker(url);`创建一个`共享worker`，这个worker会一直存在，即使本地开发时修改了worker文件，浏览器
  不会再创建新的worker，依旧使用的是第一次创建的worker，因此如果文件有改动，可以手动终止worker
- 检查开发者工具Networker，发现并没有对worker.js文件的请求，这是为啥？

index.html：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>页面1</title>
  </head>
  <body>
    <div>页面1</div>
    <button id="btn">click</button>
    <script>
        const btn = document.querySelector('#btn');
        const myWorker = new SharedWorker("./myWorker.js");
        const data = { number: 10 }
        myWorker.port.onmessage = function(e) {
            console.log('【页面1】接收到worker的消息：',e.data, e.lastEventId)
        }
        btn.onclick = function(){
            console.log('【页面1】click：',myWorker)
            myWorker.port.postMessage(data);
        }
    </script>
  </body>
</html>
```

index2.html：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>页面2</title>
</head>
<body>
<div>页面2</div>
<button id="btn">click</button>
<script>
    const btn = document.querySelector('#btn');
    const myWorker = new SharedWorker("myWorker.js");
    const data = { number: 20 }
    myWorker.port.onmessage = function(e) {
        console.log('【页面2】接收到worker的消息：',e.data, e.lastEventId)
    }
    btn.onclick = function(){
        myWorker.port.postMessage(data);
    }
</script>
</body>
</html>
```
myWorker.js：
```javascript
const clients = [];
onconnect = function(e) {
    const port = e.ports[0];
    clients.push(port)
    console.log('worker建立连接：', clients)
    port.onmessage = function(e) {
        const data = e.data;
        console.log('port...', port)
        console.log('worker接收到主线程的信息：', data)
        if(data.type === 'BROADCAST'){
            broadCast(data)
        } else {
            data.sum = data.number + data.number + 12;
            port.postMessage(data);
        }
    }
}

const broadCast = (message) => {
    clients.forEach(client => {
        client.postMessage(message)
    })
}
```
