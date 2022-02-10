原文参考[谷歌SEO指南](https://developers.google.com/search/docs/beginner/seo-starter-guide)
### 元标签
```html
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="">
  <link rel="canonical" href="https://zcl.myshopify.com/">
  <link rel="preconnect" href="https://cdn.shopify.com" crossorigin>
  <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
  <title>ZCL</title>
  <meta name="description" content="123test">
  <meta property="og:site_name" content="ZCL">
  <meta property="og:url" content="https://zcl.myshopify.com/">
  <meta property="og:title" content="ZCL">
  <meta property="og:type" content="website">
  <meta property="og:description" content="123test">
  <meta property="og:image" content="http://cdn.shopify.com/s/files/1/0557/1041/7070/files/a-bridge-sitting-in-thick-pink-and-purple-fog.jpg?v=1634545667">
  <meta property="og:image:secure_url" content="https://cdn.shopify.com/s/files/1/0557/1041/7070/files/a-bridge-sitting-in-thick-pink-and-purple-fog.jpg?v=1634545667">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="628">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="ZCL">
  <meta name="twitter:description" content="123test">
  <meta name="facebook-domain-verification" content="5iortu7ojl5t0iwwa3q2ukpovwv47k">
  <meta id="shopify-digital-wallet" name="shopify-digital-wallet" content="/55710417070/digital_wallets/dialog">
</head>
```

### SEO走查工具
- [https://seositecheckup.com/analysis](https://seositecheckup.com/analysis)


### 确保网站已经在谷歌索引中
可以在谷歌浏览器搜索栏中输入：site: baidu.com 查看网站是否被谷歌收录。

### 站点地图
要让网站显示在 Google 搜索结果中，首要步骤便是确保 Google 能够找到它。最好的办法是提交站点地图。站点地图是网站上的一种文件，
可告知搜索引擎网站上新增了哪些网页或有哪些网页进行了更改

Google 还会通过其他网页上的链接找到您的网页

### robots.txt
此文件必须命名为 robots.txt，且必须位于网站的根目录下。用于告诉搜索引擎不要抓取某些网页

### title元素
- <title>1111</title>
- 网站上的每个网页创建独一无二的标题文字
- 应简短且包含丰富的信息

### 元描述标记
- <meta name="description" content="this is a desc">
- 元描述标记很重要，因为 Google 可能会在搜索结果中将其用作网页的摘要


### 添加结构化数据标记
结构化数据是可添加到网站网页中的代码，用于向搜索引擎描述内容，以便搜索引擎更好地了解网页上的信息

[Google搜索支持以下格式的结构化数据](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data#structured-data-format)
   - [JSON-LD](https://json-ld.org/)
   - [微数据](https://html.spec.whatwg.org/multipage/)。这篇文章有更详细的介绍https://schema.org/docs/gs.html。按照谷歌官方说法，微数据使用的是schema.org协议，但是并不是协议里面的属性都是必须的，谷歌建议按照谷歌官方文档的说明来，比如logo结构化数据必须完全参考谷歌文档：https://developers.google.com/search/docs/advanced/structured-data/logo#structured-data-type-definitions并且按照里面所要求的必须属性实现
   - [RDFa](https://rdfa.info/)
LOGO结构化数据必需的属性参考：[https://developers.google.com/search/docs/advanced/structured-data/logo#structured-data-type-definitions](LOGO结构化数据必需的属性参考：https://developers.google.com/search/docs/advanced/structured-data/logo#structured-data-type-definitions。其他推荐属性可加可不加。)。其他推荐属性可加可不加。

### 语义化html标签
### 图片、视频
### 常规指南
- 保持简单的网址结构
  + 使用连字符而不是下划线连接关键字
- 向谷歌说明网页与网页内的链接指向的网站的关系
在 `<a>` 标签中添加 `rel` 属性告诉谷歌我们的网站和 `<a>` 标签的链接指向的网站之间的关系。`rel` 可取的值
  + rel = "sponsored" 广告链接
  + rel = "ugc" 用户生成的内容
  + rel = "nofollow" 告诉谷歌不跟踪这个链接
- 如果不想让 Google 跟踪指向站内网页的链接，使用 robots.txt Disallow 规则。
- 如果不想让 Google 将某个网页编入索引，允许抓取并使用 noindex robots 规则。
- 避免创建重复内容。
有些人会故意在网域间加入重复内容，意在操纵搜索引擎排名或赢得较多的流量。这种欺骗性做法会使用户在同一组搜索结果中看到实质相同的内容重复出现，
从而导致糟糕的用户体验。
可采取一些措施来主动解决内容重复的问题，并确保访问者可看到您希望他们看到的内容
  + 使用 301 重定向
  + 使用 rel="canonical" link 元素


### 改善抓取质量
- 提交站点地图
- 网页路径要简单易懂
- 使用`hreflang`指向其他语言版本的网页。
```html
<link rel="alternate" href="https://example.com/" hreflang="x-default" />
```
- 使用`rel="canonical"`明确指出规范网页和备用网页
- 使用网址检查工具检查实际网页，确保谷歌能够正常访问并呈现网页