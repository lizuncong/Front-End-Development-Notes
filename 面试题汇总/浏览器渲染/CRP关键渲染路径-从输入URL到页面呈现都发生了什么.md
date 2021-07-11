### 构建对象模型
这个过程包括文档对象模型(DOM)以及CSS对象模型(CSSOM)。

html文档和css都需要经过：字节 -> 字符 -> 令牌 -> 节点 -> 对象模型(即DOM或者CSSOM)，这一系列过程。

浏览器每次处理HTML标记时，都会完成以上所有步骤，然后构建DOM树。这个过程就是 `Parse HTML`。可以在浏览器开发者工具中 `Performance` 看到这个过程的时间开销

CSS的处理也是需要经过上述一系列流程，然后构建CSSOM树。这个过程就是 `Recalculate Style`。可以在 `Performance` 中看到该过程开销。

CSSOM为何具有树结构？
>为页面上的任何对象计算最后一组样式时，浏览器都会先从适用于该节点的最通用规则开始（例如，如果该节点是 body 元素的子项，则应用所有 body 样式），然后通过应用更具体的规则（即规则“向下级联”）以递归方式优化计算的样式。

TIPS：由于浏览器是递归的构建DOM树和CSSOM树的，这个递归的过程也是很耗时的，因此在写html和css时，尽量不要嵌套太深的层级

### 渲染树构建、布局及绘制
- DOM树和CSSOM树合并后形成渲染树(render tree)。
- 渲染树只包含渲染网页所需的节点，最终输出的是所有可见的内容。比如不包含display:none的元素，以及script，meta，link标记等。注意visibility: hidden还是会出现在渲染树中的，因为元素还是会占位置
- 布局(Layout)阶段计算每个对象的精确位置和大小，这一阶段也称为“自动重排”
- 最后一步是绘制(Paint)阶段，使用最终渲染树将像素渲染到屏幕上，这一阶段也称为“栅格化”

注意，浏览器开发者工具中，`Performance` 中的 `Layout` 事件时间线包含了渲染树构建以及位置和尺寸计算的时间

### CRP关键渲染路径步骤总结
- 1.处理HTML标记并构建DOM树。
- 2.处理CSS标记并构建CSSOM树。
- 3.将DOM与CSSOM合并成一个渲染树。
- 4.根据渲染树来布局，以计算每个节点的几何信息。
- 5.将各个节点绘制到屏幕上

TIPS：如果DOM或CSSOM被修改，只能再执行一遍以上所有步骤(摘抄自谷歌开发者文档)。

我的疑问：如果只是修改dom的字体颜色，应该只会触发paint阶段，不会触发layout吧。

### 阻塞渲染的CSS
注意是阻塞渲染，阻塞渲染树的构建，不是阻塞DOM树构建。

- 默认情况下，CSS被视为阻塞渲染的资源。浏览器将不会渲染任何已处理的内容，直至 CSSOM 构建完毕
- 可以通过媒体查询将一些CSS资源标记为不阻塞渲染。
- 浏览器会下载所有CSS资源，无论阻塞还是不阻塞
- CSS是阻塞渲染的资源，需要将它尽早、尽快地下载到客户端，以便缩短首次渲染的时间。

看以下几个例子：
```html
<link href="style.css"    rel="stylesheet">
<link href="style.css"    rel="stylesheet" media="all">
<link href="portrait.css" rel="stylesheet" media="orientation:portrait">
<link href="print.css"    rel="stylesheet" media="print">
```
- 1. 第一个声明阻塞渲染，适用于所有情况
- 2. 第二个声明和第一个声明效果等价
- 3. 第三个声明具有动态媒体查询，将在网页加载时计算。根据网页加载时设备的方向，portrait.css 可能阻塞渲染，也可能不阻塞渲染
- 4. 最后一个声明只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染。

可以检查浏览器开发者工具，Network 中查看各个资源的优先级，阻塞渲染的CSS资源优先级最高，不阻塞渲染的CSS资源优先级最低。

*** “阻塞渲染”仅是指浏览器是否需要暂停网页的首次渲染，直至该资源准备就绪。无论哪一种情况，浏览器仍会下载 CSS 资产，只不过不阻塞渲染的资源优先级较低罢了 ***



### JavaScript
默认情况下，JavaScript也会阻止DOM构建和延缓网页渲染

当HTML解析器遇到一个script标记时，它会暂停构建DOM，将控制权移交给JavaScript引擎；等JavaScript引擎运行完毕，
浏览器会从中断的地方恢复DOM构建。

***如果是外部 JavaScript 文件，浏览器必须停下来，等待从磁盘、缓存或远程服务器获取脚本，这就可能给关键渲染路径增加数十至数千毫秒的延迟***


JavaScript在DOM、CSSOM和JavaScript执行之间引入了大量新的依赖关系，从而导致首次渲染延迟：
- 脚本在文档中的位置很重要。
- 当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行。
- JavaScript 可以查询和修改 DOM 与 CSSOM。
- JavaScript 执行将暂停，直至 CSSOM 就绪。因此CSS是会阻塞js的执行的，而js执行又会阻塞dom的构建。

***“优化关键渲染路径”在很大程度上是指了解和优化 HTML、CSS 和 JavaScript 之间的依赖关系谱。***

### script标签的async，defer属性
默认情况下，所有 JavaScript 都会阻止解析器，但可以通过给外部js文件添加async或者defer异步关键字指示浏览器在等待脚本可用期间不阻止DOM构建，这样可以显著提升性能。

async和defer的区别：

- defer。不阻塞dom构建，等到DOM解析完成，在DOMContentLoaded事件之前执行。
```html
<script defer src="https://xx/long.js"></script>
<script defer src="https://xx/small.js"></script>
```
long.js和small.js并行下载，small.js可能会先下载完成。但是defer特性，确保了脚本执行的相对顺序。small.js必须等到long.js执行
结束才会被执行。

- asyn。不阻塞dom构建，async脚本就是一个会在加载完成时立即执行的完全独立的脚本。DOMContentLoaded事件可能会在async脚本前执行，也可能在其后执行。