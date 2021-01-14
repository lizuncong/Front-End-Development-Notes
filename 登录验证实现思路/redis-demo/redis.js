const redis = require('redis');

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1');

redisClient.on('error', err => {
  console.error(err)
})

function set(key, val) {
  if(typeof val === 'object'){
    val = JSON.stringify(val)
  }

  redisClient.set(key, val, redis.print)
}

function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if(err){
        reject(err)
        return
      }
      if(val === null){
        resolve(null)
        return
      }
      try{
        resolve(JSON.parse(val))
      } catch (e) {
        resolve(val)
      }
    })
  })
}

module.exports = {
  set,
  get
}
