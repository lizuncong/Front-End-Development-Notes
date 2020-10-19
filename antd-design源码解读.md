npm run compile会执行打包构建，分别生成lib和es文件夹。


1. components/index.tsx文件中的注释：
/* @remove-on-es-build-begin */
/* @remove-on-es-build-end */
是一种标记，会在打包es时去掉这个注释之间的代码。
