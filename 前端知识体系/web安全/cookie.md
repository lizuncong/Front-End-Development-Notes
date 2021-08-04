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
- Cookie的作用域。`Domain` 和 `Path` 属性决定了Cookie 应该发送给哪些URL。
    + Domain。Domain 指定了哪些主机可以接受 Cookie。如果不指定，默认为 origin，不包含子域名。如果指定了Domain，则一般包含子域名。例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在子域名中（如developer.mozilla.org）。
    > 注意：当前大多数浏览器遵循 RFC 6265，设置 Domain 时 不需要加前导点。浏览器不遵循该规范，则需要加前导点，例如：Domain=.mozilla.org

### cookies特性
- 前端数据存储
- 后端通过http头设置
- 请求时通过http头传给后端
- 前端可读写
- 遵守同源策略


### cookies属性
- 域名。不同域名，cookie不能混用
- 有效期
- 路径。指cookie可以作用于网站的哪一级，具体而言就是url上的层级，比如可以为不同的url设置不同的cookie，这样只有当这个层级的
页面被访问的时候，cookie才可以使用。如果访问的是其他页面，就获取不了这个cookie。
比如在localhost:7001/user下面有如下几个cookie：(name: aaa, path: /user)，(name: csrfToken, path: /)，(name: userId=1, path: /)，
(name: userId=2, path: /user)
如果访问页面localhost:7001/，那么我们只能看得到这两个cookie：(name: csrfToken, path: /)，(name: userId=1, path: /)
- http only。设置为true，则前端不能通过js获取cookie


### cookies作用
- 存储个性化设置
- 存储未登录时用户唯一标识
- 存储已登录用户的凭证
- 存储其他业务数据


### Cookies和XSS的关系
- XSS可能偷取Cookies。可以通过设置cookie的http only为true防止


### Cookies和CSRF的关系
- CSRF利用了用户Cookies，但是攻击站点无法读写Cookies


### Cookies安全策略
- 签名防篡改
- 私有变换(加密)
- http-only(防止XSS)
- secure
- same-site(防止CSRF)