### demo
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>demo</title>
</head>
<body>
    <div>
        <img data-src="./dog.png" class="lazyload" />
    </div>
</body>
</html>
```

### getElementsByClassName查询结果 -- 实时的
`getElementsByClassName` 查询结果是实时的，不会缓存查询结果，比如:

```js
const imgs = document.getElementsByClassName('lazyload') // imgs集合有一项元素

imgs[0].setAttribute('class', '') // 将img.lazyload的class置空，此时再打印imgs

console.log(imgs) // 此时会发现imgs已经变为空数组了

```

### querySelectorAll查询结果 -- 会缓存
`querySelectorAll` 查询结果会被缓存，比如：

```js
const imgs = document.querySelectorAll('.lazyload')
imgs[0].setAttribute('class', '')
console.log(imgs) // imgs依然有值
```