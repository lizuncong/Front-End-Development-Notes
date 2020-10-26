传统的防抖基本是使用定时器实现的，由于requestAnimationFrame性能较好，因此也可以使用这个API来实现js防抖。
```jsx
const hasNativePerformanceNow = typeof performance === 'object'
  && typeof performance.now === 'function';

const now = hasNativePerformanceNow
  ? () => performance.now()
  : () => Date.now();
const debounce = (fn, delay) => {
  let timeId;
  return function () {
    const context = this;
    const args = arguments;
    if (timeId) {
      console.log('cancel....');
      cancelAnimationFrame(timeId);
    }
    const start = now();
    function tick() {
      console.log('tick.....');
      if (now() - start >= delay) {
        fn.call(context, args);
      } else {
        timeId = requestAnimationFrame(tick);
      }
    }
    timeId = requestAnimationFrame(tick);
  };
};

const onChange = () => {
    console.log('onchange....');
};

<input
    type="text"
    onChange={debounce(onChange, 1000)}
/>
```
