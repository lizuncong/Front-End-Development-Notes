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
// 统一的登录验证
const loginCheck = (req) => {
    // 白名单，绕过登录验证
    const whiteList = ['/api/user/login']

    if(whiteList.indexOf(req.path) === -1 && !req.session.username){
        return { code: -1, msg: '尚未登录' }
    } else {
        return { code: 0, msg: '已登录或无需登录' }
    }
}

// cookie过期时间，这里设置为1分钟后过期
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (60 * 1000))  // 毫秒
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
    res.end(JSON.stringify({msg: '麻烦先登录一下好吗'}))
  }

})


server.listen(8020)
