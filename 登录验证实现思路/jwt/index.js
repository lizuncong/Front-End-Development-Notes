const http = require('http')
const jwt = require('jsonwebtoken');

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

  let token;
  // 模拟登录接口
  if(req.url.includes('/login')){
    const params = queryParams(req.url);
    if(params.username && params.password === '123456'){
      token = jwt.sign(params, 'secret_123456', { expiresIn: '1h'})
      res.end(JSON.stringify({ msg: '登录成功，欢迎  ' + params.username, data: token }))
      return;
    }
  }
  if(req.username){
    res.end(JSON.stringify({msg: '欢迎  ' + req.session.username, data: req.session}))
  } else {
    res.end(JSON.stringify({msg: '请先登录'}))
  }

})


server.listen(8020)
