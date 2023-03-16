### Server Sent Event 服务器发送事件
- 基于HTTP。HTTP长连接。会收到浏览器对HTTP连接数的限制。http1.x最多6个连接。使用HTTP / 2时，HTTP同一时间内的最大连接数由服务器和客户端之间协商（默认为100）
- 单向的，只允许服务器推送数据，客户端不能发送数据
- 事件流仅仅是一个简单的文本数据流,文本应该使用 UTF-8 格式的编码.每条消息后面都由一个空行作为分隔符.以冒号开头的行为注释行,会被忽略
- 服务端负责发布消息给所有连接的客户端，客户端接收数据并更新视图。

### SSE和Websocket的比较
- 都是h5的api。SSE是单向的，只能由服务器向浏览器发送数据。WebSocket是双向的，浏览器和服务器双向通信。
- 由于浏览器对HTTP连接数的限制，因此SSE连接数也会受到浏览器的限制。WebSocket就不会受到这个限制。
- 协议不同。SSE是http协议，基于http长连接实现的。websocket本身就是一种协议，不同于http协议。
- 连接。sse和websocket的连接都是一个get请求
- 兼容性。IE不支持SSE。Websocket兼容各种浏览器，包括ie。
- 数据传输。SSE只能是UTF-8格式编码的文本数据流。websocket支持文本数据流和二进制数据流。

### WebSocket和HTTP2的使用场景
- 当你需要在客户端和服务端建立一个真正的低延迟的，接近实时连接的时候使用 WebSockets
- 如果你的使用场景要求显示实时市场新闻，市场数据，聊天程序等等，考虑使用HTTP/2 + SSE，有以下优点：
    + 当考虑现有架构的兼容性的时候，WebSockets 经常会是一个痛点，因为升级 HTTP 连接到一个完全和 HTTP 不相关的协议。
    + 可扩展性和安全：网络组件（防火墙，入侵检测，负载均衡器）的建立，维护和配置都是为 HTTP 而设计的，大型／重要的程序会更喜欢具有弹性，安全和可伸缩性的环境


### 服务端实现
- 服务端需要保持所有的客户端连接，并在数据变化时广播给所有连接的客户端。
- 需要按照一定的格式返回事件流
- 服务器端发送的响应内容应该使用值为text/event-stream的MIME类型.每个通知以文本块形式发送，并以一对换行符结尾。有关事件流的格式的详细信息，请参见Event stream format。
- 事件流格式：事件流仅仅是一个简单的文本数据流,文本应该使用 UTF-8 格式的编码.每条消息后面都由一个空行作为分隔符.以冒号开头的行为注释行,会被忽略.
    + `event: ping\n data: JSON.stringify(data)\n\n`

```js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let clients = [];
let person = [{name: 'lzc', age: 20}];

// 允许跨域
app.use((req, res, next) => {
    if(req.method === 'OPTIONS'){
        // 预检请求
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end();
     } else {
        // 普通请求
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Vary', 'Origin');
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        next()
     }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// 没有指定消息类型
function sendEventsToAllClients(person) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(person)}\n\n`))
}
 // 指定消息类型，每次有新的连接都通知所有连接的客户端
function sendConnectEventsToAllClients(person) {
    clients.forEach(client => client.response.write(`event: client\ndata: ${JSON.stringify(clients.map(c => c.id))}\n\n`))
} 
app.post('/addPerson', (request, respsonse, next) => {
    const p = request.body;
    person.push(p);
    respsonse.json(p)
    return sendEventsToAllClients(person);
});

app.get('/connect', (request, response, next) => {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
    clients.push(newClient);
   
    sendConnectEventsToAllClients(clients)

    // 连接关闭
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
      // 有连接断开也要通知客户端
      sendConnectEventsToAllClients(clients)
    });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SSE Events service listening at http://localhost:${PORT}`)
})
```

### 前端实现
```jsx
import React, { useState, useEffect } from 'react';
import { post } from './ajax'
function App() {
  const [ data, setData ] = useState([]);
  const [clients, setClients] = useState([])
  useEffect(() => {
      const evtSource = new EventSource('http://localhost:3001/connect');
      // onmessage监听从服务器发送来的所有没有指定事件类型的消息(没有event字段的消息)
      evtSource.onmessage = (event) => {
        console.log('没有指定事件类型的消息...', event)
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      };

      // 使用addEventListener()方法来监听其他类型的事件
      // 只有在服务器发送的消息中包含一个值为"client"的event字段的时候才会触发对应的处理函数
      evtSource.addEventListener("client", function(event) {
        console.log('client....', event.data)
        setClients(JSON.parse(event.data))
      });

      evtSource.onerror = function(err) {
        console.error("EventSource failed:", err);
      };
  }, []);

  return (
    <div>
        data: {JSON.stringify(data)}
        <div>
            <button
                onClick={() => {
                    post('/addPerson', {name: 'lzc2', age: 22 })
                }}
            >
                新增一个数据
            </button>
        </div>
        <div>连接的客户端：{JSON.stringify(clients)}</div>
    </div>
  );
}

export default App;
```

ajax
```js
import querystring from 'querystring'
export default function ajax(url, type, params){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            if(xhr.status === 200){
                return resolve(xhr.response||xhr.responseText);
            }
            return reject('请求失败');
        }
        xhr.onerror = ()=>{
            return reject('出错了');
        }
        xhr.open(type, url);
        // xhr.withCredentials = true; 
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(params);
    })
}

export const get = (path, params) => {
    const url = `http://localhost:3001${path}/?id=${params.id}`
    return ajax(url, 'GET')
}

export const post = (path, params) => {
    const url = `http://localhost:3001${path}`
    return ajax(url, 'POST', querystring.stringify(params))
}
```