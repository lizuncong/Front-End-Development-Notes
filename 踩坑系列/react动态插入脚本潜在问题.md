```jsx
const scriptStr = 'console.log(124)';
const App = () => {
    useEffect(() => {
        const scr = document.createElement('script');
        scr.id = 'my_bug'
        scr.innerHTML = scriptStr
        document.body.appendChild(scr)
    }, [])
    return (
        <div>
            惨痛的教训
        </div>
    )
}
```

当`scriptStr`设置为 `'\\nconsole.log(124)'`会触发bug，此时`nconsole`是不对的