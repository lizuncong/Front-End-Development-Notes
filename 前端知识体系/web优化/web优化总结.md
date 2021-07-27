### 性能优化的目标
资源更小，速度更快的呈现在用户眼前。围绕着目标可以将性能优化分为以下3个方面
- 网络层面
- 渲染层面

### 网络层面
这个层面主要是涉及前端工程化方面。
目标：资源体积更小，加载更快
- 构建策略。基于构建工具，如webpack。可分为以下两个维度：
    + 减少打包时间
        + 缩减loader范围。配置include或者exclude缩小loader的应用范围，避免不必要的编译。
        + loader缓存。如babel-loader开启cache
        + 定向搜索。配置resolve.alias提高文件的搜索速度
        + 提前构建。配置DllPlugin将第三方依赖提前打包。
        + 并行构建。如配置thread loader开启多线程打包
        + 可视结构。配置BundleAnalyzer分析打包文件的结构，找出导致体积过大的原因
    + 减少打包体积
        + 分割代码。配置optimization.splitChunks分割代码
        + Tree Shaking。Tree Shaking只对ESM规范有效
        + 动态垫片。推荐使用动态垫片，动态垫片可根据浏览器UserAgent返回当前浏览器Polyfill，其思路是根据浏览器的UserAgent从browserlist查找出当前浏览器哪些特性缺乏支持从而返回这些特性的Polyfill。
        可参考polyfill-library和polyfill-service的源码。使用html-webpack-tags-plugin在打包时自动插入动态垫片。
        + 按需加载。原理动态import()
        + 作用提升
        + 压缩资源。使用uglifyjs或者terser-webpack-plugin压缩js代码，使用optimize-css-assets-webpack-plugin压缩css代码。传输过程中开启GZIP压缩
- 图像策略。基于图像类型，JPG/PNG/SVG/WebP/Base64
    + 图像选型。了解所有图像类型的特点及其何种应用场景最合适
    + 图像压缩。在部署到生产环境前使用工具或脚本对其压缩处理
- 分发策略。基于内容分发网络（CDN）
    + 所有静态资源走CDN
    + 静态资源与主页面置于不同域名下，绕开HTTP并发数量限制，但域名不宜过多，因为DNS寻址也是要时间的
- 缓存策略。基于浏览器缓存，如强缓存，协商缓存，本地数据缓存
- 网络请求。
    + 所有网络请求升级为HTTP2，重用 TCP 连接
    + 合理使用域名分片。由于浏览器限制每个域名最多并行打开6个TCP连接，因此可以合理将资源部署在不同的域名下以提高并行性。当然弊端是每个新的域名都需要额外的DNS查询，
      每个额外的TCP连接都会消耗浏览器和服务器的资源。
    + 减少DNS查找。每个主机名解析都需要网络往返，这会对请求施加延迟并在查找过程中阻塞请求
    + 尽量减少HTTP重定向的数量。HTTP 重定向会带来高延迟开销——例如，单个重定向到不同的源会导致 DNS、TCP、TLS 和请求-响应往返，从而增加数百到数千毫秒的延迟。最佳重定向次数为零
    + 消除不必要的请求字节。尽可能少的使用cookie
    + 资源合并以减少HTTP请求数

### 渲染层面
这个层面主要涉及日常搬砖过程中养成良好的编码习惯。
- CSS策略。基于CSS规则。
    + 避免出现超过三层的嵌套规则
    + 避免为ID选择器添加多余选择器
    + 避免使用标签选择器代替类选择器
    + 避免使用通配选择器，只对目标节点声明规则
    + 值为0时不添加任何单位
    + 移除CSS空规则
    + 避免内联样式
- DOM策略。基于DOM操作
    + 缓存DOM计算属性，比如使用本地变量缓存查找到的dom节点
    + 避免过多DOM操作
    + 使用DOMFragment缓存批量化DOM操作。
    + 尽量使用事件代理。避免将事件绑定到大量的dom节点上。
    + 如果是使用Vue框架，vue框架内已经对渲染做了优化处理。如果使用的是React，需要配合使用react提供的memo或者shouldComponentUpdate减少组件
      render。使用useMemo，useCallBack等缓存计算量大的数据
- 阻塞策略。基于脚本加载。比如可以设置脚本的defer或者async，不阻塞DOM的构建
- 回流重绘策略。
    + 缓存DOM计算属性
    + 使用类合并样式，避免逐条改变样式
    + 使用display控制DOM显隐，将DOM离线化
    + 读写分离。避免又读又写。
- 异步更新策略。
    + 在异步任务中修改DOM时把其包装成微任务。
- 动画策略
    + 优先使用CSS动画，合理开启GPU加速，可通过transform开启GPU加速
    + 合理使用requestAnimationFrame代替setTimeout
    + 高频操作使用节流或者防抖

### 性能评估
- 通过Chrome DevTools LightHouse获取页面性能指标报告
- 通过Chrome DevTools Performance获取页面性能瓶颈报告
- 通过Performance API获取页面各个阶段精确时间

### 单独介绍作用提升
分析模块间依赖关系，把打包好的模块合并到一个函数中，好处是减少函数声明和内存花销。作用提升首次出现于rollup，是rollup的核心概念，后来在webpack v3里借鉴过来使用。
在未开启作用提升前，构建后的代码会存在大量函数闭包。由于模块依赖，通过webpack打包后会转换成IIFE，大量函数闭包包裹代码会导致打包体积增大(模块越多越明显)。在运行代码时创建的函数作用域变多，从而导致更大的内存开销。
在开启作用提升后，构建后的代码会按照引入顺序放到一个函数作用域里，通过适当重命名某些变量以防止变量名冲突，从而减少函数声明和内存花销。
在webpack里只需将打包环境设置成生产环境就能让作用提升生效，或显式设置concatenateModules。

