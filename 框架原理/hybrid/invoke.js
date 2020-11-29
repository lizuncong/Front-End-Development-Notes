(function(window, undefined){


  function _invoke(action, data, callback){
    var schema = 'myapp://utils/' + action

    schema += '?'

    var key
    for(key in data){
      if(data.hasOwnProperty(key)){
        schema += '&' + key + data[key]
      }
    }

    var callbackName = ''
    if(typeof callback === 'string'){
      callbackName = callback
    } else {
      callbackName = action + Date.now()
      window[callbackName] = callback
    }

    schema = schema + 'callback=' + callbackName

    // 触发
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = schema
    var body = document.body;
    body.appendChild(iframe)

    setTimeout(() => {
      body.removeChild(iframe)
      iframe = null
    })
  }



  window.invoke = {
    share: function(data, callback){
      _invoke('share', data, callback)
    },
    scan: function(data, callback){
      _invoke('scan', data, callback)
    },
    login: function(data, callback){
      _invoke('login', data, callback)
    }
  }


})(window)
