#### 什么是vite
vite，轻量，轻快，vite是一个基于vue3单文件组件的非打包开发服务器，它做到了本地快速开发启动，实现按需编译，不再等待整个应用编译完成
面向现代浏览器，基于原生模块系统es module实现。webpack的开发环境很慢，开发时需要进行编译放到内存中。
#### vite的实现原理
vite在浏览器端使用export import的方式导入和导出模块，同时实现了按需加载。vite高度依赖module script
