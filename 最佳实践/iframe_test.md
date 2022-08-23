```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>iframe test</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />
  </head>

  <body>
    <div id="root">
      <div>iframe 测试</div>
      <iframe
        id="myIframe"
        src="./iframe_page.html"
        title="iframe example 1"
        width="400"
        height="300"
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
    <script>
      const myIframe = document.getElementById("myIframe");
      myIframe.onloadstart = () => {
        console.log("onloadstart....");
      };
      myIframe.onreadystatechange = () => {
        console.log("onreadystatechange");
      };
      myIframe.onload = (e) => {
        console.log("iframe...onload...", e.target.contentWindow.location.href);
        myIframe.contentWindow.onbeforeunload = (e) => {
          console.log("onbeforeunload...........", e.target.location.href);
        };
      };
      myIframe.onClick = () => {
        console.log("惦记了。。。。。。");
      };
      myIframe.contentWindow.load = (e) => {
        console.log("load...........", e.target.location.href);
      };

      myIframe.contentWindow.unload = (e) => {
        console.log("unload...........", e.target.location.href);
      };
      myIframe.contentWindow.onloadstart = (e) => {
        console.log("load start...........", e.target.location);
      };
    </script>
  </body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>测试iframe页面</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
    />
    <style>
      a {
        display: block;
      }
    </style>
  </head>
  <body>
    <a href="https://www.taobao.com/">点击跳转淘宝</a>
    <a href="https://www.baidu.com/">点击跳转百度</a>
    <a href="https://www.taobao.com/" target="_blank">点击新标签页跳转淘宝</a>
    <a href="./transition.html">点击跳转同源网站，加载需要5秒</a>
    <a href="./html_parse.html">点击跳转同源网站</a>

    <div>测试HTML解析器</div>
    <script></script>
  </body>
</html>
```
