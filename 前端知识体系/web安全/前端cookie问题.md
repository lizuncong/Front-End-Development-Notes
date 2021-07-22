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
