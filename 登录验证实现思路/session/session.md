### cookie的问题
在上一节中，利用cookie已经实现了基本的登录验证功能，但也有潜在的安全风险：
- 暴露了username等用户敏感信息
- cookie存储的信息有限。

- 解决方法，cookie中存储userId或者其他的唯一的id，然后服务端存储用户信息。当服务端接收到请求的cookie时，根据这个userId查找出
  对应的用户信息。这就是session解决方案。


### session
session可以看作是服务端存储用户信息的地方。
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

// cookie过期时间，这里设置为5分钟后过期
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (5 * 60 * 1000))  // 毫秒
  return d.toGMTString()
}

// session数据
const SESSION_DATA = {}

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


  // 解析session
  let userid = req.cookie.userid;
  if(userid){
    if(!SESSION_DATA[userid]){
      SESSION_DATA[userid] = {}
    }
  } else {
    userid = `${Date.now()}_${Math.random()}`; // 随机生成
    res.setHeader('Set-Cookie', `userid=${userid}; path=/; httpOnly; expires=${getCookieExpires()}`)
    SESSION_DATA[userid] = {}
  }
  req.session = SESSION_DATA[userid];



  // 模拟登录接口
  if(req.url.includes('/login')){
    const params = queryParams(req.url);
    if(params.username && params.password === '123456'){
      //登录成功，设置session
      req.session.username = params.username;
      req.session.userid = userid;
      req.session.password = params.password
      res.end(JSON.stringify({ msg: '登录成功，欢迎  ' + params.username, data: req.session }))
      return;
    }
  }
  if(req.session.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.session.username, data: req.session}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)

```
这是一个简单的演示session用法的demo。在本地维护一个全局的SESSION_DATA变量存储所有的用户登录信息。
- 一个请求过来，首先看看请求头cookie中是否有userid
    + 有的话，根据userid从SESSION_DATA中取出用户信息
    + 没有的话，则生成一个空的对象并设置 SESSION_DATA[userid] = {}，同时设置cookie
- 调用登录接口，登录成功后，将用户信息存入req.session中。

- 这种实现session的方法简单粗暴，有以下问题：
    + session直接是js变量，存在nodejs进程内存中。进程内存有限，访问量过大，内存暴增。
    + 正式线上运行是多进程的，进程之间内存无法直接共享，因此session不能共享
