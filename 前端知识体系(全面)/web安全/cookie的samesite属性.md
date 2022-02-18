### 问题描述
在我们的业务场景中，需要通过iframe嵌入第三方网站。假设第三方网站：`demoUrl = https://demo.mysite.com`，我们测试环境网站`https://admin.mysitestg.com`，正式环境网站`https://admin.mysite.com/`

第三方网站二级域名和正式环境网站相同，和测试环境不同。

在测试环境网站`https://admin.mysitestg.com/preview?demoUrl=https://demo.mysite.com`中通过iframe内嵌demoUrl(demo.mysite.com)的网页。demoUrl网页有个get请求cookie种在三级域名下，即`demo.mysite.com`。此时由于浏览器samesite限制，该get请求**并没有**携带cookie过去后端。

>注：get请求为https://demo.mysite.com/leproxy/api/product/list/sortation/info/batch/query?id=123

但是在正式环境网站`https://admin.mysite.com/preview?demoUrl=https://demo.mysite.com`(二级域名.mysite.com)中一样通过iframe内嵌demoUrl(demo.mysite.com)的网页，此时demoUrl网页的get请求**可以**携带cookie到后端


### 原因
在谷歌80以前的版本中，samesite默认为None，即允许第三方网站携带我们自己网站的cookie。假设第三方网站通过img标签发起一个对我们网站的请求，那么这个请求会携带上我们网站的cookie，请求能够正常发起，这是有安全隐患的，这也是CSRF(跨站伪站点请求)的基本原理。于是，新版浏览器中默认将samesite设置为Lax，即不允许跨站携带cookie，防止CSRF攻击。

#### 问题分析
1.由于请求接口使用的是线上的接口https://demo.mysite.com/leproxy/api/product/list/sortation/info/batch/query?id=123，域名为demo.mysite.com，和demo预览页的域名一致。
2.这个接口需要携带一个f_ds_info cookie到后端，才能正常获取到数据。这个cookie种在demo.mysite.com域名下。
3.测试环境的域名admin.mysitestg.com和接口请求的二级域名不一致，所以这是一个跨站请求，cookie没有携带过去
4.正式环境域名admin.mysite.com，虽然和demo.mysite.com不同源，但是二级域名相同，因此这是一个同站请求，cookie允许携带给后端

### 什么是samesite(同站)，什么是cross site(跨站)
如果两个URL的`protocol`、`port`和`host`都相同的话，则这两个URL是`同源`。不同源则一定跨域，但不一定跨站！！！

跨站并不等同于跨域

跨站的条件要比跨域的宽松点。协议和端口都不看，只要二级域名相同就认为是同站请求。


>如果用户在www.web.dev上向static.web.dev请求图像，那么这是一个同站请求，但是一个跨域请求。此时可以携带static.web.dev上的cookie

这里需要注意并不是所有的二级域名相同的站点都是同站的，社区上维护了一个[公共后缀列表](https://publicsuffix.org/)，只要在这个列表里面的，即使二级域名相同，都属于跨站。

>如果用户在your-project.github.io上向my-project.github.io请求图像，那么这是一个跨站请求。


### samesite的取值
- Strict。Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
>这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态

- Lax。Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表。

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/same-site01.jpg)


- None允许跨站携带cookie。如果将samesite设置为None，前提是必须同时设置Secure属性（Cookie只能通过 HTTPS 协议发送），否则无效。

### 参考链接
[samesite cookie的解释](https://web.dev/samesite-cookies-explained/)
[samesite 取值比较](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)