### 业务背景
在项目开发过程中，B项目从A项目切出来的。后续在开发A项目时需要将A项目某个分支的功能同步到B项目中


### 使用git remote & git merge 方式
- 1. 将项目A的地址添加到项目B本地的远程仓库中
```shell
git remote add proAMaster https://github.com/lizuncong/pro-a.git
```
现在在终端执行 `git remote` 可以看见本地有两个远程仓库
```shell
origin
proAMaster
```
- 2.抓取项目A仓库数据到项目B仓库中
```shell
git fetch proAMaster
```
- 3.在本地创建一个项目A的分支
如果是需要同步项目A的master分支到项目B的master分支。则在项目B本地创建一个项目A的master分支。
```shell
git checkout -b proA-master proAMaster/master
```
- 4.切换到项目B本地master分支
现在本地有两个分支，一个是项目B自己的master分支。一个是proA-master分支，这个分支是项目A的master分支
```shell
git merge proA-master --allow-unrelated-histories
```
同步成功，此时项目A已经同步到项目B中，项目B中还能保留项目A的提交记录，同时还不会有多余的项目A的分支。

