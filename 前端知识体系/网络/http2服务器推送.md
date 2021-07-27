### 代码示例
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>hello world</h1>
  <img src="example.png">
</body>
</html>
```


### 服务器推送
指的是还没有收到浏览器的请求，服务器就把各种资源推送给浏览器。比如浏览器只请求了index.html，但是服务器把index.html，style.css，example.png全部发送给浏览器。只需要一轮HTTP通信，浏览器就得到了全部资源，提高了性能

服务器推送受同源限制。发起推送的服务器不允许向客户端推送任意第三方内容。

### Nginx 实现
Nginx配置示例：
```bash
server {
    listen 443 ssl http2;
    server_name  localhost;

    ssl                      on;
    ssl_certificate          /etc/nginx/certs/example.crt;
    ssl_certificate_key      /etc/nginx/certs/example.key;

    ssl_session_timeout  5m;

    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers   on;

    location / {
      root   /usr/share/nginx/html;
      index  index.html index.htm;
      http2_push /style.css;
      http2_push /example.png;
    }
}
```

其实就是最后多了两行`http2_push`命令。它的意思是，如果用户请求根路径`/`，就推送`style.css`和`example.png`

**缺点：需要写在服务器的配置文件里面。这显然很不方便，每次修改都要重启服务，而且应用与服务器的配置不应该混在一起**

### 前端html实现
```html
<link rel="preload" href="push.css" as="style">
```

### 后端实现
后端应用产生 HTTP 回应的头信息`Link`命令。服务器发现有这个头信息，就会进行服务器推送。

```bash
Link: </styles.css>; rel=preload; as=style
```

如果要推送多个资源，就写成下面这样。

```bash
Link: </styles.css>; rel=preload; as=style, </example.png>; rel=preload; as=image
```

Nginx配置改成如下：
```bash
server {
    listen 443 ssl http2;

    # ...

    root /var/www/html;

    location = / {
        proxy_pass http://upstream;
        http2_push_preload on;
    }
}
```

如果服务器或者浏览器不支持 HTTP/2，那么浏览器就会按照 preload 来处理这个头信息，预加载指定的资源文件。

事实上，这个头信息就是 preload 标准提出的，它的语法和as属性的值都写在了标准里面。


### 服务器推送与缓存问题
服务器推送有一个很麻烦的问题。所要推送的资源文件，如果浏览器已经有缓存，推送就是浪费带宽。即使推送的文件版本更新，浏览器也会优先使用本地缓存。
一种解决办法是，只对第一次访问的用户开启服务器推送。下面是 Nginx 官方给出的示例，根据 Cookie 判断是否为第一次访问
```bash
server {
    listen 443 ssl http2 default_server;

    ssl_certificate ssl/certificate.pem;
    ssl_certificate_key ssl/key.pem;

    root /var/www/html;
    http2_push_preload on;

    location = /demo.html {
        add_header Set-Cookie "session=1";
        add_header Link $resources;
    }
}


map $http_cookie $resources {
    "~*session=1" "";
    default "</style.css>; as=style; rel=preload";
}
```


### 性能提升
服务器推送可以提高性能。网上测评的结果是，打开这项功能，比不打开时的 HTTP/2 快了**8%**，比将资源都嵌入网页的 HTTP/1 快了5%。