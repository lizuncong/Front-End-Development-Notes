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
