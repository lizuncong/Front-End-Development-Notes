### Cache-Control支持的字段分类
Cache-Control支持的字段可以分为以下几类：
- 可缓存性。public，private，no-cache，no-store
- 到期，单位都是秒。max-age，s-maxage，max-stale，min-fresh，stale-while-revalidate，stale-if-error
- 重新验证和重新加载。must-revalidate，proxy-revalidate，immutable
- 其他。no-transform，only-if-cached


### Cache-Control支持的字段，按请求和响应分
- 客户端可以在HTTP请求中使用的标准 Cache-Control 指令。
    + Cache-control: no-cache
    + Cache-control: no-store
    + Cache-Control: max-age
    + Cache-Control: max-stale
    + Cache-Control: min-fresh。表示客户端希望获取一个能在指定的秒数内保持其最新状态的响应
    + Cache-control: no-transform
    + Cache-control: only-if-cached

- 服务器可以在响应中使用的标准 Cache-Control 指令。
    + Cache-control: public。表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容
    + Cache-control: private。表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）
    + Cache-control: no-cache。在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)
    + Cache-control: no-store。缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存
    + Cache-Control: max-age。设置缓存存储的最大周期，超过这个时间缓存被认为过期(单位秒)。与Expires相反，时间是相对于请求的时间。
    + Cache-control: s-maxage。覆盖max-age或者Expires头，但是仅适用于共享缓存(比如各个代理)，私有缓存会忽略它
    + Cache-control: must-revalidate。一旦资源过期（比如已经超过max-age），在成功向原始服务器验证之前，缓存不能用该资源响应后续请求
    + Cache-control: no-transform。不得对资源进行转换或转变。Content-Encoding、Content-Range、Content-Type等HTTP头不能由代理修改
    + Cache-control: proxy-revalidate

