input和textarea都能实现复制粘贴， 两者的差别在于，使用textarea粘贴的时候能保留文本
原格式。而使用input粘贴的时候格式会丢失。
```js
  const input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = “复制我呀”；
  // input.setAttribute('value', "复制我呀");
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    console.log('复制成功');
  }
  document.body.removeChild(input);
```
