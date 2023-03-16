### RSA算法流程
具体算法流程如下：
- 找到互质的两个数， `p`和`q`， 计算`N = p*q`
- 确定一个数`e`， 使得`e`与`(p-1)(q-1)`互质， 此时公钥为`(N, e)`， 告诉给对方
- 确定私钥`d`， 使得`e*d-1`能够被`(p-1)(q-1)`整除
- 消息传输方传输消息`M`， 加密密文`C`为: 
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa01.png)

消息接受方通过收到密文消息 C， 解密消息 M:

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa02.png)

RSA算法依赖于欧拉定理，一个简化版本为大致为`a`和`p`互质，那么有:

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa03.png)

即`a`的`p-1`次方对`p`取余为1，（`a`的`p-1`次方减去1可以整除`p`）


### 举个例子
还是用个简单示例来说明：

N = pq， 取俩素数 p=11, q = 3, N = p * q = 33， 取 e 与 (p-1)(q-1) = 20 互质的数 e = 3， 然后通过

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa04.png)

确定私钥， 即取一个 d 使得 3*d -1 能 20 被整除， 假设取 d=7 或者d=67。（3*7-1=20 当然能被20整除， 3*67-1=200 也能被20整除）

因此 public key 为 (N=33, e=3)， private key 为 d=7 或者d=67。

假设加密消息M=8， 通过加密算法

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa04.png)

得到密文 C=8^3 % 33 = 17。

再来看解密， 由

![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/rsa04.png)


得到明文 M = 17^7 % 33 = 8 或者 M=17^67 % 33=8， 是不是很神奇? （这里^ 表示多少次方，后文中的有的表示异或）