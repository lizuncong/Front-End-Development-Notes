### script标签
当浏览器解析html文档构建DOM树时遇到 `<script>...</script>` 标签，浏览器必须立刻执行此脚本，才能继续往下构建DOM树。

对于外部脚本 `<script src="..."></script>`也是一样的，浏览器必须等待脚本下载完并执行结束后，才能继续往下构建DOM树。

### async 和 defer的区别（面试只需要回答到这里就好了）
- async 加载(fetch)完成后立即执行 (execution)，并不会保证相邻的两个async脚本的执行顺序
- defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)**，但会在事件 DomContentLoaded 之前。同时会保证相邻的两个
defer脚本的执行顺序

### script标签执行的几种方式
async和defer属性都是只用于加载外部脚本
- async = "async"。The script is executed asynchronously with the rest of the page (the script will be executed while the page continues the parsing)，
即该脚本与页面的其余部分异步执行（脚本将在页面继续解析的同时执行）。
- 如果不存在async属性，并且defer = "defer"。The script is executed when the page has finished parsing，即页面解析完成后执行脚本
- 既不存在async属性，又不存在defer属性时。The script is fetched and executed immediately, before the browser continues parsing the page，
即在浏览器继续解析页面之前，将立即获取并执行脚本

MDN上关于script标签async属性的描述：

>使用该属性有三种模式可供选择，如果async属性存在，脚本将异步执行，只要它是可用的，如果async属性不存在，而defer属性存在，脚本将会在页面完成解析后执行，如果都不存在，那么脚本会在useragent解析页面之前被取出并立刻执行。
