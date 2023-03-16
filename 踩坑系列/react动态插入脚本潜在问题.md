```jsx
// 复制粘贴过来的时候，webstorm自动帮我插入了`\`，因此变成了`\\n`
// const str = `var a = '\\n<div>test</div>\\n'; var s = document.createElement('span');s.innerHTML = a;document.body.appendChild(s)`

// 下面这个'\n'是源码，这个是跑不起来的
const str = `var a = '\n<div>test</div>\n'; var s = document.createElement('span');s.innerHTML = a;document.body.appendChild(s)`
const App = () => {
    useEffect(() => {
        const scr = document.createElement('script')
        scr.id = 'bug'
        scr.type = 'text/javascript';
        scr.innerHTML = str;
        document.body.appendChild(scr)
    }, [])
    return (
        <div>
            惨痛的教训
        </div>
    )
}
```

由于特殊的场景，需要复制别人的脚本到我代码中，别人的脚本中包含有 `\n`，复制粘贴的时候，webstorm自动帮我插入了`\`，因此很巧合我的代码能跑。
