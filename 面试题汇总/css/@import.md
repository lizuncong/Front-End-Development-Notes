### 语法
@import有两种语法，这两种语法并没有什么差别
- @import "style.css"
- @import url("style.css")

### link和@import区别
- 都是用于引入外部css样式。都支持媒体查询，而且都是会下载文件并根据媒体应用样式，而不是根据媒体选择性下载css文件
- link是html标签，@import是 ***css样式规则***，需要放在style标签内顶部使用，或者.css文件内顶部使用
- link可以并行下载，但是@import不能并行下载,这点在多媒体查询时尤其突出，假设如下：
```html
<!doctype html>
<html>
    <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <title>helloWorld</title>
        <meta name='keywords' content='关键词,关键词'>
        <meta name='description' content=''>
        <link rel="stylesheet" href="link.css" media="print">
        <link rel="stylesheet" href="link2.css">
        <style type="text/css">
            @import "import.css" print; 
            @import "import2.css"; 
            .hd {
                color: green;
            }
        </style> 
    </head>
    <body>
        hello world我是李尊聪
        <p class="hd">我是什么颜色</p>
        <img src="./1.jpg" alt="">
     </body>
</html>
```
检查浏览器Network，会发现首先下载index.html文件，link2.css文件，1.jpg，然后下载import.css，import2.css，link.css文件。
这里可以看出，link.css和import.css定义了media属性，然而这两者表现不同。对于link标签，优先加载有效的link2.css，对于@import样式规则，还是先加载无效的
import.css文件，然后再加载有效的import2.css文件。显然import的这种效果不是我们想要的。

其实也很容易理解，link是html标签，和img标签等标签一样，浏览器在解析dom元素构建DOM树时，遇到link标签，就发起一个请求去加载资源文件。然后继续解析后面的dom元素，如果又遇到link标签，又发起请求去加载资源文件，然后继续解析后面的dom元素。这个发起请求的操作是并行的

@import是css样式规则，只能用在style标签内部，浏览器在解析css样式构建cssom树时，一行一行读取css样式规则，在遇到@import规则时，发起请求加载css文件，然后等待css文件
返回并解析，才能继续解析后面的css规则

### 规则
[The @import rule must be at the top of the document (but after any @charset declaration).](https://www.w3schools.com/cssref/pr_import_rule.asp)
MDN：使用@import导入的规则一定要先于除了@charset的其他任何css规则。什么意思呢？
```html
// index.html
<style type="text/css">
  .hd{
    color: orange;
  }
  @import "import.css";
</style>
...
<p class="hd">我是什么颜色</p>
```
```css
// import.css
.hd{
    color: blue;
}
```
再浏览器中查看，P的颜色并不是import.css里的蓝色，而是index.html文件里定义的橘黄色。检查浏览器网络请求会发现没有请求
import.css文件，这正是因为，import规则一定要先于除了@charset的其他任何css规则，所以需要修改一下index.html：
```html
<style type="text/css">
  @import "import.css";
  .hd{
    color: orange;
  }
</style>
...
<p class="hd">我是什么颜色</p>
```

### 媒体查询
@import和link一样，都可以定义媒体查询

```html
<link rel="stylesheet" type="text/css" href="print.css" media="print"/>
```

```html
@import url("print.css") print;
@import "common.css" screen, projection;
@import url('landscape.css') screen and (orientation:landscape);
@import url('mobile.css') (max-width: 680px);
```

***这里要注意的是，不论是link还是import方式，都是会下载所有css文件，然后根据媒体去应用css样式，而不是根据媒体去选择性下载css文件***

### 不要使用@import
- 影响浏览器的并行下载
- 多个@import导致下载顺序紊乱