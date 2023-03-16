### 先说结果，css选择器是从右往左解析的

### Render Tree
浏览器渲染过程中，会将 DOM树和CSSOM树结合构建Render Tree。在这个过程中，浏览器需要为每个dom节点匹配对应的css规则。
匹配过程也相当简单，就是为每一个dom节点，都遍历一遍cssom树，查找匹配的css规则。
