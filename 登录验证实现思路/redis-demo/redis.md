### session的问题
上一节中介绍了session的基本实现及存在的问题。为了解决这些问题，就引入了redis解决方案

### redis
- web server最常用的缓存数据库， 数据存放在内存中
- 相比于mysql，redis访问速度快
- 成本更高，可存储的数据量更小
- 因此可将session存储在redis中

### 为何session适合用redis
- session访问频繁，对性能要求极高
- session可不考虑断电丢失数据的问题(内存的硬伤)
- session数据量不会很大(相比于mysql中的数据)

### redis使用
- 安装redis
- 打开终端，输入redis-server启动redis服务
- 新开一个终端窗口，输入redis-cli，此时可以输入redis命令操作redis。比如keys *查看所有的key

### nodejs连接redis
- 首先要安装redis包
