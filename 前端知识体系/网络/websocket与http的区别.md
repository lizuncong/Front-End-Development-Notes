### HTTP协议

基于请求与响应的协议，请求必须由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。

HTTP协议实现实时通信的方案：

- 轮询。js启动一个定时器，以固定的间隔给服务器发请求，询问服务器有没有新消息。缺点：
    + 实时性不够
    + HTTP请求可能包含较长的头部，频繁的请求会给服务器带来极大的压力
- Comet。本质上也是轮询，在没有消息的情况下，服务器先拖一段时间，等到有消息了再回复。这个机制暂时地解决了实时性问题，但是它带来了新的问题：
    + 大部分线程大部分时间都处于挂起状态，极大地浪费服务器资源
    + HTTP连接在长时间没有数据传输的情况下，链路上任何一个网关都可能关闭这个连接。这就要求Comet连接必须定期发一些ping数据表示连接“正常工作”

以上这些方案都带有HTTP开销，不适用于低延迟程序。

### websocket
html5新增的协议，利用了HTTP协议来建立连接，目的是在浏览器和服务器之间建立一个不受限的双向通信的通道，任何一方都可以主动发消息给对方。

WebSocket连接必须由浏览器发起，因为请求协议是一个标准的HTTP请求。为了建立一个WebSocket连接，浏览器首先要向服务器发起一个HTTP请求，这个请求和普通的HTTP请求不同，包含了一些附加头信息。格式如下：

```bash
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```
该请求和普通的HTTP请求有几点不同：
- GET请求的地址不是类似`/path/`，而是以`ws://`开头的地址。
- 请求头Upgrade: websocket和Connection: Upgrade表示这个连接将要被转换为WebSocket连接

随后，服务器如果接受该请求，就会返回如下响应：
```bash
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```
该响应代码101表示本次连接的HTTP协议即将被更改，更改后的协议就是Upgrade: websocket指定的WebSocket协议。

### WebSocket的消息类型
WebSocket的消息有两种，一种是文本，一种是二进制数据。

### 为什么WebSocket连接可以实现全双工通信而HTTP连接不行呢？
实际上，HTTP协议是建立在TCP协议之上的，TCP协议本身就实现了全双工通信，但是HTTP协议的请求-应答机制限制了
全双工通信。WebSocket连接建立以后，其实只是简单规定了一下：接下来，咱们通信就不使用HTTP协议了，直接互相发数据吧。

安全的WebSocket连接机制和HTTPS类似。首先，浏览器使用`wss://xxx`创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的`SSL/TLS`协议。


### 简单的代码实现

服务端

```js

```