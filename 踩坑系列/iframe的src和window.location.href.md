### 问题描述
特殊情况下，`iframe` 嵌套网页脚本获取到的 `window.location.href` 与 `iframe` 的 `src` 属性并不一致。

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/iframe-01.jpg)


### 复现

简单起一个简单的前端服务，index.html如下：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <title>Iframe</title>
    <style>
        html,
        body {
            height: 100%;
            ;
            width: 100%;
        }

        iframe {
            min-height: 100%;
            min-width: 100%;
        }
    </style>
</head>

<body>
    <div>iframe</div>
    <iframe id="viewbox" src="http://localhost:4000" frameborder="0"></iframe>
</body>

</html>
```


本地启动两个简单的 node.js 服务

新建 a.js，这个服务运行在 4000 端口

```js
const express = require('express')
const app = express()
app.get('/', function (req, res) {
    res.send(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>登陆页面</title>
        </head>
        <body>
        <div>登陆页面</div>
        <a href="http://localhost:3000">点我登陆<a/>
        </body>
        </html>`
    )
})
app.listen(4000)
```

新建 index.js，这个服务运行在 3000端口

```js
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    console.log('后端请求.test')
    res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>首页</title>
    </head>
    <body>
    <div>登陆成功：这是首页</div>
    <div>虽然我在iframe.src = 'http://localhost:4000'，但是我的window.lacation.href却是http://localhost:3000</div>
    <script>
        console.log(window.location.href)
    </script>
    </body>
    </html>`)
})

app.listen(3000)
```


### 结论
这是因为通过 `a` 标签跳转 到 `http://localhost:3000` 网页后，不会修改 `iframe` 的 src 属性，但此时 `iframe` 里的上下文已经变成了 `http://localhost:3000`