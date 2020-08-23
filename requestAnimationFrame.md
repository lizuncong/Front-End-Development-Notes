以后要摒弃那种使用 `setInterval` 实现动画或者其他一些需求。改用 `requestAnimationFrame`。
至于 `requestAnimationFrame` 的使用方法可以参考MDN。`requestAnimationFrame` 有很多的优点。
最重要的一点或许就是当用户切换到其他的标签页时，它会暂停，因此不会浪费用户宝贵的处理器滋源，
也不会损耗电池的使用寿命。
