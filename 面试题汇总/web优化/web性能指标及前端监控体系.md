#### 性能指标
面试答到这里就好了：
- FP(First Paint)。首次绘制时间，包括了任何用户自定义的背景绘制，它是首先将像素绘制到屏幕的时刻。
- FCP(First Content Paint)。首次内容绘制。是浏览器将第一个DOM渲染到屏幕的时间，可能是文本、图像、SVG等。这其实就是白屏时间
- FMP(First Meaningful Paint)。首次有意义绘制。页面有意义的内容渲染的时间
- LCP(Largest Contentful Paint)。最大内容渲染。代表在viewport中最大的页面元素加载的时间。
- DCL(DomContentLoaded)。DOM加载完成。当HTML文档被完全加载和解析完成之后，DOMContentLoaded事件被触发。无需等待样式表，图像和子框架的完成加载。
- L(onload)。当依赖的资源全部加载完毕之后才会触发。
- TTI(Time to Interactive)。可交互时间。用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点。
- FID(First Input Delay)。首次输入延迟。用户首次和页面交互(单击链接、点击按钮等)到页面响应交互的时间。

#### 各指标的时间计算方法
所有的这些指标都需要异步获取，需要在window.onload回调执行，因此可以放在setTimeout里面执行获取逻辑，最好延迟5s再执行。

浏览器提供了window.performance.timing 这个API可以获取各个事件的时间点。以下指标可以通过timing各个属性计算得出：
- DCL(DomContentLoaded)。timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart
- L(onload)。timing.loadEventStart - timing.fetchStart
- TTI(Time to Interactive)。timing.domInteractive - timing.fetchStart

以下指标需要通过performance.getEntriesByName这个API计算
- FP: performance.getEntriesByName('first-paint')[0].startTime
- FCP: performance.getEntriesByName('first-contentful-paint')[0].startTime

以下指标需要通过new PerformanceObserver增加一个性能条目的观察者计算，同时需要开发者在dom元素上设置响应的属性标志元素：
比如如果某个元素挂在完成才认为是FMP元素，只需要在该元素上添加对应的属性即可，这个属性用于在new PerformanceObserver中观察。
- FMP
- LCP
- FID

#### 为什么要做前端监控
- 更快发现问题和解决问题
- 做产品的决策依据
- 提升前端开发的技术深度和广度
- 为业务扩展提供更多可能性

#### 前端数据分类
前端的数据其实有很多，从大众普遍关注的 PV、UV、广告点击量，到客户端的网络环境、登陆状态，再到浏览器、操作系统信息，最后到页面性能、JS 异常，
这些数据都可以在前端收集到。

- 访问相关的数据
    + PV/UV：最基础的 PV（页面访问数量）、UV（独立访问用户数量）
    + 页面来源：页面的 refer，可以定位页面的入口
    + 操作系统：了解用户的 OS 状况，帮助分析用户群体的特征，特别是移动端，iOS 和 Android 的分布就更有意义了
    + 浏览器：可以统计到各种浏览器的占比，对于是否继续兼容 IE6、新技术（HTML5、CSS3 等）的运用等调研提供参考价值
    + 分辨率：对页面设计提供参考，特别是响应式设计
    + 登录率：登陆用户具有更高的分析价值，引导用户登陆是非常重要的
    + 地域分布：访问用户在地理位置上的分布，可以针对不同地域做运营、活动等
    + 网络类型：wifi/3G/2G，为产品是否需要适配不同网络环境做决策
    + 访问时段：掌握用户访问时间的分布，引导消峰填谷、节省带宽
    + 停留时长：判断页面内容是否具有吸引力，对于需要长时间阅读的页面比较有意义
    + 到达深度：和停留时长类似，例如百度百科，用户浏览时的页面到达深度直接反映词条的质量

- 性能相关的数据
    + 白屏时间：用户从打开页面开始到页面开始有东西呈现为止，这过程中占用的时间就是白屏时间
    + 首屏时间：用户浏览器首屏内所有内容都呈现出来所花费的时间
    + 用户可操作时间：用户可以进行正常的点击、输入等操作
    + 页面总下载时间：页面所有资源都加载完成并呈现出来所花的时间，即页面 onload 的时间
    + 自定义的时间点：对于开发人员来说，完全可以自定义一些时间点，例如：某个组件 init 完成的时间、某个重要模块加载的时间等等

- 点击相关的数据
    + 页面总点击量
    + 人均点击量：对于导航类的网页，这项指标是非常重要的
    + 流出 url：同样，导航类的网页，直接了解网页导流的去向
    + 点击时间：用户的所有点击行为，在时间上的分布，反映了用户点击操作的习惯
    + 首次点击时间：同上，但是只统计用户的第一次点击，如果该时间偏大，是否就表明页面很卡导致用户长时间不能点击呢？
    + 点击热力图：根据用户点击的位置，我们可以画出整个页面的点击热力图，可以很直观的了解到页面的热点区域

- 异常相关的数据
这里的异常是指 JS 的异常，用户的浏览器上报 JS 的 bug，这会极大地降低用户体验
    + 异常的提示信息：这是识别一个异常的最重要依据，如：’e.src’ 为空或不是对象
    + JS 文件名
    + 异常所在行
    + 发生异常的浏览器
    + 堆栈信息：必要的时候需要函数调用的堆栈信息，但是注意堆栈信息可能会比较大，需要截取

- 其他数据
除了上面提到的 4 类基本的数据统计需求，我们当然还可以根据实际情况来定义一些其他的统计需求，如用户浏览器对 canvas 的支持程度，
再比如比较特殊的 – 用户进行轮播图翻页的次数，这些数据统计需求都是前端能够满足的，每一项统计的结果都体现了前端数据的价值



#### 前端监控目标(监控分类)
- 稳定性(stability)
    + JS错误。JS执行错误或者promise异常
    + 资源异常。script、link等资源加载异常
    + 接口错误。ajax或fetch请求接口异常
    + 白屏。页面空白

- 用户体验(experience)
    + 加载时间。各个阶段的加载时间
    + TTFB(Time To First Byte 首字节时间)。是指浏览器发起第一个请求到数据返回第一个字节所消耗的时间，这个时间包含了网络请求时间、后端处理时间。
    + FP(First Paint 首次绘制)。首次绘制包括了任何用户自定义的背景绘制，它是将第一个像素点绘制到屏幕的时间。
    + FCP(First Content Paint 首次内容绘制)。首次内容绘制是浏览器将第一个DOM渲染到屏幕的时间，可以是任何文本、图像、SVG等的时间。
    + FMP(First Meaningful Paint 首次有意义绘制)。 首次有意义绘制是页面可用性的量度标准。
    + FID(First Input Delay 首次输入延迟)。用户首次和页面交互到页面响应交互的时间。
    + 卡顿。 超过50ms的任务。

- 业务(business)
    + PV。 page view 即页面浏览量或点击量
    + UV。指访问某个站点的不同IP地址的人数。
    + 页面停留时间。用户在每一个页面的停留时间。


#### 前端监控流程
- 前端埋点
- 数据上报
- 分析和计算 将采集到的数据进行加工汇总。
- 可视化展示 将数据按各种纬度进行展示
- 监控报警 发现问题后按一定的条件触发报警

#### 常见的埋点方案
- 代码埋点
    + 代码埋点，就是以嵌入代码的形式进行埋点，比如要监控用户的点击事件，会选择在用户点击时插入一段代码，保存这个监听行为或者直接将监听行为
    以某一种数据格式直接传递给服务器端。
    + 优点是可以在任意时刻，精确的发送或保存所需要的数据信息。
    + 缺点是工作量大

- 可视化埋点
    + 通过可视化交互的手段，代替代码埋点。
    + 将业务代码和埋点代码分离，提供一个可视化交互的页面，输入为业务代码，通过这个可视化系统，可以在业务代码中自定义
    的增加埋点事件等等。最后输出的代码耦合了业务代码和埋点代码
    + 可视化埋点其实是用系统来代替手工插入埋点代码。

- 无痕埋点
    + 前端的任意一个事件都被绑定一个标识，所有的事件都被记录下来。
    + 通过定期上传记录文件，配合文件解析，解析出来我们想要的数据，并生成可视化报告供专业人员分析
    + 无痕埋点的优点是采集全量数据，不会出现漏埋和误埋等现象
    + 缺点是给数据传输和服务器增加压力，也无法灵活定制数据结构

#### 编写监控采集脚本
- 监控错误
    + 错误分类。
        + JS错误
        + Promise异常
    + 资源异常
        + 监听error

- 数据结构设计
    + jsError
    ```js
      let info = {
        "title": "前端监控系统", // 页面标题
        "url": "http://localhost:8080", // 页面url
        "timestamp": "1212121212121212", // 访问时间戳
        "userAgent": "chrome", // 用户浏览器类型
        "kind": "stability", // 大类
        "type": "error", // 小类
        "errorType": "jsError", // 错误类型
        "message": "uncaught TypeError:blablabla", // 错误详情
        "filename": "http://localhost:8080/", // 访问的文件名
        "position": "0:0", // 行列信息
        "stack": "btn Click (http://localhost:8080)", // 堆栈信息
        "selector": "HTML BODY #container .content INPUT", // 选择器
      }
    ```
    + 接口异常数据结构设计
    ```js
      let info = {
        "title": "前端监控系统", // 页面标题
        "url": "http://localhost:8080", // 页面url
        "timestamp": "1212121212121212", // 访问时间戳
        "userAgent": "chrome", // 用户浏览器类型
        "kind": "stability", // 大类
        "type": "xhr", // 小类
        "eventType": "load", // 事件类型
        "pathname": "/success",
        "status": "200-0k",
        "duration": "5", // 持续时间
        "response": "hahah", // 响应内容
        "params": "参数", // 参数
      }
    ```
    + 白屏
    `screen` 返回当前window的screen对象，返回当前渲染窗口中和屏幕有关的属性
    `innerWidth` 只读的window属性。innerWidth返回以像素为单位的窗口的内部宽度
    `innerHeight` 窗口的内部高度(布局视口)的高度
    `layout_viewport`
    `elementsFromPoint`方法可以获取到当前视口内指定坐标处，由里到外排列的所有元素。
    ```js
      let info = {
        title: '前端监控系统',
        url: 'http://localhost:8080/',
        timestamp: '1239404040404044',
        userAgent: 'chorme',
        kind: 'stability',
        type: 'blank',
        emptyPoints: "0", // 空白点
        screen: "2049 * 1152", // 分辨率
        viewPoint: "2048 * 994", // 视口
        selector: "HTML BODY #container", // 选择器
      }
    ```
