### etag的生成需要满足几个条件
至少是宽松满足
- 当文件更改时，etag 值必须改变。
- 尽量便于计算，不会特别耗 CPU。这样子利用摘要算法生成 (MD5, SHA128, SHA256) 需要慎重考虑，因为他们是 CPU 密集型运算
- 必须横向扩展，分布式部署时多个服务器节点上生成的 etag 值保持一致。这样子 inode 就排除

以上几个条件是理论上的成立条件，那在真正实践中，应该如何处理？实际上，生成etag值时并没有统一的算法规则

### nginx 中 ETag 的生成
这部分内容未经实践，列出来就当作参考吧

nginx 中 etag 由响应头的 Last-Modified 与 Content-Length 表示为十六进制组合而成。

比如：
```bash
$ curl --head 10.97.109.49
HTTP/1.1 200 OK
Server: nginx/1.16.0
Date: Tue, 10 Dec 2019 06:45:24 GMT
Content-Type: text/html
Content-Length: 612
Last-Modified: Tue, 23 Apr 2019 10:18:21 GMT
Connection: keep-alive
ETag: "5cbee66d-264"
Accept-Ranges: bytes
```
由 etag 计算 Last-Modified 与 Content-Length，使用 js 计算如下，结果相符

```bash
> new Date(parseInt('5cbee66d', 16) * 1000).toJSON()
"2019-04-23T10:18:21.000Z"
> parseInt('264', 16)
612
```

### Nginx 中的 ETag 算法及其不足
Last-Modified 是由一个 unix timestamp 表示，则意味着它只能作用于秒级的改变，而 nginx 中的 ETag 添加了文件大小的附加条件

因此使用 nginx 计算 304 有一定局限性：在 1s 内修改了文件并且保持文件大小不变。但这种情况出现的概率极低就是了，因此在正常情况下可以容忍一个
不太完美但是高效的算法。

### 如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改
不一定，由服务器中 ETag 的生成算法决定。比如 nginx 中的 etag 由 last_modified 与 content_length 组成，而 last_modified 又由 mtime
组成。当编辑文件却未更改文件内容时，或者 touch file，mtime 也会改变，此时 etag 改变，但是文件内容没有更改。


### 文件系统中 mtime 和 ctime 指什么，都有什么不同
在 linux 中
- mtime：modified time 指文件内容改变的时间戳
- ctime：change time 指文件属性改变的时间戳，属性包括 mtime。而在 windows 上，它表示的是 creation time
所以 ctime 会比 mtime 要大一些。而 http 服务选择 Last_Modified 时一般会选择 mtime
