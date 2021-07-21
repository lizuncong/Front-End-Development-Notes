### CSRF
Cross Site Request Forgy，跨站请求伪造

XSS 主要是指本网站运行了来自其他网站的脚本

CSRF 主要是指其他网站对本网站产生的影响，从其他网站向目标网站(即我们自己的网站)

以resource/csrf以及resource/csrf2.jpg这两张图的示例为例，当我们打开并登陆了http://localhost:1521这个网站时，
收到图中第三方的连接并打开，图中链接构造了一个隐藏的form表单并向我们的网站http://localhost:1521发送了一个
post action。这个请求会鞋带上我们的cookie。这里使用iframe的原因是，因为提交form表单，页面会发生重新导航，
也就是会有跳转，为了避免页面条件，这里设置form的target成name是csrf的iframe，那么提交和跳转都会在iframe中完成，
只是这个iframe隐藏了用户感知不到


### CSRF原理
1.用户登录A网站，假设A网站有个http://wwww.a.com/api/getMoney请求
2.用户打开了一个B网站，B网站构造了一个对A网站的恶意请求，比如在B网站中有个<img src="http://wwww.a.com/api/getMoney">
3.此时B网站向A网站发起了一个getMoney的请求，并携带了A网站的cookie信息。同时该请求还会携带一个referer请求头，指向B网站
4.本质上，我觉得这应该是浏览器的问题，不应该携带第三方的网站的cookie信息。


### CSRF攻击防御
- 禁止第三方网站携带cookies。后端设置cookies的samesite属性，samesite可取得值为 'strict'，'Lax'，'None'。sameSite有兼容性问题，目前只有谷歌支持
