```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Open Window Test</title>
    <style>
      span {
        color: red;
      }
    </style>
  </head>
  <body>
    <div>window.open测试</div>
    <div id="counter">counter: <span id="count">0</span></div>
    <div>
        父窗口的计数器：<span id="parent-count">0</span>
    </div>
    <div>
        <button id="click">click</button>
    </div>
    <button id="btn">打开弹窗</button>
  </body>
  <script>
    const btn = document.getElementById("btn");
    const clickBtn = document.getElementById('click')
    const counter = document.getElementById("counter");
    const count = document.getElementById("count");
    const pCount = document.getElementById("parent-count");

    btn.onclick = () => {
        const externalWindow = window.open('', 'modal', 'top=300,width=300,height=300,left=200,custom=123,scrollbars=no,resizable=0,location=no,status=no');
        externalWindow.document.body.appendChild(counter);
        externalWindow.document.head.appendChild(window.document.head.cloneNode(true))
    }
    clickBtn.onclick = () => {
        count.innerHTML = Number(count.innerHTML) + 1
    }
    counter.onclick = () => {
        pCount.innerHTML = Number(pCount.innerHTML) + 1
    }
  </script>
</html>

```

![image](https://user-images.githubusercontent.com/14917591/209266138-52ae0c35-2ed5-4514-b322-89403f0a0801.png)
