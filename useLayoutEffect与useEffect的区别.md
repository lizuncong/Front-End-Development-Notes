# useLayoutEffect
react官网给出对于`useLayoutEffect`的介绍：
> 其函数签名与`useEffect`相同，但它会在所有的 DOM 变更之后同步调用effect。
可以使用它来读取DOM布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect`
内部的更新计划将被同步刷新。尽可能使用标准的 useEffect 以避免阻塞视觉更新。react官方推荐你一开始先用`useEffect`，
只有当它出问题的时候再尝试使用`useLayoutEffect`。

个人总结：
1. 平时业务开发过程中，一般使用`useEffect`。
2. 如果需要在`useEffect`中读取DOM元素布局，设置改变DOM元素样式之类的，仅在使用`useEffect`会有问题时，
则可以尝试使用`useLayoutEffect`。
3. 一般需要在effect里面做过渡或者动画时，建议使用 `useLayoutEffect`。

# Demo

1. 效果如下
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/effect-01.jpg)

点击 `1.使用useEffect` 或者 `2.使用useLayoutEffect` 可以切换使用哪个effect。
点击header的 `展开` 或者 `收起` 按钮可以显示或者隐藏红色区域的内容。

2. 逻辑
当点击 `展开` 按钮时，先在effect里面立马将红色区域的高度设置为0，然后设置定时器再重置高度。总的来说就是点击展开时，
一段时间后，比如500ms才真正的显示出来

3. 结论
当使用 `useEffect` 时，可以发现点击展开时，红色区域会先展开，然后立马收起，500ms后再显示，红色区域闪烁了一下。
当使用 `useLayoutEffect`时，点击展开，红色区域不会出现闪烁，而是过了500ms后再显示。

可以看出，
useEffect，会先渲染出DOM，然后再执行effect里面对dom的操作。因此才会看到红色区域闪烁了以下，那是因为当点击展开按钮时，
react会马上渲染红色区域，此时红色区域展开。然后再执行`useEffect`里面的操作，此时 `useEffect` 里面对红色区域的
高度设置成0，此时红色区域隐藏。然后过了500ms定时器执行 `target.style.height = ''`使得红色区域展开，因此会出现红色区域
闪烁了以下的视觉效果。


useLayoutEffect，会同时执行effect里面对dom的操作。因此不会看到红色区域的闪烁。

# 代码：

```jsx
import React, {
  memo, useRef, useLayoutEffect, useEffect,
  useState,
} from 'react';
import './demo.less';

const data = [];
for (let i = 0; i < 30; i++) {
  data.push(i);
}
const Index = memo(() => {
  const [show, setShow] = useState(false);
  const [type, setType] = useState(1); // 1使用useEffect，2使用useLayoutEffect
  const contentRef = useRef(null);
  useEffect(() => {
    if (type !== 1) return;
    const target = contentRef.current;
    if (show) {
      target.style.height = 0;
      if (target.effectTimeoutId) {
        clearTimeout(target.effectTimeoutId);
      }
      target.effectTimeoutId = setTimeout(() => {
        target.style.height = '';
      }, 500);
    }
  }, [show, type]);

  useLayoutEffect(() => {
    if (type !== 2) return;
    const target = contentRef.current;
    if (show) {
      target.style.height = 0;
      if (target.layoutEffectTimeoutId) {
        clearTimeout(target.layoutEffectTimeoutId);
      }
      target.layoutEffectTimeoutId = setTimeout(() => {
        target.style.height = '';
      }, 500);
    }
  }, [show, type]);

  return (
    <div className="effect-container">
      <div>
        <div
          className={type === 1 ? 'highlight' : ''}
          onClick={() => { setType(1); }}
        >
          1.使用useEffect
        </div>
        <div
          className={type === 2 ? 'highlight' : ''}
          onClick={() => { setType(2); }}
        >
          2.使用useLayoutEffect
        </div>
      </div>
      <div className="header">
        <span>header</span>
        <span
          className="click"
          onClick={() => {
            setShow(!show);
          }}
        >
          { show ? '收起' : '展开'}
        </span>
      </div>
      <div className={['body', show && 'show'].join(' ')} ref={contentRef}>
        {data.map((item, index) => (
          <div key={item}>{`${index}、这是一段长文本`}</div>
        ))}
      </div>
    </div>
  );
});

export default Index;

```

demo.less:

```less
.effect-container{
  width: 450px;
  .click{
    color: #1890FF;
    cursor: pointer;
    float: right;
  }
  .highlight{
    color: #1890FF;
  }
  .header{
    background: #FFF4EB;
    border: 1px solid #FFDFC5;
    padding: 12px;
    margin: 12px 0;
  }
  .body{
    display: none;
    overflow: hidden;
    background: red;
    &.show{
      display: block;
    }
  }
}

```
