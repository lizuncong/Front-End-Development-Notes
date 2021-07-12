### Cache-Control支持的字段
- 客户端可以在HTTP请求中使用的标准 Cache-Control 指令。
    + Cache-Control: max-age=<seconds>
    + Cache-Control: max-stale[=<seconds>]
    + Cache-Control: min-fresh=<seconds>
    + Cache-control: no-cache
    + Cache-control: no-store
    + Cache-control: no-transform
    + Cache-control: only-if-cached

- 服务器可以在响应中使用的标准 Cache-Control 指令。
    + Cache-control: must-revalidate
    + Cache-control: no-cache
    + Cache-control: no-store
    + Cache-control: no-transform
    + Cache-control: public
    + Cache-control: private
    + Cache-control: proxy-revalidate
    + Cache-Control: max-age=<seconds>
    + Cache-control: s-maxage=<seconds>
