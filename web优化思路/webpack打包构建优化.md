##### 1.路由懒加载
##### 2.代码分割，预加载
##### 3.keep alive缓存页面，现阶段react-router还不支持keep-alive。可以通过修改react-router源码达到此目的。
##### 4. 第三方插件按需引入
比如蚂蚁组件库等。

##### 5. 可以使用SSR
SSR首屏渲染速度快，利于SEO

##### 6. 打包速度方面
1. 使用最新版的webpack及最新版的nodejs
2. 将loader应用于最少数量的必要模块，比如不编译 `node_module` 下面的包
3. 可以使用dllPlugin将更改不频繁的代码生成单独的编译结果，提高编译速度。
4. 使用splitChunksPlugin做代码分割。使用动态import做懒加载，也可以使用第三方插件比如loadableComponent。
5. 使用 `Tree Shaking` 移除没用的代码，这个依赖于es6模块语法的静态结构特性，因此请确保代码没有副作用。

开发环境：
使用增量编译，比如使用webpack的watch模式监听文件的更改。
并使用webpack-dev-server在内存中编译和提供资源服务。

生产环境：
使用TerserPlugin或uglifyjs插件压缩代码等。
