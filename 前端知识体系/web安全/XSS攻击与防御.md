### 跨站脚本攻击 XSS（Cross Site Scripting）
是一种代码注入攻击，自身网站执行了非自身网站的逻辑代码，因此叫跨站
- 跨站脚本的危害：获取页面数据，获取Cookies，劫持前端逻辑(比如修改某个按钮的点击事件)，发送请求
- 分类。存储型攻击危害更大些，因为它更隐蔽。反射型攻击有害代码是在URL中的，用户还可能会察觉
  + 存储型XSS：恶意代码存储在数据库中，当用户访问网站时，服务器返回給浏览器
  + 反射型XSS：通过在URL参数里面插入攻击代码的方式注入。比如微博的搜索，在搜索框输入搜索关键字后，要在页面显示用户的搜索关键字及搜索结果，攻击者在url里注入恶意代码，并诱导用户点击，服务器将url里的恶意代码插入html中返回给浏览器
  + DOM型XSS

- XSS代码注入点
  + HTML节点内容
  + HTML属性(如src属性)
  + JavaScript代码
  + 富文本

### HTML节点内容
一个反射型XSS的代码示例：
```html
<span>搜索关键字：{keyword}</span>
```
攻击者构造一个链接：http://localhost:3001/?keyword=<script>alert(1)</script>China。当用户点击这个链接时，后端解析出url中的参数：<script>alert(1)</script>China。并传给浏览器，此时浏览器执行恶意代码弹出1。

攻击者通过构造链接，还可以植入第三方网站脚本：http://localhost:3001/?keyword=<script src="http://cdn.jquery.js"></script>China。

甚至，攻击者嵌入自己的脚本，<script src="http://my.attack.js"></script>

防御：可以对用户输入进行转义，替换尖括号即可完成转义，将<和>转换成&lt\\;，&gt\\;


### HTML属性
```html
<img src="#{imgUrl}" />
imgUrl来自用户输入，攻击者通过巧妙构造imgUrl=1" onerror="alert(1)，使得img标签变成如下这样：
<img src="1" onerror="alert(1)" />
```
http://localhost:3001/?imgUrl=1" onerror="alert(1)


### JavaScript代码注入
```html
<script>
  var data = "#{data}"
  // data来自用户输入，此时攻击者可以通过巧妙构造data： hello"; alert(1);";  此时data变成了下面这样：
  var data = "hello";alert(1);"";
</script>
```  
http://localhost:3001/?data=hello";alert(1)"


### 富文本




### XSS防御方案

#### 参数出现在HTML内容或属性
-  浏览器自带的防御措施，通过后端设置响应头X-XSS-Protection打开浏览器自带的防御措施。这种只能防御反射型的xss，也就是URL中的参数再次出现在页面中，并且是参数出现在HTML内容或者属性上，防御不了js代码等。

- CSP(Content Security Policy)。内容安全策略，用于指定哪些内容可执行。这样只需要将用户输入的部分标为不执行，就不会有什么危害
      CSP是http的头，里面规定了可以限制哪些来源，比如child-src，connect-src，default-src，font-src，frame-src，
      img-src，manifest-src，media-src，object-src，script-src，style-src，worker-src

      
   
    + HTML属性，<img src={src}>，这种攻击原理是通过构造src关闭"，比如src = '/images" onerror="alert(2)'，因此转义"号，即把"号转成&quto;即可防御
    
    + JavaScript代码中的如何防御。<script> var data={data} <script>，加入data="hello";alert(1);""。因此只需要转义"号成\"，或者转换使用
      JSON.stringify转换一下   
      
    + 富文本，也是比较麻烦的防御。这种防御只能按照黑名单(比如发现包含有<script> 或者onerror等属性就过滤到这个单词)或者白名单(比如只保留部分标签和属性)的方式做过滤
        + script：<script>alert(1)</script>，这种就替换掉script标签
        + a标签：<a href="javascript:alert(3)">你好</a>，这种就替换掉javascript:关键字
        + <img src="abc" onerror="alert(1)">，这种就替换onerror
        + 使用白名单的方式进行过滤
```javascript
// html为要处理的富文本字符串
var xssFilter = function(html){
  if(!html) return '';
  var cheerio = require('cheerio') // 借助cheerio这个库
  var $ = cheerio.load(html)
  // 白名单
  var whiteList = {
    'img': ['src'],
  }
  $('*').each(function(index, elem){
    if(!whiteList[elem.name]){
      $(elem).remove();
      return;
    }
    
    for(var attr in elem.attribs){
      if(whiteList[elem.name].indexOf(attr) === -1){
        $(elem).attr(attr, null)
      }
    }
    
    
  })
  
  return $.html()
}

```
   
- 跨站请求伪造攻击 CSRF
- 前端Cookies安全性
- 点击劫持
- 传输过程安全问题
- SQL注入
