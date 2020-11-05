### 使用python在本地启动一个服务
本地启动服务，在项目目录下运行python -m SimpleHTTPServer 8000。
即可。8000是端口，可以不填，默认8000

### npm 发包流程
1. 打开npmjs.com官网注册一个账号，注意激活邮箱
2. 修改package.json中的name，这个name不是项目名称，而是包名称。
3. 打开控制台，执行npm login，在控制台登录npm。
   在控制台看到
   Logged in as xxx on https://registry.npmjs.org/
   则表示登录成功。注意这里要使用npm官网的源，不要使用淘宝等第三方源。
4. 登录成功后，在项目下执行npm publish就行了。   

### npm各字段，这里使用本人所写的rui-mobile包为例

1. files
   > npm包作为依赖安装时要包括的文件，比如 npm install rui-mobile 时，会将rui-mobile的packages.json
     中指定的files安装下来。files字段接收一个文件正则格式的数组。[*]代表所有文件。
     也可以使用npmignore来忽略个别文件。
     files字段优先级最大，不会被npmignore和.gitignore覆盖。
2. main
   > 指定rui-mobile的入口文件。当使用import rui from 'rui-mobile'引入组件时，其实就是在引入main指定的文件。

3. dependencies
   > rui-mobile所依赖的其他npm包，当使用npm install rui-mobile下载时，dependencies中指定的包都会一并被下载。
4. devDependencies
   > rui-mobile包所依赖的构建和测试相关的npm包。当使用npm install rui-mobile下载时，devDependencies中的包不会
     被下载。
5. peerDependencies
   > 指定npm包与主npm包的兼容性，当开发插件时是需要的，例如开发React组件时，
     其组件是依赖于react、react-dom npm包的，可以在peerDependencies指定需要的版本。
```jsx
 "peerDependencies": {
   "react": ">=16.8.0",
   "react-dom": ">=16.8.0"
 }
```
注：如果peerDependencies指定的npm包没有下载，npm版本1和2会直接下载。 npm3不会下载，会给出警告。

关于dependencies，devDependencies，peerDependencies的差别可以看下图：

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/npm-01.png)

如图，rui-mobile中有peerDependencies，dependencies，devDependencies
```js
/*rui-mobile中的依赖关系*/
  dependencies = {
    "lodash": "^4.17.20",
    "moment": "^2.29.1",
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  };
  devDependencies = {
    "chalk": "^4.1.0",
    "rimraf": "^3.0.2"
  };
  peerDependencies = {
      "react": ">=16.9.0",
      "react-dom": ">=16.9.0",
      "classnames": ">=2.2.6"
  }
```

然后新建一个npm-test项目，这是一个空的项目，什么依赖都没有，在这个目录下执行 `npm init -y`，
然后执行 `npm install rui-mobile`，观察npm-test的package.json文件的依赖字段，可以看见
package.json的dependencies只有rui-mobile这个依赖，然后打开npm-test下面的node-modules可以发现，

1.rui-mobile中dependencies指定的依赖都下载到了npm-test目录下。

2.rui-mobile中的devDependencies都不会被下载到npm-test目录下。

3.rui-mobile中的peerDependencies都不会被下载到npm-test目录下，但是会在控制台提示用户安装peerDependencies指定的依赖。

4.在rui-mobile中执行npm install时，只会安装dependencies以及devDependencies指定的依赖，peerDependencies
指定的依赖不会被安装
