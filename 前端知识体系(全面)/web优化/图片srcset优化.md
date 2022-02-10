### 相对大小的图片
假设图片宽度是浏览器的一半，即`sizes="50vw"`，根据浏览器的宽度及其设备像素比，允许浏览器选择正确的图像，而不考虑浏览器窗口有多大。
```html
<img 
    alt="a lighthouse"
    src="lighthouse-200.jpg"
    sizes="50vw"
    srcset="
        lighthouse-100.jpg 100w, 
        lighthouse-200.jpg 200w,
        lighthouse-400.jpg 400w, 
        lighthouse-800.jpg 800w,
        lighthouse-1000.jpg 1000w, 
        lighthouse-1400.jpg 1400w,
        lighthouse-1800.jpg 1800w"
>
```
下面的表格显示了浏览器会选择哪张图片:

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/srcset-01.jpg)

可以看出，浏览器会先算出图片的宽度再乘以设备像素比，然后选择最接近的图片

即`浏览器宽度 * 图片百分比 * 设备像素比`


### 自适应图像的断点
在许多情况下，图像尺寸可能会根据网站的布局断点发生变化。 例如，在一个小屏幕上，您可能想要图像占满视口的全宽，在大屏幕上，则应只占一小部分
```html
<img 
    src="400.png" 
    sizes="(min-width: 600px) 25vw, (min-width: 500px) 50vw, 100vw"
    srcset="100.png 100w, 200.png 200w, 400.png 400w,
             800.png 800w, 1600.png 1600w, 2000.png 2000w" alt="an example image"
>
```

上面例子中的 sizes 属性使用多个媒体查询来指定图片尺寸。 当浏览器宽度大于 600px 时，图像占据视口宽度的 25%，浏览器宽度在 500px 到 600px 之间时，图像占据视口宽度的 50%，如果低于 500px，图像为全宽。