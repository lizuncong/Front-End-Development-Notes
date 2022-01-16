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


### 方法二，使用git remote & git merge 方式
- 1. 首先初始化一个空的项目B仓库，添加一个.gitignore文件(任意文件都行，主要是为了创建一个项目B的master分支)，以下操作均在项目B目录下的终端执行
- 2. 将项目A的地址添加到项目B本地的远程仓库中
```shell
git remote add proAMaster https://github.com/lizuncong/pro-a.git
```
现在在终端执行 `git remote` 可以看见本地有两个远程仓库
```shell
origin
proAMaster
```
- 3.抓取项目A仓库数据到项目B仓库中
```shell
git fetch proAMaster
```
- 4.在本地创建一个项目A的分支
如果是需要同步项目A的master分支到项目B的master分支。则在项目B本地创建一个项目A的master分支。
```shell
git checkout -b proA-master proAMaster/master
```
- 5.切换到项目B本地master分支
现在本地有两个分支，一个是项目B自己的master分支。一个是proA-master分支，这个分支是项目A的master分支
```shell
git merge proA-master --allow-unrelated-histories
```
同步成功，此时项目A已经同步到项目B中，项目B中还能保留项目A的提交记录，同时还不会有多余的项目A的分支。


### 方法三，git pull 的方式
```shell
git pull https://github.com/lizuncong/pro-a.git dev
```
dev是需要同步的分支名称
