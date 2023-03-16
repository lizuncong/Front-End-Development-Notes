### Cookie用途
- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

注意：由于浏览器每次请求都会携带Cookie数据，会带来额外的HTTP性能开销，Cookie渐渐被淘汰

### 创建Cookie
当服务器收到HTTP请求时，服务器可以在响应头里面添加一个Set-Cookie选项。浏览器收到响应后通常会保存下Cookie，之后对**该服务器每一次请求中都通过Cookie请求头部将Cookie信息发送给服务器**。另外，Cookie 的过期时间、域、路径、有效期、适用站点都可以根据需要来指定。

注意：浏览器对服务器的每次请求中都会携带上cookie，这也是CSRF攻击的原理。即使我的网站是localhost:9001端口，服务器是localhost:3001端口，然后我在别的网站localhost:9002端口向localhost:3001发起请求，也会携带上我在localhost:9001的cookie

### 域名
在熟悉cookie的属性前，先回顾一下域名的基础知识。子域名是在域名系统等级中，属于更高一层域的域。比如，mail.example.com和calendar.example.com是example.com的两个子域，而example.com则是顶级域.com的子域。

### Cookie的属性
下面按Cookie的属性分类
- Cookie的生命周期
    + Expires
    + Max-Age
- 限制访问Cookie
    + Secure：标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。可以预防中间人攻击
    + HttpOnly：JavaScript Document.cookie API 无法访问带有 HttpOnly 属性的cookie。可以预防XSS攻击
    + SameSite：允许服务器要求某个 cookie 在跨站请求时不会被发送。可以预防CSRF攻击
- Cookie的作用域。`Domain` 和 `Path` 属性决定了Cookie 应该发送给哪些URL。
    + Domain。Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为 origin，不包含子域名。如果指定了Domain，则一般包含子域名。例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在子域名中（如developer.mozilla.org）。
    > 注意：当前大多数浏览器遵循 RFC 6265，设置 Domain 时 不需要加前导点。浏览器不遵循该规范，则需要加前导点，例如：Domain=.mozilla.org
    + Path。指定了主机下的哪些路径可以接受 Cookie（该 URL 路径必须存在于请求 URL 中）。例如，设置 Path=/docs，则以下地址都会匹配：/docs，
    /docs/Web/，/docs/Web/HTTP，这几个路径的页面都可以访问到cookie。'/'路径的页面就访问不到cookie



### cookies特性
- 前端数据存储
- 后端通过http头设置
- 请求时通过http头传给后端
- 前端可读写
- 遵守同源策略



### Cookies安全策略
- 签名防篡改
- 私有变换(加密)
- http-only(防止XSS)
- secure
- same-site(防止CSRF)