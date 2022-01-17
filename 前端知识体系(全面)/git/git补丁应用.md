### 背景
项目A dev分支上某个`需求F`需要同步到项目B dev分支上。此时在项目A dev修改完并提交代码后，生成一个hotfix补丁文件
### 1. git log查看提交记录
在项目A的dev分支下执行git log查看提交记录，找出 `需求F` 的commit id
```shell
git log
```
![image](https://github.com/lizuncong/Front-End-Development-Notes/blob/master/resource/git-3.jpg)
复制需要生成补丁的 commit id，即那次修改的commit记录

### 2.git format-patch
在项目A dev分支下执行命令生成补丁文件
```shell
git format-patch 843d70f95d03dd053c9aa2a6ec3013229754b054 -1 --stdout > ./hotfix.patch
```
此时可以看到项目A目录下已经生成一个hotfix.patch文件

### 3. 补丁应用
可以使用
```shell
git apply --3way ./hotfix.patch
```

或者

```shell
git apply --reject ./hotfix.patch
```

hotfix.path就是生成的补丁文件的位置

这两种方式有细微差别，具体可实践查看.
