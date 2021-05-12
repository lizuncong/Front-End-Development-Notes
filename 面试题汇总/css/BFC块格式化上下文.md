### BFC
Block Formatting Context 块格式化上下文。

用于影响内部布局的。

### 开启BFC的方式
常见的开启BFC的方式有：
- <html>元素
- 浮动
- absolute或者fixed定位的元素
- display: inline-block的元素
- display： flex的元素
- display: grid的元素
- display: flow-root

### 开启了BFC的元素的三个特性
- 不会和后代元素发生marin collapse（外边距折叠，外边距合并）
- 不会和浮动的兄弟元素重叠
- 当元素高度没有设置时，会被元素内部的浮动元素撑开

#### 不会和后代元素发生marin collapse
```html
<!doctype html>
<html>
    <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <title>BFC Demo</title>
        <style type="text/css">
            .outer{
                width: 100px;
                height: 100px;
                background: pink;
                margin-top: 100px;
                overflow: hidden; // 开启了BFC
            }
            .inner{
                width: 50px;
                height: 50px;
                background: steelblue;
                margin-top: 50px;
            }
        </style> 
    </head>
    <body>
        <div class="outer">
            <div class="inner"></div>
        </div>
     </body>
</html>
```

效果：
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC03.png)

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC04.png)



#### 不会和浮动的兄弟元素重叠
```html
<!doctype html>
<html>
    <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <title>BFC Demo</title>
        <style type="text/css">
            .float {
                float: left;
                width: 100px;
                height: 100px;
                background-color: pink;
                padding: 10px;
                margin-right: 15px;
            }     
            .right{
                /* 开启BFC */
                /* display: flow-root;  */
                height: 200px;
                background-color: powderblue;
            } 
        </style> 
    </head>
    <body>
        <div class="float">
            我是一个浮动的元素
        </div>
        <div class="right">
            我没有浮动，但是文字不会被浮动的元素挡住
        </div>
     </body>
</html>
```
效果：
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC01.png)

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC02.png)


#### 当元素高度没有设置时，会被元素内部的浮动元素撑开
```html
<!doctype html>
<html>
    <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <title>BFC Demo</title>
        <style type="text/css">
            .outer{
                width: 400px;
                background: pink;
                border: 5px solid green;
                overflow: hidden; // 开启BFC
            }
            .inner{
                width: 100px;
                height: 100px;
                background: steelblue;
                float:left;
            }
        </style> 
    </head>
    <body>
        <div class="outer">
            我是父元素
            <div class="inner">我是浮动的子元素</div>
        </div>
     </body>
</html>
```

效果：
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC05.png)

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/BFC06.png)