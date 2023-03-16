### 复现
index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>BUG</title>
    <style>
      html,body{
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0;
      }
      .container{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-y: auto;
      }
      ul {
        display: flex;
        flex-direction: column;
      }
      .item{
        background: red;
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <ul>
        <li>1111</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1000</li>
      </ul>
      <div class="item">
        <div style="height: 40px;">
          22222
        </div>
      </div>
      <div class="item">
        <div style="height: 40px;">
          3333
        </div>
      </div>
      <div class="item">
        <div style="height: 40px;">
          4444
        </div>
      </div>
    </div>
  </body>
</html>
```

以上代码在谷歌浏览器模拟器上的显示效果，可以看出正常显示：
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/ul-flex.jpg)



真机上的显示效果，可以看出下面的元素都浮在了ul元素上。
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/ul-flex-02.jpg)


排查发现是因为ul标签设置了flex布局，导致在部分低版本浏览器内核上会显示有问题
