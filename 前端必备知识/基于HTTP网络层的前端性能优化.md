### 产品性能优化方案
- HTTP网络层优化
- 代码编译层优化
- 代码运行层优化 html/css + javascript + vue + react
- 安全优化 xss + csrf
- 数据埋点及性能监控

### CRP(Critical Rendering Path)关键渲染路径

### 从输入URL地址到看到页面，中间都经历了啥
- URL解析
  + URL解析涉及到一个URL编码的问题，假设有这么一个url：http://www.baidu.com/api/?name=测试&from=http://www.google.com/。这个URL在解析的时候
  会出现问题。因此需要对URL进行编码
    + encodeURI / decodeURI。对整个URL的编码，处理空格/中文。encodeURI(url)
    + encodeURIComponent / decodeURIComponent。主要对传递的参数信息编码。
    `http://www.baidu.com/api/?name=${encodeURIComponent('测试')}&from=${encodeURIComponent('http://www.google.com/')}`

- 缓存检查。缓存是性能优化的重点。缓存有两种方式：`强缓存` 和 `协商缓存`。
  + 缓存检测
    + 浏览器首先检测是否存在强缓存，有强缓存且未失效，则直接走强缓存。如果没有强缓存或者强缓存失效，则检测是否有协商缓存
    + 如果有协商缓存且未失效，则走协商缓存，如果没有协商缓存或者协商缓存失效，则获取最新的资源
    
  + 缓存位置：Memory Cache 内存缓存。Disk Cache硬盘缓存。
  
  + 打开网页或者刷新对于缓存的处理
    + 打开网页：查找disk cache中是否有匹配，如有则使用，如没有则发送网络请求
    + 普通刷新(F5)，因TAB没关闭，因此memory cache是可用的，会被优先使用，其次才是disk cache。
    + 强制刷新(Ctrl + F5)。浏览器不使用缓存，因此发送的请求头部均带有Cache-control:no-cache，服务器直接返回200和最新内容。
 
  + 强缓存。 Expires/ Cache-control。浏览器对于强缓存的处理，根据第一次请求资源时返回的响应头来确定的。
    + Expires(HTTP/1.0字段)：缓存过期时间，用来指定资源到期的时间。
    + Cache-Control(HTTP/1.1)：cache-control：max-age=2592000第一次拿到资源后的2592000秒内(30天)，再次发送请求，读取缓存中的信息
    + 两者同时存在的话，Cache-Control优先级高于Expires
    + 对于不经常更新的资源，比如图片啥的，都可以使用强缓存。
    
  + 协商缓存。Last-Modified / ETag。强缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存。
    + Last-Modified。资源文件最后更新的时间
    + ETag。记录的是一个标识(也是根据资源文件更新生成的，每一次资源更新都会重新生成一个ETag)
    + 客户端携带获取的缓存标识(If-Modified-Since / If-None-Match)发送HTTP请求。
    + 服务器判断资源文件是否更新
      + 没更新，返回304，通知客户端读取缓存信息
      + 更新了，返回200及最新的资源信息，以及Last-Modified / ETag
    + 流程。第一次向服务器发送请求，假设此时没有强缓存和协商缓存。则浏览器直接向服务器发送请求，此时没有携带任何的缓存标识。
    服务器收到请求准备数据，并设置缓存标识。
    第二次发送请求，客户端会带上If-Modified-Since = Last-Modified的值。或者If-None-Match = ETag的值。

- DNS解析。通过域名在DNS服务器上查找对应的服务器IP。DNS也是有缓存的。DNS解析查找顺序：浏览器缓存 -> 本地的hosts文件 -> 本地DNS解析器缓存 -> 本地DNS服务器
  + 第一次DNS解析时间预计在20-120毫秒
    + 减少DNS请求次数。一个页面中尽可能少用不同的域名，或者资源都放在相同的服务器上，实际上并不会这么做，实际项目中，不同资源往往会放在不同的服务器上。
    + 在域名较多的情况下，可以进行DNS预获取(DNS Prefetch)。<link rel="dns-prefetch" href="//img10.360buyimg.com" />
  + 服务器拆分的优势，即将资源分配在不同的域名服务器上的优势
    + 资源的合理利用
    + 抗压能力加强
    + 提高HTTP并发
    
- TCP三次握手，建立连接通道
  + seq序号，用来标识从TCP源端向目的端发送的字节流，发起方发送数据时对此进行标记。
  + ack确认序号，只有ACK标识位为1时，确认序号字段才有效，ack=seq + 1。
  + 标识位
    + ACK：确认序号有效
    + RST：重置连接
    + SYN：发起一个新连接
    + FIN： 释放一个连接 

    
### 数据缓存
- localStorage
- redux
- vuex
