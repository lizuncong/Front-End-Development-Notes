### 案例1
```js
select * from table where id=${id}
```

如果id传进来的是： 1 or 1 = 1，则sql变成了

```js
select * from table where id = 1 or 1=1
```

### 案例2
```js
select * from user where username = '${data.username}' and password='${data.password}'
```

如果password传的是 1' or '1' = '1

那么sql就变成了

```js
select * from user where username = 'Mike' and password = '1' or '1' = '1'
```


### SQL注入防御
- 关闭错误输出。后台错误信息对攻击者的帮助很大，攻击者可以通过错误信息判断自己的攻击方向对不对，然后往正确的方向改进
- 检查数据类型。比如id只能是数字字符串，不能接受非数字字符串，因此可以做个类型判断
- 对数据进行转义。对sql接收的所有参数进行转义
- 使用参数化查询
- 使用orm