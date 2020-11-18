显然，我们实现一个定时器时，可以用如下的方式简单实现
```jsx harmony
const Counter = memo(() => {
  const [count, setCount] = useState(0);

  // 使用setCount(prev => prev + 1)
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);
  
    // 不使用这种方式，因为count一变化，定时器就要被清空，如果时间太短，有可能定时器都没执行就已经被
    // 清空了。
//  useEffect(() => {
//      const id = setInterval(() => {
//        setCount(count + 1);
//      }, 1000);
  
//      return () => clearInterval(id);
//  }, [count]);

  return (
    <div>{count}</div>
  );
});
```
这种方式弊端就是定时器无法获取新的props，假设有一个step控制定时器递增的间隔。
```jsx harmony
const Counter = memo(() => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  // 这个时候就必须要传入step依赖，step一变，就要清空定时器并重新生成
  useEffect(() => {
    const id = setInterval(() => {
      setCount(prev => prev + step);
    }, 1000);

    return () => clearInterval(id);
  }, [step]);

  return (
    <div>
      <div
        onClick={() => {
          setStep(step + 1);
        }}
      >
        change step
      </div>
      {count}
    </div>
  );
});
```
这个时候，定时器里如果要用到step，就必须要把step添加到useEffect的依赖中，不然就会有问题。那有没有办法能够在组件加载时
生成定时器，组件卸载时才清空定时器呢？

```jsx harmony
const Counter = memo(() => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const savedCallback = useRef();

  const callback = () => {
    setCount(count + step);
  };

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current();
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div
        onClick={() => {
          setStep(step + 1);
        }}
      >
        change step
      </div>
      {count}
    </div>
  );
});
```

可以将这部分逻辑提取出来，封装一个useInterval定时器
```jsx harmony

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}

const Counter = memo(() => {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useInterval(() => {
    setCount(count + step);
  }, 1000);

  return (
    <div>
      <div
        onClick={() => {
          setStep(step + 1);
        }}
      >
        change step
      </div>
      {count}
    </div>
  );
});
```

真的完美。。。。。
