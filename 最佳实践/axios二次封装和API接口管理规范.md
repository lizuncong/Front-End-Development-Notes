#### 数据请求的进化史 ajax -> axios -> fetch

ajax是基于 `XHRHttpRequest` 进行的封装，就不用每次发请求都手动 new XHRHttpRequest 这么原始。

axios是基于ajax和promise进行封装的。

fetch是浏览器原生内置的api，支持基于promise进行管理。有兼容性问题，IE都不兼容

