### 问题

上周有个 java 的朋友问我，为什么第三方域名重定向到我们自己的服务时，请求头中的 cookie 会丢失。

本着好奇心，我就试试，没想到却成了我一个悬而未解的问题

### 复现场景

新建一个 server.js 文件

```js
const express = require("express");

const app = express();

app.get("/api/auth", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.redirect(302, "http://localhost:9000/server/api/authSuccess");
});

app.listen(4000);
```

这个服务非常简单，运行在 4000 前端，监听 `/api/auth` 并重定向到 `http://localhost:9000/server/api/authSuccess`。

在实际的业务场景中，`http://localhost:4000/api/auth`是第三方服务提供的鉴权服务，鉴权成功会重定向到我们提供的前端的 redirect url，即 `http://localhost:9000/server/api/authSuccess`。这里只是简化复现问题

新建一个 index.js 文件

```js
const express = require("express");

const app = express();

app.get("/api/authSuccess", (req, res) => {
  console.log("3000端口请求成功");
  res.send("请求成功");
});

app.listen(3000);
```

在实际的业务场景中，`http://localhost:9000/server/api/authSuccess` 是我们自己的后端服务。

本地起一个简单的前端服务：

```jsx
import React, { Component, PureComponent } from "react";
import ReactDOM from "react-dom";
class Counter extends Component {
  constructor(props) {
    debugger;
    super(props);
  }
  handleClick() {
    fetch("http://localhost:4000/api/auth");
  }
  handleClickAuth() {
    fetch("/server/api/authSuccess");
  }
  render() {
    return (
      <>
        <button onClick={this.handleClick}>点击发起鉴权请求</button>
        <button onClick={this.handleClickAuth}>
          手动发起 auth success 请求
        </button>
      </>
    );
  }
}

ReactDOM.render(<Counter />, document.getElementById("root"));
```

前端 webpack dev server 配置如下：

```js
const devConfig = {
  devServer: {
    host: "0.0.0.0",
    port: "9000",
    contentBase: path.resolve(__dirname, "../dist"),
    // hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    overlay: {
      errors: true,
    },
    proxy: {
      "/server": {
        target: "http://localhost:3000",
        // secure: false, // 如果请求的网址是https，需要配置secure: false
        pathRewrite: {
          "/server": "",
        },
        changeOrigin: true,
      },
    },
  },
};
```

**注意这里代理了所有的 /server 的请求并将 /server 替换成空字符串**

先来看下 cookie 面板，可以看到有设置了一个 cookie

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-01.jpg)

点击 `点击发起鉴权请求` 按钮

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-02.jpg)

首先向第三方提供的鉴权服务 `http://localhost:4000/api/auth` 发起请求，这个请求肯定是跨域请求。但由于是简单请求，不需要发起预检请求。请求成功后，重定向回我们的前端服务

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-03.jpg)

可以看到重定向回来的请求，浏览器认为这是一个跨域请求，并不会在请求头中携带 cookie，为什么？？？
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-04.jpg)

手动发起的同样的请求，cookie 是正常的：
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-05.jpg)

### 猜测

由于未找到合理的解释，这里只是一个暂时的猜测。

当我们发起一个对第三方域名接口的访问时，如果这个接口又重定向回我们自己的接口，浏览器会认为我们自己的接口是第三方域名发起的(通过下图的 Initial 可以看出)，因此浏览器认为这是一个跨域的请求

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/302-02.jpg)

如果有朋友知道原因，还请帮忙解答一下
