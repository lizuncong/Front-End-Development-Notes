### 什么是cookie
- 存储在浏览器的一段字符串
- 跨域不共享
- 格式如k1=v1;k2=v2;k3=v3;因此可以存储结构化数据
- 每次发送http请求，会将请求域的cookie一起发送给server
- server可以修改cookie并返回给浏览器

### Javascript操作cookie，浏览器中查看cookie
- cookie是不会被删除的，只能设置过期时间
- 在浏览器中操作cookie，可以通过document.cookie获取cookie。通过document.cookie = 'name=test'，往cookie后面追加(注意，这种设置方式并不会覆盖
原有的cookie)
### server端操作cookie，实现登录验证。
- 查看cookie
- 修改cookie
- 实现登录验证


### cookie，session，redis的原理
这里主要介绍cookie及session，redis三者的原理及关系，概念性的东西就不介绍了。

#### 1.一个简单的nodejs服务：cookie登录验证
新建一个index.js文件：
```js
const http = require('http')

// 解析get请求参数
const queryParams = (url) => {
  const queryStr = url.split('?')[1] || '';
  const arr = queryStr.split('&');
  const params = {}
  arr.forEach(item => {
    const temp = item.split('=');
    params[temp[0]] = decodeURIComponent(temp[1])
  })
  return params;
}

const server = http.createServer(async (req, res) => {

  res.setHeader('Content-type', 'application/json')
  // 解析cookie，假设cookie都是k1=v1;k2=v2;k3=v3;这种键值对
  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    req.cookie[key] = arr[1].trim()
  })

  if(req.cookie.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.cookie.username}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)

```
这里假设cookie都是k1=v1;k2=v2;k3=v3;这样的键值对。这个简单的服务获取req.headers.cookie并解析，将解析的结果
存在req.cookie中，最后判断cookie中是否包含username来验证用户的登录状态。


#### 2. 使用get请求模拟登录接口
```js
const server = http.createServer(async (req, res) => {

  res.setHeader('Content-type', 'application/json')
  // 解析cookie，假设cookie都是k1=v1;k2=v2;k3=v3;这种键值对
  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    req.cookie[key] = arr[1].trim()
  })

  // 模拟登录接口
  if(req.url.includes('/login')){
    const params = queryParams(req.url);
    if(params.username && params.password === '123456'){
      //登录成功设置cookie
      res.setHeader('Set-Cookie', `username=${params.username}; path=/`)
      res.end(JSON.stringify({msg: '登录成功，欢迎  ' + params.username}))
      return;
    }
  }
  
  if(req.cookie.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.cookie.username}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)
```
浏览器访问url：http://localhost:8020/login?username=lzc&password=123456便是登录成功，并且设置cookie。
此时在浏览器随便访问一个接口，比如http://localhost:8020/user，会发现返回{ msg: '欢迎lzc' }。
打开浏览器控制台，在console页签手动设置cookie，document.cookie = 'username=lisi'，
刷新浏览器，此时http://localhost:8020/user返回的是{ msg: '欢迎lisi'}。可想而知，浏览器能够随便修改cookie，
安全风险很大。对于这个问题，我们可以通过在设置cookie时同时设置httpOnly字段，表示该cookie只能由服务端修改，客户端不能修改。

#### 限制cookie只能由服务端修改，不能由客户端修改。
```js
const server = http.createServer(async (req, res) => {

  res.setHeader('Content-type', 'application/json')
  // 解析cookie，假设cookie都是k1=v1;k2=v2;k3=v3;这种键值对
  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    req.cookie[key] = arr[1].trim()
  })

  // 模拟登录接口
  if(req.url.includes('/login')){
    const params = queryParams(req.url);
    if(params.username && params.password === '123456'){
      //登录成功设置cookie
      res.setHeader('Set-Cookie', `username=${params.username}; path=/; httpOnly;`)
      res.end(JSON.stringify({msg: '登录成功，欢迎  ' + params.username}))
      return;
    }
  }
  
  if(req.cookie.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.cookie.username}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)
```
先清空浏览器cookie(F12查看控制台，选择Application页签，找到Cookies菜单，删除http://localhost:8020下的所有cookie)

- 访问http://localhost:8020/user，服务端返回请先登录。此时浏览器cookie为空。

- 控制台通过document.cookie获取cookie，会发现为空字符串

- 访问http://localhost:8020/login?username=lzc&password=123456。登录成功，服务端成功设置cookie。

- 控制台通过document.cookie获取cookie，会发现为空字符串。手动修改cookie：document.cookie = 'username=lisi'。在Application中
  查看cookie会发现username的值依然为lzc。说明浏览器不能再手动修改username了。
  
- 控制台手动设置：document.cookie = 'username2=zhangsan'，在Application中查看cookies，会发现多了一个username2的键，
  值为zhangsan。此时在控制台通过document.cookie获取cookie，输出'username2=zhangsan'。
  
- 因此，服务端可以针对某个cookie设置httpOnly以限制浏览器的修改。但是浏览器还是可以继续添加或者修改其他非httpOnly的cookie。

#### 设置cookie过期时间
````js
// cookie过期时间，这里设置为1分钟后过期
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (60 * 1000))
  return d.toGMTString()
}

const server = http.createServer(async (req, res) => {

  res.setHeader('Content-type', 'application/json')
  // 解析cookie，假设cookie都是k1=v1;k2=v2;k3=v3;这种键值对
  req.cookie = {}
  const cookie = req.headers.cookie || ''
  cookie && cookie.split(';').forEach(item => {
    const arr = item.split('=')
    const key = arr[0].trim()
    req.cookie[key] = arr[1].trim()
  })

  // 模拟登录接口
  if(req.url.includes('/login')){
    const params = queryParams(req.url);
    if(params.username && params.password === '123456'){
      //登录成功设置cookie
      res.setHeader('Set-Cookie', `username=${params.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
      res.end(JSON.stringify({msg: '登录成功，欢迎  ' + params.username}))
      return;
    }
  }
  if(req.cookie.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.cookie.username}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)

````
这里设置cookie一分钟后过期，可以先清空cookie，然后登录，访问/user接口，过一分钟后再访问，会发现登录失效。
