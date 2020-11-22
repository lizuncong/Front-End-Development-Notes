#! /usr/bin/env node
const path = require('path')
const fs = require('fs')
// 默认配置
const defaultConfig = {
  entry:'./src/index.js',
  output:{
    filename:'bundle.js'
  }
}

class MiniPack{
  constructor(config){
    // 存储一下配置
    this.config = config
    this.entry = config.entry
    // 工作 根目录
    this.root = process.cwd()
    // 存储所有代码
    this.modules = {}
  }
  parse(code, parent){
    let deps = []
    let r = /require\('(.*)'\)/g
    // require('xx')替换为__minipack_require__
    code = code.replace(r, function(match, arg){
      // 依赖路径
      const retPath = path.join(parent, arg.replace(/'|"/g),'')
      deps.push(retPath)
      return `__minipack_require__("./${retPath}")`
    })
    return {code, deps}
    // 能够解析文件内容种的require('xx.js')这种格式
  }
  createModule(modulePath, name){
    // if(this.modules[modulePath]){
    //   // 出现了循环依赖
    // }
    const fileContent = fs.readFileSync(modulePath,'utf-8')
    // 替换后的代码喝依赖数组
    const { code, deps} = this.parse(fileContent, path.dirname(name))
    console.log(code, deps)
    this.modules[name] = `function(module, exports, __minipack_require__){
        eval(\`${code}\`)
      }
      `
    // 循环获取所有依赖数组的内容
    deps.forEach(dep=>{
      this.createModule(path.join(this.root, dep), './'+dep)
    })
    // console.log(name)
    // console.log(code)
  }
  generateModuleStr(){
    let fnTemp = ""
    Object.keys(this.modules).forEach(name=>{
      fnTemp += `"${name}":${this.modules[name]},`
    })
    return fnTemp
  }
  generateFile(){
    let template = fs.readFileSync(path.resolve(__dirname, './template.js'),'utf-8')
    this.template = template.replace('__entry__',this.entry)
        .replace('__modules_content__',this.generateModuleStr())
    // app.get('xxx.js',res=>{
    //   res.send(this.template)
    // })
    fs.writeFileSync('./dist/'+this.config.output.filename, this.template)
    console.log('写入文件完毕')
  }
  start(){

    console.log('开始解析文件的依赖')
    const entryPath = path.resolve(this.root, this.entry)
    this.createModule(entryPath, this.entry)
    console.log(this.modules)
    // 生成文件
    this.generateFile()
  }
}


const config = {...defaultConfig, ...require(path.resolve('../webpack.config.js'))}
// 拿到了最终的配置
const miniPack = new MiniPack(config)
miniPack.start()
