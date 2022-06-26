> 检测 html 标签未闭合的 n 种方案

## HTML DOMParser

DOMParser 是浏览器原生的 API，兼容性较好，就是错误提示不精确

```js
let parser = new DOMParser();
const str = `
        <div>
            test
            <div>
        </div>
      `;
let doc = parser.parseFromString(str, "text/xml");
console.log(doc);
```

## html-validate

`html-validate` 是个 node 模块，可以参考这篇文章[html validate running in browser](https://html-validate.org/dev/running-in-browser.html)。不过我本地试了下，在浏览器运行会有问题

## [Nu Html Checker](https://validator.github.io/validator/)

源码仓库：[点击这里](https://github.com/validator/validator)

在线检测网址：[点击这里](https://validator.w3.org/nu/#textarea)

支持的参数：[点击这里](https://github.com/validator/validator/wiki/Service-%C2%BB-Common-params)

提供的 HTTP 接口：[点击这里](https://github.com/validator/validator/wiki/Service-%C2%BB-HTTP-interface)

### html5.validator.nu

```js
const html = `
              <div>
                test
                <div>
              </div>
            `;
var formData = new FormData();
formData.append("out", "xml");
formData.append("content", html);
const req = new XMLHttpRequest();
req.onreadystatechange = function () {
  if (req.readyState === 4) {
    const response = JSON.parse(req.responseText);
    console.log("response====", response);
  }
};
// https://validator.w3.org/nu/
// http://html5.validator.nu/
req.open("post", "http://html5.validator.nu/", true);
req.send(formData);
```

### validator.w3.org

```js
const html = `
              <style>div color: red}</style>
              <div id="lzc">
                test
              </div>
            `;
var formData = new FormData();
formData.append("out", "json"); // xhtml会提示错误，但不能识别css，json可以识别css错误
formData.append("parser", "none");
formData.append("level", "error");

// formData.append("css", "yes");
formData.append("content", html);
const req = new XMLHttpRequest();
req.onreadystatechange = function () {
  if (req.readyState === 4) {
    const response = JSON.parse(req.responseText);
    console.log("response====", response);
  }
};
// req.open("post", "http://html5.validator.nu/", true);
req.open("post", "http://validator.w3.org/nu/", true);

req.send(formData);
```
