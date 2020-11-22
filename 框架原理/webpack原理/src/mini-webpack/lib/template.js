

!function(modules){
  // 缓存
  const installModules = {}
  function __minipack_require__(moduleId){
    // 是否缓存
    if(installModules[moduleId]){
      return installModules[moduleId].exports
    }
    let module = installModules[moduleId] = {
      exports: {}
    }
    console.log()
    modules[moduleId].call(modules.exports, module, module.exports, __minipack_require__)
    return module.exports
  }
  // 入口
  return __minipack_require__("__entry__")
}({__modules_content__})
