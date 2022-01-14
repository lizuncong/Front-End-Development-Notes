### 背景
在项目开发过程中，经常需要从一个项目A中复制一份代码出来，以创建一个新的项目B。这个时候又希望项目B保留项目A的提交记录等历史信息。


### 方法一，直接使用git界面操作
以github为例，gitlab也有一样的操作界面。

假设已有的项目A地址为：https://github.com/xxx/pro-a.git

1. 在github中创建一个新的项目B
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/git-1.jpg)

2.输入项目B的仓库名称
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/git-2.jpg)

3.导入成功。此时项目B中依然会保留着项目A的历史提交记录以及分支！！
