### WebP
Google 公司开发的一种可提供有损和无损压缩的图片格式，支持透明度，目前已支持动图。WEBP的格式压缩率非常高，在同质量的情况下.webp格式的图片体积会小很多。主流的FireFox/Chrome浏览器已经支持webp图像，但目前Safari还不支持。

### WebP Server
WebP Server相当于一个旁路的WEB服务器，允许动态提供WebP图像，在不改变图片URL路径的情况下，自动将JPEG、PNG、BMP、GIF等图像转换为WebP格式，从而减小图片体积，降低流量消耗和提高加载速度。对于FireFox/Chrome支持webp图像的浏览器，在请求图片时，浏览器会在请求头的Accept字段中添加image/webp类型，服务器根据Accept判断image/webp存在，则说明浏览器是支持webp格式的图片，服务器直接返回webp格式给用户，同时URL地址不改变，并且content-type为image/webp。对于Safari不支持webp的浏览器则输出原图片格式，content-type为原图片的格式，比如image/png等。

不支持webp格式的浏览器，在请求图片资源时，Accept是不会带上image/webp的。


### WebP Server与缓存
WebP Server可以做到不改变图片URL路径的情况下，根据浏览器是否支持WebP格式的图片，判断输出WebP图像还是原图，这一点非常方便。但如果网站启用了CDN后，CDN边缘节点会将优化过的WebP图像进行缓存，若用户使用Safari这类不支持WebP图像的浏览器将导致图像无法显示。因此WebP Server不太适合CDN场景，除非直接考虑放弃Safari用户。

### 踩坑
前天踩过一个坑。iOS13 遇到图片显示不出来的情况。后面排查了下，是因为用户在上传图片时，实际上传的是webp格式的图片，但是用户手动修改了图片的后缀，本来应该是.webp，改成了.jpeg。因此iOS13在请求时，确实是请求头Accept没有带上image/webp，我们的图片服务器确实是将原图返回来了，只不过这个原图还是webp格式的，请求的响应头content-type确实也是image/webp。造成了在ios13上图片显示不出来的问题。

因此webp在实践过程中遇到问题，可以考虑一下是不是用户手动修改了webp格式图片的后缀。